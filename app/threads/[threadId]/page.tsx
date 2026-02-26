export const dynamic = 'force-dynamic';
import { sql } from '@/lib/db';
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ params, searchParams }: { params: Promise<{ threadId: string }>, searchParams: Promise<{ type?: string }> }) {
  const { threadId } = await params;
  const { type } = await searchParams;

  // FORCE CHECK: Try the gear table first regardless of type
  const gearRes = await sql`
    SELECT g.*, u.username 
    FROM gear_listings g 
    JOIN users u ON g.user_id = u.id 
    WHERE g.id = ${threadId} LIMIT 1
  `;
  const gear = gearRes[0];

  if (gear) {
    return (
      <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
        <div className="content-area" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: 'white', border: '5px solid var(--ink)', display: 'grid', gridTemplateColumns: gear.image_url ? '1.2fr 1fr' : '1fr', boxShadow: '20px 20px 0px var(--rust)' }}>
            {gear.image_url && (
              <div style={{ background: '#000', borderRight: '5px solid var(--ink)' }}>
                <img src={gear.image_url} style={{ width: '100%', display: 'block' }} alt="Listing" />
              </div>
            )}
            <div style={{ padding: '50px' }}>
              <div style={{ background: 'var(--ink)', color: 'white', padding: '5px 15px', display: 'inline-block', fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginBottom: '20px' }}>
                FOR SALE / TRADE
              </div>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5.5rem', lineHeight: '0.85', margin: '0 0 20px 0' }}>{gear.title}</h1>
              <div style={{ borderTop: '4px solid var(--ink)', borderBottom: '4px solid var(--ink)', padding: '25px 0', margin: '20px 0' }}>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--rust)', lineHeight: '1' }}>{gear.price}</div>
                <div style={{ fontSize: '1.1rem', fontFamily: 'IBM Plex Mono', marginTop: '10px' }}>CONDITION: {gear.condition}</div>
              </div>
              <p style={{ fontSize: '1.3rem', lineHeight: '1.6', fontFamily: 'Barlow' }}>{gear.description}</p>
              <div style={{ marginTop: '30px', color: '#666' }}>Listed by <strong>{gear.username}</strong></div>
            </div>
          </div>
          <div style={{ marginTop: '50px' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>Questions for Seller</h3>
            <PostReplyForm threadId={Number(threadId)} />
          </div>
        </div>
      </div>
    );
  }

  // Fallback for standard threads
  const threadRes = await sql`SELECT t.*, u.username FROM threads t JOIN users u ON t.user_id = u.id WHERE t.id = ${threadId} LIMIT 1`;
  const thread = threadRes[0];
  if (!thread) return <div>Content not found.</div>;

  return (
    <div className="page-wrapper">
       <div className="content-area" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem' }}>{thread.title}</h1>
          <PostReplyForm threadId={thread.id} />
       </div>
    </div>
  );
}
