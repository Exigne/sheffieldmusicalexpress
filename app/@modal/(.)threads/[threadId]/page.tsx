export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Modal from '@/components/Modal';
import ReplyForm from '@/components/ReplyForm';

export default async function PopOutThread({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Fetch the main thread info
  const threads = await sql`
    SELECT t.*, b.name as board_name
    FROM threads t
    JOIN boards b ON t.board_id = b.id
    WHERE t.id = ${threadId} LIMIT 1
  `;
  const thread = threads[0];

  if (!thread) return null;

  // 2. Fetch all posts for this thread
  const posts = await sql`
    SELECT p.*, u.username, u.avatar_initials 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.thread_id = ${threadId} 
    ORDER BY p.created_at ASC
  `;

  return (
    <Modal>
      {/* Thread Title Header */}
      <div className="board-header" style={{ marginTop: 0, paddingBottom: '15px', borderBottom: '2px solid var(--ink)' }}>
        <div>
          <h2 className="board-header-title" style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{thread.title}</h2>
          <p className="board-header-desc">
            Started in {thread.board_name} · {new Date(thread.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* The Conversation List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
        {posts.map((post: any) => (
          <div key={post.id} style={{ display: 'flex', gap: '15px', padding: '15px', background: 'var(--paper)', border: '1px solid var(--aged)', borderRadius: '4px' }}>
            
            {/* User Avatar */}
            <div style={{ width: '40px', flexShrink: 0 }}>
              <div className="thread-avatar" style={{ margin: '0 auto', width: '40px', height: '40px', fontSize: '1rem' }}>
                {post.avatar_initials || '?'}
              </div>
            </div>

            {/* Post Content */}
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--aged)', paddingBottom: '8px', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--rust)' }}>{post.username}</strong>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>
                  {new Date(post.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#222', fontSize: '0.9rem' }}>
                {post.body}
              </div>

              {/* The Reply Button on Every Post */}
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <a 
                  href="#reply-box" 
                  style={{ fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'none', fontWeight: 'bold', background: '#f4f4f4', padding: '5px 10px', borderRadius: '3px', border: '1px solid #ddd' }}
                >
                  ↩ Reply
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The Smart Reply Form anchored to the bottom */}
      <div id="reply-box">
        <ReplyForm threadId={thread.id} />
      </div>
    </Modal>
  );
}
