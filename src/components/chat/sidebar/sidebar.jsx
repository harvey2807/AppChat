import { useState } from "react";
import "./sidebar.css";
import {useWebSocket} from "../../../context/WebSocketContext";
import {SocketRequests} from "../../../hooks/useWebSocket";
// import 'bootstrap/dist/css/bootstrap.min.css';

//here we need to catch api get user list 

function Sidebar({ onFilterChange }) {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [chooseRoom, setChooseRoom] = useState(false);
    const [roomName, setRoomName] = useState(''); 

    // const [chooseRoom, setChooseRoom] = useState(false)
    const { sendMessage, isConnected } = useWebSocket();
    const [searchQuery, setSearchQuery] = useState("");

    // const handleChooseRoom = () => {
    //     setChooseRoom(prev => !prev)
    // }

    const handleClick = (filter) => {
        setSelectedFilter(filter);
        console.log(`Filter selected: ${filter}`);

        if (onFilterChange) {
            onFilterChange(filter);
        }
        
        if (filter === 'room') {
            setChooseRoom(true);
        } else {
            setChooseRoom(false);
        }
    }

    const handleCreateRoom = (e) => {
        e.preventDefault(); 
        
        if (!roomName.trim()) {
            alert('Vui lòng nhập tên room!');
            return;
        }

        if (!isConnected ) {
            alert('Chưa kết nối hoặc chưa đăng nhập!');
            return;
        }

        console.log(`Tạo room: ${roomName}`);
        sendMessage(SocketRequests.createRoom(roomName));
        sendMessage(SocketRequests.joinRoom(roomName))
        setRoomName(roomName);
    }
    const handleSearch = (e) => {
        e.preventDefault();
        // check searchQuery
        if (!searchQuery) {
            console.log("Search query empty");
            return;
        }

        // check websocket connection
        // if (!isConnected) {
        //     console.log("WebSocket not connected");
        //     return;
        // }

        // further implementation here
        const packet = SocketRequests.checkUserExist(searchQuery);
        sendMessage(packet);
        console.log("Sent packet:", packet);

    }

    const handeJoinRoom = (e) => {
        e.preventDefault();
        // check searchQuery
        if (!searchQuery.trim()) {
            console.log("Search query empty");
            return;
        }
        // further implementation here

        const packet = SocketRequests.joinRoom(searchQuery);
        console.log(sendMessage(packet));
    }

    return (
        <div className="sidebar-container">
            <div className="chat-sidebar">
                <div className="side-bar">
                    <h1 className="name">Chat Conversation</h1>
                    <div className="buttonSide">
                        <form className="d-flex search" role="search" onSubmit={handleCreateRoom}>
                            <input 
                                className="form-control me-2" 
                                type="text" 
                                style={{ width: "80%" }} 
                                placeholder={chooseRoom ? "Nhập tên room" : "Search"} 
                                aria-label="Search"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />

                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="filter-buttons d-flex gap-2">
                            {/* when user click all, it  will show all conversations 
                            but when user click Room, it will show only room conversations with type = 1*/}
                            <button type="button" onClick={() => handleClick('all')} className="btn btn-outline-success">All</button>
                            <button type="button" onClick={() => handleClick('room')} className="btn btn-outline-success">Room</button>
                            {chooseRoom && (
                                <button type="button" onClick={handleCreateRoom} className="btn btn-outline-success">Create</button>
                                // <button type="button" className="btn join-btn" onClick={handeJoinRoom}></button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Sidebar;