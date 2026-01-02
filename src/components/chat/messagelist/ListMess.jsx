import './ListMess.css';
import { useChatList } from './useChatList';
import ConversationItem from './ConversationItem';

function ListMess({ onSelectChat, filter }) {
    const { users, onlineStatus, lastMessages } = useChatList();
    // 
    // 2. Logic lọc danh sách dựa trên filter
    console.log("Current filter in ListMes hein tai deo co ai ");
    const filteredUsers = users.filter((user) => {
        console.log("Current filter in ListMessdcdasdklasdklasd:", filter);
        if (filter === 'all') {
            return true; // Lấy hết
        }
        if (filter === 'room') {
            console.log("Filtering for room type usersasdasdkjasdjlasdjlasdjlaskdjsladjalsjdlskadjlasdjlasdjlasjdlasjdlasjd");
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