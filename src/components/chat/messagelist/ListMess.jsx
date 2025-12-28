import './ListMess.css';

function ListMess(onSelectChat) {
    return (
        <div className="chat-list">
            <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action ">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div className="avatar me-3">
                                <button className='room-avt' />
                            </div>
                            <div className="colorMessage">
                                <h6 className="mb-0 ">Tên người dùng khác</h6>
                                <small className="">Bạn: tin nhắn mới nhất</small>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                            <small className="colorMessage mb-1">Giờ</small>
                            <div className="status-dot unread"></div> </div>
                    </div>
                </a>

                <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div className="avatar me-3">
                                <button className='room-avt' />
                            </div>
                            <div className="colorMessage">

                                <h6 className="mb-0 ">Tên người dùng khác</h6>
                                <small className="">Bạn: tin nhắn mới nhất</small>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                            <small className="colorMessage mb-1">Giờ</small>
                            <div className="status-dot"></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default ListMess;