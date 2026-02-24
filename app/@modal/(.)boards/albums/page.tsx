"use client";

import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlbumReviewsModal() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/threads?board=albums')
      .then(res => res.json())
      .then(data => {
        setThreads(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Modal>
      {/* WHITE BANNER BOX */}
      <div style={{ background: 'white', border: '1px solid #ddd', padding: '30px', display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
        <span style={{ fontSize: '4rem' }}>💽</span>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: 0, lineHeight: 1, letterSpacing: '1px' }}>
            ALBUM REVIEWS
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '1rem' }}>
            Steel City&apos;s verdict on the latest releases, local demos, and all-time classics.
          </p>
        </div>
      </div>

      {/* SUB-HEADER WITH BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--rust)', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', color: 'var(--rust)', margin: 0, fontSize: '1.4rem', letterSpacing: '1px' }}>
          LATEST CONVERSATIONS
        </h2>
        <button className="btn-submit" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>+ NEW THREAD</button>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'IBM Plex Mono', color: '#666', padding: '20px' }}>Checking the liner notes...</p>
      ) : threads.length === 0 ? (
        <p style={{ padding: '20px', color: '#666' }}>No reviews posted yet. Be the first!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {threads.map((thread: any) => (
            <Link key={thread.id} href={`/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ padding: '15px 10px', borderBottom: '1px solid var(--aged)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>{thread.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Posted by {thread.username}</span>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--rust)', fontSize: '0.9rem' }}>{thread.reply_count} replies</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/boards/albums" style={{ color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid var(--rust)' }}>
          VIEW FULL BOARD →
        </Link>
      </div>
    </Modal>
  );
}
