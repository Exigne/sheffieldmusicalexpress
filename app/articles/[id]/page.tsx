export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

// 💡 FIX: In newer Next.js versions, params must be handled as a Promise
export default async function SingleArticlePage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Await the params to get the actual ID from the URL
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let article: any = null;

  try {
    // 2. Fetch the article with a LEFT JOIN to prevent crashes if author is missing
    const res = await sql`
      SELECT a.*, u.username 
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ${id}
      LIMIT 1
    `;
    article = res[0];

    // 3. FALLBACK: If the join failed, try a direct fetch
    if (!article) {
      const fallbackRes = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`;
      article = fallbackRes[0];
    }
  } catch (e) {
    console.error("Error fetching article:", e);
  }

  // 4. If the database actually has NO record for this ID, show the 404
  if (!article) {
    console.log(`Article with ID ${id} not found in database.`);
    return notFound();
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--paper)', minHeight: '100vh' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* BREADCRUMB / BACK LINK */}
        <div style={{ marginBottom: '40px' }}>
          <a href="/articles" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>
            ← BACK TO ALL ARTICLES
          </a>
        </div>

        {/* HEADER SECTION */}
        <header style={{ borderBottom: '8px solid var(--ink)', paddingBottom: '30px', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '15px' }}>
            {article.category?.toUpperCase() || 'NEWS'} // {new Date(article.created_at).toLocaleDateString()}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.9', margin: 0, color: 'var(--ink)' }}>
            {article.title}
          </h1>
          <div style={{ marginTop: '20px', fontFamily: 'IBM Plex Mono', fontSize: '1rem', fontWeight: 'bold', color: 'var(--ink)' }}>
            BY {article.username ? article.username.toUpperCase() : 'SME STAFF'}
          </div>
        </header>

        {/* FEATURED IMAGE */}
        {article.image_url && (
          <div style={{ border: '5px solid var(--ink)', boxShadow: '15px 15px 0px var(--aged)', marginBottom: '50px', background: '#000' }}>
            <img src={article.image_url} style={{ width: '100%', display: 'block' }} alt={article.title} />
          </div>
        )}

        {/* ARTICLE CONTENT */}
        <div style={{ 
          fontFamily: 'Barlow', 
          fontSize: '1.3rem', 
          lineHeight: '1.8', 
          color: '#111',
          whiteSpace: 'pre-wrap' // This ensures line breaks from the form are preserved
        }}>
          {article.content}
        </div>

        {/* FOOTER */}
        <footer style={{ marginTop: '100px', padding: '40px 0', borderTop: '4px solid var(--ink)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', color: '#666' }}>
            © {new Date().getFullYear()} SHEFFIELD MUSIC EXPRESS
          </p>
        </footer>

      </article>
    </div>
  );
}
