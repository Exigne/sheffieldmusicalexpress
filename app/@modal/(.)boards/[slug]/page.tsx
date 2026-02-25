export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm'; // WE BROUGHT THIS BACK!

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
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Board
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: '5px 0 0 0', lineHeight: '1' }}>
          {board.name}
        </h1>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '10px 0 0 0', color: '#444' }}>
          {board.description}
        </p>
      </div>

      <div style={{ padding: '10px 0' }}>
        
        {/* WE RESTORED YOUR PROPER CSS CLASSES HERE */}
        <ul className="thread-list">
          {threads.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666', fontStyle: 'italic', background: 'var(--paper)', border: '1px solid var(--aged)' }}>
              No threads here yet. Be the first to start a discussion!
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
                        background: 'var(--rust)', 
                        color: 'var(--paper)', 
                        padding: '2px 6px', 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        fontFamily: 'IBM Plex Mono',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}>
                        SOLD
                      </span>
                    )}
                  </div>

                  <div className="thread-sub">
                    Started by <Link href={`/profile/${thread.username}`} style={{ color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>{thread.username}</Link> · {timeAgo(thread.last_interaction)}
                  </div>
                </div>
                <div className="thread-replies"><strong>{thread.reply_count || 0}</strong> replies</div>
              </li>
            ))
          )}
        </ul>

        {/* WE RESTORED YOUR CREATE THREAD FORM HERE */}
        <div style={{ marginTop: '40px', background: 'var(--paper)' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', borderBottom: '2px solid var(--ink)', paddingBottom: '10px', marginBottom: '20px' }}>
            Start a New Discussion
          </h3>
          <CreateThreadForm boardId={board.id} />
        </div>

      </div>
    </Modal>
  );
}
