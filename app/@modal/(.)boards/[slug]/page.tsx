export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm'; 

export default async function BoardModal(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;

  let board = null;
  try {
    const boards = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
    board = boards[0];
  } catch (error) {
    console.error("Failed to fetch board:", error);
  }

  if (!board) {
    return (
      <Modal>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display' }}>Board not found.</h2>
          <Link href="/" style={{color: 'var(--rust)', fontWeight: 'bold'}}>Return Home</Link>
        </div>
      </Modal>
    );
  }

  let threads: any[] = [];
  try {
    threads = await sql`
      SELECT 
        t.id, t.title, t.reply_count, t.is_sold, t.created_at, u.username,
        COALESCE(MAX(p.created_at), t.created_at) as last_interaction
      FROM threads t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN posts p ON p.thread_id = t.id
      WHERE t.board_id = ${board.id}
      GROUP BY t.id, t.title, t.reply_count, t.is_sold, t.created_at, u.username
      ORDER BY last_interaction DESC
    `;
  } catch (error) {
    console.error("Failed to fetch threads:", error);
  }

  function timeAgo(dateInput: string | Date): string {
    if (!dateInput) return '';
    const diff = Date.now() - new Date(dateInput).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <Modal>
      {/* 🏛️ BOARD HEADER */}
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Forum Section
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4.5rem', margin: '5px 0 0 0', lineHeight: '0.9' }}>
              {board.name}
            </h1>
          </div>
          
          {/* THE FIX: Quick jump button for better UX */}
          <a href="#new-post" style={{ 
            background: 'var(--ink)', 
            color: 'white', 
            padding: '12px 24px', 
            fontFamily: 'Bebas Neue', 
            fontSize: '1.4rem', 
            textDecoration: 'none',
            borderBottom: '4px solid var(--rust)',
            display: 'inline-block'
          }}>
            + START NEW LISTING
          </a>
        </div>
        
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '15px 0 0 0', color: '#333', maxWidth: '650px', lineHeight: '1.4' }}>
          {board.description}
        </p>
      </div>

      {/* 📝 THREAD LIST AREA */}
      <div style={{ minHeight: '300px' }}>
        <ul className="thread-list">
          {threads.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666', background: 'var(--paper)', border: '1px solid var(--aged)', margin: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎸</div>
              <p style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', marginBottom: '5px' }}>It's quiet in here...</p>
              <p style={{ fontSize: '0.9rem' }}>Be the first to post a listing or start a discussion below.</p>
            </div>
          ) : (
            threads.map((thread: any) => (
              <li key={thread.id} className="thread-item">
                <Link href={`/profile/${thread.username}`} style={{ textDecoration: 'none' }}>
                  <div className="thread-avatar">{thread.username?.slice(0, 2).toUpperCase() || '??'}</div>
                </Link>
                <div className="thread-main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <Link href={`/threads/${thread.id}`} className="thread-title">
                      {thread.title}
                    </Link>
                    {thread.is_sold && (
                      <span style={{ 
                        background: 'var(--rust)', color: 'white', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'IBM Plex Mono', borderRadius: '2px', textTransform: 'uppercase'
                      }}>
                        SOLD
                      </span>
                    )}
                  </div>
                  <div className="thread-sub">
                    By <span style={{fontWeight: 'bold'}}>{thread.username}</span> · Updated {timeAgo(thread.last_interaction)}
                  </div>
                </div>
                <div className="thread-replies"><strong>{thread.reply_count || 0}</strong> replies</div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ✍️ THE FORM (Target of the jump button) */}
      <div id="new-post" style={{ 
        marginTop: '60px', 
        background: 'white', 
        padding: '30px', 
        border: '3px solid var(--ink)',
        boxShadow: '12px 12px 0px var(--aged)' 
      }}>
        <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{color: 'var(--rust)'}}>●</span> 
          {board.slug === 'gear-exchange' ? 'Create Gear Listing' : 'Post New Thread'}
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '25px', fontFamily: 'IBM Plex Mono' }}>
          Please keep listings relevant to the Sheffield scene.
        </p>
        
        <CreateThreadForm boardId={board.id} />
      </div>
    </Modal>
  );
}
