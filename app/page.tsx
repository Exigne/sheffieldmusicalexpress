import { sql } from '@/lib/db';
import Link from 'next/link';

// 1. Types for our Hub
type Board = {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  post_count: number;
  thread_count: number;
};

type Thread = {
  id: number;
  title: string;
  reply_count: number;
  created_at: string;
  board_name: string;
  username: string;
};

// 2. Data Fetching
async function getBoards(): Promise<Board[]> {
  try {
    const rows = await sql`SELECT * FROM boards ORDER BY id`;
    return (rows as Board[]) ?? [];
  } catch (error) {
    console.error('Board Fetch Error:', error);
    return [];
  }
}

async function getRecentThreads(): Promise<Thread[]> {
  try {
    const rows = await sql`
      SELECT t.id, t.title, t.reply_count, t.created_at, b.name AS board_name, u.username
      FROM threads t
      LEFT JOIN boards b ON t.board_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `;
    return (rows as Thread[]) ?? [];
  } catch (error) {
    console.error('Thread Fetch Error:', error);
    return [];
  }
}

// 3. Helper for Newspaper-style dates
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function HomePage() {
  const [boards, threads] = await Promise.all([getBoards(), getRecentThreads()]);

  return (
    <div className="page-wrapper">
      <div className="content-area">
        
        {/* BOARDS GRID */}
        <div className="section-label">Forum Boards</div>
        <div className="boards-grid">
          {boards.map((board) => (
            <Link 
              key={board.id} 
              href={`/boards/${board.slug}`} 
              className="board-card rust"
            >
              <span className="board-icon">{board.icon}</span>
              <div className="board-name">{board.name}</div>
              <div className="board-desc">{board.description}</div>
              <div className="board-meta">
                <span><strong>{board.post_count}</strong> posts</span>
                <span><strong>{board.thread_count}</strong> threads</span>
              </div>
            </Link>
          ))}
        </div>

        {/* LATEST THREADS */}
        <div className="section-label">Latest Activity</div>
        {threads.length === 0 ? (
          <div className="no-threads">The archive is empty. Be the first to start a thread.</div>
        ) : (
          <ul className="thread-list">
            {threads.map((thread) => (
              <li key={thread.id} className="thread-item">
                <div className="thread-avatar">{thread.username?.slice(0, 2).toUpperCase() || '??'}</div>
                <div className="thread-main">
                  <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                  <div className="thread-sub">
                    <span className="board-tag">{thread.board_name}</span>
                    by <strong>{thread.username}</strong> · {timeAgo(thread.created_at)}
                  </div>
                </div>
                <div className="thread-replies">
                  <strong>{thread.reply_count}</strong> replies
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link href="/boards/gear/new-thread" className="btn-post">+ Start a New Thread</Link>
        
        <div className="sidebar-widget">
          <div className="widget-header">Join the community</div>
          <div className="widget-body">
            <p style={{fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '15px'}}>
              Free membership for Sheffield musicians. Connect, collab, and swap gear.
            </p>
            <Link href="/register" className="btn-register">Register Free →</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
