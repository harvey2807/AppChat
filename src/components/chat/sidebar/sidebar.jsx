import { useState } from "react";
import "./sidebar.css";

//here we need to catch api get user list 

function Sidebar() {
    const [chooseRoom, setChooseRoom] = useState(false)
    const handleChooseRoom = () => {
        setChooseRoom(prev => !prev)
    }
    return (
        <div className="sidebar-container">
            <div className="chat-sidebar">
                <div className="side-bar">
                    <h1 className="name">Chat Conversation</h1>
                    <div className="buttonSide">
                        <form className="d-flex search" role="search">
                            <input className="form-control me-2" type="search" style={{ width: "80%" }} placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="filter-buttons d-flex gap-2" style={{ alignItems: "center" }}>
                            <button
                                onClick={() => setChooseRoom(false)}
                                style={{ backgroundColor: chooseRoom ? "var(--bg)" : "var(--chose-btn) ", color: chooseRoom ? "var(--text)" : "var(--bg)" }}
                                type="button"
                                className="btn">All</button>
                            <button
                                onClick={handleChooseRoom}
                                style={{ backgroundColor: chooseRoom ? "var(--chose-btn)" : "var(--bg)", color: chooseRoom ? "var(--bg)" : "var(--text)" }}
                                type="button"
                                className="btn">Room</button>
                            {chooseRoom && (
                                <button type="button" className="btn join-btn"></button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Sidebar;