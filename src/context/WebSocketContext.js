import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "./AuthContext";

const SOCKET_URL = "wss://chat.longapp.site/chat/chat";
let socket = null;

export const useWebSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(() => {
        if (socket && socket.readyState === WebSocket.OPEN) return;

        socket = new WebSocket(SOCKET_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            window.dispatchEvent(
                new CustomEvent("WS_MESSAGE_RECEIVED", { detail: message })
            );
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };
    }, []);

    const disconnect = useCallback(() => {
        socket?.close();
        socket = null;
    }, []);

    const sendMessage = useCallback((payload) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        }
    }, []);

    return { connect, disconnect, sendMessage, isConnected };
};

export function WebSocketProvider({ children }) {
    const { connect, disconnect } = useWebSocket();
    useEffect(() => {
        connect();              // ✅ CONNECT NGAY KHI APP LOAD
        return () => disconnect();
    }, []);

    return children;
}
