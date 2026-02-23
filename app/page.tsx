export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

// UPDATED: Fetch threads sorted by their newest reply, skipping empty ones
async function getRecentThreads() {
  try {
    const rows = await sql`
      SELECT 
        t.id, 
        t.title, 
        t.reply_count, 
        b.name AS board_name, 
        u.username,
        MAX(p.created_at) as last_interaction
      FROM threads t
      JOIN boards b ON t.board_id = b.id
      JOIN users u ON t.user_id = u.id
      JOIN posts p ON p.thread_id = t.id
      WHERE t.reply_count > 0
      GROUP BY t.id, t.title, t.reply_count, b.name, u.username
      ORDER BY last_interaction DESC
      LIMIT 6
    `;
    return rows ?? [];
  } catch (error) {
    console.error('Thread Fetch Error:', error);
    return [];
  }
}

function timeAgo(dateInput: string | Date): string {
  const diff = Date.now() - new Date(dateInput).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function HomePage() {
  const threads = await getRecentThreads();

  return (
    <div className="page-wrapper">
      <div className="content-area">
        
        {/* NEW ARTICLE SECTION */}
        <div className="section-label">The Steel City Wire</div>
        
        {/* Featured Headline Article */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', padding: '20px', marginBottom: '20px', borderBottom: '4px solid var(--rust)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Exclusive Interview
          </div>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', margin: '0 0 10px 0', lineHeight: '1.1' }}>
            The Leadmill Legacy: 40 Years of Sweat, Steel, and Sound
          </h2>
          <p style={{ fontFamily: 'Barlow', color: '#444', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '15px' }}>
            From Pulp's first gigs to the modern indie revival, we sit down with the sound engineers who have kept Sheffield's most iconic venue ringing in our ears.
          </p>
          <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono' }}>By The Editor · 5 min read</div>
        </div>

        {/* Secondary Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ borderTop: '2px solid var(--ink)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '5px' }}>GEAR REVIEW</div>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', margin: '0 0 5px 0' }}>Testing the new 'Forgemaster' Fuzz Pedal</h3>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>Built right here in Kelham Island, does it actually cut through the mix?</p>
          </div>
          <div style={{ borderTop: '2px solid var(--ink)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '5px' }}>SCENE REPORT</div>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', margin: '0 0 5px 0' }}>5 Basement Practice Rooms You Haven't Tried</h3>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>Stop fighting for the prime slots at Pirate Studios and look underground.</p>
          </div>
        </div>

        {/* TRENDING FORUM ACTIVITY */}
        <div className="section-label">Trending Discussions</div>
        {threads.length === 0 ? (
          <div className="no-threads">No active discussions yet. Head to the boards to reply to a thread!</div>
        ) : (
          <ul className="thread-list">
            {threads.map((thread: any) => (
              <li key={thread.id} className="thread-item">
                <div className="thread-avatar">{thread.username?.slice(0, 2).toUpperCase() || '??'}</div>
                <div className="thread-main">
                  <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                  <div className="thread-sub">
                    <span className="board-tag">{thread.board_name}</span>
                    Started by <strong>{thread.username}</strong> · Active {timeAgo(thread.last_interaction)}
                  </div>
                </div>
                <div className="thread-replies">
                  <strong>{thread.reply_count || 0}</strong> replies
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SIDEBAR: COMMUNITY FOCUS */}
      <aside className="sidebar">
        
        {/* Band Spotlight */}
        <div className="sidebar-widget">
          <div className="widget-header">🎸 Band of the Week</div>
          <div className="widget-body">
            <h4 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>The Lead Lungs</h4>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '10px' }}>
              Heavy alt-rock trio making waves in S1. Catch their EP release party at Sidney & Matilda this Friday.
            </p>
            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none' }}>Listen on Spotify →</a>
          </div>
        </div>

        {/* Gig Guide */}
        <div className="sidebar-widget">
          <div className="widget-header">📅 Weekend Gig Guide</div>
          <div className="widget-body" style={{ fontSize: '0.85rem' }}>
            <div style={{ borderBottom: '1px solid var(--aged)', paddingBottom: '8px', marginBottom: '8px' }}>
              <strong>Friday</strong><br/>
              Local Indie Showcase<br/>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>@ Washington | 8pm | Free</span>
            </div>
            <div style={{ borderBottom: '1px solid var(--aged)', paddingBottom: '8px', marginBottom: '8px' }}>
              <strong>Saturday</strong><br/>
              Heavy Riffs All-Dayer<br/>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>@ Record Junkee | 2pm | £10</span>
            </div>
            <div>
              <strong>Sunday</strong><br/>
              Acoustic Open Mic<br/>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>@ The Broadfield | 7pm | Free</span>
            </div>
          </div>
        </div>

      </aside>
    </div>
  );
}
