import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { boardSlug, title, body, username } = await request.json();

    // 1. Basic Validation
    if (!boardSlug || !title?.trim() || !body?.trim() || !username?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (title.length > 255) {
      return NextResponse.json({ error: 'Title is too long.' }, { status: 400 });
    }

    // Use a transaction to ensure database integrity
    // Note: If your lib/db 'sql' doesn't support .begin(), you can use 'BEGIN' and 'COMMIT' queries
    const result = await sql.begin(async (sql) => {
      
      // 2. Get board
      const [board] = await sql`SELECT id FROM boards WHERE slug = ${boardSlug} LIMIT 1`;
      if (!board) {
        throw new Error('Board not found');
      }

      // 3. Get or create user
      let userId: number;
      const [existingUser] = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const initials = username.slice(0, 2).toUpperCase();
        const guestEmail = `${username.toLowerCase().replace(/\s+/g, '')}-${Date.now()}@guest.sme`;
        
        const [newUser] = await sql`
          INSERT INTO users (username, email, password_hash, avatar_initials)
          VALUES (${username}, ${guestEmail}, ${'guest'}, ${initials})
          RETURNING id
        `;
        userId = newUser.id;
      }

      // 4. Create thread
      const [newThread] = await sql`
        INSERT INTO threads (board_id, user_id, title)
        VALUES (${board.id}, ${userId}, ${title.trim()})
        RETURNING id
      `;

      // 5. Create the first post (the OP)
      await sql`
        INSERT INTO posts (thread_id, user_id, body)
        VALUES (${newThread.id}, ${userId}, ${body.trim()})
      `;

      // 6. Update board thread count
      await sql`
        UPDATE boards 
        SET thread_count = thread_count + 1 
        WHERE id = ${board.id}
      `;

      return newThread.id;
    });

    return NextResponse.json({ threadId: result }, { status: 201 });

  } catch (err: any) {
    console.error('Error creating thread:', err);
    
    if (err.message === 'Board not found') {
      return NextResponse.json({ error: 'Board not found.' }, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Server error. Please try again.',
      details: process.env.NODE_VERSION === 'development' ? err.message : undefined 
    }, { status: 500 });
  }
}
