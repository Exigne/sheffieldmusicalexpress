export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

// --- FORUM POSTS SETUP ---
type AdminPost = {
  id: number;
  username: string;
  body: string;
  created_at: string;
  thread_title: string;
  thread_id: number;
};

async function getRecentPosts(): Promise<AdminPost[]> {
  try {
    const rows = await sql`
      SELECT p.id, p.body, p.created_at, u.username, t.title as thread_title, t.id as thread_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN threads t ON p.thread_id = t.id
      ORDER BY p.created_at DESC
      LIMIT 25
    `;
    return (rows as AdminPost[]) ?? [];
  } catch (error) {
    console.error('Admin Fetch Error:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  const posts = await getRecentPosts();

  // --- GIG MANAGER SETUP ---
  // Fetch existing gigs so you can see what's currently in the system
  let existingGigs: any[] = [];
  try {
    existingGigs = await sql`SELECT * FROM gigs WHERE gig_date >= CURRENT_DATE ORDER BY gig_date ASC`;
  } catch (e) {
    // Fails silently if table isn't created yet
  }

  // The Server Action to add new gigs securely
  async function addGig(formData: FormData) {
    "use server";
    
    const title = formData.get('title') as string;
    const venue = formData.get('venue') as string;
    const gig_date = formData.get('gig_date') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;

    try {
      await sql`
        INSERT INTO gigs (title, venue, gig_date, price, description)
        VALUES (${title}, ${venue}, ${gig_date}, ${price}, ${description})
      `;
      // Wipe the cache so the gig guide updates instantly everywhere
      revalidatePath('/'); 
      revalidatePath('/features/gig-guide');
      revalidatePath('/admin');
    } catch (err) {
      console.error("Failed to add gig", err);
    }
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Moderator Control Panel</span>
        </nav>

        {/* --- SECTION 1: GIG MANAGER --- */}
        <div className="form-card" style={{ marginBottom: '40px' }}>
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <div className="form-card-icon">🎸</div>
            <div>
              <h2 className="form-card-title">Live Gig Manager</h2>
              <div className="form-card-sub">Add upcoming shows to the global Gig Guide.</div>
            </div>
          </div>

          <div style={{ background: 'var(--paper)', padding: '20px', border: '1px solid var(--ink)', marginTop: '20px' }}>
            <form action={addGig} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label className="form-label">Headline / Event Title</label>
                  <input name="title" className="form-input" placeholder="e.g. Heavy Riffs All-Dayer" required />
                </div>
                <div>
                  <label className="form-label">Venue</label>
                  <input name="venue" className="form-input" placeholder="e.g. Record Junkee" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label className="form-label">Date</label>
                  <input name="gig_date" type="date" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Cost / Ticket Info</label>
                  <input name="price" className="form-input" placeholder="e.g. £10 OTD or Free" required />
                </div>
              </div>

              <div>
                <label className="form-label">Description (Optional)</label>
                <textarea name="description" className="reply-textarea" rows={2} placeholder="Brief info about the bands playing..."></textarea>
              </div>

              <button type="submit" className="btn-submit" style={{ alignSelf: 'flex-start' }}>+ Add to Gig Guide</button>
            </form>
          </div>

          {/* List of active gigs */}
          <div className="section-label" style={{ marginTop: '20px' }}>Currently Active Gigs</div>
          {existingGigs.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#666' }}>No active gigs in the database yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
              {existingGigs.map(gig => (
                <li key={gig.id} style={{ padding: '10px', borderBottom: '1px solid var(--aged)', display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{new Date(gig.gig_date).toLocaleDateString('en-GB')} - {gig.title}</strong>
                  <span style={{ color: 'var(--rust)' }}>{gig.venue}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- SECTION 2: FORUM MODERATION --- */}
        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">🛡️</div>
            <div>
              <h2 className="form-card-title">Forum Moderation</h2>
              <div className="form-card-sub">Manage the latest contributions to the SME boards.</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>USER</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>CONTENT</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>DATE</th>
                  <th style={{ padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid var(--aged)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{post.username}</td>
                    <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--rust)' }}>{post.thread_title}</div>
                      <div style={{ color: '#666' }}>"{post.body.slice(0, 50)}..."</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.7rem' }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        style={{ color: '#999', cursor: 'not-allowed', border: 'none', background: 'none', fontSize: '0.7rem', textDecoration: 'underline' }}
                        title="Feature coming soon: Requires API Delete Route"
                        disabled
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
