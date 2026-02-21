export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

type AdminPost = {
  id: number;
  username: string;
  body: string;
  created_at: string;
  thread_title: string;
  thread_id: number;
};

async function getRecentPosts(): Promise<AdminPost[]> {
  try {
    const rows = await sql`
      SELECT p.id, p.body, p.created_at, u.username, t.title as thread_title, t.id as thread_id
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
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Moderator Control Panel</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">🛡️</div>
            <div>
              <h2 className="form-card-title">Moderator Dashboard</h2>
              <div className="form-card-sub">Manage the latest contributions to the SME boards.</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>USER</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>CONTENT</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>DATE</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid var(--aged)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{post.username}</td>
                    <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--rust)' }}>{post.thread_title}</div>
                      <div style={{ color: '#666' }}>"{post.body.slice(0, 50)}..."</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.7rem' }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {/* Note: This logic assumes you have the Delete API route set up */}
                      <button 
                        style={{ color: 'var(--rust)', cursor: 'pointer', border: 'none', background: 'none', fontSize: '0.7rem', textDecoration: 'underline' }}
                        onClick={() => alert('Feature coming soon: Requires API Delete Route')}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
