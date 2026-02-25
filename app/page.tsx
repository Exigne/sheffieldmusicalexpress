export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

// 1. UPDATED SQL: Now selects 't.is_sold' and groups by it!
async function getRecentThreads() {
  try {
    const rows = await sql`
      SELECT 
        t.id, t.title, t.reply_count, t.is_sold, b.name AS board_name, u.username,
        MAX(p.created_at) as last_interaction
      FROM threads t
      JOIN boards b ON t.board_id = b.id
      JOIN users u ON t.user_id = u.id
      JOIN posts p ON p.thread_id = t.id
      WHERE t.reply_count > 0
      GROUP BY t.id, t.title, t.reply_count, t.is_sold, b.name, u.username
      ORDER BY last_interaction DESC
      LIMIT 6
    `;
    return rows ?? [];
  } catch (error) {
    console.error('Thread Fetch Error:', error);
    return [];
  }
}

async function getUpcomingGigs() {
  try {
    const rows = await sql`
      SELECT id, title, venue, gig_date
      FROM gigs 
      WHERE gig_date >= (CURRENT_DATE - INTERVAL '1 day')
      ORDER BY gig_date ASC
      LIMIT 5
    `;
    return rows ?? [];
  } catch (error) {
    console.error('Gig Fetch Error:', error);
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
  const upcomingGigs = await getUpcomingGigs();
  
  let articles: any[] = [];
  let band: any = null;
  try {
    articles = await sql`SELECT * FROM articles ORDER BY created_at DESC LIMIT 3`;
    const bandsRes = await sql`SELECT * FROM featured_bands ORDER BY created_at DESC LIMIT 1`;
    band = bandsRes[0] || null;
  } catch (e) { console.error("DB Error"); }

  const featuredArticle = articles[0];
  const subArticles = articles.slice(1, 3);

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <div className="section-label">The Steel City Wire</div>
        
        {featuredArticle ? (
          <Link href={`/articles/${featuredArticle.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', padding: '20px', marginBottom: '20px', borderBottom: '4px solid var(--rust)', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {featuredArticle.category}
              </div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', margin: '0 0 10px 0', lineHeight: '1.1' }}>
                {featuredArticle.title}
              </h2>
              <p style={{ fontFamily: 'Barlow', color: '#444', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '15px' }}>
                {featuredArticle.excerpt}
              </p>
              <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono' }}>By {featuredArticle.author || 'The Editor'}</div>
            </div>
          </Link>
        ) : (
          <p style={{marginBottom: '20px', color: '#666', fontSize: '0.9rem'}}>Publish your first article in the Mod Panel!</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          {subArticles.map((article: any) => (
            <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ borderTop: '2px solid var(--ink)', paddingTop: '10px', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '5px' }}>{article.category}</div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', margin: '0 0 5px 0' }}>{article.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#555' }}>{article.excerpt.slice(0, 80)}...</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="section-label">Trending Discussions</div>
        <ul className="thread-list">
          {threads.map((thread: any) => (
            <li key={thread.id} className="thread-item">
              <Link href={`/profile/${thread.username}`} style={{ textDecoration: 'none' }}>
                <div className="thread-avatar">{thread.username?.slice(0, 2).toUpperCase() || '??'}</div>
              </Link>
              <div className="thread-main">
                
                {/* 2. UPDATED JSX: Thread Title + SOLD Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href={`/threads/${thread.id}`} className="thread-title">
                    {thread.title}
                  </Link>
                  {thread.is_sold && (
                    <span style={{ 
                      background: 'var(--rust)', 
                      color: 'var(--paper)', 
                      padding: '2px 6px', 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold', 
                      fontFamily: 'IBM Plex Mono',
                      borderRadius: '3px',
                      textTransform: 'uppercase'
                    }}>
                      SOLD
                    </span>
                  )}
                </div>

                <div className="thread-sub">
                  <span className="board-tag">{thread.board_name}</span>
                  Started by <Link href={`/profile/${thread.username}`} style={{ color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>{thread.username}</Link> · {timeAgo(thread.last_interaction)}
                </div>
              </div>
              <div className="thread-replies"><strong>{thread.reply_count || 0}</strong> replies</div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="sidebar">
        {band && (
          <Link href="/features/band-of-the-month" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sidebar-widget">
              <div className="widget-header">🎸 Band of the Month</div>
              <div className="widget-body">
                <h4 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>{band.name}</h4>
                <p style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '10px' }}>{band.description.slice(0, 100)}...</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold' }}>Read Feature →</span>
              </div>
            </div>
          </Link>
        )}

        <div className="sidebar-widget">
          <div className="widget-header">📅 Upcoming Gigs</div>
          <div className="widget-body" style={{ padding: '15px' }}>
            {upcomingGigs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {upcomingGigs.map((gig: any) => (
                  <Link key={gig.id} href={`/gigs/${gig.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ borderLeft: '3px solid var(--rust)', paddingLeft: '10px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>
                        {new Date(gig.gig_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} @ {gig.venue}
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'Playfair Display', color: 'var(--ink)' }}>
                        {gig.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                <p style={{ margin: 0 }}>No upcoming shows listed.</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
