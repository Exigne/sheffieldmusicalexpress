import { sql } from '@/lib/db';
import Link from 'next/link';
import PostReplyForm from '@/components/PostReplyForm';
import CloseModalButton from '@/components/CloseModalButton';

export default async function ThreadModal({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // Fetch the thread AND its associated board
  const threadRes = await sql`
    SELECT t.*, b.slug as board_slug 
    FROM threads t 
    JOIN boards b ON t.board_id = b.id 
    WHERE t.id = ${threadId} 
    LIMIT 1
  `;
  const thread = threadRes[0];

  if (!thread) return null;

  // Fetch all posts/replies for this thread
  const posts = await sql`
    SELECT p.*, u.username 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.thread_id = ${threadId} 
    ORDER BY p.created_at ASC
  `;

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.85)', zIndex: 9999, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      padding: '20px' 
    }}>
      
      {/* MODAL CONTAINER */}
      <div style={{ 
        background: 'var(--aged)', 
        width: '100%', 
        maxWidth: '900px', 
        maxHeight: '90vh', 
        display: 'flex',
        flexDirection: 'column',
        border: '6px solid var(--ink)', 
        boxShadow: '15px 15px 0px var(--rust)'
      }}>
        
        {/* MODAL TOP BAR */}
        <div style={{ 
          background: 'var(--ink)', 
          padding: '15px 30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ color: 'white', fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', fontWeight: 'bold' }}>
            VIEWING THREAD
          </div>
          
          <CloseModalButton />
          
        </div>

        {/* MODAL SCROLLABLE CONTENT */}
        <div style={{ padding: '40px 30px', overflowY: 'auto' }}>
          
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.9', marginBottom: '40px' }}>
            {thread.title}
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '50px' }}>
            {posts.map((p: any, index: number) => (
              <div key={p.id} style={{ 
                background: 'white', 
                border: '3px solid var(--ink)', 
                padding: '25px', 
                boxShadow: index === 0 ? '8px 8px 0px var(--rust)' : '8px 8px 0px var(--ink)' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  marginBottom: '20px', 
                  borderBottom: '2px solid var(--ink)', 
                  paddingBottom: '15px' 
                }}>
                  {/* User Avatar Block */}
                  <div style={{ 
                    width: '45px', height: '45px', 
                    background: index === 0 ? 'var(--rust)' : 'var(--ink)', 
                    color: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontFamily: 'Bebas Neue', fontSize: '1.5rem' 
                  }}>
                    {p.username.slice(0, 2).toUpperCase()}
                  </div>
                  
                  {/* USERNAME & DM BUTTON BLOCK */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      {/* 👈 Username is now just static text (span), not a Link */}
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '1rem', color: 'var(--ink)', fontWeight: 'bold' }}>
                        @{p.username.toUpperCase()}
                      </span>
                      
                      <Link 
                        href={`/inbox?chat=${p.username}`} 
                        style={{ 
                          fontFamily: 'IBM Plex Mono', 
                          fontSize: '0.7rem', 
                          background: 'var(--rust)', 
                          color: 'white', 
                          padding: '3px 8px', 
                          textDecoration: 'none', 
                          fontWeight: 'bold',
                          boxShadow: '2px 2px 0px var(--ink)'
                        }}
                      >
                        ✉ MESSAGE
                      </Link>
                    </div>
                    
                    <span style={{ fontSize: '0.7rem', fontFamily: 'IBM Plex Mono', color: '#666' }}>
                      {new Date(p.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p style={{ fontFamily: 'Barlow', fontSize: '1.25rem', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          
          {/* REPLY FORM CONTAINER */}
          <div style={{ 
            background: 'white', 
            border: '4px solid var(--ink)', 
            padding: '30px', 
            boxShadow: '10px 10px 0px var(--aged)' 
          }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', marginBottom: '20px' }}>ADD A REPLY</h2>
            <PostReplyForm threadId={thread.id} />
          </div>

        </div>
      </div>
    </div>
  );
}
