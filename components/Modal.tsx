"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);

  const onDismiss = () => router.back();

  useEffect(() => {
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
        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{
        position: 'relative', background: 'var(--paper)', width: '100%', maxWidth: '1100px',
        maxHeight: '90vh', overflow: 'hidden', border: '2px solid var(--ink)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <button 
          onClick={onDismiss}
          style={{
            position: 'absolute', top: '15px', right: '15px', zIndex: 10,
            background: 'var(--rust)', color: 'white', border: 'none', 
            padding: '5px 12px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          CLOSE [X]
        </button>
        {children}
      </div>
    </div>
  );
}
