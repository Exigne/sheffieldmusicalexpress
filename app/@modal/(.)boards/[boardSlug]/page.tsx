export const dynamic = 'force-dynamic'; // <-- This kills the cache monster for good

import { sql } from '@/lib/db';
import Modal from '@/components/Modal';
import BoardInteractive from '@/components/BoardInteractive';

export default async function PopOutBoard({ params }: { params: Promise<{ boardSlug: string }> }) {
  const { boardSlug } = await params;

  // 1. Fetch the board details
  const boards = await sql`SELECT * FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
  const board = boards[0];

  if (!board) return null;

  // 2. Fetch the initial threads from the database
  const threads = await sql`
    SELECT t.*, u.username, u.avatar_initials 
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.board_id = ${board.id} 
    ORDER BY t.created_at DESC
  `;

  return (
    <Modal>
      <BoardInteractive board={board} initialThreads={threads} />
    </Modal>
  );
}
