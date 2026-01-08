import React, { useEffect, useState, useRef } from 'react';
import './Login.css';
import { useWebSocket } from '../../context/WebSocketContext';
import { SocketRequests } from '../../hooks/useWebSocket';
import { useAuth } from '../../context/AuthContext';
import { useIsRTL } from 'react-bootstrap/esm/ThemeProvider';

function Login() {
    const [username, setUsername] = React.useState('');
    const usernameRef = useRef('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const { sendMessage, isConnected, connect, setIsAuthenticated } = useWebSocket();
    const { loginSuccess } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        usernameRef.current = username;
        sendMessage(SocketRequests.login(usernameRef.current, password));
        // sendMessage(SocketRequests.login(username, password));
        localStorage.setItem("USERNAME", username)
    };

    useEffect(() => {
        if (!isConnected) {
            connect()
        }
    }, [])

    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail;
            const username = localStorage.getItem("USERNAME")
            if (msg.event === "LOGIN" && msg.status === "success") {
                setIsAuthenticated(true);
                console.log("Login successful for usersrrrrr:", msg.event);
                loginSuccess(username, msg.data.RE_LOGIN_CODE);
            }else if (msg.event === "LOGIN" && msg.status === "error") {
                setError(msg.message || "Login failed");
                setLoading(false);
            }
        };

        window.addEventListener("WS_MESSAGE_RECEIVED", handler);
        return () => window.removeEventListener("WS_MESSAGE_RECEIVED", handler);
    }, [loginSuccess, setIsAuthenticated]);

    return (
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <a href="/register" className="switch-link">Don't have an account? Register</a>
                </form>
            </div>
        </div>
    );
}

export default Login;