import './ListMess.css';
import { useChatList } from './useChatList';
import ConversationItem from './ConversationItem';
import { useEffect } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { SocketRequests } from '../../../hooks/useWebSocket';

function ListMess({ onSelectChat, filter, setRoom }) {
    const { users, onlineStatus, lastMessages } = useChatList();
    // 2. Logic lọc danh sách dựa trên filter
    const filteredUsers = users.filter((user) => {
        if (filter === 'all') {

            return true; // Lấy hết

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
                        onClick={() => {
                            onSelectChat(user);
                            if (user.type === 1) {
                                setRoom(true)
                            }
                            else {
                                setRoom(false)
                            }
                        }}
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