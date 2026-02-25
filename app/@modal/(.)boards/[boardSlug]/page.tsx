export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function BoardModal(props: { params: Promise<{ boardSlug: string }> }) {
  const params = await props.params;
  const boardSlug = params?.boardSlug;

  // 1. Fetch the board details
  let board = null;
  try {
    const boards = await sql`SELECT * FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
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

  // 2. Fetch the threads, INCLUDING t.is_sold
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

      <div style={{ padding: '10px 20px' }}>
        <ul className="thread-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {threads.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666', fontStyle: 'italic', background: '#f9f9f9', border: '1px solid #eee' }}>
              No threads here yet. Be the first to start a discussion!
            </div>
          ) : (
            threads.map((thread: any) => (
              <li key={thread.id} className="thread-item" style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                
                <Link href={`/profile/${thread.username}`} style={{ textDecoration: 'none' }}>
                  <div className="thread-avatar" style={{ width: '40px', height: '40px', background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '4px' }}>
                    {thread.username?.slice(0, 2).toUpperCase() || '??'}
                  </div>
                </Link>
                
                <div className="thread-main" style={{ flexGrow: 1 }}>
                  
                  {/* TITLE & SOLD BADGE */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <Link href={`/threads/${thread.id}`} className="thread-title" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--ink)', textDecoration: 'none' }}>
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

                  <div className="thread-sub" style={{ fontSize: '0.8rem', color: '#666' }}>
                    Started by <Link href={`/profile/${thread.username}`} style={{ color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>{thread.username}</Link> · {timeAgo(thread.last_interaction)}
                  </div>
                </div>
                
                <div className="thread-replies" style={{ fontSize: '0.85rem', color: '#555', textAlign: 'right', minWidth: '70px' }}>
                  <strong>{thread.reply_count || 0}</strong> replies
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Note: In a modal, we usually link to the full page to create a new thread, 
            or you can embed your CreateThreadForm here if it fits! */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link 
            href={`/boards/${board.slug}`} 
            onClick={() => {
               // Optional: trigger hard navigation if you want to leave the modal
               window.location.href = `/boards/${board.slug}`;
            }}
            style={{ display: 'inline-block', background: 'var(--ink)', color: 'var(--paper)', padding: '10px 20px', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'IBM Plex Mono' }}>
            Open Full Board to Post
          </Link>
        </div>

      </div>
    </Modal>
  );
}
