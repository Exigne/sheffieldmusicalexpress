import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { boardSlug, title, body, username } = await request.json();

    // 1. Validate
    if (!boardSlug || !title?.trim() || !body?.trim() || !username?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // 2. Get Board ID
    const boards = await sql`SELECT id FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
    if (boards.length === 0) {
      return NextResponse.json({ error: 'Board not found.' }, { status: 404 });
    }
    const boardId = boards[0].id;

    // 3. Handle User (Get or Create)
    let userId: number;
    const existingUsers = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      // Create guest user - Use a more unique email to avoid "Duplicate Key" errors
      const guestEmail = `${username.toLowerCase().replace(/\s+/g, '')}-${Date.now()}@guest.sme`;
      
      const newUsers = await sql`
        INSERT INTO users (username, email, password_hash, avatar_initials)
        VALUES (
          ${username},
          ${guestEmail},
          'guest_pass',
          ${username.slice(0, 2).toUpperCase()}
        )
        RETURNING id
      `;
      userId = newUsers[0].id;
    }

    // 4. Create Thread
    const newThreads = await sql`
      INSERT INTO threads (board_id, user_id, title)
      VALUES (${boardId}, ${userId}, ${title.trim()})
      RETURNING id
    `;
    const threadId = newThreads[0].id;

    // 5. Create Initial Post
    await sql`
      INSERT INTO posts (thread_id, user_id, body)
      VALUES (${threadId}, ${userId}, ${body.trim()})
    `;

    // 6. Update Stats
    await sql`UPDATE boards SET thread_count = thread_count + 1 WHERE id = ${boardId}`;

    return NextResponse.json({ threadId }, { status: 201 });

  } catch (err: any) {
    console.error('DATABASE ERROR:', err);
    // This will help you see the EXACT error in Netlify Logs
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
