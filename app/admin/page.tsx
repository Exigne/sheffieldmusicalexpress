export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

const PASSCODE = "STEELCITY"; 

export default async function AdminDashboard() {

  // --- SECURE SERVER ACTIONS ---
  async function addGig(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;

    // We use 'artist' instead of 'title' to match your 'gigs' table
    await sql`
      INSERT INTO gigs (artist, venue, gig_date, ticket_url, description) 
      VALUES (
        ${formData.get('artist') as string}, 
        ${formData.get('venue') as string}, 
        ${formData.get('gig_date') as string}, 
        ${formData.get('ticket_url') as string}, 
        ${formData.get('description') as string}
      )
    `;

    // Refresh all pages that show gig data
    revalidatePath('/'); 
    revalidatePath('/features/gig-guide'); 
    revalidatePath('/admin');
  }

  async function addArticle(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    await sql`INSERT INTO articles (slug, title, category, excerpt, content) VALUES (${formData.get('slug') as string}, ${formData.get('title') as string}, ${formData.get('category') as string}, ${formData.get('excerpt') as string}, ${formData.get('content') as string})`;
    revalidatePath('/'); revalidatePath('/articles/[slug]', 'page'); revalidatePath('/admin');
  }

  async function updateBand(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;
    await sql`INSERT INTO featured_bands (name, description, next_gig, essential_track) VALUES (${formData.get('name') as string}, ${formData.get('description') as string}, ${formData.get('next_gig') as string}, ${formData.get('essential_track') as string})`;
    revalidatePath('/'); revalidatePath('/features/band-of-the-month'); revalidatePath('/admin');
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <nav className="breadcrumb">
          <Link href="/">Home</Link> <span className="breadcrumb-sep">›</span> <span>Moderator Control Panel</span>
        </nav>

        {/* SECURITY REMINDER */}
        <div style={{ background: '#fdf0ee', padding: '15px', border: '1px solid var(--rust)', marginBottom: '20px', borderRadius: '4px' }}>
          <strong>🔒 Security Note:</strong> You must enter the Admin Passcode (<code>{PASSCODE}</code>) to submit any forms below.
        </div>

        {/* ARTICLES FORM */}
        <div className="form-card" style={{ marginBottom: '40px' }}>
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">🗞️ Publish Article</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={addArticle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <input name="title" className="form-input" placeholder="Headline" required />
                <input name="slug" className="form-input" placeholder="URL-slug (e.g. leadmill-legacy)" required />
                <input name="category" className="form-input" placeholder="Category (e.g. Interview)" required />
              </div>
              <textarea name="excerpt" className="form-input" rows={2} placeholder="Short dashboard excerpt..." required />
              <textarea name="content" className="reply-textarea" rows={6} placeholder="Full article content..." required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Admin Passcode" style={{ width: '200px' }} required />
                <button type="submit" className="btn-submit">Publish Article</button>
              </div>
            </form>
          </div>
        </div>

        {/* BAND OF THE MONTH FORM */}
        <div className="form-card" style={{ marginBottom: '40px' }}>
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">🎸 Update Band of the Month</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={updateBand} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input name="name" className="form-input" placeholder="Band Name" required />
                <input name="essential_track" className="form-input" placeholder="Essential Track Name" required />
              </div>
              <input name="next_gig" className="form-input" placeholder="Next Gig Info" required />
              <textarea name="description" className="reply-textarea" rows={3} placeholder="Band bio..." required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Admin Passcode" style={{ width: '200px' }} required />
                <button type="submit" className="btn-submit">Update Band</button>
              </div>
            </form>
          </div>
        </div>

        {/* GIG GUIDE FORM - UPDATED FOR THE 'GIGS' TABLE */}
        <div className="form-card">
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">📅 Add to Gig Guide</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={addGig} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input name="artist" className="form-input" placeholder="Artist / Band Name" required />
                <input name="venue" className="form-input" placeholder="Venue" required />
                <input name="gig_date" type="date" className="form-input" required />
                <input name="ticket_url" className="form-input" placeholder="Ticket Link (HTTPS://...)" />
              </div>
              <textarea name="description" className="reply-textarea" rows={2} placeholder="Brief description or support acts..." />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Admin Passcode" style={{ width: '200px' }} required />
                <button type="submit" className="btn-submit">Add Gig to Listings</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
