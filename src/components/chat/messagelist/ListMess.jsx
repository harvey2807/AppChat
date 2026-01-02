import './ListMess.css';
import { useState, useEffect, useRef, use } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { SocketRequests } from '../../../hooks/useWebSocket';
import { formatTime } from '../../../utils/formatTime';
import { useAuth } from '../../../context/AuthContext';

function ListMess() {
    const { isConnected, sendMessage } = useWebSocket();
    const [users, setUsers] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [lastMessages, setLastMessages] = useState([]);
    const currentUser = localStorage.getItem("USER");
    const checkQueueRef = useRef([]);
    const { isAuth } = useAuth()

    // Initialize: login and get list user
    useEffect(() => {
        if (isAuth) {
            // sendMessage(SocketRequests.login("luc", "12345"));
            console.log("Đang lấy list user")
            sendMessage(SocketRequests.getUserList());
            console.log("Đã lấy xong list user")
        }
    }, [isConnected, isAuth]);

    // handle check online status for each user
    useEffect(() => {

        if (users.length > 0) {
            checkQueueRef.current = [];

            users.forEach((user) => {
                if (user.name) {
                    checkQueueRef.current.push(user.name);

                    console.log(`Asking about: ${user.name}, Queue number: ${checkQueueRef.current.length}`);
                    sendMessage(SocketRequests.checkUserOnline(user.name));
                }
            });
        }
    }, [users, sendMessage]);
    //handle get last message using api GET_PEOPLE_CHAT_MES
    //logic to get last message: server response a conversation list of 2 people
    //we will get the list messages and sort by time, then get the last message
    useEffect(() => {
        if (users.length > 0) {
            users.forEach((user) => {
                if (user.name) {
                    if (user.type === 0) {
                        sendMessage(SocketRequests.getPeopleMessages(user.name, 1));
                        console.log(`Get messages with: ${user.name}`);
                    }
                    else if (user.type === 1) {
                        sendMessage(SocketRequests.getRoomMessages(user.name, 1));
                        console.log(`Get messages with room: ${user.name}`);
                    } else {
                        console.warn(`Unknown user type for ${user.name}: ${user.type}`);
                    }
                }
            });
        }
    }, [users, sendMessage]);

    //Handle response from server
    useEffect(() => {
        const handleSocketMessage = (e) => {
            const message = e.detail;
            console.log("Handling WS_MESSAGE_RECEIVED in ListMess:", message);
            if (!message) return;

            const { event, data } = message;

            switch (event) {
                case "GET_USER_LIST":
                    if (Array.isArray(message.data)) {
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
                case "GET_PEOPLE_CHAT_MES": {
                    // Log message.data for debugging
                    //we need to shorten createdAt for easier reading and handle when user offline for a while

                    console.log("GET_PEOPLE_CHAT_MES message.data:", message.data);
                    console.log("GET_PEOPLE_CHAT_MES message.data:", JSON.stringify(message.data, null, 2));
                    if (Array.isArray(message.data) && message.data.length > 0) {
                        const sortedMessages = message.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        const lastMessage = sortedMessages[0];
                        console.log("Messages received:", lastMessage);
                        setLastMessages((prev) => ({
                            ...prev,
                            [lastMessage.name === currentUser ? lastMessage.to : lastMessage.name]: lastMessage
                        }));
                        console.log("Last message:", lastMessage);
                        console.log("Time formatted:", formatTime(lastMessage.createAt));
                    } else {
                        console.log("No messages to sort for", message.data?.name);
                    }
                    break;
                }
                case "GET_ROOM_CHAT_MES":
                    //server will be response a list of mess in room
                    console.log(`hello world`);
                    break;
                default:
                    break;
            }
        };
        window.addEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        return () => {
            window.removeEventListener("WS_MESSAGE_RECEIVED", handleSocketMessage);
        };
    }, []);

    return (
        <div className="chat-list">
            <div className="list-group list-group-flush">
                {users.map((user, index) => {
                    const isOnline = onlineStatus[user.name];

                    return (
                        <a key={user.name} href="#" className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="avatar me-3">
                                        <button className='room-avt' />
                                    </div>
                                    <div className="colorMessage">
                                        <h6 className="mb-0">{user.name}</h6>
                                        <small>{lastMessages[user.name]?.mes || ''}</small>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end">
                                    <small className="colorMessage mb-1">{formatTime(lastMessages[user.name]?.createAt)}</small>
                                    <div className={`status-dot ${isOnline === true ? 'online' : (isOnline === false ? 'offline' : '')}`}></div>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default ListMess;