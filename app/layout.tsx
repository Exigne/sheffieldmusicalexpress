export const dynamic = 'force-dynamic'; // This keeps the data live

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function HomePage() {
  // 1. Fetch all the boards for the Hub
  const boards = await sql`SELECT * FROM boards ORDER BY id ASC`;
  
  // 2. Fetch the latest threads from across the whole site
  const recentThreads = await sql`
    SELECT t.id, t.title, b.name as board_name, u.username
    FROM threads t
    JOIN boards b ON t.board_id = b.id
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC LIMIT 5
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <div className="section-label">Forum Boards</div>
        <div className="boards-grid">
          {boards.map((board: any) => (
            <Link href={`/boards/${board.slug}`} key={board.id} className="board-card rust">
              <span className="board-icon">{board.icon || '🎵'}</span>
              <div className="board-name">{board.name}</div>
              <div className="board-desc">{board.description}</div>
            </Link>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: '40px' }}>Latest Activity</div>
        <div className="thread-list">
          {recentThreads.map((thread: any) => (
            <div key={thread.id} className="thread-item">
               <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
               <div className="thread-sub">in {thread.board_name} by {thread.username}</div>
            </div>
          ))}
        </div>
      </div>

      <aside className="sidebar">
        <div className="sidebar-widget">
          <div className="widget-header">Welcome to SME</div>
          <div className="widget-body">
            <p style={{ fontSize: '0.8rem' }}>The Sheffield Musical Express is live. Select a board to start.</p>
          </div>
        </div>
        <Link href="/register" className="btn-register">Join the Community →</Link>
      </aside>
    </div>
  );
}
