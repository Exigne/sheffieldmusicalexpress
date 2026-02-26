"use client";
import { useEffect, useState } from "react";

export default function MarketplaceActions({ itemId, sellerName }: { itemId: number, sellerName: string }) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('sme_user');
    if (currentUser && currentUser.toLowerCase() === sellerName.toLowerCase()) {
      setIsOwner(true);
    }
  }, [sellerName]);

  if (!isOwner) return null;

  const handleMarkSold = async () => {
    if (!confirm("Are you sure? This will hide the contact button and add a SOLD banner.")) return;

    const res = await fetch('/api/marketplace/mark-sold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, username: sellerName })
    });

    if (res.ok) window.location.reload();
  };

  return (
    <button 
      onClick={handleMarkSold}
      style={{ 
        display: 'block', marginTop: '20px', background: 'var(--rust)', color: 'white', 
        padding: '10px 20px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', 
        fontSize: '1.2rem', cursor: 'pointer', boxShadow: '5px 5px 0px var(--ink)' 
      }}
    >
      MARK AS SOLD
    </button>
  );
}
