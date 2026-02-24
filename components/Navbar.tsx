"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // This reference helps us detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // 1. Check if the user is logged in
    const savedUser = localStorage.getItem('sme_user');
    setUser(savedUser);

    // 2. The "Click Outside" logic to close the menu automatically
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <li><Link href="/boards/gear">🎸 Gear &amp; Kit</Link></li>
        <li><Link href="/boards/albums">🎵 Technique</Link></li>
        <li><Link href="/boards/gigs">🎤 Gigs &amp; Venues</Link></li>
        <li><Link href="/boards/band-wanted">🤝 Band Wanted</Link></li>
        <li><Link href="/boards/production">🎧 Production</Link></li>
        <li><Link href="/boards/records">📻 Record Fair</Link></li>

        {/* LOGGED IN VIEW WITH DROPDOWN */}
        {user ? (
          <li className="nav-auth-split" style={{ position: 'relative' }} ref={dropdownRef}>
            
            {/* The Clickable Username Button */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                background: 'var(--ink)', color: 'var(--bright-gold)', 
                padding: '5px 15px', borderRadius: '3px', border: 'none', 
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              👤 {user} <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>

            {/* The Dropdown Menu Box */}
            {isDropdownOpen && (
              <div style={{ 
                position: 'absolute', top: '100%', right: 0, marginTop: '8px', 
                background: 'var(--paper)', border: '1px solid var(--ink)', 
                borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', 
                minWidth: '160px', zIndex: 1000, overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Link to Profile page */}
                  <Link 
                    href={`/profile/${user}`} 
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ padding: '12px 15px', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--aged)', fontSize: '0.9rem' }}
                  >
                    🗂️ My Posts
                  </Link>
                  
                  {/* Link to Settings page */}
                  <Link 
                    href="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ padding: '12px 15px', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--aged)', fontSize: '0.9rem' }}
                  >
                    ⚙️ Settings
                  </Link>
                  
                  {/* The Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      padding: '12px 15px', background: '#fdf0ee', color: 'var(--rust)', 
                      border: 'none', textAlign: 'left', cursor: 'pointer', 
                      fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 'bold'
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        ) : (
          /* LOGGED OUT VIEW */
          <>
            <li className="nav-auth-split">
              <Link href="/register" style={{ background: 'var(--ink)', color: 'var(--bright-gold)', padding: '5px 15px', borderRadius: '3px' }}>🗞️ Join</Link>
            </li>
            <li><Link href="/sign-in">✍️ Sign In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
