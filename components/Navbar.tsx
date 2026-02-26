"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // This checks if the user is logged in
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
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '4px solid var(--rust)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* 1. LOGO */}
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontFamily: 'Bebas Neue', fontSize: '2.2rem' }}>
        SHEFFIELD MUSIC <span style={{color: 'var(--rust)'}}>EXPRESS</span>
      </Link>

      {/* 2. NAVIGATION LINKS */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', fontWeight: 'bold' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>DASHBOARD</Link>
        <Link href="/articles" style={{ color: 'white', textDecoration: 'none' }}>ARTICLES</Link>
        
        {user ? (
          /* LOGGED IN VIEW */
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href={`/profile/${user}`} style={{ color: 'var(--rust)', textDecoration: 'none' }}>@{user.toUpperCase()}</Link>
            <button 
              onClick={handleLogout}
              style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 12px', cursor: 'pointer', fontSize: '0.7rem' }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          /* LOGGED OUT VIEW - THE FIX IS HERE */
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none', border: '1px solid white', padding: '5px 15px' }}>
              LOGIN
            </Link>
            <Link href="/register" style={{ 
              background: 'var(--rust)', 
              color: 'white', 
              textDecoration: 'none', 
              padding: '6px 15px',
              border: '1px solid var(--rust)' 
            }}>
              REGISTER
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
