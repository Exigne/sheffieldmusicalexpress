import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

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
    console.error('Database error fetching thread:', error);
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
    console.error('Database error fetching posts:', error);
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

// Simple XSS protection - escape HTML entities
function escapeHtml(text: string): string {
  const div = { __html: '' };
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Convert newlines to <br> tags safely
function formatPostBody(body: string): string {
  return escapeHtml(body).replace(/\n/g, '<br>');
}

async function getCurrentUser() {
  // Simple session check - adjust based on your actual auth setup
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  return session ? { username: 'User' } : null; // Replace with actual session validation
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

  const [thread, posts, currentUser] = await Promise.all([
    getThread(id), 
    getPosts(id),
    getCurrentUser()
  ]);
  
  if (!thread) {
    notFound();
  }

  const isAuthenticated = !!currentUser;

  return (
    <div className="page-wrapper">
      <div className="content-area">

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol className="breadcrumb-list">
            <li><a href="/">Home</a></li>
            <li aria-hidden="true" className="breadcrumb-sep">›</li>
            <li>
              <a href={`/boards/${thread.board_slug}`}>
                <span aria-hidden="true">{thread.board_icon}</span>
                <span className="visually-hidden">Board: </span>
                {thread.board_name}
              </a>
            </li>
            <li aria-hidden="true" className="breadcrumb-sep">›</li>
            <li aria-current="page">{thread.title}</li>
          </ol>
        </nav>

        {/* THREAD TITLE */}
        <div className="thread-header">
          <h2 className="thread-header-title">{thread.title}</h2>
          <div className="thread-header-meta">
            Started by <strong>{thread.username ?? 'Unknown'}</strong>
            {' · '}{formatDate(thread.created_at)}
            {' · '}<strong>{posts.length}</strong> replies
          </div>
        </div>

        {/* POSTS */}
        <div className="post-list">
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              className={`post-card${index === 0 ? ' first-post' : ''}`}
            >
              <div className="post-author">
                <div 
                  className="post-avatar" 
                  aria-label={`Avatar for ${post.username ?? 'Unknown user'}`}
                >
                  {post.username?.slice(0, 2).toUpperCase() ?? '??'}
                </div>
                <div className="post-author-name">{post.username ?? 'Unknown'}</div>
                <div className="post-number" aria-label={`Post number ${index + 1}`}>
                  #{index + 1}
                </div>
              </div>
              <div className="post-body">
                <div 
                  className="post-text"
                  dangerouslySetInnerHTML={{ __html: formatPostBody(post.body) }}
                />
                <footer className="post-footer">
                  <time className="post-time" dateTime={post.created_at}>
                    {formatDate(post.created_at)}
                  </time>
                  <span className="post-ago">{timeAgo(post.created_at)}</span>
                </footer>
              </div>
            </article>
          ))}
        </div>

        {/* REPLY FORM - Only show if authenticated */}
        {isAuthenticated ? (
          <div className="reply-box">
            <h3 className="section-label" style={{ marginBottom: '16px' }}>
              Post a Reply
            </h3>
            <form action={`/api/posts`} method="POST">
              <input type="hidden" name="threadId" value={thread.id} />
              <textarea
                name="body"
                className="reply-textarea"
                placeholder="Write your reply here…"
                rows={6}
                required
                aria-label="Reply content"
                maxLength={10000}
              />
              <div className="reply-actions">
                <span className="reply-note">
                  Posting as <strong>{currentUser?.username}</strong>
                </span>
                <button type="submit" className="btn-submit">
                  Post Reply →
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="reply-box reply-box--guest">
            <p className="reply-login-message">
              <a href={`/login?redirect=/threads/${thread.id}`}>Sign in</a> to post a reply
            </p>
          </div>
        )}

      </div>

      {/* SIDEBAR */}
      <aside className="sidebar" aria-label="Thread sidebar">
        <a 
          href={`/boards/${thread.board_slug}/new-thread`} 
          className="btn-post"
          role="button"
        >
          + New Thread
        </a>

        <div className="sidebar-widget">
          <h3 className="widget-header">Thread Info</h3>
          <div className="widget-body">
            <dl className="stats-grid">
              <div className="stat-box">
                <dt className="stat-label">Posts</dt>
                <dd className="stat-number">{posts.length}</dd>
              </div>
              <div className="stat-box">
                <dt className="stat-label">Replies</dt>
                <dd className="stat-number">{Math.max(0, posts.length - 1)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="sidebar-widget">
          <h3 className="widget-header">Board</h3>
          <div className="widget-body">
            <a 
              href={`/boards/${thread.board_slug}`} 
              className="back-to-board"
            >
              <span aria-hidden="true">{thread.board_icon}</span>
              Back to {thread.board_name}
            </a>
          </div>
        </div>

        <a href="/" className="btn-register">← Back to Home</a>
      </aside>
    </div>
  );
}
