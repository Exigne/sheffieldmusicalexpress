export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function ArticlesPage() {
  let articles: any[] = [];
  
  try {
    // 👈 LEFT JOIN ensures articles show up even if the user/author is missing!
    articles = await sql`
      SELECT a.*, u.username 
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `;
  } catch (e) {
    console.error("DB Error:", e);
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--paper)', minHeight: '100vh' }}>
      <div className="content-area" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        
        <header style={{ borderBottom: '12px solid var(--ink)', paddingBottom: '30px', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '8rem', margin: 0, lineHeight: '0.8' }}>SME ARTICLES</h1>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <a key={article.id} href={`/articles/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '30px', background: 'white', border: '4px solid var(--ink)', boxShadow: '10px 10px 0px var(--aged)' }}>
                  <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: '0' }}>{article.title}</h2>
                  <p style={{ fontFamily: 'IBM Plex Mono', color: 'var(--rust)' }}>
                    BY {article.username ? article.username.toUpperCase() : 'SME STAFF'}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', border: '3px dashed var(--aged)' }}>
              <p>No articles found in the database table.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
