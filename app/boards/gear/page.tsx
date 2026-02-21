import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function GearBoardPage() {
  // Hardcoded for the 'gear' board
  const boardId = 1; 
  const boardName = "Gear & Kit Talk";

  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.board_id = ${boardId} 
    ORDER BY t.created_at DESC
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{boardName}</span>
        </nav>

        <div className="board-header">
          <div className="board-header-icon">🎸</div>
          <div>
            <h1 className="board-header-title">{boardName}</h1>
            <p className="board-header-desc">Amps, pedals, and local Sheffield workshops.</p>
          </div>
        </div>

        <div className="section-label">Latest Conversations</div>

        {threads.length === 0 ? (
          <div className="no-threads">
            No threads yet. <Link href="/boards/gear/new-thread" style={{color: 'var(--rust)'}}>Start the first one!</Link>
          </div>
        ) : (
          <ul className="thread-list">
            {threads.map((thread: any) => (
              <li key={thread.id} className="thread-item">
                <div className="thread-avatar">{thread.avatar_initials}</div>
                <div>
                  <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                  <div className="thread-sub">Posted by {thread.username}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
