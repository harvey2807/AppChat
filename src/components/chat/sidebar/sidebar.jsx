import "./sidebar.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeContext } from '../../../context/ThemeContext'
import DarkTheme from '../../../assets/images/dark.png'
import LightTheme from '../../../assets/images/light.png'
import { useContext, useEffect } from 'react';

//here we need to catch api get user list 

function Sidebar() {
    const { theme, toggleTheme } = useContext(ThemeContext)
    console.log("theme in sidebar:", theme);

    return (
        <div className="sidebar-container">
            <div className="chat-sidebar">
                <div className="side-bar">
                    <h1 className="name">Chat Conversation</h1>
                    <div className="buttonSide">
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" style={{ width: "60%" }} placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="filter-buttons d-flex gap-2">
                            <button type="button" className="btn btn-outline-success">All</button>
                            <button type="button" className="btn btn-outline-success">Room</button>
                        </div>
                    </div>

                    <button className='theme-btn'
                        onClick={toggleTheme}
                        style={{ backgroundImage: theme === "light" ? `url(${DarkTheme})` : `url(${LightTheme})` }} />

                </div>
            </div>
        </div>
    )
}
export default Sidebar;