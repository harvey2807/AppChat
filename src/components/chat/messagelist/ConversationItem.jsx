import { formatTime } from '../../../utils/formatTime';

function ConversationItem({ user, isOnline, lastMessage,onClick }) {
    return (
        <a
            onClick={() => {
                onClick()
            }}
            href="#"
            className="list-group-item list-group-item-action">
            <div className="d-flex w-100 align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="avatar me-3">
                        <button className='room-avt' />
                    </div>
                    <div className="colorMessage">
                        <h6 className="mb-0">{user.name}</h6>
                        <small>{lastMessage?.mes || ''}</small>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <small className="colorMessage mb-1">
                        {formatTime(lastMessage?.createAt)}
                    </small>
                    <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                </div>
            </div>
        </a>
    );
}

export default ConversationItem;