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
      fetch('/api/gigs')
        .then(res => res.json())
        .then(data => {
          setGigs(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [featureId]);

  if (featureId !== 'gig-guide') return null;

  return (
    <Modal>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: 0 }}>LIVE GIG GUIDE</h1>
        <p style={{ color: 'var(--rust)', fontWeight: 'bold', fontSize: '0.8rem' }}>OFFICIAL SHEFFIELD LISTINGS</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>SCANNING DATABASE...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {gigs.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No upcoming gigs found in the 'gigs' table.</p>
          ) : (
            gigs.map((gig: any) => (
              <div key={gig.id} style={{ borderLeft: '4px solid var(--rust)', paddingLeft: '15px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold' }}>
                  {new Date(gig.gig_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                </div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', margin: '5px 0' }}>{gig.artist}</h2>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>📍 {gig.venue}</div>
                {gig.ticket_url && (
                  <a href={gig.ticket_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid var(--rust)', marginTop: '8px', display: 'inline-block' }}>
                    GET TICKETS →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  );
}
