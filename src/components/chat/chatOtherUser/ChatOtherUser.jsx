import './ChatOtherUser.css'
import { useRef } from 'react'

const userName = "duy"

function ChatOtherUser({onSend}) {
    const textareaRef = useRef(null)
    const MAX_HEIGHT = 140
    const messages = [{ "id": 11077, "name": "tttt", "type": 0, "to": "duy", "mes": "Bạn ơi tối nay đi chơi được không. Mọi chi phí tôi lo, bạn chỉ cần đi thôi.", "createAt": "2025-12-12 07:31:12" },
    { "id": 11076, "name": "duy", "type": 0, "to": "tttt", "mes": "Ok luôn bạn ê.", "createAt": "2025-12-12 07:31:09" },
    { "id": 11075, "name": "duy", "type": 0, "to": "tttt", "mes": "Mà cho tôi cái lịch đi bạn ơi.", "createAt": "2025-12-12 07:35:09" }]

    const handleInput = () => {
        const el = textareaRef.current
        el.style.height = 'auto'

        if (el.scrollHeight <= MAX_HEIGHT) {
            el.style.height = el.scrollHeight + "px";
            el.style.overflowY = "hidden";
        } else {
            el.style.height = MAX_HEIGHT + "px";
            el.style.overflowY = "auto";
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend?.(textareaRef.current.value);
            textareaRef.current.value = "";
            textareaRef.current.style.height = "40px";
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-box-header">
                <button className='avt' />
                <text className='user-name'>Nguoi dung khac</text>
            </div>
            <div className="main-chat">
                {messages.map(msg => (
                    Message(msg)
                ))}
            </div>
            <div className="chat-input">
                <button className='image-btn' />
                <button className='file-btn' />
                <div class="form-chat">
                    <textarea className="chat-text" 
                    ref={textareaRef}
                    rows="1" 
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder='Nhập tin nhắn . . .' />
                    <button className='icon-btn file-btn' />
                    <button className="send-btn file-btn"></button>
                </div>
            </div>
        </div>
    )
}
function Message(msg) {
    if (msg.name === userName) {
        return (
            <div className="message me">
                <div className="message-content">
                    <p>{msg.mes}</p>
                    <span className="time-send">
                        {msg.createAt}
                    </span>
                </div>
                <button className='avt' style={{ width: 15, height: 15 }} />
            </div>
        )
    } else {
        return (
            <div className="message other">
                <button className='avt' style={{ width: 15, height: 15 }} />
                <div className="message-content">
                    <p>{msg.mes}</p>
                    <span className="time-send">
                        {msg.createAt}
                    </span>
                </div>
            </div>
        )
    }
}
// {"event":"GET_PEOPLE_CHAT_MES","status":"success","data":[{"id":11077,"name":"tttt","type":0,"to":"duy","mes":"ấd","createAt":"2025-12-12 07:31:12"},{"id":11076,"name":"duy","type":0,"to":"tttt","mes":"keeeeee","createAt":"2025-12-12 07:31:09"},{"id":11075,"name":"duy","type":0,"to":"tttt","mes":"klsdfds","createAt":"2025-12-12 07:31:02"},{"id":11074,"name":"tttt","type":0,"to":"duy","mes":"knn","createAt":"2025-12-12 07:30:59"},{"id":11073,"name":"tttt","type":0,"to":"duy","mes":"kjhjk","createAt":"2025-12-12 07:30:44"},{"id":11072,"name":"duy","type":0,"to":"tttt","mes":"sdfsf","createAt":"2025-12-12 07:30:34"},{"id":11071,"name":"tttt","type":0,"to":"duy","mes":"o;lsjdklf","createAt":"2025-12-12 07:30:26"},{"id":11069,"name":"duy","type":0,"to":"tttt","mes":"hello","createAt":"2025-12-12 07:27:22"},{"id":11068,"name":"duy","type":0,"to":"tttt","mes":"hello","createAt":"2025-12-12 07:26:55"}]}

export default ChatOtherUser
