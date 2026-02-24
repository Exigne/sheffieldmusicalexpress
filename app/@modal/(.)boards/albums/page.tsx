"use client";

import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlbumReviewsModal() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch threads specifically for the 'albums' board
    fetch('/api/threads?board=albums')
      .then(res => res.json())
      .then(data => {
        setThreads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Modal>
      <div style={{ maxHeight: '85vh', overflowY: 'auto', padding: '20px' }}>
        <div style={{ borderBottom: '4px solid var(--rust)', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', margin: 0 }}>💽 Album Reviews</h2>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Steel City's verdict on the latest releases.</p>
        </div>

        {loading ? (
          <p>Loading reviews...</p>
        ) : threads.length === 0 ? (
          <p>No reviews posted yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {threads.map((thread: any) => (
              <Link 
                key={thread.id} 
                href={`/threads/${thread.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ padding: '15px', background: 'white', border: '1px solid var(--aged)', borderRadius: '4px' }}>
                   <h3 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display' }}>{thread.title}</h3>
                   <div style={{ fontSize: '0.8rem', color: '#666' }}>
                     Posted by <strong>{thread.username}</strong> · {thread.reply_count} replies
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
           <Link href="/boards/albums" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-block' }}>
             View Full Board →
           </Link>
        </div>
      </div>
    </Modal>
  );
}
