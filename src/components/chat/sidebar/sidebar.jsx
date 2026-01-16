import { useState } from "react";
import "./sidebar.css";
import {useWebSocket} from "../../../context/WebSocketContext";
import {SocketRequests} from "../../../hooks/useWebSocket";
// import 'bootstrap/dist/css/bootstrap.min.css';

//here we need to catch api get user list 

function Sidebar({ onFilterChange }) {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [chooseRoom, setChooseRoom] = useState(false)
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
            setChooseRoom(true)
        }
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
        console.log("Searching for:", searchQuery, "if exists");
        const packet = SocketRequests.checkUserExist(searchQuery);
        sendMessage(packet);
        console.log("sent message to check user exist:", packet);

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
        sendMessage(packet);
        console.log("sent message to join room:", packet);
    }

    return (
        <div className="sidebar-container">
            <div className="chat-sidebar">
                <div className="side-bar">
                    <h1 className="name">Chat Conversation</h1>
                    <div className="buttonSide">
                        <form className="d-flex search" role="search" onSubmit={handleSearch}>
                            <input className="form-control me-2" type="search" style={{ width: "80%" }} placeholder="Search" aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="filter-buttons d-flex gap-2">
                            {/* when user click all, it  will show all conversations 
                            but when user click Room, it will show only room conversations with type = 1*/}
                            <button type="button" onClick={() => handleClick('all')} className="btn btn-outline-success">All</button>
                            <button type="button" onClick={() => handleClick('room')} className="btn btn-outline-success">Room</button>
                            {chooseRoom && (
                                <button type="button" className="btn join-btn" onClick={handeJoinRoom}></button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Sidebar;