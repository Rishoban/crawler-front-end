import { useState } from 'react';
import type { CSSProperties } from 'react';

export default function CreateUrlForm({ onCreate, onCancel }: { onCreate: (url: string) => void, onCancel: () => void }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const cardStyle: CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px #e0e0e0',
    padding: '32px 24px',
    minWidth: 320,
    maxWidth: 400,
    width: '100%',
    margin: '0 auto',
  };

  const inputStyle: CSSProperties = {
    borderRadius: 8,
    padding: '10px 12px',
    border: '1px solid #ccc',
    fontSize: 16,
    width: '100%',
    marginBottom: 16,
  };

  const buttonStyle: CSSProperties = {
    padding: '10px 24px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    marginRight: 8,
    marginBottom: 0,
    cursor: 'pointer',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }
    setError('');
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:8080/crawler/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ url: url.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create URL');
        return res.json();
      })
      .then(() => {
        onCreate(url.trim());
        setUrl('');
      })
      .catch(() => {
        setError('Failed to create URL.');
      });
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontWeight: 700, fontSize: 28, letterSpacing: 1, textAlign: 'center', marginBottom: 24 }}>Add URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={inputStyle}
          autoFocus
        />
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
          }}>{error}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button type="submit" style={{ ...buttonStyle, background: '#2d4739', color: '#fff' }}>Add</button>
          <button type="button" onClick={onCancel} style={{ ...buttonStyle, background: '#eee', color: '#333' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
