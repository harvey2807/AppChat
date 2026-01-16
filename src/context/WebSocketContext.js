
import { createContext, useEffect, useRef, useCallback, useState, useContext } from "react";
import { useAuth, setIsAuth } from "./AuthContext";
import { SocketRequests } from "../hooks/useWebSocket";
import { renderToReadableStream } from "react-dom/server";


const SOCKET_URL = "wss://chat.longapp.site/chat/chat";

// Create the context
const WebSocketContext = createContext(null);

// Provider component - owns all WebSocket state and logic
// at here we need to use singleton partern to make sure only one websocket connection is created
export function WebSocketProvider({ children }) {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const connect = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(SOCKET_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);

            const reloginCode = localStorage.getItem("RE_LOGIN_CODE")
            const user = localStorage.getItem("USER")
            if (reloginCode && user) {
                sendMessage(SocketRequests.reLogin(user, reloginCode))
            }
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            // Log ALL messages to see what's coming back
            console.log("Received:", message.event, message.status);
            
            // Log people message responses specifically
            if (message.event === "GET_PEOPLE_CHAT_MES") {
                console.log("GET_PEOPLE_CHAT_MES received:", JSON.stringify(message, null, 2));
            }
            
            window.dispatchEvent(
                new CustomEvent("WS_MESSAGE_RECEIVED", { detail: message })
            );
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
            if (!isConnected) connect();
        };

    }, []);

    const disconnect = useCallback(() => {
        socketRef.current?.close();
        socketRef.current = null;
    }, []);
    
    const sendMessage = useCallback((payload) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(payload));
        }
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    // Provide all state and functions to children via context
    return (
        <WebSocketContext.Provider value={{ connect, disconnect, sendMessage, isConnected, isAuthenticated, setIsAuthenticated }}>
            {children}
        </WebSocketContext.Provider> 
    );
}

// Custom hook - just reads from shared context
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};
