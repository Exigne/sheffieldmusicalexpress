"use client";

import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GearModal() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/threads?board=gear')
      .then(res => res.json())
      .then(data => {
        setThreads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Modal>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', margin: 0, color: 'var(--ink)' }}>
          Gear &amp; <span className="express">Kit</span>
        </h1>
        <p style={{ color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
          The Steel City Gear Exchange & Discussion
        </p>
      </div>

      {loading ? (
        <div className="loading-shimmer" style={{ height: '200px' }}>Loading conversations...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ink)', border: '1px solid var(--ink)' }}>
          {threads.map((thread: any) => (
            <Link key={thread.id} href={`/threads/${thread.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'var(--paper)', 
                padding: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--paper)'}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display', fontSize: '1.3rem', color: 'var(--ink)' }}>{thread.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
                    BY {thread.username.toUpperCase()} · {thread.reply_count} REPLIES
                  </span>
                </div>
                <div style={{ color: 'var(--rust)', fontSize: '1.2rem' }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
         <Link href="/boards/gear" className="btn-submit" style={{ textDecoration: 'none' }}>
           Open Full Board
         </Link>
         <button className="btn-submit" style={{ background: 'var(--ink)' }}>
           + New Discussion
         </button>
      </div>
    </Modal>
  );
}
