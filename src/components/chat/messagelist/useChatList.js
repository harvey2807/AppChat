// hooks/useChatList.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { SocketRequests } from '../../../hooks/useWebSocket';
import { useAuth } from '../../../context/AuthContext';

export const useChatList = () => {
    const { isConnected, sendMessage } = useWebSocket();
    // const [typeFilter, setTypeFilter] = useState({}); // 'all' or 'room'
    const [users, setUsers] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const { isAuth, chatWithUser, chatInRoom, dstUser, dstRoom } = useAuth()


    const checkQueueRef = useRef([]);
    const currentUser = localStorage.getItem("USER");    // Initialize: login and get list user

    useEffect(() => {
        // sendMessage(SocketRequests.login("luc", "12345"));

        if (isConnected || isAuth) {
            console.log("isConnected:", isConnected, "isAuth:", isAuth);
            sendMessage(SocketRequests.getUserList());
            console.log("Length of users after request:", users.length);
            console.log("Đã lấy xong list user")
        }

        // }
    }, [isConnected]);

    useEffect(() => {
        if (isConnected || users.length > 0) {
            checkQueueRef.current = [];
            users.forEach((user) => {
                if (user.name) {
                    checkQueueRef.current.push(user.name);

                    console.log(`Asking about: ${user.name}, Queue number: ${checkQueueRef.current.length}`);
                    sendMessage(SocketRequests.checkUserOnline(user.name));
                }
            });
        }
    }, [isConnected, users, sendMessage]);

    // useEffect(() => {
    //     if (isConnected || users.length > 0) {
    //         users.forEach((user) => {
    //             if (user.name) {
    //                 console.log("MÉ sao kì vậy")
    //                 if (user.type === 0) {
    //                     sendMessage(SocketRequests.getPeopleMessages(user.name, 1));
    //                 } else if (user.type === 1) {
    //                     sendMessage(SocketRequests.getRoomMessages(user.name, 1));
    //                 }
    //             }
    //         });
    //     }
    // }, [users, isConnected, sendMessage]);

    const handleSocketMessage = useCallback((e) => {
        const message = e.detail;
        if (!message) return;
        const { event, data } = message;

        switch (event) {
            case "GET_USER_LIST":
                if (Array.isArray(message.data)) {
                    console.log("Received user list:", message.data);
                    setUsers(message.data);
                }
                break;

            case "CHECK_USER_ONLINE":
                const userChecked = checkQueueRef.current.shift();

                if (userChecked) {
                    console.log(`Server responsed status: ${data.status} -> Asigned for: ${userChecked}`);
                    setOnlineStatus((prev) => ({
                        ...prev,
                        [userChecked]: message.data.status
                    }));
                } else {
                    console.warn("Server responsed extra or queue misaligned!");
                }
                break;

            case "GET_PEOPLE_CHAT_MES":
                console.log("Danh sach tin nhan lay cua nguoi dung" + message.data)
                break;
            case "GET_ROOM_CHAT_MES":
                // if (Array.isArray(message.data) && message.data.length > 0) {
                //     const sortedMessages = message.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                //     const lastMessage = sortedMessages[0];

                //     const key = lastMessage.name === currentUser ? lastMessage.to : lastMessage.name;

                //     setLastMessages((prev) => ({
                //         ...prev,
                //         [key]: lastMessage
                //     }));
                // }
                break;
            default: break;
        }
    }, []);

    useEffect(() => {
        window.addEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        return () => {
            window.removeEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        };
    }, [handleSocketMessage]);

    return { users, onlineStatus, lastMessages };
};