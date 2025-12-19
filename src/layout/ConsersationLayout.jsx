import './ChatLayout.css';
import Sidebar from '../components/chat/sidebar/sidebar.jsx';
import ListMess from '../components/chat/messagelist/ListMess.jsx';
import ChatOtherUser from '../components/chat/chatOtherUser/ChatOtherUser.jsx';
import InfoChat from '../components/chat/chatOtherUser/InfoChat.jsx';

function ConsersationLayout() {
    return (
        <div className='chat-container'>
            <div className='chat-left'>
                <Sidebar /> 
                <ListMess />

            </div>
            <div className='chat-right'>
                <ChatOtherUser/>
                <InfoChat/>
            </div>
        </div>
    );
}

export default ConsersationLayout;