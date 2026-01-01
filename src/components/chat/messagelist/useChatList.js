// useChatList.js
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { SocketRequests } from '../../../hooks/useWebSocket';

export const useChatList = () => {
    const { isConnected, sendMessage } = useWebSocket();
    const [users, setUsers] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const currentUser = "luc"; // Nên lấy từ Context Auth

    // 1. Initial Load
    useEffect(() => {
        if (isConnected) {
            sendMessage(SocketRequests.login(currentUser, "12345"));
            sendMessage(SocketRequests.getUserList());
        }
    }, [isConnected, sendMessage]);

    // 2. Tách logic xử lý message socket ra hàm riêng
    const handleSocketMessage = useCallback((e) => {
        const message = e.detail;
        if (!message) return;
        const { event, data } = message;

        switch (event) {
            case "GET_USER_LIST":
                if (Array.isArray(data)) {
                    setUsers(data);
                    // Gửi request lấy data phụ trợ ngay khi có list
                    // LƯU Ý: Nên tối ưu phía server để trả về full data 1 lần thay vì loop ở đây
                    data.forEach(user => {
                         sendMessage(SocketRequests.checkUserOnline(user.name));
                         // Logic lấy tin nhắn...
                         const reqType = user.type === 0 ? SocketRequests.getPeopleMessages : SocketRequests.getRoomMessages;
                         sendMessage(reqType(user.name, 1));
                    });
                }
                break;
            case "CHECK_USER_ONLINE":
                // Cần sửa lại logic server để trả về cả username trong data
                // Thay vì dùng queue, giả sử data trả về dạng { username: "abc", status: true }
                if(data.username) {
                     setOnlineStatus(prev => ({ ...prev, [data.username]: data.status }));
                }
                break;
            case "GET_PEOPLE_CHAT_MES":
            case "GET_ROOM_CHAT_MES": // Gộp logic nếu format giống nhau
                if (Array.isArray(data) && data.length > 0) {
                     // Sắp xếp và lấy tin mới nhất
                     const lastMsg = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                     // Key mapping logic
                     const key = lastMsg.name === currentUser ? lastMsg.to : lastMsg.name;
                     setLastMessages(prev => ({ ...prev, [key]: lastMsg }));
                }
                break;
            default: break;
        }
    }, [currentUser, sendMessage]);

    useEffect(() => {
        window.addEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        return () => window.removeEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
    }, [handleSocketMessage]);

    return { users, onlineStatus, lastMessages };
};