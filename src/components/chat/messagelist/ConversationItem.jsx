import { formatTime } from '../../../utils/formatTime';
import "./ConversationItem.style.css"
function ConversationItem({ user, isOnline, lastMessage, onClick }) {
    return (
        <a
            onClick={() => {
                onClick()
            }}
            href="#"
            className="list-group-item list-group-item-action">
            <div className="component d-flex w-100 align-items-center justify-content-between">
                <div className="component-left d-flex align-items-center">
                    <div className='avt-box'>
                        {user.type === 1 ? (
                            <button className='room-avt' />
                        ) : (
                            <button className='avt' />
                        )}
                    </div>

                    <div className="colorMessage">
                        <h6 className="mb-0 user-name">{user.name}</h6>
                        <small className='user-name'>{lastMessage?.mes || ''}</small>
                    </div>
                </div>
                <div className="component-right d-flex flex-column align-items-end">
                    {/* <small className="colorMessage mb-1">
                        {formatTime(lastMessage?.createAt)}
                    </small> */}
                    <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                </div>
            </div>
        </a>
    );
}

export default ConversationItem;
