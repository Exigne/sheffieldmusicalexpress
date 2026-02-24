export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // 1. Grab and decode the username from the URL
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // 2. Look up the user in the database
  let user = null;
  try {
    const userRes = await sql`SELECT id, username, created_at, avatar_initials, bio FROM users WHERE username = ${decodedUsername} LIMIT 1`;
    user = userRes[0];
  } catch (e) {
    console.error("Failed to fetch user");
  }

  // If the user doesn't exist, show a clean error state
  if (!user) {
    return (
      <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
        <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto", textAlign: 'center', padding: '50px' }}>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem' }}>User Not Found</h1>
          <p style={{ color: '#666' }}>The musician you are looking for has left the stage.</p>
          <Link href="/" className="btn-submit" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  // 3. Fetch their latest threads
  let threads: any[] = [];
  try {
    threads = await sql`
      SELECT t.id, t.title, t.created_at, t.reply_count, b.name as board_name, b.slug as board_slug
      FROM threads t
      JOIN boards b ON t.board_id = b.id
      WHERE t.user_id = ${user.id}
      ORDER BY t.created_at DESC
      LIMIT 10
    `;
  } catch (e) {}

  // 4. Fetch their latest replies
  let replies: any[] = [];
  try {
    replies = await sql`
      SELECT p.id, p.body, p.created_at, t.id as thread_id, t.title as thread_title
      FROM posts p
      JOIN threads t ON p.thread_id = t.id
      WHERE p.user_id = ${user.id}
      ORDER BY p.created_at DESC
      LIMIT 10
    `;
  } catch (e) {}

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Navigation */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Community</span>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: 'var(--rust)' }}>{user.username}</span>
        </nav>

        {/* PROFILE HEADER WITH NEW MESSAGE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--paper)', border: '1px solid var(--ink)', padding: '30px', marginBottom: '40px', borderBottom: '4px solid var(--rust)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--ink)', color: 'var(--bright-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Playfair Display', flexShrink: 0 }}>
            {user.avatar_initials || user.username.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flexGrow: 1 }}>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: '0 0 5px 0' }}>{user.username}</h1>
            <div style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'IBM Plex Mono', marginBottom: '10px' }}>
              Member since {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
            {/* Show their bio if they filled it out in settings! */}
            {user.bio && (
              <div style={{ fontSize: '0.95rem', color: '#333', fontStyle: 'italic' }}>"{user.bio}"</div>
            )}
          </div>
          
          {/* <-- THE NEW DIRECT MESSAGE BUTTON --> */}
          <div>
            <Link href={`/inbox?chat=${user.username}`} className="btn-submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: 'var(--rust)', color: 'white' }}>
              ✉️ Message
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* LEFT COLUMN: THREADS STARTED */}
          <div>
            <h2 className="section-label" style={{ marginBottom: '15px' }}>Threads Started</h2>
            {threads.length === 0 ? (
              <div style={{ padding: '20px', background: 'var(--paper)', border: '1px solid var(--aged)', color: '#666', fontSize: '0.9rem' }}>
                {user.username} hasn't started any conversations yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {threads.map(thread => (
                  <div key={thread.id} style={{ padding: '15px', background: 'var(--paper)', border: '1px solid var(--aged)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--rust)', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold' }}>
                      {thread.board_name}
                    </div>
                    <Link href={`/threads/${thread.id}`} style={{ display: 'block', fontFamily: 'Playfair Display', fontSize: '1.2rem', color: 'var(--ink)', textDecoration: 'none', marginBottom: '8px', fontWeight: 'bold' }}>
                      {thread.title}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                      <span><strong>{thread.reply_count}</strong> replies</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: RECENT REPLIES */}
          <div>
            <h2 className="section-label" style={{ marginBottom: '15px' }}>Recent Replies</h2>
            {replies.length === 0 ? (
              <div style={{ padding: '20px', background: 'var(--paper)', border: '1px solid var(--aged)', color: '#666', fontSize: '0.9rem' }}>
                No recent replies.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {replies.map(reply => (
                  <div key={reply.id} style={{ padding: '15px', background: 'var(--paper)', border: '1px solid var(--aged)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                      Replied to: <Link href={`/threads/${reply.thread_id}`} style={{ color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>{reply.thread_title}</Link>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.5', fontStyle: 'italic', borderLeft: '3px solid var(--aged)', paddingLeft: '10px' }}>
                      "{reply.body.length > 100 ? reply.body.slice(0, 100) + '...' : reply.body}"
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '8px' }}>
                      {new Date(reply.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
