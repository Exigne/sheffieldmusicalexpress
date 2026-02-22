"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);

  // This is the "brain" that checks if you are logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('sme_user');
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sme_user');
    setUser(null);
    window.location.href = '/'; // Reload to homepage
  };

  return (
    <nav className="main-nav">
      <ul>
        <li><Link href="/">🏠 Home</Link></li>
        <li><Link href="/boards/gear">🎸 Gear</Link></li>
        <li><Link href="/boards/technique">🎵 Technique</Link></li>
        <li><Link href="/boards/gigs">🎤 Gigs</Link></li>
        <li><Link href="/boards/band-wanted">🤝 Bands</Link></li>
        <li><Link href="/boards/production">🎧 Production</Link></li>
        <li><Link href="/boards/records">📻 Records</Link></li>

        {/* If user exists, show Profile/Logout. If not, show Join/Sign In */}
        {user ? (
          <>
            <li className="nav-auth-split">
              <span style={{ background: 'var(--ink)', color: 'var(--bright-gold)', padding: '8px 15px' }}>
                👤 {user}
              </span>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', padding: '10px 15px' }}
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
