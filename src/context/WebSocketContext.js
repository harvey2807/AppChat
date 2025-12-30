import { useEffect, useRef, useCallback, useState, use } from "react";

const SOCKET_URL = "wss://chat.longapp.site/chat/chat";

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        //init websocket only once
        socketRef.current = new WebSocket(SOCKET_URL);

        //handle websocket events
        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        //handle websocket events when server sends a message
        socketRef.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("WebSocket message received:", message);
                setLastMessage(message);
                const customEvent = new CustomEvent("WS_MESSAGE_RECEIVED", { detail: message });
                window.dispatchEvent(customEvent);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const sendMessage = useCallback((payload) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log("Sending WebSocket message:", payload);
            socketRef.current.send(JSON.stringify(payload));
        } else {
            console.warn("WebSocket is not connected");
        }
    }, []);

    return { isConnected, lastMessage, sendMessage };

};