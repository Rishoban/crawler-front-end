import { useMemo } from 'react';

export default function Navbar({ onSignOut }: { onSignOut: () => void }) {
  // Try to get userName from localStorage (assume login response is stored as JSON in 'authUser' or similar)
  const userName = useMemo(() => {
    try {
      const auth = localStorage.getItem('authUser');
      if (auth) {
        const parsed = JSON.parse(auth);
        return parsed.userName || 'User';
      }
    } catch {}
    return 'User';
  }, []);
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    onSignOut();
  };
  return (
    <nav style={{
      width: '100%',
      background: '#cbb7df', // pastel pink
      color: '#23272f',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 8px #e0e0e0',
      padding: '0 24px',
      justifyContent: 'space-between',
    }}>
      <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: 1 }}>Website Crawler Dashboard</span>
      <span>
        <span style={{ marginRight: 16 }}>{userName}</span>
        <button
          onClick={handleSignOut}
          className="navbar-signout-btn"
          style={{
            background: '#b0bec5', // ash color
            color: '#000',
            border: 'none',
            borderRadius: '10%', // fully round
            fontWeight: 600,
            padding: '6px 16px',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#90a4ae'; // darker ash on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#b0bec5'; // revert to original ash
          }}
        >
          Sign Out
        </button>
      </span>
    </nav>
  );
}
