"use client";

import { useRouter } from 'next/navigation';

export default function CloseModalButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      style={{ 
        background: 'none', 
        border: 'none', 
        color: 'var(--rust)', 
        fontFamily: 'Bebas Neue', 
        fontSize: '2rem', 
        cursor: 'pointer',
        lineHeight: '1',
        padding: 0
      }}
    >
      X CLOSE
    </button>
  );
}
