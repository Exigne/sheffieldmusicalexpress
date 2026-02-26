export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm'; 

export default async function BoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch the board details
  const boards = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
  const board = boards[0];

  if (!board) {
    return (
      <div className="page-wrapper">
        <div className="content-area" style={{ textAlign: 'center', padding: '100px' }}>
          <h2 style={{ fontFamily: 'Playfair Display' }}>Board not found.</h2>
          <Link href="/" style={{color: 'var(--rust)', fontWeight: 'bold'}}>Return Home</Link>
        </div>
      </div>
    );
  }

  // 2. Fetch the threads
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
        
        <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{board.name}</span>
        </nav>

        {/* 🏛️ BOLD HEADER WITH JUMP BUTTON */}
        <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '25px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', margin: '0', lineHeight: '0.9' }}>
                {board.name}
              </h1>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '15px 0 0 0', color: '#333', maxWidth: '600px' }}>
                {board.description}
              </p>
            </div>
            
            <a href="#new-post" style={{ 
              background: 'var(--ink)', 
              color: 'white', 
              padding: '14px 28px', 
              fontFamily: 'Bebas Neue', 
              fontSize: '1.5rem', 
              textDecoration: 'none',
              borderBottom: '4px solid var(--rust)',
              display: 'inline-block'
            }}>
              + START NEW LISTING
            </a>
          </div>
        </div>

        {/* 📝 THREAD LIST */}
        <ul className="thread-list">
          {threads.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#666', background: 'var(--paper)', border: '1px solid var(--aged)', margin: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎸</div>
              <p style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: '5px' }}>This board is currently empty.</p>
              <p style={{ fontSize: '0.9rem' }}>Be the first to share a listing or start a discussion below.</p>
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

        {/* ✍️ THE FORM SECTION */}
        <div id="new-post" style={{ 
          marginTop: '60px', 
          background: 'white', 
          padding: '40px', 
          border: '3px solid var(--ink)',
          boxShadow: '15px 15px 0px var(--aged)' 
        }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{color: 'var(--rust)'}}>●</span> 
            {board.slug === 'gear-exchange' ? 'Create Gear Listing' : 'Post New Thread'}
          </h3>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '30px', fontFamily: 'IBM Plex Mono' }}>
            Posting as a member of the Sheffield Music Express community.
          </p>
          
          <CreateThreadForm boardId={board.id} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '60px' }}>
          <Link href="/" style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--ink)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← BACK TO HOME
          </Link>
        </div>

      </div>
    </div>
  );
}
