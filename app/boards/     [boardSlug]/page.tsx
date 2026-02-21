import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

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
  last_reply_at: string;
  username: string;
  is_pinned: boolean;
};

async function getBoard(slug: string): Promise<Board | null> {
  try {
    const rows = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching board:', error);
    return null;
  }
}

async function getThreads(boardId: number): Promise<Thread[]> {
  try {
    return await sql`
      SELECT
        t.id,
        t.title,
        t.reply_count,
        t.created_at,
        t.last_reply_at,
        t.is_pinned,
        u.username
      FROM threads t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.board_id = ${boardId}
      ORDER BY t.is_pinned DESC, t.last_reply_at DESC
    `;
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

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardSlug: string }>;
}) {
  const { boardSlug } = await params;
  const board = await getBoard(boardSlug);
  
  if (!board) {
    notFound();
  }

  const threads = await getThreads(board.id);

  return (
    <div className="page-wrapper">
      <div className="content-area">

        {/* BOARD HEADER */}
        <div className="board-header">
          <div className="board-header-icon">{board.icon}</div>
          <div>
            <h2 className="board-header-title">{board.name}</h2>
            <p className="board-header-desc">{board.description}</p>
          </div>
          <a href={`/boards/${board.slug}/new-thread`} className="btn-post" style={{ width: 'auto', marginBottom: 0 }}>
            + New Thread
          </a>
        </div>

        {/* THREAD LIST */}
        <div className="section-label">
          {threads.length} Thread{threads.length !== 1 ? 's' : ''}
        </div>

        {threads.length === 0 ? (
          <div className="no-threads">
            No threads yet in this board.{' '}
            <a href={`/boards/${board.slug}/new-thread`}>Start the first one!</a>
          </div>
        ) : (
          <ul className="thread-list">
            {threads.map((thread) => (
              <li key={thread.id} className="thread-item">
                <div className="thread-avatar">
                  {thread.is_pinned ? '📌' : thread.username?.slice(0, 2).toUpperCase() ?? '??'}
                </div>
                <div className="thread-info">
                  <a href={`/threads/${thread.id}`} className="thread-title">
                    {thread.is_pinned && <span className="pinned-badge">Pinned</span>}
                    {thread.title}
                  </a>
                  <div className="thread-sub">
                    by <strong>{thread.username ?? 'Unknown'}</strong>
                    {' · '}Started {timeAgo(thread.created_at)}
                    {' · '}Last reply {timeAgo(thread.last_reply_at)}
                  </div>
                </div>
                <div className="thread-replies">
                  <strong>{thread.reply_count}</strong>
                  replies
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <a href={`/boards/${board.slug}/new-thread`} className="btn-post">
          + New Thread
        </a>

        <div className="sidebar-widget">
          <div className="widget-header">Board Stats</div>
          <div className="widget-body">
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">{board.post_count.toLocaleString()}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{board.thread_count.toLocaleString()}</span>
                <span className="stat-label">Threads</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-widget">
          <div className="widget-header">All Boards</div>
          <div className="widget-body" style={{ padding: 0 }}>
            {[
              { slug: 'gear', icon: '🎸', name: 'Gear & Kit' },
              { slug: 'band-wanted', icon: '🤝', name: 'Band Wanted' },
              { slug: 'gigs', icon: '🎤', name: 'Gigs & Scene' },
              { slug: 'production', icon: '🎧', name: 'Production' },
              { slug: 'technique', icon: '🎵', name: 'Technique' },
              { slug: 'records', icon: '📻', name: 'Record Fair' },
            ].map((b) => (
              <a
                key={b.slug}
                href={`/boards/${b.slug}`}
                className={`board-nav-item${b.slug === board.slug ? ' active' : ''}`}
              >
                {b.icon} {b.name}
              </a>
            ))}
          </div>
        </div>

        <a href="/" className="btn-register">← Back to Home</a>
      </aside>
    </div>
  );
}
