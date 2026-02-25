export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import ReplyForm from '@/components/ReplyForm';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Get the currently logged-in user from cookies
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('username')?.value; // <-- Change 'username' if your auth cookie is named differently

  // 2. Fetch the main thread info (Added a JOIN to get the thread author's username)
  const threads = await sql`
    SELECT t.*, b.name as board_name, b.slug as board_slug, u.username as thread_author
    FROM threads t
    JOIN boards b ON t.board_id = b.id
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ${threadId} LIMIT 1
  `;
  const thread = threads[0];

  if (!thread) {
    return <div className="page-wrapper"><div className="content-area">Thread not found.</div></div>;
  }

  // 3. Fetch all posts for this thread
  const posts = await sql`
    SELECT p.*, u.username, u.avatar_initials 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.thread_id = ${threadId} 
    ORDER BY p.created_at ASC
  `;

  // --- SERVER ACTION: MARK AS SOLD ---
  async function markAsSold() {
    "use server";
    await sql`UPDATE threads SET is_sold = true WHERE id = ${threadId}`;
    revalidatePath(`/threads/${threadId}`);
    revalidatePath(`/boards/${thread.board_slug}`);
    revalidatePath('/'); 
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Discussion</span>
        </nav>

        <div className="board-header">
          <div>
            <h1 className="board-header-title">
              {thread.title} {thread.is_sold && <span style={{ color: 'var(--rust)', fontSize: '1.5rem' }}>(SOLD)</span>}
            </h1>
            <p className="board-header-desc">
              Started in {thread.board_name} · {new Date(thread.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* The Conversation (Posts) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post: any, index: number) => {
            const isOriginalPost = index === 0;
            const isGearExchange = thread.board_slug === 'gear-exchange'; // Checks if this is the marketplace board
            const isAuthor = currentUser === thread.thread_author;

            return (
              <div key={post.id} style={{ position: 'relative', display: 'flex', gap: '15px', padding: '20px', background: 'var(--paper)', border: '1px solid var(--aged)', borderRadius: '4px', overflow: 'hidden' }}>
                
                {/* --- THE SOLD STAMP OVERLAY (Only on the first post) --- */}
                {isOriginalPost && thread.is_sold && (
                  <div style={{
                    position: 'absolute', 
                    top: '20px', 
                    right: '30px',
                    transform: 'rotate(15deg)', 
                    color: 'var(--rust)', 
                    border: '4px solid var(--rust)', 
                    padding: '5px 15px',
                    fontSize: '3rem', 
                    fontFamily: 'Bebas Neue',
                    fontWeight: 'bold', 
                    letterSpacing: '2px',
                    opacity: 0.85, 
                    pointerEvents: 'none',
                    zIndex: 10
                  }}>
                    SOLD
                  </div>
                )}

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

                  {/* --- MARK AS SOLD BUTTON --- */}
                  {/* Only shows on the 1st post, in the Gear Exchange, if the user is the author, and it isn't already sold */}
                  {isOriginalPost && isGearExchange && isAuthor && !thread.is_sold && (
                    <form action={markAsSold} style={{ marginTop: '20px', borderTop: '1px dashed var(--aged)', paddingTop: '15px' }}>
                      <button 
                        type="submit" 
                        style={{ 
                          background: 'var(--ink)', 
                          color: 'var(--paper)', 
                          padding: '8px 16px', 
                          fontFamily: 'IBM Plex Mono', 
                          fontWeight: 'bold', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                      >
                        🏷️ Mark as Sold
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hide the reply form if the item is sold! */}
        {!thread.is_sold ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <div style={{ marginTop: '30px', padding: '20px', background: '#f4f4f4', border: '1px solid #ddd', textAlign: 'center', color: '#666', fontFamily: 'IBM Plex Mono' }}>
            🔒 This item has been sold. Replies are disabled.
          </div>
        )}

      </div>
    </div>
  );
}
