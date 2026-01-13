import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { SocketRequests } from '../../../hooks/useWebSocket';
import { useAuth } from '../../../context/AuthContext';

export const useChatList = () => {
    const { isConnected, sendMessage, isAuthenticated } = useWebSocket();
    const [users, setUsers] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const [loadingMessages, setLoadingMessages] = useState({});

    const onlineCheckCountRef = useRef(0);
    const hasRequestedUserListRef = useRef(false);
    const hasCheckedOnlineRef = useRef(false);
    const fetchedMessagesRef = useRef(new Set());
    const messageQueueRef = useRef([]);
    const isProcessingQueueRef = useRef(false);

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

    // const fetchMessagesForUser = useCallback((userName, userType) => {
    //     if (fetchedMessagesRef.current.has(userName) || loadingMessages[userName]) {
    //         console.log(`Skipping ${userName} (already fetched or loading)`);
    //         return;
    //     }

    //     if (!isConnected || !isAuthenticated) {
    //         console.warn(`Cannot fetch ${userName} - not connected/authenticated`);
    //         return;
    //     }

    //     console.log(`Fetching messages for: ${userName}`);
    //     setLoadingMessages(prev => ({ ...prev, [userName]: true }));
    //     fetchedMessagesRef.current.add(userName);

    // if (userType === 0) {
    //     console.log(`Sending GET_PEOPLE_CHAT_MES for ${userName}`);
    //     sendMessage(SocketRequests.getPeopleMessages("long", 1));
    // } else if (userType === 1) {
    //     sendMessage(SocketRequests.getRoomMessages(userName, 1));
    // }
    // }, [isConnected, isAuthenticated, sendMessage]);
    useEffect(() => {

        if (isConnected || users.length > 0) {
            checkQueueRef.current = [];
            users.forEach((user) => {
                if (user.name) {
                    checkQueueRef.current.push(user.name);

                    const recentUsers = [...users]
                        .sort((a, b) => new Date(b.actionTime) - new Date(a.actionTime))
                        .slice(0, 13);
                    messageQueueRef.current = recentUsers;
                }
            });
        }
    }, [isConnected, users, sendMessage]);

    const processNextMessage = useCallback(() => {
        if (!isConnected || !isAuthenticated) {
            console.log("Queue stopped: disconnected");
            return;
        }

        if (isProcessingQueueRef.current) {
            console.log("Already processing, skipping");
            return;
        }

        if (messageQueueRef.current.length === 0) {
            console.log("All messages fetched!");
            return;
        }

        const user = messageQueueRef.current.shift();
        if (!user || fetchedMessagesRef.current.has(user.name)) {
            processNextMessage();
            return;
        }

        isProcessingQueueRef.current = true;
        fetchedMessagesRef.current.add(user.name);

        console.log(`[${13 - messageQueueRef.current.length}/13] Fetching: ${user.name}`);

        if (user.type === 0) {
            // console.log(`Sending GET_PEOPLE_CHAT_MES for ${user.name}`);
            sendMessage(SocketRequests.getPeopleMessages(user.name, 1));
        } else if (user.type === 1) {
            sendMessage(SocketRequests.getRoomMessages(user.name, 1));
        }
    }, [isConnected, isAuthenticated, sendMessage]);

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
                if (Array.isArray(data)) {
                    setUsers(data);
                }
                break;

            case "CHECK_USER_ONLINE":
                const userChecked = checkQueueRef.current.shift();
                if (userChecked) {
                    onlineCheckCountRef.current++;
                    console.log(`[${onlineCheckCountRef.current}/${users.length}] ${userChecked}: ${data.status ? 'online' : 'offline'}`);

                    setOnlineStatus((prev) => ({
                        ...prev,
                        [userChecked]: data.status
                    }));

                    if (onlineCheckCountRef.current === users.length) {
                        console.log("All online checks complete!");
                        setOnlineStatus(prev => ({ ...prev }));
                    }
                }
                break;

                // case "GET_PEOPLE_CHAT_MES":
                //     const peopleMessages = data;
                //     if (Array.isArray(peopleMessages) && peopleMessages.length > 0) {
                //         const sorted = [...peopleMessages].sort((a, b) =>
                //             new Date(b.createAt) - new Date(a.createAt)
                //         );
                //         const lastMsg = sorted[0];
                //         const key = lastMsg.name === currentUser ? lastMsg.to : lastMsg.name;

                //         console.log(`Last message from ${key}: "${lastMsg.mes}"`);
                //         setLastMessages((prev) => ({ ...prev, [key]: lastMsg }));
                //     }

                //     isProcessingQueueRef.current = false;
                //     setTimeout(processNextMessage, 100);
                //     break;

                // case "GET_ROOM_CHAT_MES":
                //     const roomMessages = data?.chatData;
                //     if (Array.isArray(roomMessages) && roomMessages.length > 0) {
                //         const sorted = [...roomMessages].sort((a, b) =>
                //             new Date(b.createAt) - new Date(a.createAt)
                //         );
                //         const lastMsg = sorted[0];
                //         const key = lastMsg.to;

                //         console.log(`Room ${key}: "${lastMsg.mes}"`);
                //         setLastMessages((prev) => ({ ...prev, [key]: lastMsg }));
                //     }

                //     isProcessingQueueRef.current = false;
                //     setTimeout(processNextMessage, 100);
                //     break;

                // default:
                //     if (!["LOGIN", "RE_LOGIN", "AUTH"].includes(event)) {
                //         console.log("UNHANDLED EVENT:", event, message);
                //     }
                // console.log("Danh sach tin nhan lay cua nguoi dung" + message.data)
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
        }
    }, []);


    useEffect(() => {
        window.addEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        return () => {
            window.removeEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        };
    }, [handleSocketMessage]);

    // console.log("list chat", typeof lastMessages) // Comment out để giảm log
    return {
        users,
        onlineStatus,
        lastMessages,
        loadingMessages,
        // fetchMessagesForUser 
    };
};