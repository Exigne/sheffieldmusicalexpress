"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Check who is logged in
    const user = localStorage.getItem('sme_user');
    
    if (user) {
      // 2. Ask the database if they are an admin
      fetch(`/api/users/role?username=${user}`)
        .then(res => res.json())
        .then(data => {
          if (data.role === 'admin') {
            setIsAdmin(true);
          }
        })
        .catch(err => console.error("Failed to fetch role"));
    }
  }, []);

  // 3. If they aren't an admin (or not logged in), show absolutely nothing
  if (!isAdmin) return null;

  // 4. If they ARE an admin, render the link
  return (
    <Link href="/admin" style={{ color: 'var(--rust)', fontSize: '0.65rem', textDecoration: 'none', fontWeight: 'bold' }}>
      🛡️ MOD PANEL
    </Link>
  );
}
