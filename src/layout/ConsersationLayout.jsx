import './ChatLayout.css';
import { useState, useEffect } from 'react';
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
    const { isConnected, sendMessage } = useWebSocket();
    const { isAuth, user } = useAuth();
    const [listMessages, setListMessages] = useState([])
    const [isInRoom, setIsInRoom] = useState(false);
    const [error, setError] = useState('')
    const [listMemberInRoom, setListMemberInRoom] = useState([])

    const handleFilterChange = (type) => {
        setFilterType(type);
    };
    useEffect(() => {
        if (!isAuth) navigate("/login");
    }, [isAuth]);

    useEffect(() => {
        if (isAuth) {
            sendMessage(SocketRequests.getUserList())
        }
    }, [])

    useEffect(() => {
        if (!selectedChat) return
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


    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail;
            console.log("BẮt được sự kiện rồi 1 - " + msg.event)
            switch (msg.event) {
                case "RE_LOGIN":
                    sendMessage(SocketRequests.getUserList())
                    break;
                case "GET_USER_LIST":
                    setSelectedChat(msg.data[0]);
                    if (msg.data[0].type === 1) setRoom(true)
                    else setRoom(false)
                    break;
                case "GET_PEOPLE_CHAT_MES":
                    const messOfPeople = Array.isArray(msg.data) ? msg.data : [];
                    setListMessages(messOfPeople);
                    break;
                case "GET_ROOM_CHAT_MES":
                    const messOfRoom = msg.data.chatData.length ? msg.data.chatData : [];
                    const joined = Array.isArray(msg.data?.userList)
                        && msg.data.userList.some(u => u.name === user);
                    setListMemberInRoom(msg.data.userList)
                    setIsInRoom(joined);
                    console.log("Đã gửi tin nhắn rồi này " + joined)
                    if (!joined) setError("Hãy tham gia phòng để gửi tin nhắn!")
                    setListMessages(messOfRoom);
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
                                <ListMess onSelectChat={setSelectedChat} filter={filterType} setRoom={setRoom} setShowChatList={setShowChatList} />
                            </div>
                        )}
                    </div>
                    {!showChatList && (
                        <div className='chat-right'>
                            <ChatOtherUser room={room} chat={selectedChat} mess={listMessages} isInRoom={isInRoom} error={error} />
                            <InfoChat room={room} chat={selectedChat} mess={listMessages} listMemberInRoom={listMemberInRoom} />
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
                            <ListMess onSelectChat={setSelectedChat} filter={filterType} setRoom={setRoom} setShowChatList={setShowChatList}  />
                        </div>

                    </div>

                    <div className='chat-right'>
                        <ChatOtherUser room={room} chat={selectedChat} mess={listMessages} isInRoom={isInRoom} error={error} />
                        <InfoChat room={room} chat={selectedChat} mess={listMessages} listMemberInRoom={listMemberInRoom} />
                    </div>
                </>
            )}
        </div>
    );
}

export default ConsersationLayout;