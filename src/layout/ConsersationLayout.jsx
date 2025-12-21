import './ChatLayout.css';
import { useState } from 'react';
import Sidebar from '../components/chat/sidebar/sidebar.jsx';
import ListMess from '../components/chat/messagelist/ListMess.jsx';
import ChatOtherUser from '../components/chat/chatOtherUser/ChatOtherUser.jsx';
import InfoChat from '../components/chat/chatOtherUser/InfoChat.jsx';
import useMediaQuery from '../hooks/useMediaQuery.js';


function ConsersationLayout() {
    const [room, setRoom] = useState(false)
    const isMobile = useMediaQuery("(max-width: 992px)")
    const [showChatList, setShowChatList] = useState(false)

    return (
        <div className='chat-container'>
            {isMobile && (
                <div className='chat-left' style={{width: showChatList ? '100%': '5%'}}>
                    <button className="chat-icon" onClick={() => setShowChatList(true)} />
                    {showChatList && (
                        <div className='chat-left-content'>
                            <Sidebar />
                            <ListMess />
                        </div>
                    )}

                </div>
            )}
            {!isMobile && (
                <div className='chat-left'>
                    <button className="chat-icon" onClick={() => setShowChatList(true)} />
                    <div className='chat-left-content'>
                        <Sidebar />
                        <ListMess />
                    </div>

                </div>
            )}
            {isMobile && !showChatList && (
                <div className='chat-right'>
                    <ChatOtherUser room={room} />
                    <InfoChat room={room} />
                </div>
            )}
            {!isMobile && (
                <div className='chat-right'>
                    <ChatOtherUser room={room} />
                    <InfoChat room={room} />
                </div>
            )}
        </div>
    );
}

export default ConsersationLayout;