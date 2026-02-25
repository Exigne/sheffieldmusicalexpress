export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';

// Helper function to turn a regular Spotify link into a playable embed widget
function getSpotifyEmbed(url: string | null) {
  if (!url) return null;
  if (url.includes('spotify.com/track/')) {
    const trackId = url.split('track/')[1].split('?')[0];
    return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  }
  return null;
}

export default async function BandModal() {
  let band = null;

  try {
    const rows = await sql`SELECT * FROM featured_bands ORDER BY created_at DESC LIMIT 1`;
    band = rows[0];
  } catch (error) {
    console.error("Failed to fetch Band of the Month:", error);
  }

  if (!band) {
    return (
      <Modal>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display' }}>No band featured this month.</h2>
        </div>
      </Modal>
    );
  }

  const embedUrl = getSpotifyEmbed(band.spotify_url);

  return (
    <Modal>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold' }}>
          🎸 BAND OF THE MONTH
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: '5px 0 0 0', lineHeight: '1' }}>
          {band.name}
        </h1>
      </div>

      <div style={{ padding: '10px 20px' }}>
        <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', textAlign: 'center', marginBottom: '30px' }}>
          {band.description}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '2px dashed var(--aged)', paddingTop: '20px' }}>
          <div style={{ background: 'var(--paper)', padding: '15px', border: '1px solid var(--aged)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>🎧 Essential Track</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 'bold' }}>{band.essential_track || "TBA"}</div>
          </div>
          
          <div style={{ background: 'var(--paper)', padding: '15px', border: '1px solid var(--aged)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>📅 Catch Them Live</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 'bold' }}>{band.next_gig || "No upcoming dates"}</div>
          </div>
        </div>

        {/* SPOTIFY AUDIO PLAYER */}
        {embedUrl && (
          <div style={{ marginTop: '25px' }}>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src={embedUrl} 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen={false} 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        )}

      </div>
    </Modal>
  );
}
