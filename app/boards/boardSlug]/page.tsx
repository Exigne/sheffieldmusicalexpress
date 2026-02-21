import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function BoardPage({ params }: { params: Promise<{ boardSlug: string }> }) {
  const { boardSlug } = await params;

  // 1. Fetch board details
  const boards = await sql`SELECT * FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
  if (boards.length === 0) return notFound();
  const board = boards[0];

  // 2. Fetch threads for this board
  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.board_id = ${board.id} 
    ORDER BY t.created_at DESC
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>{board.name}</span>
        </nav>

        <div className="board-header">
          <div className="board-header-icon">{board.icon || '🎸'}</div>
          <div>
            <h1 className="board-header-title">{board.name}</h1>
            <p className="board-header-desc">{board.description}</p>
          </div>
        </div>

        <div className="section-label">Latest Conversations</div>

        {threads.length === 0 ? (
          <div className="no-threads">
            No threads here yet. <a href={`/boards/${boardSlug}/new-thread`}>Be the first to start one!</a>
          </div>
        ) : (
          <ul className="thread-list">
            {threads.map((thread: any) => (
              <li key={thread.id} className="thread-item">
                <div className="thread-avatar">{thread.avatar_initials}</div>
                <div className="thread-main">
                  <a href={`/threads/${thread.id}`} className="thread-title">{thread.title}</a>
                  <div className="thread-sub">
                    Posted by <strong>{thread.username}</strong> · {new Date(thread.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="thread-replies">
                  <strong>{thread.reply_count || 0}</strong> replies
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="sidebar">
        <a href={`/boards/${boardSlug}/new-thread`} className="btn-post">
          + Start a New Thread
        </a>
        <div className="sidebar-widget">
          <div className="widget-header">Board Stats</div>
          <div className="widget-body">
            <div className="stat-box">
              <span className="stat-number">{board.thread_count}</span>
              <span className="stat-label">Threads</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
