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
    const [selectedChatId, setSelectedChatId] = useState(null)
    const { isConnected, sendMessage, isAuthenticated, setIsAuthenticated } = useWebSocket();
    const { isAuth, reloginCode, user } = useAuth();

    const handleFilterChange = (type) => {
        setFilterType(type);
    };
    useEffect(() => {
        if (!isAuth) navigate("/login");
    }, [isAuth]);

    useEffect(() => {
        if (!isConnected && isAuthenticated) {
            console.log("Socket disconnected, resetting isAuthenticated to false");
            setIsAuthenticated(false);
        } else {
            console.log("Socket connection status:", isConnected, "| isAuthenticated:", isAuthenticated);
        }

    }, [isConnected, isAuthenticated]);

    useEffect(() => {
        if ((isConnected || !isConnected) && isAuth && reloginCode && (isAuthenticated || !isAuthenticated)) {
            console.log("Attempting re-login for user:", user);
            sendMessage(SocketRequests.reLogin(user, reloginCode));
        } else {
            console.log("Re-login conditions:", {
                isConnected,
                isAuth,
                hasReloginCode: !!reloginCode,
                isAuthenticated
            });

        }
    }, [isConnected, isAuth, reloginCode, isAuthenticated, sendMessage]);

    useEffect(() => {
        const handleReLoginSuccess = (e) => {
            const msg = e.detail;
            console.log("Handle relogin success ", msg.event)
            setIsAuthenticated(true);
            try {
                if (msg.event === "RE_LOGIN" && msg.status === "success") {
                    console.log("ReLogin successful for user:", msg.event);
                    //setIsAuthenticated(true);
                    sendMessage(SocketRequests.getUserList());
                    // const list = sendMessage(SocketRequests.getUserList());
                    // console.log("ReLogin successfulllll for user:", msg.event);
                    // }
                    //  if (msg.event === "AUTH") {
                    //     setIsAuthenticated(true);
                    //     sendMessage(SocketRequests.getUserList());
                    // }
                    // Also handle direct LOGIN success (first time login)
                    // else if (msg.event === "LOGIN" && msg.status === "success") {

                    //     console.log("login sucessfull at the first time");
                    //     setIsAuthenticated(true);
                } else {
                    //why check here 
                    console.log("ReLogin failed or other event:", msg.event, msg.mes);
                }
            }
            catch (err) {
                console.log("Error handling re-login success:", err)
            }
        };
        window.addEventListener("WS_MESSAGE_RECEIVED", handleReLoginSuccess);
        return () => window.removeEventListener("WS_MESSAGE_RECEIVED", handleReLoginSuccess);
    }, [isAuthenticated]);

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