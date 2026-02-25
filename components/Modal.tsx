"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);

  const onDismiss = () => router.back();

  useEffect(() => {
    // Force a fresh server fetch every time any modal opens.
    // This ensures the board modal always shows the latest posts/threads.
    router.refresh();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      ref={overlay}
      onClick={(e) => e.target === overlay.current && onDismiss()}
      style={{
        position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(8px)'
      }}
    >
      <div style={{
        position: 'relative',
        background: 'var(--paper)',
        width: '100%',
        maxWidth: '1000px',
        minHeight: '400px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '4px solid var(--ink)',
        boxShadow: '20px 20px 0px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* MODAL TOP BAR */}
        <div style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', fontSize: '1.2rem' }}>
          </span>
          <button
            onClick={onDismiss}
            style={{
              background: 'var(--rust)',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Mono',
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}
          >
            ESC to Close ✕
          </button>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
