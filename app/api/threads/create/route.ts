import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, body, boardId } = await req.json();
    const cookieStore = await cookies();
    const username = cookieStore.get('username')?.value;

    if (!username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Get User ID
    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    // 2. Insert Thread
    const threadRes = await sql`
      INSERT INTO threads (title, board_id, user_id) 
      VALUES (${title}, ${boardId}, ${userId}) 
      RETURNING id
    `;
    const threadId = threadRes[0].id;

    // 3. Insert the first post (the body of the thread)
    await sql`
      INSERT INTO posts (body, thread_id, user_id) 
      VALUES (${body}, ${threadId}, ${userId})
    `;

    return NextResponse.json({ id: threadId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
