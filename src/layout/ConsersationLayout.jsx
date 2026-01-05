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
    console.log("Current filterType in ConsersationLayout:", filterType);
    const isMobile = useMediaQuery("(max-width: 992px)")
    const [showChatList, setShowChatList] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState(null)
    const { isConnected, sendMessage } = useWebSocket();
    const { isAuth, reloginCode, user } = useAuth();

    const handleFilterChange = (type) => {
        setFilterType(type);
    };
    useEffect(() => {
        if (!isAuth) navigate("/login");
    }, [isAuth]);

    useEffect(() => {
        if (isConnected && isAuth && reloginCode) {
            sendMessage(SocketRequests.reLogin(user, reloginCode));
        }
    }, [isConnected, isAuth, reloginCode]);
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
                                <ListMess onSelectChat={setSelectedChatId} filter={filterType} />
                            </div>
                        )}
                    </div>
                    {!showChatList && (
                        <div className='chat-right'>
                            <ChatOtherUser room={room} chatId={selectedChatId} />
                            <InfoChat room={room} chatId={selectedChatId} />
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
                            <ListMess onSelectChat={setSelectedChatId} filter={filterType} />
                        </div>

                    </div>

                    <div className='chat-right'>
                        <ChatOtherUser room={room} chatId={selectedChatId} />
                        <InfoChat room={room} chatId={selectedChatId} />
                    </div>
                </>
            )}
        </div>
    );
}

export default ConsersationLayout;