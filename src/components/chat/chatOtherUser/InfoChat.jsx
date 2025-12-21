import './InfoChat.css'
import { use, useState } from 'react'
import useMediaQuery from '../../../hooks/useMediaQuery';
import toggleDown from '../../../assets/images/toggledown.png'
import toggleUp from '../../../assets/images/upload.png'

function InfoChat({ room }) {
    const isMobile = useMediaQuery("(max-width: 992px)");
    const [showInforChat, setShowInforChat] = useState(false);
    const [showInforUser, setShowInforUser] = useState(false);
    const [choseMedia, setChoseMedia] = useState(0)
    const [showListMem, setShowListMem] = useState(false)
    const [showMedia, setShowMedia] = useState(true)

    const changeMedia = () => {
        if (choseMedia === 0) setChoseMedia(1)
        else setChoseMedia(0)
        console.log(choseMedia)
    }

    const images = ["https://wp-cms-media.s3.ap-east-1.amazonaws.com/canh_dong_xanh_muot_tao_cam_giac_thu_thai_va_binh_yen_845456e2a6.jpg",
        "https://nads.1cdn.vn/2024/11/22/74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png",
        "https://statictuoitre.mediacdn.vn/thumb_w/640/2017/7-1512755474943.jpg",
        "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482812Fuv/anh-mo-ta.png",
        "https://danangfantasticity.com/wp-content/uploads/2023/05/da-nang-trong-top-nhung-diem-den-co-phong-canh-nui-non-dep-nhat-chau-a.jpg"

    ]
    const files = ["filetest.txt",
        "bikieptangai.pdf",
        "cuu_am_chan_kinh.pdf"
    ]

    const listMem = [{ "name": "Duy" }, { "name": "Toan" }, { "name": "Luc" }]

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
                                <p>Tên phòng</p>
                            </div>
                        )}
                        {!room && (
                            <div className="inforOtherUser">
                                <div className="avt"></div>
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
                                                <div className='mem-info'>
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
                                            {images.map((url, index) => (
                                                <div className="col-4 img">
                                                    <img key={index} src={url} alt={`img-${index}`} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="file-box"
                                            style={
                                                { visibility: choseMedia === 1 ? "visible" : "hidden" }
                                            }>
                                            {files.map((filename) => (
                                                <div className="file">
                                                    <div className="file-icon"></div>
                                                    <p className='file-name'>{filename}</p>
                                                    <button className="download-btn" />
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
                        <p>Tên người dùng</p>
                        <button className='logout-btn'>Đăng xuất</button>
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
                                            <div className='mem-info'>
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
                                        {images.map((url, index) => (
                                            <div className="col-4 img">
                                                <img key={index} src={url} alt={`img-${index}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="file-box"
                                        style={
                                            { visibility: choseMedia === 1 ? "visible" : "hidden" }
                                        }>
                                        {files.map((filename) => (
                                            <div className="file">
                                                <div className="file-icon"></div>
                                                <p className='file-name'>{filename}</p>
                                                <button className="download-btn" />
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
                    <p>Tên người dùng</p>
                    <button className='logout-btn'>Đăng xuất</button>
                </div>
            )}
        </>
    )
}

export default InfoChat