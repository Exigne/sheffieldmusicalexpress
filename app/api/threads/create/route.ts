import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { boardId, username, title, body } = await request.json();

    // 1. Find User ID
    const users = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userId = users[0].id;

    // 2. Create Thread
    const newThread = await sql`
      INSERT INTO threads (board_id, user_id, title)
      VALUES (${boardId}, ${userId}, ${title})
      RETURNING id
    `;
    const threadId = newThread[0].id;

    // 3. Create Initial Post
    await sql`
      INSERT INTO posts (thread_id, user_id, body)
      VALUES (${threadId}, ${userId}, ${body})
    `;

    return NextResponse.json({ threadId }, { status: 201 });
  } catch (err: any) {
    console.error("THREAD CREATION ERROR:", err.message);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
