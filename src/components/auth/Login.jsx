import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login
                console.log('Login successful');
                // Store token
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                // Redirect
                navigate('/app');
            } else {
                // Handle login error
                console.log('Login failed');
                setError(data.message || 'Login failed. Please check your credentials.');
            }

            console.log('Login ok', data);

            // Further processing based on response data here

        }catch(err){
            console.error('Error during login:', err);
            setError('An error occurred during login. Please try again!');
        }finally{
            setLoading(false);
        }
    };

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

export  default Login;