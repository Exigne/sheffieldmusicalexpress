import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, content, category, imageUrl, username } = await req.json();

    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const result = await sql`
      INSERT INTO articles (title, content, category, image_url, author_id)
      VALUES (${title}, ${content}, ${category}, ${imageUrl}, ${userId})
      RETURNING id
    `;

    return NextResponse.json({ id: result[0].id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
