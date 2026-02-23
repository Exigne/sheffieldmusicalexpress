export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';
import ArticleComments from '@/components/ArticleComments';

export default async function ArticlePopOut({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let article = null;
  try {
    const result = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
    article = result[0];
  } catch (e) {
    console.error("Failed to fetch article");
  }

  if (!article) return null;

  return (
    <Modal>
      <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--rust)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {article.category}
        </div>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: '0 0 10px 0', lineHeight: '1.1' }}>
          {article.title}
        </h1>
        <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
          By The Editor · {new Date(article.created_at).toLocaleDateString()}
        </div>
      </div>

      <div style={{ fontFamily: 'Barlow', fontSize: '1.1rem', lineHeight: '1.8', color: '#222', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
        {article.content}
      </div>

      <ArticleComments articleId={article.id} />
    </Modal>
  );
}
