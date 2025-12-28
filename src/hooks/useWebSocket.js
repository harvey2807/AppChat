function useWebSocket(){
    // Hook implementation goes here
    const ws = new WebSocket('wss://chat.longapp.site/chat/chat');
    return null;
}

export default useWebSocket;