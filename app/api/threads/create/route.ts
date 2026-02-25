import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, body, boardId, username: bodyUsername } = await req.json();
    const cookieStore = await cookies();
    
    // Check cookie first, then fall back to the username sent in the body
    const username = cookieStore.get('username')?.value || bodyUsername;

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized: No username found.' }, { status: 401 });
    }

    // Find the user ID
    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: `User "${username}" not found.` }, { status: 404 });
    }

    // Insert Thread
    const threadRes = await sql`
      INSERT INTO threads (title, board_id, user_id) 
      VALUES (${title}, ${boardId}, ${userId}) 
      RETURNING id
    `;
    const threadId = threadRes[0].id;

    // Insert first post
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
