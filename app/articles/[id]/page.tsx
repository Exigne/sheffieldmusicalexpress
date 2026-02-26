export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';

export default async function SingleArticlePage({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams?.id;

  let article: any = null;
  let dbError: string | null = null;

  try {
    // 💡 We use a safer query that handles the missing author gracefully
    const res = await sql`
      SELECT a.*, u.username 
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ${id}
      LIMIT 1
    `;
    article = res[0];
  } catch (e: any) {
    // If the JOIN fails (because of the missing column), we fall back to raw data
    console.error("Join failed, falling back...");
    try {
      const fallback = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`;
      article = fallback[0];
    } catch (err2: any) {
      dbError = err2.message;
    }
  }

  if (!article) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'Bebas Neue' }}>ARTICLE NOT FOUND</h1>
        <p>ID: {id}</p>
        <a href="/articles" style={{ color: 'var(--rust)', fontWeight: 'bold' }}>← BACK TO ARTICLES</a>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        
        <a href="/articles" style={{ fontFamily: 'IBM Plex Mono', color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← BACK TO FEED
        </a>

        <header style={{ borderBottom: '8px solid var(--ink)', paddingBottom: '30px', margin: '40px 0' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '10px' }}>
            {article.category?.toUpperCase() || 'NEWS'}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.9', margin: 0 }}>
            {article.title}
          </h1>
          <div style={{ marginTop: '20px', fontFamily: 'IBM Plex Mono', fontWeight: 'bold' }}>
            BY {article.username ? article.username.toUpperCase() : 'SME STAFF'}
          </div>
        </header>

        {article.image_url && (
          <div style={{ border: '4px solid var(--ink)', boxShadow: '12px 12px 0px var(--aged)', marginBottom: '40px' }}>
            <img src={article.image_url} style={{ width: '100%', display: 'block' }} alt="" />
          </div>
        )}

        <div style={{ 
          fontFamily: 'Barlow', 
          fontSize: '1.3rem', 
          lineHeight: '1.8', 
          whiteSpace: 'pre-wrap' 
        }}>
          {article.content}
        </div>

      </article>
    </div>
  );
}
