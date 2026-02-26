export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the specific article and join with the author's name
  const articleRes = await sql`
    SELECT a.*, u.username 
    FROM articles a
    JOIN users u ON a.author_id = u.id
    WHERE a.id = ${id} 
    LIMIT 1
  `;
  const article = articleRes[0];

  if (!article) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '100px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem' }}>ARTICLE NOT FOUND</h1>
        <Link href="/articles" style={{ color: 'var(--rust)', fontWeight: 'bold' }}>RETURN TO ARTICLES</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'white', minHeight: '100vh' }}>
      
      {/* 🖼️ HERO IMAGE SECTION */}
      {article.image_url && (
        <div style={{ width: '100%', height: '60vh', background: '#000', overflow: 'hidden', borderBottom: '10px solid var(--ink)' }}>
          <img 
            src={article.image_url} 
            alt={article.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
          />
        </div>
      )}

      <div className="content-area" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* 🏷️ CATEGORY & DATE */}
        <div style={{ 
          fontFamily: 'IBM Plex Mono', 
          fontWeight: 'bold', 
          color: 'var(--rust)', 
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '20px'
        }}>
          {article.category} // {new Date(article.created_at).toLocaleDateString()}
        </div>

        {/* 📰 HEADLINE */}
        <h1 style={{ 
          fontFamily: 'Bebas Neue', 
          fontSize: 'clamp(4rem, 10vw, 7rem)', 
          lineHeight: '0.85', 
          margin: '0 0 40px 0',
          color: 'var(--ink)'
        }}>
          {article.title}
        </h1>

        {/* ✍️ BYLINE */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          marginBottom: '60px', 
          paddingBottom: '20px', 
          borderBottom: '2px solid #eee' 
        }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue' }}>
            {article.username.slice(0,2).toUpperCase()}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem' }}>
            WORDS BY <strong>{article.username.toUpperCase()}</strong>
          </div>
        </div>

        {/* 📄 BODY CONTENT */}
        <div style={{ 
          fontFamily: 'Barlow', 
          fontSize: '1.3rem', 
          lineHeight: '1.7', 
          color: '#111',
          whiteSpace: 'pre-wrap'
        }}>
          {article.content}
        </div>

        {/* 🔙 NAVIGATION FOOTER */}
        <div style={{ marginTop: '100px', paddingTop: '40px', borderTop: '5px solid var(--ink)' }}>
           <Link href="/articles" style={{ 
             fontFamily: 'Bebas Neue', 
             fontSize: '1.5rem', 
             textDecoration: 'none', 
             color: 'var(--ink)',
             border: '3px solid var(--ink)',
             padding: '10px 25px',
             display: 'inline-block'
           }}>
             ← BACK TO ALL ARTICLES
           </Link>
        </div>
      </div>
    </div>
  );
}
