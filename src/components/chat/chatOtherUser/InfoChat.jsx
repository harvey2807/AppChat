import './InfoChat.css'
import { use, useContext, useEffect, useState } from 'react'
import useMediaQuery from '../../../hooks/useMediaQuery';
import toggleDown from '../../../assets/images/toggledown.png'
import toggleUp from '../../../assets/images/upload.png'
import downloadDarkBtn from '../../../assets/images/download.png'
import downloadLightBtn from '../../../assets/images/download-light.png'
import { ThemeContext } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useWebSocket } from '../../../context/WebSocketContext';
function InfoChat({ room, chat, mess, listMemberInRoom }) {
    const isMobile = useMediaQuery("(max-width: 992px)");
    const [showInforChat, setShowInforChat] = useState(false);
    const [showInforUser, setShowInforUser] = useState(false);
    const [choseMedia, setChoseMedia] = useState(0)
    const [showListMem, setShowListMem] = useState(false)
    const [showMedia, setShowMedia] = useState(true)
    const username = localStorage.getItem("USER")
    const { logout } = useAuth()
    const { disconnect } = useWebSocket();
    const [images, setImages] = useState([]);
    const [fileList, setFileList] = useState([])

    const changeMedia = () => {
        if (choseMedia === 0) setChoseMedia(1)
        else setChoseMedia(0)
        console.log(choseMedia)
    }

    const isCloudinaryImage = (text) =>
        text.startsWith("https://res.cloudinary.com/appchatnlu/image/")

    const isCloudinaryFile = (text) => text.startsWith("https://res.cloudinary.com/appchatnlu/raw/")

    useEffect(() => {
        const imgs = mess
            .map(m => m.mes)
            .filter(isCloudinaryImage) || [];

        setImages(imgs);

        const files = mess.map(m => m.mes).filter(isCloudinaryFile) || [];
        setFileList(files)
    }, [mess]);

    const getFileName = (url) => {
        return url.split('/').pop()
    }
    const downloadFile = (url) => {
        const downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
        window.open(downloadUrl, '_blank');
    };


    const { theme, toggleTheme } = useContext(ThemeContext)

    const listMem = [{ "name": "Duy" }, { "name": "Toan" }, { "name": "Luc" }]

    const handleLogout = () => {
        logout()
        disconnect()
    }
    return (
        <>
            {isMobile && (
                <div className='sidebar'>
                    <button className="more-info-btn"
                        style={{ border: showInforChat ? "solid 2px black" : "none", borderRadius: "10px" }}
                        onClick={() => { setShowInforChat(!showInforChat); setShowInforUser(false) }} />
                    <button className="info-u-btn"
                        style={{ border: showInforUser ? "solid 2px black" : "none", borderRadius: "10px" }}
                        onClick={() => { setShowInforUser(!showInforUser); setShowInforChat(false) }} />
                </div>
            )}
            {!isMobile && (
                <div className="infor">
                    <div className='inforOtherUserBox'>
                        {room && (
                            <div className="inforOtherUser">
                                <div className="room-avt"></div>
                                <p>{chat !== null ? chat.name : "User"}</p>
                            </div>
                        )}
                        {!room && (
                            <div className="inforOtherUser">
                                <div className="avt"></div>
                                <p>{chat !== null ? chat.name : "User"}</p>
                            </div>
                        )}

                        <div className="media-box">
                            {room && (
                                <div className='info-option'>
                                    <div className="row list-mem">
                                        <p className="col-11 label">Danh sách thành viên</p>
                                        <button className="col-1 toggle"
                                            onClick={() => setShowListMem(!showListMem)}
                                            style={{ backgroundImage: showListMem ? `url(${toggleUp})` : `url(${toggleDown})` }}
                                        ></button>
                                    </div>
                                    {showListMem && (
                                        <div className="list-mem-box">
                                            {listMemberInRoom.map((mem, index) => (
                                                <div key={index} className='mem-info'>
                                                    <button className='avt' style={{ width: 15, height: 15 }} />
                                                    <p>{mem.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="row list-mem">
                                        <p className="col-11 label">Ảnh, file phương tiện</p>
                                        <button className="col-1 toggle"
                                            onClick={() => setShowMedia(!showMedia)}
                                            style={{ backgroundImage: showMedia ? `url(${toggleUp})` : `url(${toggleDown})` }}
                                        ></button>
                                    </div>
                                </div>
                            )}
                            {showMedia && (
                                <div className="media-detail-box">
                                    <div className="btn-box">
                                        <button onClick={changeMedia}
                                            className='btn-media chose'
                                            style={{ backgroundColor: choseMedia === 0 ? 'cyan' : 'white' }}
                                        >Ảnh</button>
                                        <button onClick={changeMedia}
                                            className='btn-media'
                                            style={{ backgroundColor: choseMedia === 1 ? 'cyan' : 'white' }}
                                        >File</button>
                                    </div>
                                    <div className="media">
                                        <div className="image-box row gx-3"
                                            style={
                                                { visibility: choseMedia === 0 ? "visible" : "hidden" }
                                            }>
                                            {Array.isArray(images) && images.map((url, index) => (
                                                <div key={index} className="col-4 img">
                                                    <img src={url} alt={`img-${index}`} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="file-box"
                                            style={
                                                { visibility: choseMedia === 1 ? "visible" : "hidden" }
                                            }>
                                            {fileList.map((filename) => (
                                                <div key={filename} className="file">
                                                    <div className="file-icon"></div>
                                                    <p className='file-name'>{getFileName(filename)}</p>
                                                    <button className="download-btn"
                                                        onClick={() => downloadFile(filename)}
                                                        style={{ backgroundImage: theme === "light" ? `url(${downloadDarkBtn})` : `url(${downloadLightBtn})` }} />
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='inforUserBox'>
                        <div className="avt avt-u"></div>
                        <p>{username}</p>
                        <button onClick={handleLogout} className='logout-btn'>Đăng xuất</button>
                    </div>
                </div>
            )}
            {isMobile && showInforChat && (
                <div className='inforOtherUserBoxMobile'>
                    {room && (
                        <div className="inforOtherUserMobile">
                            <div className="room-avt avt-mobile"></div>
                            <p>Tên phòng</p>
                        </div>
                    )}
                    {!room && (
                        <div className="inforOtherUserMobile">
                            <div className="avt-u avt-mobile"></div>
                            <p>Tên người dùng</p>
                        </div>
                    )}

                    <div className="media-box">
                        {room && (
                            <div className='info-option'>
                                <div className="row list-mem">
                                    <p className="col-11 label">Danh sách thành viên</p>
                                    <button className="col-1 toggle"
                                        onClick={() => setShowListMem(!showListMem)}
                                        style={{ backgroundImage: showListMem ? `url(${toggleUp})` : `url(${toggleDown})` }}
                                    ></button>
                                </div>

                                {showListMem && (
                                    <div className="list-mem-box">
                                        {listMem.map(mem => (
                                            <div key={mem.name} className='mem-info'>
                                                <button className='avt' style={{ width: 15, height: 15 }} />
                                                <p>{mem.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="row list-mem">
                                    <p className="col-11 label">Ảnh, file phương tiện</p>
                                    <button className="col-1 toggle"
                                        onClick={() => setShowMedia(!showMedia)}
                                        style={{ backgroundImage: showMedia ? `url(${toggleUp})` : `url(${toggleDown})` }}
                                    ></button>
                                </div>
                            </div>
                        )}
                        {showMedia && (
                            <div className='media-detail-box'>
                                <div className="btn-box">
                                    <button onClick={changeMedia}
                                        className='btn-media chose'
                                        style={{ backgroundColor: choseMedia === 0 ? 'cyan' : 'white' }}
                                    >Ảnh</button>
                                    <button onClick={changeMedia}
                                        className='btn-media'
                                        style={{ backgroundColor: choseMedia === 1 ? 'cyan' : 'white' }}
                                    >File</button>
                                </div>
                                <div className="media">
                                    <div className="image-box row gx-3"
                                        style={
                                            { visibility: choseMedia === 0 ? "visible" : "hidden" }
                                        }>
                                        {Array.isArray(images) && images.map((url, index) => (
                                            <div key={index} className="col-4 img">
                                                <img src={url} alt={`img-${index}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="file-box"
                                        style={
                                            { visibility: choseMedia === 1 ? "visible" : "hidden" }
                                        }>
                                        {fileList.map((filename) => (
                                            <div key={filename} className="file">
                                                <div className="file-icon"></div>
                                                <p className='file-name'>{getFileName(filename)}</p>
                                                <button className="download-btn"
                                                    onClick={() => downloadFile(filename)}
                                                    style={{ backgroundImage: theme === "light" ? `url(${downloadDarkBtn})` : `url(${downloadLightBtn})` }} />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isMobile && showInforUser && (
                <div className='inforUserBoxMobile'>
                    <div className="avt avt-u"></div>
                    <p>{username}</p>
                    <button onClick={handleLogout} className='logout-btn'>Đăng xuất</button>
                </div>
            )}
        </>
    )
}

export default InfoChat