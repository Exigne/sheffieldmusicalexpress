export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const PASSCODE = "STEELCITY"; // Your secret key

export default async function AdminDashboard() {

  // --- SERVER ACTIONS ---

  async function addArticle(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    
    // Safety check: Strip URL parts if the user accidentally pasted a link as the slug
    let slug = (formData.get('slug') as string)
      .replace('https://sheffieldmusicexpress.co.uk/articles/', '')
      .replace('https://sheffieldmusicexpress.co.uk/', '')
      .trim().toLowerCase().replace(/ /g, '-');

    await sql`
      INSERT INTO articles (slug, title, category, excerpt, content) 
      VALUES (${slug}, ${formData.get('title') as string}, ${formData.get('category') as string}, ${formData.get('excerpt') as string}, ${formData.get('content') as string})
    `;
    revalidatePath('/'); revalidatePath('/admin');
  }

  async function deleteArticle(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    const id = formData.get('id');
    await sql`DELETE FROM articles WHERE id = ${id}`;
    revalidatePath('/'); revalidatePath('/admin');
  }

  async function deleteGig(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    const id = formData.get('id');
    await sql`DELETE FROM gigs WHERE id = ${id}`;
    revalidatePath('/'); revalidatePath('/features/gig-guide'); revalidatePath('/admin');
  }

  // --- FETCH DATA FOR MANAGEMENT TABLES ---
  const currentArticles = await sql`SELECT id, title, slug FROM articles ORDER BY created_at DESC`;
  const currentGigs = await sql`SELECT id, title, venue, gig_date FROM gigs ORDER BY gig_date ASC LIMIT 20`;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', textAlign: 'center', marginBottom: '40px' }}>
          MODERATOR PANEL
        </h1>

        {/* 🗞️ PUBLISH ARTICLE FORM (Same as before but with slug safety) */}
        <div className="form-card" style={{ marginBottom: '60px', border: '2px solid var(--ink)', padding: '30px', background: 'var(--paper)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', borderBottom: '2px solid var(--rust)', marginBottom: '20px' }}>🗞️ Publish Article</h2>
          <form action={addArticle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <input name="passcode" type="password" placeholder="Admin Passcode" required style={{ padding: '10px' }} />
             <input name="title" placeholder="Article Title" required style={{ padding: '10px' }} />
             <input name="slug" placeholder="Slug (e.g. why-we-built-this)" required style={{ padding: '10px' }} />
             <input name="category" placeholder="Category (e.g. News)" required style={{ padding: '10px' }} />
             <textarea name="excerpt" placeholder="Short Excerpt" rows={2} style={{ padding: '10px' }} />
             <textarea name="content" placeholder="Full Article Content" rows={10} required style={{ padding: '10px' }} />
             <button type="submit" style={{ background: 'var(--ink)', color: 'white', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}>PUBLISH TO HOMEPAGE</button>
          </form>
        </div>

        {/* 🛠️ DATABASE MANAGER SECTION */}
        <div style={{ background: '#eee', padding: '40px', border: '4px double var(--ink)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', textAlign: 'center', marginBottom: '30px' }}>🛠️ Database Manager</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            
            {/* Manage Articles */}
            <div>
              <h3 style={{ fontFamily: 'IBM Plex Mono', borderBottom: '2px solid var(--ink)' }}>Live Articles</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {currentArticles.map((art: any) => (
                  <li key={art.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>{art.title}</strong><br/>
                      <code style={{ fontSize: '0.7rem', color: 'var(--rust)' }}>/{art.slug}</code>
                    </div>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={art.id} />
                      <input type="hidden" name="passcode" value={PASSCODE} />
                      <button type="submit" style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', fontSize: '0.7rem', cursor: 'pointer' }}>DELETE</button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>

            {/* Manage Gigs */}
            <div>
              <h3 style={{ fontFamily: 'IBM Plex Mono', borderBottom: '2px solid var(--ink)' }}>Upcoming Gigs</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {currentGigs.map((gig: any) => (
                  <li key={gig.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>{gig.title}</strong><br/>
                      <span style={{ fontSize: '0.7rem' }}>{gig.venue}</span>
                    </div>
                    <form action={deleteGig}>
                      <input type="hidden" name="id" value={gig.id} />
                      <input type="hidden" name="passcode" value={PASSCODE} />
                      <button type="submit" style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', fontSize: '0.7rem', cursor: 'pointer' }}>DELETE</button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
