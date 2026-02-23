import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { threadId, username, body } = await request.json();

    // 1. Find the User ID
    const users = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userId = users[0].id;

    // 2. Insert the new reply
    await sql`
      INSERT INTO posts (thread_id, user_id, body)
      VALUES (${threadId}, ${userId}, ${body})
    `;

    // 3. Update the thread's total reply count
    await sql`
      UPDATE threads 
      SET reply_count = reply_count + 1 
      WHERE id = ${threadId}
    `;

    // 4. Banish the cache monster! Force the thread page to update instantly.
    revalidatePath(`/threads/${threadId}`);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("REPLY CREATION ERROR:", err.message);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}
