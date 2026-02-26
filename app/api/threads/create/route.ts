import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, body, boardId, boardSlug, username, price, condition, imageUrl } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    
    if (!userRes[0]) {
      return NextResponse.json({ error: `User not found: ${username}` }, { status: 404 });
    }

    const userId = userRes[0].id;

    if (boardSlug === 'gear-exchange') {
      const res = await sql`
        INSERT INTO gear_listings (title, description, price, condition, image_url, user_id, board_id)
        VALUES (${title}, ${body}, ${price}, ${condition}, ${imageUrl}, ${userId}, ${boardId})
        RETURNING id
      `;
      return NextResponse.json(
        { id: res[0].id, type: 'gear' },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const threadRes = await sql`
      INSERT INTO threads (title, board_id, user_id) 
      VALUES (${title}, ${boardId}, ${userId}) 
      RETURNING id
    `;
    await sql`
      INSERT INTO posts (body, thread_id, user_id) 
      VALUES (${body}, ${threadRes[0].id}, ${userId})
    `;
    
    return NextResponse.json(
      { id: threadRes[0].id, type: 'thread' },
      { headers: { 'Cache-Control': 'no-store' } }
    );

  } catch (err) {
    console.error('Thread create error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
