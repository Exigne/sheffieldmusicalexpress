"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);

  // The "Brain": Check if user is saved in the browser memory
  useEffect(() => {
    const savedUser = localStorage.getItem('sme_user');
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sme_user');
    setUser(null);
    window.location.href = '/'; // Send back to home and refresh
  };

  return (
    <nav className="main-nav">
      <ul>
        <li><Link href="/">🏠 Home</Link></li>
        <li><Link href="/boards/gear">🎸 Gear &amp; Kit</Link></li>
        <li><Link href="/boards/technique">🎵 Technique</Link></li>
        <li><Link href="/boards/gigs">🎤 Gigs &amp; Venues</Link></li>
        <li><Link href="/boards/band-wanted">🤝 Band Wanted</Link></li>
        <li><Link href="/boards/production">🎧 Production</Link></li>
        <li><Link href="/boards/records">📻 Record Fair</Link></li>
        
        {/* THE SPLIT: Show Profile/Logout if logged in, otherwise Join/Sign In */}
        {user ? (
          <>
            <li className="nav-auth-split">
              <span style={{ background: 'var(--ink)', color: 'var(--bright-gold)', padding: '5px 15px', borderRadius: '3px' }}>
                👤 {user}
              </span>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-auth-split">
              <Link href="/register" style={{ background: 'var(--ink)', color: 'var(--bright-gold)' }}>🗞️ Join</Link>
            </li>
            <li><Link href="/sign-in">✍️ Sign In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
