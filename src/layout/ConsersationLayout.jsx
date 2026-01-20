import './ChatLayout.css';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/chat/sidebar/sidebar.jsx';
import ListMess from '../components/chat/messagelist/ListMess.jsx';
import ChatOtherUser from '../components/chat/chatOtherUser/ChatOtherUser.jsx';
import InfoChat from '../components/chat/chatOtherUser/InfoChat.jsx';
import useMediaQuery from '../hooks/useMediaQuery.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext.js';
import { SocketRequests } from '../hooks/useWebSocket.js';

function ConsersationLayout() {
    const navigate = useNavigate()
    const [room, setRoom] = useState(false)
    const [filterType, setFilterType] = useState('all');
    const isMobile = useMediaQuery("(max-width: 992px)")
    const [showChatList, setShowChatList] = useState(false)
    const [selectedChat, setSelectedChat] = useState(null)
    const { sendMessage, disconnect } = useWebSocket();
    const { isAuth, user, logout } = useAuth();
    const [listMessages, setListMessages] = useState([])
    const [isInRoom, setIsInRoom] = useState(false);
    const [listMemberInRoom, setListMemberInRoom] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const selectedChatRef = useRef(null);
    const [reloginError, setReloginError] = useState(false)
    const [userList, setUserList] = useState([])
    const searchedChatRef = useRef(null);

    const handleFilterChange = (type) => {
        setFilterType(type);
    };

    const handleSearchChat = (username) => {
        searchedChatRef.current = username;
    };
    const saveChat = (chatList) => {
        let existedChatList = [];

        try {
            existedChatList = JSON.parse(
                localStorage.getItem("CHATLIST") || "[]"
            );
        } catch (e) {
            console.error("CHATLIST bị lỗi, reset lại");
            existedChatList = [];
        }

        const result = [
            ...existedChatList,
            ...chatList.filter(
                item2 =>
                    !existedChatList.some(item1 => item1.name === item2.name)
            )
        ];

        console.log("Danh sach all chat la:", result);

        localStorage.setItem("CHATLIST", JSON.stringify(result));
    };
    useEffect(() => {
        if (!isAuth) navigate("/login");
    }, [isAuth]);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        if (isAuth) {
            sendMessage(SocketRequests.getUserList())
        }
    }, [])

    useEffect(() => {
        if (!selectedChat) return
        setPage(1);
        setHasMore(true);
        setIsInRoom(false)
        setListMessages([])
        setListMemberInRoom([])
        if (selectedChat.type === 1) {
            // checkInRoom(selectedChat)
            console.log("Chat da duoc chon: " + selectedChat.name)
            sendMessage(SocketRequests.getRoomMessages(selectedChat.name, 1))
        } else {
            console.log("Chat da duoc chon: " + selectedChat.name)
            sendMessage(SocketRequests.getPeopleMessages(selectedChat.name, 1))
        }

    }, [selectedChat])

    const loadMoreMessages = () => {
        if (!hasMore || !selectedChat) return;

        const nextPage = page + 1;
        setPage(nextPage);

        if (selectedChat.type === 1) {
            sendMessage(SocketRequests.getRoomMessages(selectedChat.name, nextPage));
        } else {
            sendMessage(SocketRequests.getPeopleMessages(selectedChat.name, nextPage));
        }
    };
    const isChatActive = (chatName, type) => {
        return (
            selectedChat &&
            selectedChat.name === chatName &&
            selectedChat.type === type
        );
    };

    function findUserByUsername(chatList, username) {
        console.log("Cần tìm user " + username + "ở trong list là ", chatList)
        return chatList.find(user => user.name === username) || null;
    }
    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail;

            console.log("BẮt được sự kiện rồi 1 - " + msg.event)
            switch (msg.event) {
                case "RE_LOGIN":
                    console.log("Đã gọi relogin với status: " + msg.status + " Và nội dung là : " + msg.data)
                    if (msg.status === 'error') {
                        setReloginError(true)
                    } else {
                        setReloginError(false)
                        localStorage.setItem("RE_LOGIN_CODE", msg.data.RE_LOGIN_CODE)
                        sendMessage(SocketRequests.getUserList())
                    }
                    break;
                case "GET_USER_LIST":
                    // CHỈ set lần đầu khi chưa có chat nào được chọn
                    if (!selectedChatRef.current && msg.data.length > 0) {
                        saveChat(msg.data)
                        const listUser = msg.data.filter(x => x.name !== user)

                        setSelectedChat(listUser[0]);
                        setRoom(listUser[0].type === 1);
                    }
                    break;
                case "SEND_CHAT":
                    // if (!selectedChat) return;
                    console.log("Da có tin nhắn gửi đến ", msg.data)
                    if (msg.status === "success") {
                        if (msg.data.name === selectedChat.name) {
                            if (msg.data.type === 0) {
                                sendMessage(SocketRequests.getPeopleMessages(msg.data.name, 1))
                            } else {
                                sendMessage(SocketRequests.getRoomMessages(msg.data.name, 1))
                            }
                        }
                    }
                    break;
                case "GET_PEOPLE_CHAT_MES":
                    const messOfPeople = msg.data.length ? msg.data : [];
                    if (!messOfPeople || messOfPeople.length === 0) {
                        setHasMore(false);
                        return;
                    }
                    setListMessages(prev => {
                        const map = new Map();

                        // 1. merge + dedupe
                        [...prev, ...messOfPeople].forEach(m => {
                            map.set(m.id, m);
                        });

                        // 2. sort theo thời gian
                        return Array.from(map.values()).sort(
                            (a, b) => new Date(b.createAt) - new Date(a.createAt)
                        );
                    });

                    break;
                case "GET_ROOM_CHAT_MES":
                    const messOfRoom = msg.data.chatData.length ? msg.data.chatData : [];
                    if (!messOfRoom || messOfRoom.length === 0) {
                        setHasMore(false);
                        return;
                    }

                    const joined = Array.isArray(msg.data.userList)
                        && msg.data.userList.some(u => u.name === user);
                    setListMemberInRoom(msg.data.userList)
                    setIsInRoom(joined);

                    setListMessages(prev => {
                        const map = new Map();

                        // 1. merge + dedupe
                        [...prev, ...messOfRoom].forEach(m => {
                            map.set(m.id, m);
                        });

                        // 2. sort theo thời gian
                        return Array.from(map.values()).sort(
                            (a, b) => new Date(b.createAt) - new Date(a.createAt)
                        );
                    });
                    break;

                case "CHECK_USER_EXIST":
                    if (msg.status === "success") {
                        if (msg.data.status === true) {
                            const existedChatList = JSON.parse(
                                localStorage.getItem("CHATLIST") || "[]"
                            );
                            const user = findUserByUsername(existedChatList, searchedChatRef.current)
                            if (user) {
                                setRoom(user.type === 1);
                                setSelectedChat(user)
                            }
                        } else {
                            const existedChatList = JSON.parse(
                                localStorage.getItem("CHATLIST") || "[]"
                            );
                            const user = findUserByUsername(existedChatList, searchedChatRef.current)
                            if (user) {
                                setRoom(user.type === 1);
                                setSelectedChat(user)
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("WS_MESSAGE_RECEIVED", handler);
        return () => window.removeEventListener("WS_MESSAGE_RECEIVED", handler);
    }, []);

    return (
        <>
            <div className='chat-container'>
                {reloginError && (
                    <div className="end-session">
                        <div className="box">
                            <p>Đã hết phiên, vui lòng đăng nhập lại</p>
                            <button className='btn-ok'
                                onClick={() => {
                                    logout();
                                    disconnect();
                                }}
                            >OK</button>
                        </div>
                    </div>
                )}
                {isMobile && (
                    <>
                        <div className='chat-left' style={{ width: showChatList ? '100%' : '5%' }}>
                            <div className='icon-menu' style={{ width: showChatList ? '5%' : '100%' }}>
                                <button className="chat-icon" onClick={() => setShowChatList(true)} />
                            </div>
                            {showChatList && (
                                <div className='chat-left-content'>
                                    <Sidebar
                                        onFilterChange={handleFilterChange}
                                        onSearchChat={handleSearchChat} />
                                    <ListMess
                                        onSelectChat={setSelectedChat}
                                        filter={filterType}
                                        setRoom={setRoom}
                                        setShowChatList={setShowChatList}
                                        onUserList={setUserList} />
                                </div>
                            )}
                        </div>
                        {!showChatList && (
                            <div className='chat-right'>
                                <ChatOtherUser
                                    room={room}
                                    chat={selectedChat}
                                    mess={listMessages}
                                    setListMessages={setListMessages}
                                    isInRoom={isInRoom}
                                    hasMore={hasMore}
                                    onLoadMore={loadMoreMessages}
                                    isActive={isChatActive} />
                                <InfoChat
                                    room={room}
                                    chat={selectedChat}
                                    mess={listMessages}
                                    listMemberInRoom={listMemberInRoom} />
                            </div>
                        )}
                    </>
                )}
                {!isMobile && (
                    <>
                        <div className='chat-left'>
                            <button className="chat-icon" onClick={() => setShowChatList(true)} />
                            <div className='chat-left-content'>
                                <Sidebar
                                    onFilterChange={handleFilterChange}
                                    onSearchChat={handleSearchChat} />
                                <ListMess
                                    onSelectChat={setSelectedChat}
                                    filter={filterType}
                                    setRoom={setRoom}
                                    setShowChatList={setShowChatList}
                                    onUserList={setUserList} />
                            </div>

                        </div>
                        <div className='chat-right'>
                            <ChatOtherUser
                                room={room}
                                chat={selectedChat}
                                mess={listMessages}
                                setListMessages={setListMessages}
                                isInRoom={isInRoom}
                                hasMore={hasMore}
                                onLoadMore={loadMoreMessages}
                                isActive={isChatActive} />
                            <InfoChat
                                room={room}
                                chat={selectedChat}
                                mess={listMessages}
                                listMemberInRoom={listMemberInRoom} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default ConsersationLayout;