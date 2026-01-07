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
    const { isAuth } = useAuth();

    const checkQueueRef = useRef([]);
    const onlineCheckCountRef = useRef(0);
    const hasRequestedUserListRef = useRef(false);
    const hasCheckedOnlineRef = useRef(false);
    const fetchedMessagesRef = useRef(new Set());
    const messageQueueRef = useRef([]); 
    const isProcessingQueueRef = useRef(false); 
    const currentUser = localStorage.getItem("USER");

    useEffect(() => {
        if (isConnected && isAuthenticated && !hasRequestedUserListRef.current) {
            console.log("Requesting user list...");
            sendMessage(SocketRequests.getUserList());
            hasRequestedUserListRef.current = true;
        }

        // Reset ALL refs when disconnected OR when not authenticated
        if (!isConnected || !isAuthenticated) {
            hasRequestedUserListRef.current = false;
            hasCheckedOnlineRef.current = false;
            onlineCheckCountRef.current = 0;
            fetchedMessagesRef.current.clear();
            messageQueueRef.current = [];
            isProcessingQueueRef.current = false;
        }
    }, [isConnected, isAuthenticated]);


    useEffect(() => {
        if (isConnected && isAuthenticated && users.length > 0 && !hasCheckedOnlineRef.current) {
            console.log(`Checking online status for ${users.length} users`);
            checkQueueRef.current = [];
            onlineCheckCountRef.current = 0;
            
            users.forEach((user, index) => {
                if (user.name) {
                    setTimeout(() => {
                        checkQueueRef.current.push(user.name);
                        sendMessage(SocketRequests.checkUserOnline(user.name));
                    }, index * 200);
                }
            });
            
            hasCheckedOnlineRef.current = true;
        }
    }, [users, isConnected, isAuthenticated]);

    const fetchMessagesForUser = useCallback((userName, userType) => {
        if (fetchedMessagesRef.current.has(userName) || loadingMessages[userName]) {
            console.log(`Skipping ${userName} (already fetched or loading)`);
            return;
        }

        if (!isConnected || !isAuthenticated) {
            console.warn(`Cannot fetch ${userName} - not connected/authenticated`);
            return;
        }

        console.log(`Fetching messages for: ${userName}`);
        setLoadingMessages(prev => ({ ...prev, [userName]: true }));
        fetchedMessagesRef.current.add(userName);

        // if (userType === 0) {
        //     console.log(`Sending GET_PEOPLE_CHAT_MES for ${userName}`);
        //     sendMessage(SocketRequests.getPeopleMessages("long", 1));
        // } else if (userType === 1) {
        //     sendMessage(SocketRequests.getRoomMessages(userName, 1));
        // }
    }, [isConnected, isAuthenticated, sendMessage]);
    // useEffect(() => {
    //     if (
    //         isConnected && 
    //         isAuthenticated && 
    //         users.length > 0 && 
    //         onlineCheckCountRef.current === users.length &&
    //         messageQueueRef.current.length === 0 
    //     ) {
    //         console.log(`Setting up queue for ${users.length} conversations`);
            
    //         const recentUsers = [...users]
    //             .sort((a, b) => new Date(b.actionTime) - new Date(a.actionTime))
    //             .slice(0, 13);

    //         messageQueueRef.current = recentUsers;
            
    //         processNextMessage();
    //     }
    // }, [users, isConnected, isAuthenticated, onlineCheckCountRef.current]);

    // const processNextMessage = useCallback(() => {
    //     if (!isConnected || !isAuthenticated) {
    //         console.log("Queue stopped: disconnected");
    //         return;
    //     }

    //     if (isProcessingQueueRef.current) {
    //         console.log("Already processing, skipping");
    //         return;
    //     }

    //     if (messageQueueRef.current.length === 0) {
    //         console.log("All messages fetched!");
    //         return;
    //     }

    //     const user = messageQueueRef.current.shift();
    //     if (!user || fetchedMessagesRef.current.has(user.name)) {
    //         processNextMessage();
    //         return;
    //     }

    //     isProcessingQueueRef.current = true;
    //     fetchedMessagesRef.current.add(user.name);

    //     console.log(`[${13 - messageQueueRef.current.length}/13] Fetching: ${user.name}`);

    //     if (user.type === 0) {
    //         console.log(`Sending GET_PEOPLE_CHAT_MES for ${user.name}`);
    //         sendMessage(SocketRequests.getPeopleMessages(user.name, 1));
    //     } else if (user.type === 1) {
    //         sendMessage(SocketRequests.getRoomMessages(user.name, 1));
    //     }
    // }, [isConnected, isAuthenticated, sendMessage]);


    const handleSocketMessage = useCallback((e) => {
        const message = e.detail;
        if (!message) return;
        const { event, data } = message;

        console.log("Received event:", event, "| Data type:", typeof data, "| Is array?", Array.isArray(data));

        switch (event) {
            case "GET_USER_LIST":
                if (Array.isArray(data)) {
                    console.log("Received user list:", data.length, "users");
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
            //     console.log("Processing GET_PEOPLE_CHAT_MESssss:", peopleMessages);
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

            default: 
                if (!["LOGIN", "RE_LOGIN", "AUTH"].includes(event)) {
                    console.log("UNHANDLED EVENT:", event, message);
                }
                break;
        }
    // }, [currentUser, users.length, processNextMessage]);
    }, [currentUser, users.length]);

    useEffect(() => {
        window.addEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        return () => {
            window.removeEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        };
    }, [handleSocketMessage]);

    console.log("list chat", typeof lastMessages)
    return { 
        users, 
        onlineStatus, 
        lastMessages, 
        loadingMessages,
        fetchMessagesForUser 
    };
};