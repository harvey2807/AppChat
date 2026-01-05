import React, { useEffect, useState } from 'react';
import './Login.css';
import { useWebSocket } from '../../context/WebSocketContext';
import { SocketRequests } from '../../hooks/useWebSocket';
import { useAuth } from '../../context/AuthContext';
import { useIsRTL } from 'react-bootstrap/esm/ThemeProvider';

function Login() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const { sendMessage, isConnected, connect } = useWebSocket();
    const { loginSuccess } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        sendMessage(SocketRequests.login(username, password));
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
            console.log(username)
            console.log(msg)
            if (msg.event === "LOGIN" && msg.status === "success") {
                loginSuccess(username, msg.data.RE_LOGIN_CODE);
            }

            if (msg.type === "LOGIN" && msg.status === "error") {
                setError(msg.message || "Login failed");
                setLoading(false);
            }
        };

        window.addEventListener("WS_MESSAGE_RECEIVED", handler);
        return () => window.removeEventListener("WS_MESSAGE_RECEIVED", handler);
    }, [loginSuccess]);

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