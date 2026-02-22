import { sql } from '@/lib/db';
import Modal from '@/components/Modal';
import Link from 'next/link';

export default async function PopOutBoard({ params }: { params: Promise<{ boardSlug: string }> }) {
  const { boardSlug } = await params;

  // Fetch the board details
  const boards = await sql`SELECT * FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
  const board = boards[0];

  if (!board) return null;

  // Fetch the threads for this board
  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.board_id = ${board.id} 
    ORDER BY t.created_at DESC
  `;

  return (
    <Modal>
      <div className="board-header" style={{ marginTop: '0' }}>
        <div className="board-header-icon">{board.icon}</div>
        <div>
          <h2 className="board-header-title" style={{ fontSize: '2rem' }}>{board.name}</h2>
          <p className="board-header-desc">{board.description}</p>
        </div>
      </div>

      <div className="section-label">Latest Conversations</div>
      
      <div className="thread-list">
        {threads.length === 0 ? (
          <div className="no-threads">No threads here yet.</div>
        ) : (
          threads.map((thread: any) => (
            <div key={thread.id} className="thread-item">
              <div className="thread-avatar">{thread.avatar_initials}</div>
              <div className="thread-main">
                {/* Clicking a thread will break out of the modal and go to the full thread page */}
                <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                <div className="thread-sub">Posted by {thread.username}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
         <Link href={`/boards/${board.slug}/new-thread`} className="btn-post" style={{ display: 'inline-block' }}>
           + New Thread
         </Link>
      </div>
    </Modal>
  );
}
