export const dynamic = 'force-dynamic';
export const revalidate = 0; // Essential to show new adverts the instant they are created

import { sql } from '@/lib/db';
import PostReplyForm from '@/components/PostReplyForm';
import Link from 'next/link';

export default async function ThreadPage({ 
  params 
}: { 
  params: Promise<{ threadId: string }> 
}) {
  const { threadId } = await params;

  // 1. PRIMARY CHECK: Is this an item in the Gear Marketplace?
  const gearRes = await sql`
    SELECT g.*, u.username, b.slug as board_slug, b.name as board_name
    FROM gear_listings g 
    JOIN users u ON g.user_id = u.id 
    JOIN boards b ON g.board_id = b.id
    WHERE g.id = ${threadId} 
    LIMIT 1
  `;
  const gear = gearRes[0];

  // If found in gear_listings, show the HIGH-IMPACT ADVERT UI
  if (gear) {
    return (
      <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
        <div className="content-area" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
          
          <nav className="breadcrumb" style={{ marginBottom: '30px', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }}>
            <Link href="/" style={{ color: 'inherit' }}>HOME</Link>
            <span style={{ margin: '0 10px', color: 'var(--rust)' }}>/</span>
            <Link href="/marketplace" style={{ color: 'inherit' }}>THE EXCHANGE</Link>
          </nav>

          <div style={{ 
            background: 'white', 
            border: '6px solid var(--ink)', 
            display: 'grid', 
            gridTemplateColumns: gear.image_url ? '1.3fr 1fr' : '1fr',
            boxShadow: '25px 25px 0px var(--rust)',
            marginBottom: '60px'
          }}>
            {/* Left Side: Product Image */}
            {gear.image_url && (
              <div style={{ 
                background: '#111', 
                borderRight: '6px solid var(--ink)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '500px'
              }}>
                <img 
                  src={gear.image_url} 
                  alt={gear.title} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            )}

            {/* Right Side: Advert Details */}
            <div style={{ padding: '60px' }}>
              <div style={{ 
                background: 'var(--rust)', color: 'white', padding: '6px 18px', 
                fontFamily: 'Bebas Neue', fontSize: '1.4rem', marginBottom: '25px', 
                display: 'inline-block' 
              }}>
                GEAR FOR SALE
              </div>
              
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: '0.8', margin: '0 0 30px 0' }}>
                {gear.title}
              </h1>
              
              <div style={{ 
                borderTop: '5px solid var(--ink)', 
                borderBottom: '5px solid var(--ink)', 
                padding: '35px 0', 
                margin: '35px 0' 
              }}>
                <div style={{ fontSize: '4.5rem', fontWeight: 'bold', color: 'var(--ink)', lineHeight: '1' }}>
                  {gear.price || 'Contact for Price'}
                </div>
                <div style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', marginTop: '15px', textTransform: 'uppercase' }}>
                  Condition: <strong style={{color: 'var(--rust)'}}>{gear.condition}</strong>
                </div>
              </div>

              <p style={{ 
                fontSize: '1.4rem', 
                lineHeight: '1.6', 
                fontFamily: 'Barlow', 
                whiteSpace: 'pre-wrap',
                color: '#111' 
              }}>
                {gear.description}
              </p>

              <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
                LISTED BY <span style={{color: 'var(--rust)', fontWeight: 'bold'}}>{gear.username?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* REPLIES / MESSAGES */}
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', marginBottom: '30px' }}>QUESTIONS & OFFERS</h2>
            <PostReplyForm threadId={Number(threadId)} />
          </div>
        </div>
      </div>
    );
  }

  // 2. SECONDARY CHECK: Fallback to standard Forum Thread
  const threadRes = await sql`
    SELECT t.*, u.username, b.slug as board_slug, b.name as board_name
    FROM threads t 
    JOIN users u ON t.user_id = u.id 
    JOIN boards b ON t.board_id = b.id
    WHERE t.id = ${threadId} 
    LIMIT 1
  `;
  const thread = threadRes[0];

  if (!thread) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '100px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem' }}>FETCHING CONTENT...</h1>
        <p style={{ fontSize: '1.2rem', margin: '20px 0', fontFamily: 'IBM Plex Mono' }}>The database is synchronizing. Please refresh in a second.</p>
        <button onClick={() => window.location.reload()} style={{ background: 'var(--ink)', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', fontFamily: 'Bebas Neue' }}>REFRESH NOW</button>
      </div>
    );
  }

  // 3. FETCH REPLIES (Standard Thread only)
  const posts = await sql`
    SELECT p.*, u.username FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.thread_id = ${threadId}
    ORDER BY p.created_at ASC
  `;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px' }}>
        <nav className="breadcrumb" style={{ marginBottom: '20px', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }}>
          <Link href="/">HOME</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name.toUpperCase()}</Link>
        </nav>

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4.5rem', borderBottom: '6px solid var(--ink)', paddingBottom: '15px', marginBottom: '40px', lineHeight: '1' }}>
          {thread.title}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {posts.map((post: any) => (
            <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px' }}>
               <div style={{ width: '60px', height: '60px', background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', fontSize: '1.5rem' }}>
                 {post.username.slice(0,2).toUpperCase()}
               </div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>{post.username}</div>
                  <div style={{ fontSize: '1.2rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'Barlow' }}>{post.body}</div>
               </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', padding: '40px', background: 'var(--paper)', border: '2px solid var(--ink)' }}>
          <PostReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
