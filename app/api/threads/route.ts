import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { boardSlug, title, body, username } = await request.json();

    // 1. Get Board ID
    const boards = await sql`SELECT id FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
    if (!boards || boards.length === 0) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    const boardId = boards[0].id;

    // 2. Create User first (to ensure they exist)
    // We use a unique email to avoid "duplicate key" errors in Neon
    const uniqueEmail = `${username.toLowerCase().replace(/\s/g, '')}-${Date.now()}@guest.sme`;
    
    const users = await sql`
      INSERT INTO users (username, email, password_hash, avatar_initials)
      VALUES (${username}, ${uniqueEmail}, 'guest', ${username.slice(0, 2).toUpperCase()})
      RETURNING id
    `;
    const userId = users[0].id;

    // 3. Create Thread
    const threads = await sql`
      INSERT INTO threads (board_id, user_id, title)
      VALUES (${boardId}, ${userId}, ${title.trim()})
      RETURNING id
    `;
    const threadId = threads[0].id;

    // 4. Create Post
    await sql`
      INSERT INTO posts (thread_id, user_id, body)
      VALUES (${threadId}, ${userId}, ${body.trim()})
    `;

    return NextResponse.json({ threadId }, { status: 201 });
  } catch (err: any) {
    console.error('Neon DB Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
