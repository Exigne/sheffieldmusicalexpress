export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

function getSpotifyEmbed(url: string | null) {
  if (!url) return null;
  if (url.includes('spotify.com/track/')) {
    const trackId = url.split('track/')[1].split('?')[0];
    return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  }
  return null;
}

export default async function BandFallbackPage() {
  let band = null;

  try {
    const rows = await sql`SELECT * FROM featured_bands ORDER BY created_at DESC LIMIT 1`;
    band = rows[0];
  } catch (error) {
    console.error("Failed to fetch Band of the Month:", error);
  }

  if (!band) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'Playfair Display' }}>No band featured this month.</h2>
        <Link href="/" style={{ color: 'var(--rust)', fontWeight: 'bold' }}>← Return Home</Link>
      </div>
    );
  }

  const embedUrl = getSpotifyEmbed(band.spotify_url);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '70vh' }}>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold' }}>
          🎸 BAND OF THE MONTH
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', margin: '10px 0 0 0', lineHeight: '1' }}>
          {band.name}
        </h1>
      </div>

      <div style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center', marginBottom: '40px' }}>
        <p>{band.description}</p>
      </div>

      {/* SPOTIFY AUDIO PLAYER */}
      {embedUrl && (
        <div style={{ marginBottom: '50px', maxWidth: '500px', margin: '0 auto 50px auto' }}>
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

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase' }}>🎧 Essential Track</div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '5px' }}>{band.essential_track || "TBA"}</div>
        </div>
        
        <div style={{ width: '2px', background: 'var(--aged)' }}></div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase' }}>📅 Catch Them Live</div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '5px' }}>{band.next_gig || "No upcoming dates"}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', color: 'var(--ink)', borderBottom: '2px solid var(--rust)', textDecoration: 'none' }}>
          ← Back to Sheffield Music Express
        </Link>
      </div>
    </div>
  );
}
