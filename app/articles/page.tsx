export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { sql } from '@/lib/db';

export default async function ArticlesPage() {
  let articles: any[] = [];
  let dbError: string | null = null;

  try {
    // 1. FIRST ATTEMPT: Try the full query with names
    articles = await sql`
      SELECT a.*, u.username 
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `;
  } catch (e: any) {
    console.warn("Join failed, falling back to simple fetch:", e.message);
    try {
      // 2. FALLBACK: If the join fails (missing columns), just get the raw articles
      articles = await sql`SELECT * FROM articles ORDER BY created_at DESC`;
    } catch (fallbackError: any) {
      dbError = fallbackError.message;
    }
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--paper)', minHeight: '100vh' }}>
      <div className="content-area" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* HEADER */}
        <header style={{ borderBottom: '12px solid var(--ink)', paddingBottom: '30px', marginBottom: '60px' }}>
          {/* NOTICE THE clamp() FONT SIZE HERE */}
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 15vw, 8rem)', margin: 0, lineHeight: '0.8', color: 'var(--ink)' }}>
            SME ARTICLES
          </h1>
          <p style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px' }}>
            LATEST NEWS · INTERVIEWS · GIG REVIEWS
          </p>
        </header>

        {/* ERROR DIAGNOSTIC */}
        {dbError && (
          <div style={{ background: 'var(--rust)', color: 'white', padding: '20px', border: '4px solid var(--ink)', marginBottom: '30px' }}>
            <p style={{ fontWeight: 'bold' }}>DATABASE ERROR: {dbError}</p>
          </div>
        )}

        {/* ARTICLES LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <a key={article.id} href={`/articles/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div 
                  className="mobile-article-card" /* ADDED THIS CLASS */
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: article.image_url ? '300px 1fr' : '1fr', 
                    gap: '30px',
                    padding: '30px',
                    background: 'white',
                    border: '4px solid var(--ink)',
                    boxShadow: '10px 10px 0px var(--aged)',
                  }}>
                  
                  {article.image_url && (
                    <div className="mobile-article-image" style={{ height: '220px', background: '#111', overflow: 'hidden', border: '2px solid var(--ink)' }}>
                      <img src={article.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '10px' }}>
                      {article.category?.toUpperCase() || 'NEWS'} // {new Date(article.created_at).toLocaleDateString()}
                    </div>
                    
                    {/* ADDED clamp() TO ARTICLE TITLE */}
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', margin: '0 0 15px 0', lineHeight: '0.9' }}>
                      {article.title}
                    </h2>
                    
                    <p style={{ fontFamily: 'Barlow', fontSize: '1.1rem', color: '#444', lineHeight: '1.5', margin: 0 }}>
                      {article.content ? article.content.substring(0, 180) : ''}...
                    </p>
                    
                    <div style={{ marginTop: '20px', fontFamily: 'IBM Plex Mono', fontSize: '0.85rem', fontWeight: 'bold', borderTop: '2px solid var(--aged)', paddingTop: '15px' }}>
                      WORDS BY {article.username ? article.username.toUpperCase() : 'SME STAFF'} →
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div style={{ padding: '80px 40px', textAlign: 'center', border: '4px dashed var(--aged)' }}>
              <p style={{ fontFamily: 'IBM Plex Mono' }}>No articles found. If you see them in Neon, ensure your Netlify DATABASE_URL is correct.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
