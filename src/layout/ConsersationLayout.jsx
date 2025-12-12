import './ChatLayout.css';
import Sidebar from '../components/chat/sidebar/sidebar.jsx';

function ConsersationLayout() {
    return (
        <div className='chat-container'>
            <div className='chat-left'>
                <Sidebar />
            </div>
            <div className='chat-right'>
                <h1>HELLOooooo</h1>
            </div>
        </div>
    );
}

export default ConsersationLayout;