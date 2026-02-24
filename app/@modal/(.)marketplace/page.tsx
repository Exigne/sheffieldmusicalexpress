"use client";

import Modal from '@/components/Modal';
import MarketplacePage from '@/app/marketplace/page';

export default function MarketplaceModal() {
  return (
    <Modal>
      <div style={{ maxHeight: '85vh', overflowY: 'auto', padding: '10px' }}>
        <MarketplacePage />
      </div>
    </Modal>
  );
}
