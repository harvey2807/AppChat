import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth, setIsAuth } from "./AuthContext";
import { SocketRequests } from "../hooks/useWebSocket";
import { renderToReadableStream } from "react-dom/server";


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
            const reloginCode = localStorage.getItem("RE_LOGIN_CODE")
            const user = localStorage.getItem("USER")
            if (reloginCode && user) {
                sendMessage(SocketRequests.reLogin(user, reloginCode))
                sendMessage(SocketRequests.login(user, localStorage.getItem("PASSWORD")))
            }
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            window.dispatchEvent(
                new CustomEvent("WS_MESSAGE_RECEIVED", { detail: message })
            );
        };

        // socket.onclose = () => {
        //     console.log("WebSocket disconnected");
        //     setIsConnected(false);
        // };
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
        connect();
        return () => disconnect();
    }, []);

    return children;
}
