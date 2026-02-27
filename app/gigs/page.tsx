import { sql } from '@/lib/db';

// Force Next.js to fetch fresh gigs every time the page loads (bypasses caching)
export const dynamic = 'force-dynamic';

export default async function GigGuidePage() {
  // Fetch gigs from the database that are happening today or in the future, ordered by date
  const gigs = await sql`
    SELECT * FROM gig_guide 
    WHERE event_date >= CURRENT_DATE 
    ORDER BY event_date ASC
  `;

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEAVY HEADER */}
        <header style={{ borderBottom: '12px solid var(--ink)', paddingBottom: '20px', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', margin: 0, lineHeight: '0.8', color: 'var(--ink)' }}>
            GIG GUIDE
          </h1>
          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px', fontSize: '1.2rem' }}>
            LIVE MUSIC // SHEFFIELD // SUPPORT YOUR LOCAL SCENE
          </p>
        </header>

        {/* GIG LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {gigs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', border: '4px dashed var(--ink)', fontFamily: 'Bebas Neue', fontSize: '2rem' }}>
              NO UPCOMING GIGS FOUND. CHECK BACK LATER.
            </div>
          ) : (
            gigs.map((gig) => {
              // Format the date for the "Calendar Block" look
              const eventDate = new Date(gig.event_date);
              const day = eventDate.toLocaleDateString('en-GB', { day: '2-digit' });
              const month = eventDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
              const weekday = eventDate.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase();

              return (
                <div 
                  key={gig.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    background: 'white', 
                    border: '6px solid var(--ink)', 
                    boxShadow: '10px 10px 0px var(--aged)',
                    overflow: 'hidden',
                    flexWrap: 'wrap' // Ensures it stacks correctly on mobile screens
                  }}
                >
                  {/* DATE BLOCK (Left side) */}
                  <div style={{ 
                    background: 'var(--rust)', 
                    color: 'white', 
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRight: '6px solid var(--ink)',
                    minWidth: '150px'
                  }}>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px' }}>{month}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.9', margin: '5px 0' }}>{day}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '1rem' }}>{weekday}</span>
                  </div>

                  {/* DETAILS BLOCK (Middle) */}
                  <div style={{ padding: '25px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '5px', fontSize: '0.9rem' }}>
                      📍 {gig.venue.toUpperCase()}
                    </div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: '0 0 10px 0', lineHeight: '1', color: 'var(--ink)' }}>
                      {gig.title}
                    </h2>
                    <p style={{ fontFamily: 'Barlow', fontSize: '1.1rem', color: '#444', margin: '0 0 15px 0', maxWidth: '600px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {gig.description}
                    </p>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '1rem', color: 'var(--ink)' }}>
                      🎟️ DOOR: {gig.price}
                    </div>
                  </div>

                  {/* ACTION BLOCK (Right side) */}
                  <div style={{ 
                    padding: '25px', 
                    borderLeft: '6px solid var(--ink)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'var(--paper)',
                    minWidth: '220px'
                  }}>
                    <a 
                      href={gig.ticket_link && gig.ticket_link !== '#' ? gig.ticket_link : '#'} 
                      target={gig.ticket_link && gig.ticket_link !== '#' ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      style={{ 
                        background: 'var(--ink)', 
                        color: 'white', 
                        padding: '15px 20px', 
                        textDecoration: 'none', 
                        fontFamily: 'Bebas Neue', 
                        fontSize: '1.8rem', 
                        display: 'inline-block',
                        border: '3px solid var(--ink)',
                        boxShadow: '4px 4px 0px var(--rust)',
                        transition: 'transform 0.1s',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      GET TICKETS →
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
