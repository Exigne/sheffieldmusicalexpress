export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import ReplyForm from '@/components/ReplyForm';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Fetch the main thread info
  const threads = await sql`
    SELECT t.*, b.name as board_name, b.slug as board_slug
    FROM threads t
    JOIN boards b ON t.board_id = b.id
    WHERE t.id = ${threadId} LIMIT 1
  `;
  const thread = threads[0];

  if (!thread) {
    return <div className="page-wrapper"><div className="content-area">Thread not found.</div></div>;
  }

  // 2. Fetch all posts (original post + replies) for this thread
  const posts = await sql`
    SELECT p.*, u.username, u.avatar_initials 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.thread_id = ${threadId} 
    ORDER BY p.created_at ASC
  `;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumbs */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Discussion</span>
        </nav>

        {/* Thread Title */}
        <div className="board-header">
          <div>
            <h1 className="board-header-title">{thread.title}</h1>
            <p className="board-header-desc">
              Started in {thread.board_name} · {new Date(thread.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* The Conversation (Posts) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post: any, index: number) => (
            <div key={post.id} style={{ display: 'flex', gap: '15px', padding: '20px', background: 'var(--paper)', border: '1px solid var(--aged)', borderRadius: '4px' }}>
              <div style={{ width: '50px', flexShrink: 0 }}>
                <div className="thread-avatar" style={{ margin: '0 auto' }}>{post.avatar_initials || '?'}</div>
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--aged)', paddingBottom: '10px', marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--rust)' }}>{post.username}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>
                    {new Date(post.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#222' }}>
                  {post.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. The Smart Reply Form */}
        <ReplyForm threadId={thread.id} />

      </div>
    </div>
  );
}
