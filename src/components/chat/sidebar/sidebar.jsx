import "./sidebar.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

//here we need to catch api get user list 

function Sidebar() {
   
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
                        <div className="filter-buttons d-flex gap-2">
                            <button type="button" className="btn btn-outline-success">All</button>
                            <button type="button" className="btn btn-outline-success">Room</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar;