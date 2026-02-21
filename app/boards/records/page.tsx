export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function RecordsBoardPage() {
  // Fetch threads specifically for the 'records' board using its slug
  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    JOIN boards b ON t.board_id = b.id
    WHERE b.slug = 'records' 
    ORDER BY t.created_at DESC
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Record Fairs & Vinyl</span>
        </nav>

        <div className="board-header">
          <div className="board-header-icon">📻</div>
          <div>
            <h1 className="board-header-title">Record Fairs & Vinyl</h1>
            <p className="board-header-desc">Buying, selling, hunting. Rare finds and charity shop scores.</p>
          </div>
        </div>

        <div className="section-label">Latest Finds</div>
        
        <div className="thread-list">
          {threads.length === 0 ? (
            <div className="no-threads">No crates being dug today. Start the first thread!</div>
          ) : (
            threads.map((thread: any) => (
              <div key={thread.id} className="thread-item">
                <div className="thread-avatar">{thread.avatar_initials}</div>
                <div className="thread-main">
                  <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                  <div className="thread-sub">Posted by {thread.username}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <aside className="sidebar">
        <Link href="/boards/records/new-thread" className="btn-post">+ New Thread</Link>
        <div className="sidebar-widget">
          <div className="widget-header">Rules of the Fair</div>
          <div className="widget-body">
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
              No bootlegs unless explicitly stated. State your vinyl grading (NM, VG+, etc.) clearly when selling.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
