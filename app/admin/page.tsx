import { sql } from '@/lib/db';

type AdminPost = {
  id: number;
  username: string;
  body: string;
  created_at: string;
  thread_title: string;
};

async function getRecentPosts(): Promise<AdminPost[]> {
  const rows = await sql`
    SELECT p.id, p.body, p.created_at, u.username, t.title as thread_title
    FROM posts p
    JOIN users u ON p.user_id = u.id
    JOIN threads t ON p.thread_id = t.id
    ORDER BY p.created_at DESC
    LIMIT 20
  `;
  return rows as AdminPost[];
}

export default async function AdminDashboard() {
  const posts = await getRecentPosts();

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area">
        <h2 className="section-label">Moderator Dashboard</h2>
        <div className="form-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--aged)' }}>
                <th style={{ padding: '10px' }}>User</th>
                <th style={{ padding: '10px' }}>Thread</th>
                <th style={{ padding: '10px' }}>Content</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--aged)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{post.username}</td>
                  <td style={{ padding: '10px' }}>{post.thread_title}</td>
                  <td style={{ padding: '10px' }}>{post.body.slice(0, 50)}...</td>
                  <td style={{ padding: '10px' }}>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '10px' }}>
                    <button style={{ color: 'var(--rust)', cursor: 'pointer', border: 'none', background: 'none' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
