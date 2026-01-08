import './ChatOtherUser.css'
import { useContext, useEffect, useRef, useState } from 'react'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { ThemeContext } from '../../../context/ThemeContext'
import DarkTheme from '../../../assets/images/dark.png'
import LightTheme from '../../../assets/images/light.png'

import { useAuth } from "../../../context/AuthContext";
import { useWebSocket } from "../../../context/WebSocketContext";
import { SocketRequests } from "../../../hooks/useWebSocket";

const userName = localStorage.getItem("USER")

function ChatOtherUser({ room, chat, mess }) {
    const textareaRef = useRef(null)
    const [text, setText] = useState("")
    const [showPicker, setShowPicker] = useState(false)
    const MAX_HEIGHT = 140

    const { sendMessage } = useWebSocket();
    var dstUser = useAuth().dstUser;
    var dstRoom = useAuth().dstRoom;
    const srcUser = useAuth().user?.username || "";
    const [uploading, setUploading] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [isFile, setIsFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mess]); // mỗi khi có tin mới


    async function uploadImageToCloudinary(file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "chat_unsigned")

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/appchatnlu/image/upload",
            {
                method: "POST",
                body: formData
            }
        )

        if (!response.ok) {
            throw new Error("Upload failed")
        }

        const data = await response.json()

        return data.secure_url
    }

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
            // const message = textareaRef.current.value;
            // sendMessage(SocketRequests.sendToRoom(chatId, message))

            sendNude();
            textareaRef.current.value = "";
            textareaRef.current.style.height = "40px";
        }
    };
    const { theme, toggleTheme } = useContext(ThemeContext)

    const handleSendImage = async (file) => {
        try {
            if (!selectedFile) return;
            setUploading(true)

            const imageUrl = await uploadImageToCloudinary(selectedFile)

            setSelectedFile(null)
            return imageUrl
        } catch (err) {
            alert("Upload image failed")
        } finally {
            setUploading(false)
        }
    }

    const sendNude = async () => {
        console.log("Send message:", text);

        // FOR TESTING PURPOSES ONLY
        // dstUser = "tttt" // REMOVE THIS LINE IN PRODUCTION
        // dstRoom = "room1" // REMOVE THIS LINE IN PRODUCTION

        const imageUrl = await handleSendImage(selectedFile)

        console.log("Đã gửi ảnh: " + imageUrl)
        if (imageUrl) {
            // check whether send message to room or people
            if (chat.type === 1) {
                sendMessage(SocketRequests.sendToRoom(chat.name, imageUrl));
                sendMessage(SocketRequests.getRoomMessages(chat.name, 1))
            } else {
                sendMessage(SocketRequests.sendToPeople(chat.name, imageUrl));
                sendMessage(SocketRequests.getPeopleMessages(chat.name, 1))
            }
        }
        // get msg text
        const msgText = text.trim();
        if (msgText === "") {
            console.log("Message is empty.");
            return; // don't send empty message
        }

        // reset input
        setText("");

        // send msg
        console.log("Message packaging...");
        // check whether send message to room or people
        if (chat.type === 1) {
            const packet = SocketRequests.sendToRoom(chat.name, msgText);
            console.log("Sending packet:", packet);
            sendMessage(packet);
            sendMessage(SocketRequests.getRoomMessages(chat.name, 1))
        } else {
            console.log("Tin nhan duoc gui den" + dstUser)
            const packet = SocketRequests.sendToPeople(chat.name, msgText);
            console.log("Sending packet:", packet);
            sendMessage(packet);
            sendMessage(SocketRequests.getPeopleMessages(chat.name, 1))
        }
        return;
    }
    return (
        <>
            <div className="chat-box">
                {room && (
                    <div className="chat-box-header">
                        <button className='room-avt' />
                        <p className='user-name'>{chat !== null ? chat.name : "User"}</p>
                        <button className='theme-btn'
                            onClick={toggleTheme}
                            style={{ backgroundImage: theme === "light" ? `url(${DarkTheme})` : `url(${LightTheme})` }} />
                    </div>
                )}
                {!room && (
                    <div className="chat-box-header">
                        <button className='avt' />
                        <p className='user-name'>{chat !== null ? chat.name : "User"}</p>
                        <button className='theme-btn'
                            onClick={toggleTheme}
                            style={{ backgroundImage: theme === "light" ? `url(${DarkTheme})` : `url(${LightTheme})` }} />
                    </div>
                )}

                <div className="main-chat">
                    {mess.map((_, i) => {
                        const msg = mess[mess.length - 1 - i];
                        return Message(msg, room);
                    })}
                    {/* Mốc để scroll */}
                    <div ref={bottomRef} />
                </div>


                {selectedFile && (
                    <>
                        <ImagePreview file={selectedFile} className="image-preview" />
                    </>
                )}
                <div className="chat-input">
                    <ImagePicker onSelect={setSelectedFile} />
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
                        <button className="send-btn file-btn" onClick={sendNude}></button>
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

const isCloudinaryImage = (text) =>
    text.startsWith("https://res.cloudinary.com/")

function Message(msg, room) {
    if (msg.name === userName) {
        return (
            <div key={msg.id} className="message me">
                <div className="message-content">
                    {isCloudinaryImage(msg.mes) ? (
                        <img
                            src={msg.mes}
                            alt="chat-img"
                            style={{ maxWidth: 240, borderRadius: 8 }}
                        />
                    ) : (
                        <p>{msg.mes}</p>
                    )}
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
                        {isCloudinaryImage(msg.mes) ? (
                            <img
                                src={msg.mes}
                                alt="chat-img"
                                style={{ maxWidth: 240, borderRadius: 8 }}
                            />
                        ) : (
                            <p>{msg.mes}</p>
                        )}
                        <span className="time-send">
                            {msg.createAt}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

function ImagePicker({ onSelect }) {
    const inputImageRef = useRef(null)

    const openFileDialog = () => {
        inputImageRef.current.click()
    }

    const handleChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            onSelect(file)
        }
    }

    return (
        <>

            <button onClick={openFileDialog}
                className='image-btn' />

            <input
                ref={inputImageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChange}
            />
        </>
    )
}
function ImagePreview({ file }) {
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (!file) return

        const url = URL.createObjectURL(file)
        setPreview(url)

        return () => URL.revokeObjectURL(url)
    }, [file])

    if (!preview) return null

    return (
        <div className='image-preview'>
            <button className='remove-image'>x</button>
            <img
                src={preview}
                alt="preview"
                style={{ maxWidth: 200, borderRadius: 8 }}
            />
        </div>
    )
}



export default ChatOtherUser
