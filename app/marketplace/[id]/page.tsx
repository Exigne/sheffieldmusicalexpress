export const dynamic = 'force-dynamic';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import MarketplaceActions from '@/components/MarketplaceActions';
import CommentForm from '@/components/CommentForm';

export default async function MarketplaceItemPage({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams?.id;

  // 1. Fetch Item (with seller username)
  const itemRes = await sql`
    SELECT m.*, u.username 
    FROM marketplace m 
    LEFT JOIN users u ON m.seller_id = u.id 
    WHERE m.id = ${id} 
    LIMIT 1
  `;
  const item = itemRes[0];

  if (!item) return notFound();

  // 2. Fetch Comments
  const comments = await sql`
    SELECT * FROM marketplace_comments 
    WHERE item_id = ${id} 
    ORDER BY created_at DESC
  `;

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <a href="/marketplace" style={{ fontFamily: 'IBM Plex Mono', color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← BACK TO MARKETPLACE
        </a>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '40px' }}>
          
          {/* LEFT COLUMN: IMAGE */}
          <div style={{ position: 'relative' }}>
            <div style={{ border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--aged)', background: 'white' }}>
              <img 
                src={item.image_url} 
                style={{ width: '100%', display: 'block', filter: item.is_sold ? 'grayscale(100%)' : 'none' }} 
                alt={item.title}
              />
            </div>
            {item.is_sold && (
              <div style={{ 
                position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', 
                background: 'var(--rust)', color: 'white', padding: '20px 40px', 
                fontFamily: 'Bebas Neue', fontSize: '5rem', border: '5px solid var(--ink)', zIndex: 20 
              }}>
                SOLD
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DETAILS & ACTIONS */}
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '10px' }}>
              {item.condition.toUpperCase()} // LISTED BY @{item.username?.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.9', margin: 0 }}>{item.title}</h1>
            <div style={{ fontSize: '3.5rem', fontFamily: 'Bebas Neue', color: 'var(--ink)', marginTop: '10px' }}>£{item.price}</div>
            
            <p style={{ fontFamily: 'Barlow', fontSize: '1.2rem', lineHeight: '1.6', marginTop: '30px', whiteSpace: 'pre-wrap' }}>
              {item.description}
            </p>

            {/* ACTION BUTTONS AREA */}
            <div style={{ marginTop: '40px', borderTop: '4px solid var(--ink)', paddingTop: '30px' }}>
              {!item.is_sold ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* 📩 NEW MESSAGE SELLER BUTTONS */}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    
                    {/* Redirects to Inbox with a ?chat=username parameter */}
                    <a 
                      href={`/inbox?chat=${item.username}`} 
                      style={{ 
                        background: 'var(--rust)', 
                        color: 'white', 
                        padding: '15px 30px', 
                        textDecoration: 'none', 
                        fontFamily: 'Bebas Neue', 
                        fontSize: '1.5rem', 
                        display: 'inline-block',
                        boxShadow: '6px 6px 0px var(--ink)',
                        border: '3px solid var(--ink)'
                      }}
                    >
                      MESSAGE SELLER →
                    </a>

                    <a 
                      href={`mailto:?subject=SME Gear Inquiry: ${item.title}`} 
                      style={{ 
                        background: 'white', 
                        color: 'var(--ink)', 
                        padding: '15px 30px', 
                        textDecoration: 'none', 
                        fontFamily: 'Bebas Neue', 
                        fontSize: '1.5rem', 
                        display: 'inline-block',
                        border: '3px solid var(--ink)'
                      }}
                    >
                      EMAIL
                    </a>
                  </div>

                  {/* SELLER ONLY ACTIONS (Mark as Sold Button) */}
                  <MarketplaceActions itemId={item.id} sellerName={item.username} />
                </div>
              ) : (
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: 'var(--rust)', border: '4px dashed var(--rust)', padding: '20px', textAlign: 'center' }}>
                  THIS ITEM HAS BEEN COLLECTED.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <section style={{ marginTop: '80px', borderTop: '10px solid var(--ink)', paddingTop: '40px' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem' }}>QUESTIONS & COMMENTS</h2>
          
          <CommentForm itemId={item.id} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
            {comments.length > 0 ? (
              comments.map((c: any) => (
                <div key={c.id} style={{ background: 'white', border: '3px solid var(--ink)', padding: '20px', boxShadow: '5px 5px 0px var(--aged)' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--rust)', marginBottom: '5px' }}>
                    @{c.username.toUpperCase()} // {new Date(c.created_at).toLocaleDateString()}
                  </div>
                  <p style={{ margin: 0, fontFamily: 'Barlow', fontSize: '1.1rem' }}>{c.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ fontFamily: 'IBM Plex Mono', color: '#666' }}>No questions yet. Be the first!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
