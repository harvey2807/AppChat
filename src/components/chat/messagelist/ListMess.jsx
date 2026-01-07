import './ListMess.css';
import { useChatList } from './useChatList';
import ConversationItem from './ConversationItem';
import { use } from 'react';

function ListMess({ onSelectChat, filter }) {
    const { users, onlineStatus, lastMessages } = useChatList();
    // 2. Logic lọc danh sách dựa trên filter
    const filteredUsers = users.filter((user) => {
        if (filter === 'all') {
            return user.type === 0 || user.type === 1;
        }
        if (filter === 'room') {
            return user.type === 1;
        }
        return true;
    });
    return (
        <div className="chat-list"> 
            <div className="list-group list-group-flush">
                {filteredUsers.map((user) => (
                    <ConversationItem
                        key={user.name}
                        user={user}
                        isOnline={onlineStatus[user.name]}
                        lastMessage={lastMessages[user.name]}
                        onClick={() => onSelectChat(user.name)}
                    />
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center mt-3 text-muted">
                        No conversations found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListMess;