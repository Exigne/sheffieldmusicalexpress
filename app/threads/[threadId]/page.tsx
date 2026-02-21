import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

type Thread = {
  id: number;
  title: string;
  reply_count: number;
  created_at: string;
  board_name: string;
  board_slug: string;
  board_icon: string;
  username: string;
  is_pinned: boolean;
};

type Post = {
  id: number;
  body: string;
  created_at: string;
  username: string;
  user_id: number;
};

async function getThread(id: number): Promise<Thread | null> {
  try {
    const rows = await sql`
      SELECT
        t.id, t.title, t.reply_count, t.created_at, t.is_pinned,
        b.name AS board_name, b.slug AS board_slug, b.icon AS board_icon,
        u.username
      FROM threads t
      LEFT JOIN boards b ON t.board_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ${id}
      LIMIT 1
    `;
    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching thread:', error);
    return null;
  }
}

async function getPosts(threadId: number): Promise<Post[]> {
  try {
    return await sql`
      SELECT
        p.id, p.body, p.created_at, p.user_id,
        u.username
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.thread_id = ${threadId}
      ORDER BY p.created_at ASC
    `;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const id = parseInt(threadId);
  
  if (isNaN(id)) {
    notFound();
  }

  const [thread, posts] = await Promise.all([getThread(id), getPosts(id)]);
  
  if (!thread) {
    notFound();
  }

  return (
    <div className="page-wrapper">
      <div className="content-area">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <a href={`/boards/${thread.board_slug}`}>{thread.board_icon} {thread.board_name}</a>
          <span className="breadcrumb-sep">›</span>
          <span>{thread.title}</span>
        </div>

        {/* THREAD TITLE */}
        <div className="thread-header">
          <h2 className="thread-header-title">{thread.title}</h2>
          <div className="thread-header-meta">
            Started by <strong>{thread.username ?? 'Unknown'}</strong>
            {' · '}{formatDate(thread.created_at)}
            {' · '}<strong>{thread.reply_count}</strong> replies
          </div>
        </div>

        {/* POSTS */}
        <div className="post-list">
          {posts.map((post, index) => (
            <div key={post.id} className={`post-card${index === 0 ? ' first-post' : ''}`}>
              <div className="post-author">
                <div className="post-avatar">
                  {post.username?.slice(0, 2).toUpperCase() ?? '??'}
                </div>
                <div className="post-author-name">{post.username ?? 'Unknown'}</div>
                <div className="post-number">#{index + 1}</div>
              </div>
              <div className="post-body">
                <div className="post-text">{post.body}</div>
                <div className="post-footer">
                  <span className="post-time">{formatDate(post.created_at)}</span>
                  <span className="post-ago">{timeAgo(post.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REPLY FORM */}
        <div className="reply-box">
          <div className="section-label" style={{ marginBottom: '16px' }}>Post a Reply</div>
          <form action={`/api/posts`} method="POST">
            <input type="hidden" name="threadId" value={thread.id} />
            <textarea
              name="body"
              className="reply-textarea"
              placeholder="Write your reply here…"
              rows={6}
              required
            />
            <div className="reply-actions">
              <span className="reply-note">You must be signed in to reply.</span>
              <button type="submit" className="btn-submit">Post Reply →</button>
            </div>
          </form>
        </div>

      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <a href={`/boards/${thread.board_slug}/new-thread`} className="btn-post">
          + New Thread
        </a>

        <div className="sidebar-widget">
          <div className="widget-header">Thread Info</div>
          <div className="widget-body">
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{thread.reply_count}</span>
                <span className="stat-label">Replies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-widget">
          <div className="widget-header">Board</div>
          <div className="widget-body">
            <a href={`/boards/${thread.board_slug}`} className="back-to-board">
              {thread.board_icon} Back to {thread.board_name}
            </a>
          </div>
        </div>

        <a href="/" className="btn-register">← Back to Home</a>
      </aside>
    </div>
  );
}
