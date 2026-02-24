"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MailNotification() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('sme_user');
    if (!user) return;

    const checkMail = async () => {
      try {
        const res = await fetch(`/api/messages/unread?username=${user}`);
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (e) {
        // Silently fail if offline
      }
    };

    checkMail(); // Check immediately on load
    const interval = setInterval(checkMail, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // If there is no new mail, render absolutely nothing
  if (unreadCount === 0) return null;

  // If there IS mail, show the alert!
  return (
    <Link href="/inbox" style={{ 
      color: 'var(--rust)', 
      textDecoration: 'none', 
      fontWeight: 'bold', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '5px',
      background: '#fdf0ee',
      padding: '2px 8px',
      borderRadius: '4px',
      border: '1px solid var(--rust)'
    }}>
      ✉️ You have Mail
    </Link>
  );
}
