import './ChatOtherUser.css'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { ThemeContext } from '../../../context/ThemeContext'
import DarkTheme from '../../../assets/images/dark.png'
import LightTheme from '../../../assets/images/light.png'

import { useAuth } from "../../../context/AuthContext";
import { useWebSocket } from "../../../context/WebSocketContext";
import { SocketRequests } from "../../../hooks/useWebSocket";

const userName = localStorage.getItem("USER")


function ChatOtherUser({ room, chat, mess, setListMessages, isInRoom, hasMore, onLoadMore, isActive, isOnline }) {
    const textareaRef = useRef(null)
    const [text, setText] = useState("")
    const [showPicker, setShowPicker] = useState(false)
    const MAX_HEIGHT = 140



    const { sendMessage, isConnected } = useWebSocket();
    const { user } = useAuth();
    const srcUser = useAuth().user?.username || "";
    const [uploading, setUploading] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [isFile, setIsFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)
    const bottomRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isAtBottomRef = useRef(true);
    const [error, setError] = useState("Hãy tham gia phòng để gửi tin nhắn!");

    const prevScrollHeightRef = useRef(0);

    const handleScroll = () => {
        const el = chatContainerRef.current;
        if (!el || !hasMore) return;

        const thresholdTop = 20;
        const thresholdBottom = 50;

        // 👇 CHỈ ghi scrollHeight khi sắp load thêm
        if (el.scrollTop <= thresholdTop) {
            prevScrollHeightRef.current = el.scrollHeight;
            onLoadMore(); // gọi CHA
            return; // ⛔ QUAN TRỌNG: dừng luôn
        }

        // 👇 chỉ cập nhật trạng thái đáy khi KHÔNG load thêm
        isAtBottomRef.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < thresholdBottom;
    };

    // useEffect(() => {
    //     if (!chat) return;
    //     // if(!isActive(chat.name, chat.type)) return;
    //     // console.log("Chat đang active : " + isActive(chat.name, chat.type))

    //     const interval = setInterval(() => {
    //         if (chat.type === 1) {
    //             sendMessage(SocketRequests.getRoomMessages(chat.name, 1));
    //         } else {
    //             sendMessage(SocketRequests.getPeopleMessages(chat.name, 1));
    //         }
    //     }, 1000); // 2 giây

    //     return () => clearInterval(interval);
    // }, [chat]);

    useLayoutEffect(() => {
        if (!bottomRef.current) return;
        if (!isAtBottomRef.current) return;

    }, [mess]);
    useLayoutEffect(() => {
        const el = chatContainerRef.current;
        if (!el) return;

        // 1️⃣ Load thêm tin cũ → giữ vị trí
        if (prevScrollHeightRef.current > 0) {
            el.scrollTop =
                el.scrollHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = 0;
            return;
        }

        // 2️⃣ User đang ở đáy → auto scroll
        if (isAtBottomRef.current) {
            el.scrollTop = el.scrollHeight;
        }
    }, [mess.length, chat, isConnected]);
    useEffect(() => {
        isAtBottomRef.current = true;
        prevScrollHeightRef.current = 0;

        requestAnimationFrame(() => {
            const el = chatContainerRef.current;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }, [chat?.id]);

    useLayoutEffect(() => {
        if (!bottomRef.current) return;

        if (!isAtBottomRef.current) return; // 👈 QUAN TRỌNG

        bottomRef.current.scrollIntoView({ behavior: "auto" });
    }, [mess, chat, isConnected]);

    async function uploadImageToCloudinary(file) {
        const formData = new FormData()
        const isImage = file.type.startsWith("image/");
        const resourceType = isImage ? "image" : "raw";

        formData.append("file", file)
        // nameFile = file.name;
        // formData.append("use_filename", "true")
        // formData.append("unique_filename", "true")
        // formData.append("overwrite", "false")
        formData.append("upload_preset", "chat_unsigned")

        console.log("Uploading image to Cloudinary...", file)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/appchatnlu/${resourceType}/upload`,
            {
                method: "POST",
                body: formData
            }
        )

        if (!response.ok) {
            const errData = await response.json();
            console.error("Cloudinary error:", errData);
            throw new Error(errData.error?.message || "Upload failed");
        }

        const data = await response.json()
        console.log("Form data", formData)
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

            setUploading(true)
            sendNude();
            textareaRef.current.value = "";
            textareaRef.current.style.height = "40px";
            setUploading(false)
        }
    };
    const { theme, toggleTheme } = useContext(ThemeContext)

    const handleSendImage = async (file) => {
        try {
            if (!selectedFile) return;
            setUploading(true)

            const imageUrl = await uploadImageToCloudinary(selectedFile)
            // nameFile = getCloudinaryFileName(imageUrl)
            // console.log("Uploaded image URL:", nameFile)
            setSelectedFile(null)
            return imageUrl
        } catch (err) {
            alert("Upload image failed")
        } finally {
            setUploading(false)
        }
    }


    const sendNude = async () => {
        setUploading(true)

        console.log("Send message:", text);
        // FOR TESTING PURPOSES ONLY
        // dstUser = "tttt" // REMOVE THIS LINE IN PRODUCTION
        // dstRoom = "room1" // REMOVE THIS LINE IN PRODUCTION

        const imageUrl = await handleSendImage(selectedFile)
        console.log("Kiểm tra có trong room hay chưa: " + isInRoom + '-' + room)
        console.log("Gửi ảnh: " + imageUrl)
        if (imageUrl) {
            // check whether send message to room or people
            if (room && isInRoom) {
                sendMessage(SocketRequests.sendToRoom(chat.name, imageUrl));
                //append ngay cho UI
                // handleSendMessage(chat.name, chat.type, imageUrl)
                sendMessage(SocketRequests.getRoomMessages(chat.name, 1))

            } else if (!room) {
                sendMessage(SocketRequests.sendToPeople(chat.name, imageUrl));
                // handleSendMessage(chat.name, chat.type, imageUrl)
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

        console.log("Send message:", msgText);
        // send msg
        console.log("Message packaging...");
        // check whether send message to room or people
        console.log(`Room :${room}, In Room: ${isInRoom}, Chat type: ${chat.type}`)

        if (room && isInRoom) {
            const packet = SocketRequests.sendToRoom(chat.name, encodeEmoji(msgText));
            console.log("Sending packet:", packet);
            // handleSendMessage(chat.name, chat.type, msgText)
            sendMessage(packet);
            sendMessage(SocketRequests.getRoomMessages(chat.name, 1))
        } else if (!room) {

            const packet = SocketRequests.sendToPeople(chat.name, encodeEmoji(msgText));
            console.log("Sending packet:", packet);
            // handleSendMessage(chat.name, chat.type, msgText)
            sendMessage(packet);
            sendMessage(SocketRequests.getPeopleMessages(chat.name, 1))
        }
        setUploading(false)
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
                        <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
                        <button className='theme-btn'
                            onClick={toggleTheme}
                            style={{ backgroundImage: theme === "light" ? `url(${DarkTheme})` : `url(${LightTheme})` }} />
                    </div>
                )}

                <div className="main-chat" ref={chatContainerRef} onScroll={handleScroll} >
                    {mess.map((_, i) => {
                        const msg = mess[mess.length - 1 - i];
                        return Message(msg, room);
                    })}
                    {/* Mốc để scroll */}
                    <div ref={bottomRef} />

                    {room && !isInRoom && (

                        <div className='error-box slide-up'>
                            <span className='error-noti'> {error}</span>
                        </div>
                    )}
                </div>


                {selectedFile && (
                    <>
                        {
                            selectedFile.type.startsWith("image/") ? (
                                <ImagePreview file={selectedFile} className="image-preview" />
                            ) : (
                                <FilePreview file={selectedFile} onRemove={setSelectedFile} className="file-preview" />
                            )
                        }

                    </>
                )
                }
                <div className="chat-input">
                    <ImagePicker onSelect={setSelectedFile} />
                    <FilePicker onSelect={setSelectedFile} />
                    {/* <button className='file-btn' /> */}
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
                        {uploading ? (
                            <div className="send-status">
                                <span className="dot dot-1"></span>
                                <span className="dot dot-2"></span>
                                <span className="dot dot-3"></span>
                            </div>
                        ) : (
                            <button className="send-btn file-btn" onClick={sendNude}></button>
                        )}
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
            </div >
        </>
    )
}
const encodeEmoji = (text) => {
    const bytes = new TextEncoder().encode(text);
    return btoa(String.fromCharCode(...bytes));
};

const decodeEmoji = (text) => {
    try {
        const bytes = Uint8Array.from(atob(text), c => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    } catch {
        return text;
    }
};


const isCloudinaryImage = (text) =>
    text.startsWith("https://res.cloudinary.com/")

function getCloudinaryFileType(url) {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
    const ext = url.split('.').pop().toLowerCase();
    // if(imageExts.some(r => url.endsWith(r))) return "image";
    return imageExts.includes(ext) ? "image" : "raw"; //true if image, false if raw
}

function getCloudinaryFileName(url) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('.')[0]; // returns file name without extension
}

function Message(msg, room) {
    if (msg.name === userName) {
        return (
            <div key={msg.id} className="message me">
                <div className="message-content">
                    {/* {isCloudinaryImage(msg.mes) ? (
                        <img
                            //at here we need to check if msg.mes is image or file
                            //and render accordingly
                            src={msg.mes}
                            alt="chat-img"
                            style={{ maxWidth: 240, borderRadius: 8 }}
                        />
                    ) : (
                        <p style={{whiteSpace: 'pre-wrap'}}>{decodeEmoji(msg.mes)}</p>
                        <p>{msg.mes}</p>
                    )} */}

                    {isCloudinaryImage(msg.mes) ? (
                        getCloudinaryFileType(msg.mes) === "image" ? (
                            <img
                                src={msg.mes}
                                alt="chat-img"
                                style={{ maxWidth: 240, borderRadius: 8 }}
                            />
                        ) : (
                            <a href={msg.mes} target="_blank" rel="noopener noreferrer">
                                Download File
                            </a>
                        )
                    ) : (
                        <p style={{ whiteSpace: 'pre-wrap' }}>{decodeEmoji(msg.mes)}</p>
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
                    {room && (<p className='sender-mess'>{msg.name} đã gửi tin nhắn</p>)}
                    <div className="message-content">
                        {isCloudinaryImage(msg.mes) ? (
                            getCloudinaryFileType(msg.mes) === "image" ? (
                                <img
                                    src={msg.mes}
                                    alt="chat-img"
                                    style={{ maxWidth: 240, borderRadius: 8 }}
                                />
                            ) : (//how to display UI for file message
                                <a href={msg.mes} target="_blank" rel="noopener noreferrer">
                                    {getCloudinaryFileName(msg.mes) || "Download File"}
                                </a>
                            )
                        ) : (
                            <p style={{ whiteSpace: 'pre-wrap' }}>{decodeEmoji(msg.mes)}</p>
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
function ImagePreview({ file, onRemoveImage }) {
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (!file) return

        const url = URL.createObjectURL(file)
        setPreview(url)

        return () => URL.revokeObjectURL(url)
    }, [file])

    if (!preview) return null
    const removeImage = () => {
        onRemoveImage(null)
        setPreview(null)
    }

    return (
        <div className='image-preview'>
            <button className='remove-image' onClick={() => removeImage()}>x</button>
            <img
                src={preview}
                alt="preview"
                style={{ maxWidth: 200, borderRadius: 8 }}
            />
        </div>
    )
}

function FilePicker({ onSelect }) {
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
                className='file-btn' />

            <input
                ref={inputImageRef}
                type="file"
                accept="file/*"
                hidden
                onChange={handleChange}
            />
        </>
    )
}

// function FilePreview({ file }) {
//     const [preview, setPreview] = useState(null)

//     useEffect(() => {
//         if (!file) return

//         const url = URL.createObjectURL(file)
//         setPreview(url)

//         return () => URL.revokeObjectURL(url)
//     }, [file])

//     if (!preview) return null

//     return (
//         <div className='file-preview'>
//             <button className='remove-file'>x</button>
//             <img
//                 src={preview}
//                 alt="preview"
//                 style={{ maxWidth: 200, borderRadius: 8 }}
//             />
//         </div>
//     )

// }
function FilePreview({ file, onRemove }) {
    const [preview, setPreview] = useState(null)

    // Helper: Format dung lượng file (KB/MB)
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (!file) return;

        // Chỉ tạo URL preview nếu là ảnh
        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [file]);

    if (!file) return null;

    const isImage = file.type.startsWith("image/");

    return (
        <div className='file-preview-card'>
            {/* Nút xóa */}
            <button className='remove-file-btn' onClick={() => onRemove && onRemove(null)}>
                ✕
            </button>

            {isImage ? (
                /* Giao diện cho ẢNH */
                <div className="preview-image-container">
                    <img
                        src={preview}
                        alt="preview"
                        className="preview-img"
                    />
                    <div className="file-info-overlay">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                </div>
            ) : (
                /* Giao diện cho FILE KHÁC (PDF, DOC, ETC.) */
                <div className="preview-file-container">
                    <div className="file-icon">
                        {/* Icon tượng trưng (Dùng SVG inline cho gọn) */}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="file-details">
                        <p className="file-name" title={file.name}>{file.name}</p>
                        <p className="file-size">{formatFileSize(file.size)}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ChatOtherUser