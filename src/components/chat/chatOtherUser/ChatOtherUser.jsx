import './ChatOtherUser.css'
import { useContext, useRef, useState } from 'react'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { ThemeContext } from '../../../context/ThemeContext'
import DarkTheme from '../../../assets/images/dark.png'
import LightTheme from '../../../assets/images/light.png'

const userName = "duy"

function ChatOtherUser({ room, chatId }) {
    const textareaRef = useRef(null)
    const [text, setText] = useState("")
    const [showPicker, setShowPicker] = useState(false)
    const MAX_HEIGHT = 140
    const messages = [
        { "id": 11077, "name": "tttt", "type": 0, "to": "duy", "mes": "Bạn ơi tối nay đi chơi được không. Mọi chi phí tôi lo, bạn chỉ cần đi thôi.", "createAt": "2025-12-12 07:31:12" },
        { "id": 11076, "name": "duy", "type": 0, "to": "tttt", "mes": "Ok luôn bạn ê.", "createAt": "2025-12-12 07:31:09" },
        { "id": 11075, "name": "duy", "type": 0, "to": "tttt", "mes": "Mà cho tôi cái lịch đi bạn ơi.", "createAt": "2025-12-12 07:35:09" },
        { "id": 11074, "name": "tttt", "type": 0, "to": "duy", "mes": "Tầm 7h chỗ cũ nha.", "createAt": "2025-12-12 07:31:12" },
    ]

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
            // onSend?.(textareaRef.current.value);
            textareaRef.current.value = "";
            textareaRef.current.style.height = "40px";
        }
    };
    const { theme, toggleTheme } = useContext(ThemeContext)

    return (
        <>
            <div className="chat-box">
                {room && (
                    <div className="chat-box-header">
                        <button className='room-avt' />
                        <p className='user-name'>Tên phòng</p>
                        <button className='theme-btn'
                            onClick={toggleTheme}
                            style={{ backgroundImage: theme === "light" ? `url(${DarkTheme})` : `url(${LightTheme})` }} />
                    </div>
                )}
                {!room && (
                    <div className="chat-box-header">
                        <button className='avt' />
                        <p className='user-name'>Người dùng khác</p>
                        <button className='theme-btn'
                            onClick={toggleTheme}
                            style={{ backgroundImage: theme === "light" ? `url(${DarkTheme})` : `url(${LightTheme})` }} />
                    </div>
                )}

                <div className="main-chat">
                    {messages.map(msg => (
                        Message(msg, room)
                    ))}
                </div>
                <div className="chat-input">
                    <button className='image-btn' />
                    <button className='file-btn' />
                    <div className="form-chat">
                        <textarea className="chat-text"
                            ref={textareaRef}
                            rows="1"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            onClick={() => setShowPicker(false)}
                            placeholder='Nhập tin nhắn . . .' />
                        <button className="icon-btn file-btn"
                            onClick={() => setShowPicker(prev => !prev)}
                        />
                        <button className="send-btn file-btn"></button>
                    </div>
                    {showPicker && (
                        <div style={{ position: "absolute", bottom: "60px", right: "10px" }}>
                            <EmojiPicker
                                data={data}
                                onEmojiSelect={(emoji) =>
                                    setText(prev => prev + emoji.native)
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
function Message(msg, room) {
    if (msg.name === userName) {
        return (
            <div key={msg.id} className="message me">
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
            <div key={msg.id} className="message other">
                <button className='avt' style={{ width: 15, height: 15 }} />
                <div className="message-box">
                    {room && (<p className='sender-mess'>Duy đã gửi tin nhắn</p>)}
                    <div className="message-content">
                        <p>{msg.mes}</p>
                        <span className="time-send">
                            {msg.createAt}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
// {"event":"GET_PEOPLE_CHAT_MES","status":"success","data":[{"id":11077,"name":"tttt","type":0,"to":"duy","mes":"ấd","createAt":"2025-12-12 07:31:12"},{"id":11076,"name":"duy","type":0,"to":"tttt","mes":"keeeeee","createAt":"2025-12-12 07:31:09"},{"id":11075,"name":"duy","type":0,"to":"tttt","mes":"klsdfds","createAt":"2025-12-12 07:31:02"},{"id":11074,"name":"tttt","type":0,"to":"duy","mes":"knn","createAt":"2025-12-12 07:30:59"},{"id":11073,"name":"tttt","type":0,"to":"duy","mes":"kjhjk","createAt":"2025-12-12 07:30:44"},{"id":11072,"name":"duy","type":0,"to":"tttt","mes":"sdfsf","createAt":"2025-12-12 07:30:34"},{"id":11071,"name":"tttt","type":0,"to":"duy","mes":"o;lsjdklf","createAt":"2025-12-12 07:30:26"},{"id":11069,"name":"duy","type":0,"to":"tttt","mes":"hello","createAt":"2025-12-12 07:27:22"},{"id":11068,"name":"duy","type":0,"to":"tttt","mes":"hello","createAt":"2025-12-12 07:26:55"}]}

export default ChatOtherUser
