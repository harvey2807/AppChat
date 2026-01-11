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
    const { isAuth } = useAuth()
    const [count, setCount] = useState(0);


    const checkQueueRef = useRef([]);
    const currentUser = localStorage.getItem("USER");    // Initialize: login and get list user

    useEffect(() => {
        if (isConnected || isAuth) {
            sendMessage(SocketRequests.getUserList());
        }
    }, []);

    useEffect(() => {
        if (isConnected || users.length > 0) {
            checkQueueRef.current = [];
            users.forEach((user) => {
                if (user.name) {
                    checkQueueRef.current.push(user.name);
                    sendMessage(SocketRequests.checkUserOnline(user.name));
                }
                if (user.type === 0) {
                    sendMessage(SocketRequests.getPeopleMessages(user.name, 1));
                } else {
                    sendMessage(SocketRequests.getRoomMessages(user.name, 1));
                }
                setCount(count + 1)
            });
        }
    }, []);

    // useEffect(() => {
    //     if (isConnected || users.length > 0) {
    //         users.forEach((user) => {
    //             if (user.name) {
    //                 if (user.type === 0) {
    //                     sendMessage(SocketRequests.getPeopleMessages(user.name, 1));
    //                 } else {
    //                     sendMessage(SocketRequests.getRoomMessages(user.name, 1));
    //                 }
    //                 setCount(count + 1)
    //             }
    //         });
    //     }
    // }, [users, isConnected]);

    const handleSocketMessage = useCallback((e) => {
        const message = e.detail;
        if (!message) return;
        const { event, data } = message;

        switch (event) {
            case "GET_USER_LIST":
                if (Array.isArray(message.data)) {
                    const listUser = message.data.filter(x => x.name !== currentUser)
                    setUsers(listUser);
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

            // case "GET_PEOPLE_CHAT_MES":
            //     if (Array.isArray(message.data) && message.data.length > 0) {
            //         const sortedMessages = message.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            //         const lastMessage = sortedMessages[0];

            //         const key = lastMessage.name === currentUser ? lastMessage.to : lastMessage.name;

            //         setLastMessages((prev) => ({
            //             ...prev,
            //             [key]: lastMessage
            //         }));
            //     }
            //     break;
            // case "GET_ROOM_CHAT_MES":
            //     if (Array.isArray(message.data.chatData) && message.data.chatData.length > 0) {
            //         const sortedMessages = message.data.chatData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            //         const lastMessage = sortedMessages[0];

            //         const key = lastMessage.name === currentUser ? lastMessage.to : lastMessage.name;

            //         setLastMessages((prev) => ({
            //             ...prev,
            //             [key]: lastMessage
            //         }));
            //     }
            //     break;
            default: break;
        }
    }, [users, count]);

    useEffect(() => {
        window.addEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        return () => {
            window.removeEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        };
    }, [handleSocketMessage]);

    return { users, onlineStatus, lastMessages };
};