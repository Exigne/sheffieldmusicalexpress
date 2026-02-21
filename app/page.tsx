import { sql } from '@/lib/db';

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
  board_slug: string;
  username: string;
};

async function getBoards(): Promise<Board[]> {
  try {
    const rows = await sql`SELECT * FROM boards ORDER BY id`;
    return (rows as Board[]) ?? [];
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
}

async function getRecentThreads(): Promise<Thread[]> {
  try {
    const rows = await sql`
      SELECT
        t.id,
        t.title,
        t.reply_count,
        t.created_at,
        b.name AS board_name,
        b.slug AS board_slug,
        u.username
      FROM threads t
      LEFT JOIN boards b ON t.board_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.last_reply_at DESC
      LIMIT 10
    `;
    return (rows as Thread[]) ?? [];
  } catch (error) {
    console.error('Error fetching threads:', error);
    return [];
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const boardColors: Record<string, string> = {
  gear: 'rust',
  'band-wanted': 'gold',
  gigs: 'ink',
  production: 'steel',
  technique: 'ink',
  records: 'gold',
};

export default async function HomePage() {
  const [boards, threads] = await Promise.all([getBoards(), getRecentThreads()]);

  return (
    <div className="page-wrapper">
      <div className="content-area">

        {/* BOARDS */}
        <div className="section-label">Forum Boards</div>
        <div className="boards-grid">
          {boards.map((board) => (
            <a
              key={board.id}
              href={`/boards/${board.slug}`}
              className={`board-card ${boardColors[board.slug] || 'ink'}`}
            >
              <span className="board-icon">{board.icon}</span>
              <div className="board-name">{board.name}</div>
              <div className="board-desc">{board.description}</div>
              <div className="board-meta">
                <span><strong>{board.post_count.toLocaleString()}</strong> posts</span>
                <span><strong>{board.thread_count.toLocaleString()}</strong> threads</span>
              </div>
            </a>
          ))}
        </div>

        {/* RECENT THREADS */}
        <div className="section-label">Latest Threads</div>
        {threads.length === 0 ? (
          <div className="no-threads">
            No threads yet — <a href="/new-thread">be the first to post!</a>
          </div>
        ) : (
          <ul className="thread-list">
            {threads.map((thread) => (
              <li key={thread.id} className="thread-item">
                <div className="thread-avatar">
                  {thread.username ? thread.username.slice(0, 2).toUpperCase() : '??'}
                </div>
                <div className="thread-info">
                  <a href={`/threads/${thread.id}`} className="thread-title">
                    {thread.title}
                  </a>
                  <div className="thread-sub">
                    <span className="board-tag">{thread.board_name}</span>
                    by <strong>{thread.username || 'Unknown'}</strong> · {timeAgo(thread.created_at)}
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
        <a href="/new-thread" className="btn-post">+ Start a New Thread</a>

        <div className="sidebar-widget">
          <div className="widget-header">Forum Stats</div>
          <div className="widget-body">
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">
                  {boards.reduce((sum, b) => sum + b.post_count, 0).toLocaleString()}
                </span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">
                  {boards.reduce((sum, b) => sum + b.thread_count, 0).toLocaleString()}
                </span>
                <span className="stat-label">Threads</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-widget">
          <div className="widget-header">Join the Community</div>
          <div className="widget-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '14px', lineHeight: '1.5' }}>
              Free membership. Connect with Sheffield musicians, post gigs, swap gear, and find your band.
            </p>
            <a href="/register" className="btn-register">Register Free →</a>
          </div>
        </div>
      </aside>
    </div>
  );
}
