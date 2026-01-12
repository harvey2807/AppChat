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
    const { isConnected, sendMessage, connect } = useWebSocket();
    const { isAuth, user } = useAuth();
    const [listMessages, setListMessages] = useState([])
    const [isInRoom, setIsInRoom] = useState(false);
    const [listMemberInRoom, setListMemberInRoom] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const selectedChatRef = useRef(null);


    const handleFilterChange = (type) => {
        setFilterType(type);
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


    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail;

            console.log("BẮt được sự kiện rồi 1 - " + msg.event)
            switch (msg.event) {
                case "RE_LOGIN":
                    sendMessage(SocketRequests.getUserList())
                    break;
                case "GET_USER_LIST":
                    // CHỈ set lần đầu khi chưa có chat nào được chọn
                    if (!selectedChatRef.current && msg.data.length > 0) {
                        setSelectedChat(msg.data[0]);
                        setRoom(msg.data[0].type === 1);
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
                        prev.forEach(m => map.set(m.id, m));
                        messOfPeople.forEach(m => map.set(m.id, m));
                        return Array.from(map.values());
                    });
                    break;
                case "GET_ROOM_CHAT_MES":
                    const messOfRoom = msg.data.chatData.length ? msg.data.chatData : [];
                    if (!messOfRoom || messOfRoom.length === 0) {
                        setHasMore(false);
                        return;
                    }

                    const joined = Array.isArray(msg.data?.userList)
                        && msg.data.userList.some(u => u.name === user);
                    setListMemberInRoom(msg.data.userList)
                    setIsInRoom(joined);

                    setListMessages(prev => {
                        const map = new Map();
                        prev.forEach(m => map.set(m.id, m));
                        messOfRoom.forEach(m => map.set(m.id, m));
                        return Array.from(map.values());
                    });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("WS_MESSAGE_RECEIVED", handler);
        return () => window.removeEventListener("WS_MESSAGE_RECEIVED", handler);
    }, []);

    return (
        <div className='chat-container'>
            {isMobile && (
                <>
                    <div className='chat-left' style={{ width: showChatList ? '100%' : '5%' }}>
                        <div className='icon-menu' style={{ width: showChatList ? '5%' : '100%' }}>
                            <button className="chat-icon" onClick={() => setShowChatList(true)} />
                        </div>
                        {showChatList && (
                            <div className='chat-left-content'>
                                <Sidebar onFilterChange={handleFilterChange} />
                                <ListMess
                                    onSelectChat={setSelectedChat}
                                    filter={filterType}
                                    setRoom={setRoom}
                                    setShowChatList={setShowChatList} />
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
                            <Sidebar onFilterChange={handleFilterChange} />
                            <ListMess
                                onSelectChat={setSelectedChat}
                                filter={filterType}
                                setRoom={setRoom}
                                setShowChatList={setShowChatList} />
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
    );
}

export default ConsersationLayout;