import './ListMess.css';
import { useChatList } from './useChatList'; 
import ConversationItem from './ConversationItem';

function ListMess() {
    const { users, onlineStatus, lastMessages } = useChatList();
    // 
    return (
        <div className="chat-list">
            <div className="list-group list-group-flush">
                {users.map((user) => (
                    <ConversationItem
                        key={user.name} 
                        user={user}
                        isOnline={onlineStatus[user.name]}
                        lastMessage={lastMessages[user.name]}
                    />
                ))}
            </div>
        </div>
    );
}

export default ListMess;