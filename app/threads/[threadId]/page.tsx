export const dynamic = 'force-dynamic';
export const revalidate = 0; // Kills Next.js caching to ensure listings show instantly

import { sql } from '@/lib/db';
import Link from 'next/link';
// Ensure this path matches your file structure exactly
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ threadId: string }>,
  searchParams: Promise<{ type?: string }> 
}) {
  const { threadId } = await params;
  const { type } = await searchParams;

  // 1. PRIMARY CHECK: Is this a Marketplace Listing?
  // We check the gear_listings table first because it has the "Proper Advert" data
  const gearRes = await sql`
    SELECT g.*, u.username, b.slug as board_slug, b.name as board_name
    FROM gear_listings g 
    JOIN users u ON g.user_id = u.id 
    JOIN boards b ON g.board_id = b.id
    WHERE g.id = ${threadId} 
    LIMIT 1
  `;
  const gear = gearRes[0];

  if (gear) {
    return (
      <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
        <div className="content-area" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link href={`/boards/${gear.board_slug}`}>{gear.board_name}</Link>
          </nav>

          {/* 🎸 THE PROPER ADVERT LAYOUT */}
          <div style={{ 
            background: 'white', 
            border: '5px solid var(--ink)', 
            display: 'grid', 
            gridTemplateColumns: gear.image_url ? '1.2fr 1fr' : '1fr',
            boxShadow: '20px 20px 0px var(--rust)',
            marginBottom: '50px'
          }}>
            {/* Left Column: Image */}
            {gear.image_url && (
              <div style={{ background: '#111', borderRight: '5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img 
                  src={gear.image_url} 
                  alt={gear.title} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            )}

            {/* Right Column: Listing Details */}
            <div style={{ padding: '50px' }}>
              <div style={{ 
                background: 'var(--rust)', color: 'white', padding: '5px 15px', 
                fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginBottom: '20px', 
                display: 'inline-block' 
              }}>
                FOR SALE / TRADE
              </div>
              
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.85', margin: '0 0 20px 0' }}>
                {gear.title}
              </h1>
              
              <div style={{ 
                borderTop: '4px solid var(--ink)', 
                borderBottom: '4px solid var(--ink)', 
                padding: '25px 0', 
                margin: '25px 0' 
              }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--ink)', lineHeight: '1' }}>
                  {gear.price || 'Contact for Price'}
                </div>
                <div style={{ fontSize: '1.1rem', fontFamily: 'IBM Plex Mono', marginTop: '10px', textTransform: 'uppercase' }}>
                  Condition: <strong>{gear.condition}</strong>
                </div>
              </div>

              <p style={{ 
                fontSize: '1.3rem', 
                lineHeight: '1.6', 
                fontFamily: 'Barlow', 
                whiteSpace: 'pre-wrap',
                color: '#222' 
              }}>
                {gear.description}
              </p>

              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9rem', color: '#666' }}>
                Listing by <Link href={`/profile/${gear.username}`} style={{color: 'var(--rust)', fontWeight: 'bold'}}>{gear.username}</Link>
              </div>
            </div>
          </div>

          {/* 💬 REPLIES SECTION */}
          <div style={{ maxWidth: '800px' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '20px' }}>Questions for Seller</h3>
            <PostReplyForm threadId={Number(threadId)} />
          </div>
        </div>
      </div>
    );
  }

  // 2. SECONDARY CHECK: Fallback to Standard Thread
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
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem' }}>Fetching Listing...</h1>
        <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>The database is synchronizing. Please wait 2 seconds and refresh.</p>
        <button onClick={() => window.location.reload()} className="btn-submit" style={{width: 'auto', padding: '10px 30px'}}>REFRESH PAGE</button>
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
      <div className="content-area" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
        </nav>

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', borderBottom: '5px solid var(--ink)', paddingBottom: '10px', marginBottom: '40px' }}>
          {thread.title}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {posts.map((post: any) => (
            <div key={post.id} style={{ borderBottom: '1px solid var(--aged)', paddingBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--rust)', fontSize: '0.9rem' }}>{post.username}</div>
              <div style={{ fontSize: '1.1rem', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{post.body}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '50px' }}>
          <PostReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
