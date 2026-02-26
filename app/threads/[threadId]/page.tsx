export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
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

  // 1. Try fetching as a Gear Listing if the type is 'gear'
  if (type === 'gear') {
    const gearRes = await sql`
      SELECT g.*, u.username, b.name as board_name, b.slug as board_slug
      FROM gear_listings g
      JOIN users u ON g.user_id = u.id
      JOIN boards b ON g.board_id = b.id
      WHERE g.id = ${threadId} LIMIT 1
    `;
    const listing = gearRes[0];

    if (listing) {
      return (
        <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
          <div className="content-area" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            <div style={{ 
              background: 'white', 
              border: '5px solid var(--ink)', 
              display: 'grid', 
              gridTemplateColumns: listing.image_url ? '1.2fr 1fr' : '1fr',
              boxShadow: '15px 15px 0px var(--rust)',
              marginBottom: '50px'
            }}>
              {listing.image_url && (
                <div style={{ background: '#000', borderRight: '5px solid var(--ink)', display: 'flex', alignItems: 'center' }}>
                  <img src={listing.image_url} style={{ width: '100%', height: 'auto' }} alt="Listing" />
                </div>
              )}
              <div style={{ padding: '50px' }}>
                <div style={{ background: 'var(--ink)', color: 'white', padding: '5px 12px', display: 'inline-block', fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginBottom: '20px' }}>
                  SME GEAR EXCHANGE
                </div>
                <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.8', margin: '0 0 20px 0' }}>{listing.title}</h1>
                
                <div style={{ margin: '30px 0', borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)', padding: '25px 0' }}>
                   <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--rust)', lineHeight: '1' }}>{listing.price}</div>
                   <div style={{ fontSize: '1rem', fontFamily: 'IBM Plex Mono', marginTop: '10px' }}>CONDITION: {listing.condition}</div>
                </div>

                <div style={{ fontFamily: 'Barlow', fontSize: '1.2rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {listing.description}
                </div>

                <div style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666' }}>
                  Listed by <strong>{listing.username}</strong>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: '800px' }}>
               <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>Questions & Replies</h3>
               <PostReplyForm threadId={Number(threadId)} />
            </div>
          </div>
        </div>
      );
    }
  }

  // 2. Fallback to standard Thread fetching if not gear or not found
  const threadRes = await sql`
    SELECT t.*, u.username, b.slug as board_slug, b.name as board_name
    FROM threads t
    JOIN users u ON t.user_id = u.id
    JOIN boards b ON t.board_id = b.id
    WHERE t.id = ${threadId} LIMIT 1
  `;
  const thread = threadRes[0];

  if (!thread) return <div className="page-wrapper">Content not found.</div>;

  return (
    <div className="page-wrapper">
       <div className="content-area" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem' }}>{thread.title}</h1>
          <hr />
          {/* Render standard posts here... */}
          <PostReplyForm threadId={thread.id} />
       </div>
    </div>
  );
}
