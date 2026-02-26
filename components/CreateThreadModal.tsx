"use client";
import { useState } from 'react';
import CreateThreadForm from './CreateThreadForm';

export default function CreateThreadModal({ boardId, boardSlug }: { boardId: number, boardSlug: string }) {
  const [open, setOpen] = useState(false);
  const isMarketplace = boardSlug === 'gear-exchange';

  const handleSuccess = () => {
    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'var(--ink)',
          color: 'white',
          padding: '15px 30px',
          fontFamily: 'Bebas Neue',
          fontSize: '1.8rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '6px 6px 0px var(--rust)',
        }}
      >
        {isMarketplace ? '+ LIST AN ITEM' : '+ NEW THREAD'}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--paper)',
              border: '4px solid var(--ink)',
              boxShadow: '12px 12px 0px var(--rust)',
              padding: '40px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontFamily: 'Bebas Neue',
                fontSize: '2rem',
                cursor: 'pointer',
                color: 'var(--ink)',
              }}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', marginTop: 0, marginBottom: '30px' }}>
              {isMarketplace ? 'LIST YOUR GEAR' : 'START A THREAD'}
            </h2>

            <CreateThreadForm
              boardId={boardId}
              boardSlug={boardSlug}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
