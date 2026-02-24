"use client";

import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function FeatureModal() {
  const params = useParams();
  const featureId = params.featureId;
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (featureId === 'gig-guide') {
      // We add a 'cache buster' to the end of the URL (?v=...)
      fetch(`/api/gigs?v=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          setGigs(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [featureId]);

  return (
    <Modal>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', margin: 0 }}>LIVE GIG GUIDE</h1>
        <p style={{ color: 'var(--rust)', fontWeight: 'bold', fontSize: '0.8rem' }}>
          VERIFIED SYSTEM V2.0 // ADMIN DATA ONLY
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>SCANNING DATABASE...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {gigs.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No admin gigs found. Use the SQL editor to add one!</p>
          ) : (
            gigs.map((gig: any) => (
              <div key={gig.id} style={{ borderLeft: '4px solid var(--rust)', paddingLeft: '15px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold' }}>
                   {new Date(gig.gig_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()} @ {gig.venue}
                </div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', margin: '5px 0' }}>{gig.artist}</h2>
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  );
}
