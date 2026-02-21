import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

// 1. Define the Post Type for the Admin View
type AdminPost = {
  id: number;
  username: string;
  body: string;
  created_at: string;
  thread_title: string;
  thread_id: number;
};

// 2. Data Fetching Function
async function getRecentPosts(): Promise<AdminPost[]> {
  try {
    // Fetches the 25 most recent posts across the entire forum
    const rows = await sql`
      SELECT 
        p.id, 
        p.body, 
        p.created_at, 
        u.username, 
        t.title as thread_title,
        t.id as thread_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN threads t ON p.thread_id = t.id
      ORDER BY p.created_at DESC
      LIMIT 25
    `;
    return (rows as AdminPost[]) ?? [];
  } catch (error) {
    console.error('Admin Fetch Error:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  const posts = await getRecentPosts();

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area">
        
        {/* BREADCRUMB */}
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>Moderator Control Panel</span>
        </nav>

        <div className="section-label">Recent Forum Activity</div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">🛡️</div>
            <div>
              <h2 className="form-card-title">Moderator Dashboard</h2>
              <div className="form-card-sub">Review and manage the latest contributions to the SME boards.</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>User</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>Location</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>Preview</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>Date</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                      No recent posts found in the archive.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} style={{ borderBottom: '1px solid var(--aged)' }}>
                      <td style={{ padding: '12px', fontWeight: '600', fontSize: '0.85rem' }}>
                        {post.username}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                        <a href={`/threads/${post.thread_id}`} style={{ color: 'var(--rust)', textDecoration: 'none' }}>
                          {post.thread_title.slice(0, 30)}...
                        </a>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.8rem', color: '#555' }}>
                        "{post.body.slice(0, 60)}..."
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.65rem' }}>
                        {new Date(post.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {/* Inline Client-side Delete Trigger */}
                        <form action={`/api/admin/delete-post?id=${post.id}`} method="POST">
                           {/* Using a form is a safe way to trigger deletes in Server Components without complex state */}
                           <button 
                             type="submit"
                             onClick={(e) => {
                               if (!confirm("Are you sure? This action is permanent and will remove the post from the SME archive.")) {
                                 e.preventDefault();
                               }
                             }}
                             style={{ 
                               background: 'var(--rust)', 
                               color: 'white', 
                               border: 'none', 
                               padding: '4px 8px', 
                               fontFamily: 'Bebas Neue',
                               fontSize: '0.8rem',
                               cursor: 'pointer',
                               boxShadow: '2px 2px 0 var(--ink)'
                             }}
                           >
                             DELETE
                           </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
           <a href="/" className="btn-register" style={{ display: 'inline-block' }}>← Return to Home</a>
        </div>
      </div>

      {/* ADMIN SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-widget">
          <div className="widget-header">Mod Tools</div>
          <div className="widget-body">
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4', color: '#666' }}>
              Use this dashboard to keep the SME boards clean. Deleting a post removes it instantly from the database. 
              Always refer to the <strong>Rules & Guidelines</strong> before taking action.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
