"use client";

import Modal from '@/components/Modal';
import BoardPage from '@/app/boards/[slug]/page';

export default function AlbumReviewsModal() {
  return (
    <Modal>
      <div style={{ maxHeight: '85vh', overflowY: 'auto', padding: '10px' }}>
        <div style={{ padding: '20px 20px 0 20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', margin: 0 }}>💽 Album Reviews</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>The latest local and global releases discussed by the Sheffield scene.</p>
        </div>
        {/* @ts-ignore - params is a Promise in Next.js 15 */}
        <BoardPage params={Promise.resolve({ slug: 'albums' })} />
      </div>
    </Modal>
  );
}
