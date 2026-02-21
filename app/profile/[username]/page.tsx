import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // 1. Fetch User Data
  const users = await sql`
    SELECT id, username, avatar_initials, created_at 
    FROM users 
    WHERE username = ${username} 
    LIMIT 1
  `;
  
  if (users.length === 0) return notFound();
  const user = users[0];

  // 2. Fetch User's Recent Posts
  const recentPosts = await sql`
    SELECT p.*, t.title as thread_title, t.id as thread_id
    FROM posts p
    JOIN threads t ON p.thread_id = t.id
    WHERE p.user_id = ${user.id}
    ORDER BY p.created_at DESC
    LIMIT 10
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Member Profile</span>
        </nav>

        {/* PROFILE HEADER */}
        <div className="form-card" style={{ marginBottom: '24px' }}>
          <div className="form-card-header" style={{ borderBottom: 'none' }}>
            <div className="post-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {user.avatar_initials}
            </div>
            <div style={{ marginLeft: '20px' }}>
              <h1 className="site-title" style={{ fontSize: '3rem', textShadow: 'none', color: 'var(--ink)' }}>
                {user.username}
              </h1>
              <div className="thread-sub">
                SME Member since {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="section-label">Recent Activity</div>

        {recentPosts.length === 0 ? (
          <div className="no-threads">This user hasn't posted in the SME archive yet.</div>
        ) : (
          <div className="post-list">
            {recentPosts.map((post: any) => (
              <div key={post.id} className="post-card" style={{ gridTemplateColumns: '1fr' }}>
                <div className="post-body">
                  <div className="thread-sub" style={{ marginBottom: '8px' }}>
                    Replied to: <Link href={`/threads/${post.thread_id}`} style={{ color: 'var(--rust)', fontWeight: '600' }}>
                      {post.thread_title}
                    </Link>
                  </div>
                  <div className="post-text" style={{ fontSize: '0.85rem' }}>
                    {post.body.slice(0, 200)}{post.body.length > 200 ? '...' : ''}
                  </div>
                  <div className="post-footer">
                    <span className="post-ago">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="sidebar">
        <div className="sidebar-widget">
          <div className="widget-header">Member Stats</div>
          <div className="widget-body">
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">{recentPosts.length}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">1</span>
                <span className="stat-label">Level</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
