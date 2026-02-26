export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { sql } from '@/lib/db';
import Link from 'next/link';
// We will create a specialized Article form in the next step
import CreateArticleForm from '@/components/CreateArticleForm';

export default async function ArticlesPage() {
  // 1. Fetch all articles from the new table
  let articles: any[] = [];
  try {
    articles = await sql`
      SELECT a.*, u.username 
      FROM articles a
      JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `;
  } catch (e) {
    console.error("Database Error:", e);
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--paper)', minHeight: '100vh' }}>
      <div className="content-area" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* 📰 SECTION HEADER */}
        <header style={{ borderBottom: '12px solid var(--ink)', paddingBottom: '30px', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '8rem', margin: 0, lineHeight: '0.8' }}>SME ARTICLES</h1>
          <p style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px' }}>
            NEWS · INTERVIEWS · GIG REVIEWS · SCENE REPORTS
          </p>
        </header>

        {/* 📑 ARTICLE LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: article.image_url ? '250px 1fr' : '1fr', 
                  gap: '30px',
                  padding: '30px',
                  background: 'white',
                  border: '4px solid var(--ink)',
                  boxShadow: '10px 10px 0px var(--aged)',
                  transition: 'transform 0.2s ease'
                }}>
                  {article.image_url && (
                    <div style={{ height: '200px', background: '#111', overflow: 'hidden' }}>
                      <img src={article.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    </div>
                  )}
                  <div>
                    <div style={{ 
                      fontFamily: 'IBM Plex Mono', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      color: 'var(--rust)', 
                      textTransform: 'uppercase',
                      marginBottom: '10px'
                    }}>
                      {article.category} // {new Date(article.created_at).toLocaleDateString()}
                    </div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: '0 0 15px 0', lineHeight: '0.9' }}>
                      {article.title}
                    </h2>
                    <p style={{ fontFamily: 'Barlow', fontSize: '1.1rem', color: '#444', lineHeight: '1.5' }}>
                      {article.content.slice(0, 180)}...
                    </p>
                    <div style={{ marginTop: '20px', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      READ FULL ARTICLE →
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', border: '3px dashed var(--aged)' }}>
              <p style={{ fontFamily: 'IBM Plex Mono' }}>No articles published yet.</p>
            </div>
          )}
        </div>

        {/* ✍️ EDITOR SECTION (Hidden unless someone wants to post) */}
        <div style={{ marginTop: '100px', padding: '60px', background: 'white', border: '6px solid var(--ink)', boxShadow: '20px 20px 0px var(--aged)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', marginBottom: '30px' }}>POST NEW ARTICLE</h2>
          <CreateArticleForm />
        </div>

      </div>
    </div>
  );
}
