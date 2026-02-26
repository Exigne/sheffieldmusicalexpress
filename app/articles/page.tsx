export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function ArticlesPage() {
  let articles: any[] = [];
  let debugInfo = "";

  try {
    // 1. Get the raw count first
    const countRes = await sql`SELECT COUNT(*) as total FROM articles`;
    const totalCount = countRes[0]?.total || 0;

    // 2. Fetch raw articles (No Joins!)
    articles = await sql`SELECT * FROM articles ORDER BY created_at DESC`;
    
    debugInfo = `Database connected. Found ${totalCount} articles in table.`;
  } catch (e: any) {
    debugInfo = `CONNECTION ERROR: ${e.message}`;
  }

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'IBM Plex Mono' }}>
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem' }}>DEBUG HUB</h1>
      
      <div style={{ background: 'var(--ink)', color: 'white', padding: '20px', marginBottom: '40px', border: '4px solid var(--rust)' }}>
        <p style={{ fontWeight: 'bold', margin: 0 }}>STATUS: {debugInfo}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {articles.length > 0 ? (
          articles.map((a) => (
            <div key={a.id} style={{ border: '3px solid var(--ink)', padding: '20px' }}>
              <h2 style={{ margin: 0 }}>{a.title}</h2>
              <p>ID: {a.id} | Category: {a.category}</p>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', border: '2px dashed #ccc', textAlign: 'center' }}>
            <p>The query returned ZERO articles from the current DATABASE_URL.</p>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Double-check your Netlify Environment Variables.</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <Link href="/" style={{ color: 'var(--rust)' }}>← Back to Dashboard</Link>
      </div>
    </div>
  );
}
