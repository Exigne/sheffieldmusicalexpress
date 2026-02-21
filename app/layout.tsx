import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function GearPage() {
  // We manually fetch gear threads (Board ID 1 usually)
  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.board_id = 1 
    ORDER BY t.created_at DESC
  `;

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <h2 className="section-label">🎸 Gear & Kit Talk</h2>
        <div className="thread-list">
          {threads.map((thread: any) => (
            <div key={thread.id} className="thread-item">
              <div className="thread-avatar">{thread.avatar_initials}</div>
              <div>
                <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                <div className="thread-sub">Posted by {thread.username}</div>
              </div>
            </div>
          ))}
          {threads.length === 0 && <p className="no-threads">No gear talk yet. Sheffield's quiet today...</p>}
        </div>
      </div>
      <aside className="sidebar">
        <Link href="/boards/gear/new-thread" className="btn-post">+ New Thread</Link>
      </aside>
    </div>
  );
}
