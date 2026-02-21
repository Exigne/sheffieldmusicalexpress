export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function HomePage() {
  const boards = await sql`SELECT * FROM boards ORDER BY id ASC`;
  
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
              <div className="board-meta">
                <span><strong>{board.post_count || 0}</strong> posts</span>
                <span><strong>{board.thread_count || 0}</strong> threads</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <aside className="sidebar">
        <div className="sidebar-widget">
          <div className="widget-header">Welcome to SME</div>
          <div className="widget-body">
            <p style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
              The Sheffield Musical Express is live. Select a board to join the conversation.
            </p>
          </div>
        </div>
        <Link href="/register" className="btn-register">Register Free →</Link>
      </aside>
    </div>
  );
}
