export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';
import ArticleComments from '@/components/ArticleComments';

// FIXED: Using the standard Next.js 15/16 params pattern
export default async function ArticlePopOut(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  
  let article = null;
  try {
    const result = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
    article = result[0];
  } catch (e) {
    console.error("Failed to fetch article", e);
  }

  if (!article) {
    return (
      <Modal>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display' }}>Article not found.</h2>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--rust)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {article.category}
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', margin: '0 0 10px 0', lineHeight: '1' }}>
          {article.title}
        </h1>
        <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
          By The Editor · {new Date(article.created_at).toLocaleDateString()}
        </div>
      </div>

      <div style={{ 
        fontFamily: 'Barlow, sans-serif', 
        fontSize: '1.15rem', 
        lineHeight: '1.7', 
        color: '#222', 
        whiteSpace: 'pre-wrap', 
        marginBottom: '40px' 
      }}>
        {article.content}
      </div>

      <hr style={{ border: '0', borderTop: '1px solid var(--aged)', marginBottom: '30px' }} />
      
      <ArticleComments articleId={article.id} />
    </Modal>
  );
}
