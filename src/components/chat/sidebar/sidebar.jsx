import "./sidebar.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <h1 className="name">Chat Conversation</h1>
            <form class="d-flex" role="search">
                <input className="form-control me-2" type="search" style={{width: "60%"}} placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
            <div className="filter-buttons d-flex gap-2">
                <button type="button" className="btn btn-outline-success">All</button>
                <button type="button" className="btn btn-outline-success">Room</button>
            </div>
        </div>
    )
}
export default Sidebar;