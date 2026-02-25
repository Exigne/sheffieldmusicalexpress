export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import ArticleComments from '@/components/ArticleComments';

export default async function FullArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const result = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
  const article = result[0];

  if (!article) {
    return (
      <div className="page-wrapper">
        <div className="content-area" style={{ textAlign: 'center', padding: '100px' }}>
          <h2>Article not found.</h2>
          <Link href="/">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <nav style={{ marginBottom: '20px', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }}>
          <Link href="/" style={{ color: 'var(--rust)', textDecoration: 'none' }}>HOME</Link>
          <span style={{ margin: '0 10px', color: '#ccc' }}>/</span>
          <span style={{ color: '#666', textTransform: 'uppercase' }}>{article.category}</span>
        </nav>

        <article>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', lineHeight: '1', marginBottom: '10px' }}>
            {article.title}
          </h1>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', color: '#666', marginBottom: '30px' }}>
            Published {new Date(article.created_at).toLocaleDateString()}
          </p>
          
          <div style={{ 
             fontSize: '1.2rem', 
             lineHeight: '1.8', 
             whiteSpace: 'pre-wrap', 
             color: '#222',
             marginBottom: '60px'
          }}>
            {article.content}
          </div>
        </article>

        <div style={{ borderTop: '4px solid var(--ink)', paddingTop: '40px' }}>
           <ArticleComments articleId={article.id} />
        </div>
      </div>
    </div>
  );
}
