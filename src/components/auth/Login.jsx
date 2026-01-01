import React, {useEffect } from 'react';
import './Login.css';
import { useWebSocket } from '../../context/WebSocketContext';
import { SocketRequests } from '../../hooks/useWebSocket';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const { isConnected, lastMessage, sendMessage } = useWebSocket();
    const { loginSuccess } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try{
            if (!isConnected) {
                setError("WebSocket not connected");
                setLoading(false);
                return;
            }
            sendMessage(SocketRequests.login(username, password));
        }catch (e){
            console.log(e.mes)
        }
    };

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.event === "LOGIN") {
            if (lastMessage.status === "success") {
                loginSuccess(username, lastMessage.data.RE_LOGIN_CODE);
                navigate("/app");
            } else {
                setError(lastMessage.mes);
            }
            setLoading(false);
        }
    }, [lastMessage]);

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