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
    // Only fetch if we are looking at the gig guide
    if (featureId === 'gig-guide') {
      fetch('/api/gigs')
        .then(res => res.json())
        .then(data => {
          setGigs(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [featureId]);

  // If it's not the gig guide, we can show a generic message or handle other features
  if (featureId !== 'gig-guide') {
    return (
      <Modal>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Feature: {featureId}</h2>
          <p>This section is coming soon!</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', margin: 0 }}>LIVE GIG GUIDE</h1>
        <p style={{ color: 'var(--rust)', fontWeight: 'bold', fontSize: '0.9rem' }}>OFFICIAL ADMIN LISTINGS</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>SCANNING THE CITY...</p>
      ) : gigs.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>No upcoming gigs found in the database.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {gigs.map((gig: any) => (
            <div key={gig.id} style={{ borderLeft: '4px solid var(--rust)', paddingLeft: '15px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold' }}>
                {new Date(gig.gig_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
              </div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', margin: '5px 0' }}>{gig.artist}</h2>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>📍 {gig.venue}</div>
              {gig.ticket_url && (
                <a href={gig.ticket_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid var(--rust)', marginTop: '5px', display: 'inline-block' }}>
                  GET TICKETS →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
