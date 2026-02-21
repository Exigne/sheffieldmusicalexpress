export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function GearPage() {
  // We manually fetch gear threads (Board ID 1)
  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.board_id = 1 
    ORDER BY t.created_at DESC
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Gear & Kit Talk</span>
        </nav>

        <div className="board-header">
          <div className="board-header-icon">🎸</div>
          <div>
            <h1 className="board-header-title">Gear & Kit Talk</h1>
            <p className="board-header-desc">Amps, pedals, and local Sheffield workshops.</p>
          </div>
        </div>

        <div className="section-label">Latest Conversations</div>

        <div className="thread-list">
          {threads.map((thread: any) => (
            <div key={thread.id} className="thread-item">
              <div className="thread-avatar">{thread.avatar_initials}</div>
              <div className="thread-main">
                <Link href={`/threads/${thread.id}`} className="thread-title">
                  {thread.title}
                </Link>
                <div className="thread-sub">Posted by {thread.username}</div>
              </div>
            </div>
          ))}
          
          {threads.length === 0 && (
            <div className="no-threads">
              No gear talk yet. Sheffield's quiet today...
            </div>
          )}
        </div>
      </div>

      <aside className="sidebar">
        <Link href="/boards/gear/new-thread" className="btn-post">
          + Start a New Thread
        </Link>
        <div className="sidebar-widget">
          <div className="widget-header">Board Info</div>
          <div className="widget-body">
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
              From Leadmill legends to bedroom producers, show us your Sheffield-made rigs.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
