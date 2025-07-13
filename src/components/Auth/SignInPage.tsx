import React, { useState } from 'react';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100vw',
  background: '#cbb7df', // pastel pink/purple like the image
  fontFamily: 'Inter, Arial, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 0,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 16px #e0e0e0',
  padding: '40px 32px',
  minWidth: 340,
  maxWidth: 400,
  width: '100%',
};

export default function SignInPage({ onSignIn }: { onSignIn: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onSignIn(data.token);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 className="mb-4" style={{ fontWeight: 700, fontSize: 32, letterSpacing: 1, textAlign: 'center' }}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ borderRadius: 8 }}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </div>
          {error && (
            <div style={{
              color: '#d32f2f',
              background: '#fff0f0',
              border: '1px solid #f8d7da',
              borderRadius: 4,
              padding: '10px 12px',
              marginBottom: 12,
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '0.98rem'
            }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn-signin" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
