"use client";
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is logged in
    const loggedInUser = localStorage.getItem('sme_user');
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sme_user');
    window.location.href = '/';
  };

  return (
    <nav style={{ 
      background: 'var(--ink)', 
      color: 'white', 
      padding: '15px 40px', 
      display: 'flex', 
      justifyContent: 'center', /* Centers the links */
      alignItems: 'center',
      borderBottom: '4px solid var(--rust)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* NAVIGATION LINKS */}
      <div style={{ display: 'flex', gap: '35px', alignItems: 'center', fontFamily: 'IBM Plex Mono', fontSize: '1rem', fontWeight: 'bold' }}>
        {/* Using 'a' tags to force hard page loads and bypass Netlify caching */}
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>DASHBOARD</a>
        <a href="/articles" style={{ color: 'white', textDecoration: 'none' }}>ARTICLES</a>
        
        {/* NEW MARKETPLACE LINK */}
        <a href="/marketplace" style={{ color: 'white', textDecoration: 'none' }}>MARKETPLACE</a>
        
        {user ? (
          /* LOGGED IN VIEW */
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href={`/profile/${user}`} style={{ color: 'var(--rust)', textDecoration: 'none' }}>@{user.toUpperCase()}</a>
            <button 
              onClick={handleLogout}
              style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold' }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          /* LOGGED OUT VIEW */
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a href="/login" style={{ color: 'white', textDecoration: 'none', border: '1px solid white', padding: '5px 15px' }}>
              LOGIN
            </a>
            <a href="/register" style={{
              background: 'var(--rust)', 
              color: 'white', 
              textDecoration: 'none', 
              padding: '6px 15px',
              border: '1px solid var(--rust)' 
            }}>
              REGISTER
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
