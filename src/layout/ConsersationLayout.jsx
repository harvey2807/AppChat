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
    const { isAuth, reloginCode, user } = useAuth();
    const [listMessages, setListMessages] = useState([])

    const handleFilterChange = (type) => {
        setFilterType(type);
    };
    useEffect(() => {
        if (!isAuth) navigate("/login");
    }, [isAuth]);

    useEffect(() => {
        if (isConnected && isAuth) {
            sendMessage(SocketRequests.getUserList())
        }
    }, [isConnected, isAuth])

    useEffect(() => {
        if (!selectedChat) return
        setListMessages([])
        if (selectedChat.type === 1) {
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

            if (
                msg.event === "GET_PEOPLE_CHAT_MES" ||
                msg.event === "GET_ROOM_CHAT_MES" &&
                msg.chatName === selectedChat?.name
            ) {

                const messages = Array.isArray(msg.data) ? msg.data : [];
                setListMessages(messages);
                console.log("Bat duoc su kien : " + msg.event)
            }
            switch (msg.event) {
                case "RE_LOGIN":
                    sendMessage(SocketRequests.getUserList())
                    break;
                case "GET_USER_LIST":
                    setSelectedChat(msg.data[0]);
                    if (msg.data[0].type === 1) setRoom(true)
                    else setRoom(false)
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
                                <ListMess onSelectChat={setSelectedChat} filter={filterType} setRoom={setRoom} />
                            </div>
                        )}
                    </div>
                    {!showChatList && (
                        <div className='chat-right'>
                            <ChatOtherUser room={room} chat={selectedChat} mess={listMessages} />
                            <InfoChat room={room} chat={selectedChat} />
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
                            <ListMess onSelectChat={setSelectedChat} filter={filterType} setRoom={setRoom} />
                        </div>

                    </div>

                    <div className='chat-right'>
                        <ChatOtherUser room={room} chat={selectedChat} mess={listMessages} />
                        <InfoChat room={room} chat={selectedChat} />
                    </div>
                </>
            )}
        </div>
    );
}

export default ConsersationLayout;