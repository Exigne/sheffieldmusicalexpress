import { sql } from '@/lib/db';
import Link from 'next/link';
import ArticleComments from '@/components/ArticleComments';

export const dynamic = 'force-dynamic';

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  let article = null;
  try {
    const result = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
    article = result[0];
  } catch (e) {
    console.error('Failed to fetch article');
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'Playfair Display' }}>Article not found.</h2>
        <Link href="/" style={{ color: 'var(--rust)', fontWeight: 'bold' }}>← Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '70vh' }}>

      <nav className="breadcrumb" style={{ marginBottom: '40px' }}>
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{article.category}</span>
      </nav>

      <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--rust)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {article.category}
        </div>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', margin: '0 0 10px 0', lineHeight: '1.1' }}>
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

      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', color: 'var(--ink)', borderBottom: '2px solid var(--rust)', textDecoration: 'none' }}>
          ← Back to Sheffield Music Express
        </Link>
      </div>
    </div>
  );
}
