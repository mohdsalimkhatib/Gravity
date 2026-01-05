import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Register({ onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await register(username, email, password);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 style={{
                        margin: 0,
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Journey
                    </h1>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                        Create an account to start documenting your journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            Registration successful! Redirecting to login...
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                            autoFocus
                            disabled={success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Choose a password (min 6 characters)"
                            required
                            disabled={success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            disabled={success}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary btn-full-width"
                        disabled={loading || success}
                    >
                        {loading ? 'Creating account...' : success ? 'Success!' : 'Register'}
                    </button>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="link-button"
                                onClick={onSwitchToLogin}
                                disabled={success}
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
