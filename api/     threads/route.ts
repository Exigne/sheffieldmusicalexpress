import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { boardSlug, title, body, username } = await request.json();

    // Validate
    if (!boardSlug || !title?.trim() || !body?.trim() || !username?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (title.length > 255) {
      return NextResponse.json({ error: 'Title is too long.' }, { status: 400 });
    }

    // Get board
    const boards = await sql`SELECT id FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
    if (boards.length === 0) {
      return NextResponse.json({ error: 'Board not found.' }, { status: 404 });
    }
    const boardId = boards[0].id;

    // Get or create a guest user by username
    let userId: number;
    const existingUsers = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      // Create a guest user (no email/password for now)
      const newUsers = await sql`
        INSERT INTO users (username, email, password_hash, avatar_initials)
        VALUES (
          ${username},
          ${`${username.toLowerCase()}@guest.sme`},
          ${'guest'},
          ${username.slice(0, 2).toUpperCase()}
        )
        RETURNING id
      `;
      userId = newUsers[0].id;
    }

    // Create thread
    const threads = await sql`
      INSERT INTO threads (board_id, user_id, title)
      VALUES (${boardId}, ${userId}, ${title.trim()})
      RETURNING id
    `;
    const threadId = threads[0].id;

    // Create the first post (the thread body)
    await sql`
      INSERT INTO posts (thread_id, user_id, body)
      VALUES (${threadId}, ${userId}, ${body.trim()})
    `;

    // Update board thread count
    await sql`
      UPDATE boards SET thread_count = thread_count + 1 WHERE id = ${boardId}
    `;

    return NextResponse.json({ threadId }, { status: 201 });

  } catch (err) {
    console.error('Error creating thread:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
