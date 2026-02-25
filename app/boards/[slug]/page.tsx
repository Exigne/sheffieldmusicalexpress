export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
// NO FORM IMPORT HERE

export default async function BoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const boards = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
  const board = boards[0];

  if (!board) {
    return (
      <div className="page-wrapper">
        <div className="content-area" style={{ textAlign: 'center', padding: '100px' }}>
          <h2>Board not found.</h2>
          <Link href="/">Return Home</Link>
        </div>
      </div>
    );
  }

  const threads = await sql`
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

  function timeAgo(dateInput: string | Date): string {
    const diff = Date.now() - new Date(dateInput).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{board.name}</span>
        </nav>

        <div className="board-header" style={{ marginBottom: '30px' }}>
          <div>
            <h1 className="board-header-title">{board.name}</h1>
            <p className="board-header-desc">{board.description}</p>
          </div>
        </div>

        <ul className="thread-list">
          {threads.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', background: 'var(--paper)', border: '1px solid var(--aged)' }}>
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
                        background: 'var(--rust)', color: 'var(--paper)', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'IBM Plex Mono', borderRadius: '3px', textTransform: 'uppercase'
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

        {/* SAFE PLACEHOLDER BUTTON */}
        <div style={{ marginTop: '50px' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', borderBottom: '2px solid var(--ink)', paddingBottom: '10px', marginBottom: '20px' }}>
            Start a New Discussion
          </h3>
          
          <div style={{ background: 'var(--paper)', padding: '30px', textAlign: 'center', border: '1px dashed var(--aged)' }}>
            <p style={{ fontFamily: 'IBM Plex Mono', color: 'var(--rust)', marginBottom: '15px' }}>
              Form temporarily disabled for site updates.
            </p>
            <button 
              disabled
              style={{ 
                display: 'inline-block', background: 'var(--aged)', color: '#666', padding: '12px 25px', fontWeight: 'bold', fontFamily: 'IBM Plex Mono', fontSize: '1.1rem', border: '2px solid #ccc', textTransform: 'uppercase', cursor: 'not-allowed'
              }}
            >
              + Start New Discussion
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
