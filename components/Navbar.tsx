"use client";
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    // 1. Check if the user is logged in
    const loggedInUser = localStorage.getItem('sme_user');
    setUser(loggedInUser);

    if (loggedInUser) {
      // 2. Function to fetch unread messages from the API
      const fetchUnreadCount = async () => {
        try {
          const res = await fetch(`/api/messages/unread?username=${loggedInUser}`);
          const data = await res.json();
          setMessageCount(data.count || 0);
        } catch (err) {
          console.error("Navbar: Could not fetch unread messages", err);
        }
      };

      // Initial check
      fetchUnreadCount();

      // Refresh every 30 seconds to keep the icon updated
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
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
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>DASHBOARD</a>
        <a href="/articles" style={{ color: 'white', textDecoration: 'none' }}>ARTICLES</a>
        
        {/* 🎸 NEW GIG GUIDE LINK HERE */}
        <a href="/gigs" style={{ color: 'white', textDecoration: 'none' }}>GIG GUIDE</a>

        <a href="/marketplace" style={{ color: 'white', textDecoration: 'none' }}>MARKETPLACE</a>
        
        {user ? (
          /* LOGGED IN VIEW */
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* ✉️ NOTIFICATION ICON: Only shows if count > 0 */}
              {messageCount > 0 && (
                <a href="/inbox" style={{ 
                  marginRight: '12px', 
                  textDecoration: 'none', 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '1.4rem' }}>✉️</span>
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: 'var(--rust)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--ink)',
                    fontFamily: 'Barlow'
                  }}>
                    {messageCount}
                  </span>
                </a>
              )}

              <a href={`/profile/${user}`} style={{ color: 'var(--rust)', textDecoration: 'none' }}>
                @{user.toUpperCase()}
              </a>
            </div>

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
