import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { 
      title, 
      body, 
      boardId, 
      boardSlug, 
      username: manualUsername, 
      price, 
      condition, 
      imageUrl 
    } = await req.json();

    const cookieStore = await cookies();
    const username = cookieStore.get('username')?.value || manualUsername;

    if (!username) {
      return NextResponse.json({ error: 'Please log in to post.' }, { status: 401 });
    }

    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // 🎸 LOGIC: If it's the gear exchange, save to the specialized table
    if (boardSlug === 'gear-exchange') {
      const result = await sql`
        INSERT INTO gear_listings (
          title, 
          description, 
          price, 
          condition, 
          image_url, 
          user_id, 
          board_id
        ) 
        VALUES (${title}, ${body}, ${price}, ${condition}, ${imageUrl}, ${userId}, ${boardId})
        RETURNING id
      `;
      return NextResponse.json({ id: result[0].id, type: 'gear' });
    } 

    // 📝 LOGIC: Otherwise, save to the standard threads and posts tables
    const threadRes = await sql`
      INSERT INTO threads (title, board_id, user_id) 
      VALUES (${title}, ${boardId}, ${userId}) 
      RETURNING id
    `;
    const threadId = threadRes[0].id;

    await sql`
      INSERT INTO posts (body, thread_id, user_id) 
      VALUES (${body}, ${threadId}, ${userId})
    `;

    return NextResponse.json({ id: threadId, type: 'thread' });

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
