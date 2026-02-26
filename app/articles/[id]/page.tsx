export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function SingleArticlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  let article: any = null;

  try {
    // 1. TRY THE FULL JOIN FIRST
    const res = await sql`
      SELECT a.*, u.username 
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ${id}
      LIMIT 1
    `;
    article = res[0];

    // 2. FALLBACK: If the join failed or returned nothing, try a raw fetch
    if (!article) {
      const fallbackRes = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`;
      article = fallbackRes[0];
    }
  } catch (e) {
    console.error("Error fetching single article:", e);
  }

  // If even the fallback finds nothing, show 404
  if (!article) return notFound();

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--paper)', minHeight: '100vh' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 20px' }}>
        
        {/* HEADER SECTION */}
        <div style={{ borderBottom: '8px solid var(--ink)', paddingBottom: '30px', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '15px' }}>
            {article.category?.toUpperCase()} // {new Date(article.created_at).toLocaleDateString()}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5.5rem', lineHeight: '0.85', margin: 0 }}>
            {article.title}
          </h1>
          <div style={{ marginTop: '20px', fontFamily: 'IBM Plex Mono', fontSize: '1rem', fontWeight: 'bold' }}>
            WORDS BY {article.username ? article.username.toUpperCase() : 'SME STAFF'}
          </div>
        </div>

        {/* IMAGE */}
        {article.image_url && (
          <div style={{ border: '4px solid var(--ink)', boxShadow: '12px 12px 0px var(--aged)', marginBottom: '50px', background: '#000' }}>
            <img src={article.image_url} style={{ width: '100%', display: 'block' }} alt="" />
          </div>
        )}

        {/* CONTENT */}
        <div style={{ 
          fontFamily: 'Barlow', 
          fontSize: '1.25rem', 
          lineHeight: '1.8', 
          color: '#222',
          whiteSpace: 'pre-wrap' // This preserves your paragraph breaks!
        }}>
          {article.content}
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '4px solid var(--ink)' }}>
          <a href="/articles" style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: 'var(--rust)', textDecoration: 'none' }}>
            ← BACK TO ARTICLES
          </a>
        </div>

      </article>
    </div>
  );
}
