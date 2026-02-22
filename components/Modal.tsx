"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back(); // Closes the pop-out and goes back to the dashboard
  }, [router]);

  // Close on ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);

  return (
    <div 
      style={{
        position: 'fixed', zIndex: 9999, left: 0, top: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(12, 15, 18, 0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
      }}
      onClick={onDismiss} // Clicking the dark background closes it
    >
      <div 
        style={{
          background: 'var(--paper)', width: '100%', maxWidth: '800px', maxHeight: '90vh',
          overflowY: 'auto', borderRadius: '4px', border: '1px solid var(--ink)',
          position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()} // Clicking inside the modal DOES NOT close it
      >
        <button 
          onClick={onDismiss}
          style={{
            position: 'absolute', top: '15px', right: '15px', background: 'var(--ink)',
            color: 'var(--paper)', border: 'none', padding: '5px 10px', cursor: 'pointer'
          }}
        >
          ✕ Close
        </button>
        {/* The board content goes here */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
