export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function AdminDashboard() {

  async function addGig(formData: FormData) {
    "use server";
    if (formData.get('passcode') !== PASSCODE) return;

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

    revalidatePath('/'); 
    revalidatePath('/features/gig-guide'); 
    revalidatePath('/admin');
  }

  // (addArticle and updateBand functions stay the same as your previous version)
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
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem' }}>Admin Control Panel</h1>

        {/* GIG GUIDE FORM */}
        <div className="form-card" style={{ marginBottom: '40px' }}>
          <div className="form-card-header" style={{ borderBottom: '2px solid var(--rust)', paddingBottom: '15px' }}>
            <h2 className="form-card-title">📅 Add New Gig</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <form action={addGig} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input name="artist" className="form-input" placeholder="Artist / Band" required />
                <input name="venue" className="form-input" placeholder="Venue" required />
                <input name="gig_date" type="date" className="form-input" required />
                <input name="ticket_url" className="form-input" placeholder="Ticket Link (HTTPS://...)" />
              </div>
              <textarea name="description" className="reply-textarea" rows={2} placeholder="Extra info..." />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="passcode" type="password" className="form-input" placeholder="Admin Passcode" required />
                <button type="submit" className="btn-submit">Add Gig</button>
              </div>
            </form>
          </div>
        </div>

        {/* ... Include your existing Article and Band forms below ... */}
      </div>
    </div>
  );
}
