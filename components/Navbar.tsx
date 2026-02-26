"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem('sme_user'));
  }, []);

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
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontFamily: 'Bebas Neue', fontSize: '2rem' }}>
        SHEFFIELD MUSIC <span style={{color: 'var(--rust)'}}>EXPRESS</span>
      </Link>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', fontWeight: 'bold' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>DASHBOARD</Link>
        {/* MARKETPLACE REMOVED FROM HERE */}
        
        {user ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href={`/profile/${user}`} style={{ color: 'var(--rust)', textDecoration: 'none' }}>@{user.toUpperCase()}</Link>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', cursor: 'pointer' }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ color: 'white', textDecoration: 'none', border: '1px solid white', padding: '5px 15px' }}>LOGIN</Link>
        )}
      </div>
    </nav>
  );
}
