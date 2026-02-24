"use client";

import Modal from '@/components/Modal';
import BoardPage from '@/app/boards/[slug]/page';

// We pass the "albums" slug directly to our existing Board engine
export default function TechniqueModal() {
  return (
    <Modal>
      <div style={{ maxHeight: '85vh', overflowY: 'auto', padding: '10px' }}>
        {/* @ts-ignore - params is a Promise in Next.js 15 */}
        <BoardPage params={Promise.resolve({ slug: 'albums' })} />
      </div>
    </Modal>
  );
}
