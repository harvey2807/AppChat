import './ChatOtherUser.css'

function ChatOtherUser() {
    return (
        <div className="chat-box">
            <div className="chat-box-header">
                <button className='avt' />
                <text className='user-name'>Nguoi dung khac</text>
            </div>
            <div className="main-chat">

            </div>
            <div className="chat-input">
                <button className='image-btn' />
                <button className='file-btn' />
                <form class="form-chat" role="chat">
                    <input className="chat-text" type="chat" placeholder='Nhập tin nhắn . . .' />
                    <button className='icon-btn file-btn' />
                    <button className="send-btn file-btn" type="submit"></button>
                </form>
            </div>
        </div>
    )
}

export default ChatOtherUser
