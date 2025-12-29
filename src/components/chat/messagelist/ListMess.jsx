import './ListMess.css';
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { SocketRequests } from '../../../hooks/useWebSocket';

function ListMess() {
    const { isConnected, lastMessage, sendMessage } = useWebSocket();
    // const [lastMessageState, setLastMessageState] = useState([]);
    const [currentCheckUser, setCurrentCheckUser] = useState(null);
    const [username, setUsername] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({}); // { status: true/false }
    //handle event login success in here
    //but right now i will next it do not use it
    //just display static list mess

    //check socket connected
    useEffect(() => {
        if (isConnected) {
            console.log("WebSocket is connected in ListMess component");

            //send login request
            const login = SocketRequests.login("luc", "12345");
            console.log("Sending login payload:", login);
            sendMessage(login);

            //send get user list request
            const payload = SocketRequests.getUserList();
            console.log("Sending getUserList payload:", payload);
            sendMessage(payload);
        }
    }, [isConnected, sendMessage]);

    // When username list changes, check online status for each user
    useEffect(() => {
        if (isConnected && username.length > 0) {
            username.forEach((user) => {
                console.log("Checking online status for user:", user.name);
                const checkOnlinePayload = SocketRequests.checkUserOnline(user.name);
                sendMessage(checkOnlinePayload);
            });
        }
    }, [isConnected, username, sendMessage]);


    //listen response from server
    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.event === "GET_USER_LIST") {
                console.log("Received user list:", lastMessage.data);
                if (Array.isArray(lastMessage.data)) {
                    setUsername(lastMessage.data);
                    console.log("Updated username state:", lastMessage.data);
                }
            }
            // Handle CHECK_USER_ONLINE response
            if (lastMessage.event === "CHECK_USER_ONLINE") {
                // const user = lastMessage.data?.name;
                const online = lastMessage.data?.status;
                console.log(`online status:`, online);
                // if (user) {
                //     setOnlineStatus((prev) => ({ ...prev, [user]: online }));
                // }
            }
        }
    }, [lastMessage]);




    return (
        <div className="chat-list">
            <div className="list-group list-group-flush">
                {username.map((user, u) => {
                    const isOnline = onlineStatus[user.name];
                    return (
                        <a key={user.name} href="#" className="list-group-item list-group-item-action ">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="avatar me-3">
                                        <button className='room-avt' />
                                    </div>
                                    <div className="colorMessage">
                                        <h6 className="mb-0 ">{user.name}</h6>
                                        <small className="">Bạn: tin nhắn mới nhất</small>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end">
                                    <small className="colorMessage mb-1">Giờ</small>
                                    <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
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