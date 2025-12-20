import './InfoChat.css'
import { useState } from 'react'

function InfoChat() {
    const [choseMedia, setChoseMedia] = useState(0)

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

    return (
        <div className="infor">
            <div className='inforOtherUserBox'>
                <div className="inforOtherUser">
                    <div className="avt-o"></div>
                    <p>Tên người dùng</p>
                </div>
                <div className="media-box">
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
            </div>
            <div className='inforUserBox'>
                <div className="avt avt-u"></div>
                <p>Tên người dùng</p>
                <button className='logout-btn'>Đăng xuất</button>
            </div>
        </div>
    )
}

export default InfoChat