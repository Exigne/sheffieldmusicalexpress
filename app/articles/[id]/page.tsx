export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function SingleArticlePage({ params }: { params: any }) {
  // 💡 SUPPORT BOTH NEXT.js 14 and 15
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams?.id;

  let article: any = null;
  let errorMsg: string | null = null;

  try {
    // Attempt fetch
    const res = await sql`
      SELECT a.*, u.username 
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ${id}
      LIMIT 1
    `;
    article = res[0];
  } catch (e: any) {
    errorMsg = e.message;
  }

  // If no article is found, show a custom error instead of a generic 404
  if (!article) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>
        <h1 style={{ fontSize: '4rem', fontFamily: 'Bebas Neue' }}>ARTICLE NOT FOUND</h1>
        <p>Attempted to load ID: <strong>{id}</strong></p>
        {errorMsg && <p style={{ color: 'var(--rust)' }}>Database Error: {errorMsg}</p>}
        <div style={{ marginTop: '20px' }}>
          <a href="/articles" style={{ color: 'var(--rust)', fontWeight: 'bold' }}>← RETURN TO ARTICLES</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--paper)', minHeight: '100vh' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <a href="/articles" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}>
            ← BACK TO ALL ARTICLES
          </a>
        </div>

        <header style={{ borderBottom: '8px solid var(--ink)', paddingBottom: '30px', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '15px' }}>
            {article.category?.toUpperCase() || 'NEWS'} // {new Date(article.created_at).toLocaleDateString()}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', lineHeight: '0.9', margin: 0, color: 'var(--ink)' }}>
            {article.title}
          </h1>
          <div style={{ marginTop: '20px', fontFamily: 'IBM Plex Mono', fontSize: '1rem', fontWeight: 'bold' }}>
            BY {article.username ? article.username.toUpperCase() : 'SME STAFF'}
          </div>
        </header>

        {article.image_url && (
          <div style={{ border: '5px solid var(--ink)', boxShadow: '15px 15px 0px var(--aged)', marginBottom: '50px', background: '#000' }}>
            <img src={article.image_url} style={{ width: '100%', display: 'block' }} alt="" />
          </div>
        )}

        <div style={{ 
          fontFamily: 'Barlow', 
          fontSize: '1.3rem', 
          lineHeight: '1.8', 
          color: '#111',
          whiteSpace: 'pre-wrap' 
        }}>
          {article.content}
        </div>

        <footer style={{ marginTop: '100px', padding: '40px 0', borderTop: '4px solid var(--ink)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', color: '#666' }}>
            © {new Date().getFullYear()} SHEFFIELD MUSIC EXPRESS
          </p>
        </footer>
      </article>
    </div>
  );
}
