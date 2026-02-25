import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, body, boardId, username: manualUsername } = await req.json();
    const cookieStore = await cookies();
    
    // Check for cookie FIRST, then fall back to the username sent in the form
    const username = cookieStore.get('username')?.value || manualUsername;

    if (!username) {
      return NextResponse.json({ error: 'Please log in to post.' }, { status: 401 });
    }

    // Grab the ID from your Neon database
    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Save the new thread to Neon
    const threadRes = await sql`
      INSERT INTO threads (title, board_id, user_id) 
      VALUES (${title}, ${boardId}, ${userId}) 
      RETURNING id
    `;
    const threadId = threadRes[0].id;

    // Save the first post to Neon
    await sql`
      INSERT INTO posts (body, thread_id, user_id) 
      VALUES (${body}, ${threadId}, ${userId})
    `;

    return NextResponse.json({ id: threadId });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
