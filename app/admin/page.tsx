export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

const PASSCODE = "STEELCITY"; 

export default async function AdminDashboard() {

  // --- SERVER ACTIONS ---

  async function addArticle(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    await sql`
      INSERT INTO articles (slug, title, category, excerpt, content) 
      VALUES (${formData.get('slug') as string}, ${formData.get('title') as string}, ${formData.get('category') as string}, ${formData.get('excerpt') as string}, ${formData.get('content') as string})
    `;
    revalidatePath('/'); revalidatePath('/admin');
  }

  async function updateBand(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    await sql`
      INSERT INTO featured_bands (name, description, next_gig, essential_track) 
      VALUES (${formData.get('name') as string}, ${formData.get('description') as string}, ${formData.get('next_gig') as string}, ${formData.get('essential_track') as string})
    `;
    revalidatePath('/'); revalidatePath('/admin');
  }

  async function addGig(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;

    // FIXED: Using 'title' and 'price' to match your actual Neon database table
    await sql`
      INSERT INTO gigs (title, venue, gig_date, price, description) 
      VALUES (
        ${formData.get('title') as string}, 
        ${formData.get('venue') as string}, 
        ${formData.get('gig_date') as string}, 
        ${formData.get('price') as string}, 
        ${formData.get('description') as string}
      )
    `;

    revalidatePath('/'); 
    revalidatePath('/features/gig-guide'); 
    revalidatePath('/admin');
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', textAlign: 'center', marginBottom: '40px' }}>
          MODERATOR PANEL
        </h1>

        {/* ARTICLES SECTION */}
        <div className="form-card" style={{ marginBottom: '40px' }}>
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">🗞️ Publish Article</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={addArticle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <input name="title" className="form-input" placeholder="Headline" required />
                <input name="slug" className="form-input" placeholder="URL-slug" required />
                <input name="category" className="form-input" placeholder="Category" required />
              </div>
              <textarea name="excerpt" className="form-input" rows={2} placeholder="Excerpt..." required />
              <textarea name="content" className="reply-textarea" rows={6} placeholder="Full content..." required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Passcode" required />
                <button type="submit" className="btn-submit">Publish</button>
              </div>
            </form>
          </div>
        </div>

        {/* BAND SECTION */}
        <div className="form-card" style={{ marginBottom: '40px' }}>
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">🎸 Update Band of the Month</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={updateBand} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input name="name" className="form-input" placeholder="Band Name" required />
                <input name="essential_track" className="form-input" placeholder="Essential Track" required />
              </div>
              <input name="next_gig" className="form-input" placeholder="Next Gig" required />
              <textarea name="description" className="reply-textarea" rows={3} placeholder="Bio..." required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Passcode" required />
                <button type="submit" className="btn-submit">Update</button>
              </div>
            </form>
          </div>
        </div>

        {/* GIG SECTION */}
        <div className="form-card">
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">📅 Add New Gig</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={addGig} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {/* Notice these names match the original database setup exactly */}
                <input name="title" className="form-input" placeholder="Artist / Band" required />
                <input name="venue" className="form-input" placeholder="Venue" required />
                <input name="gig_date" type="date" className="form-input" required />
                <input name="price" className="form-input" placeholder="Price / Ticket Link" required />
              </div>
              <textarea name="description" className="reply-textarea" rows={2} placeholder="Extra info..." />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Passcode" required />
                <button type="submit" className="btn-submit">Add Gig</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
