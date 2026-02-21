import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { threadId, body, username } = await request.json();

    // 1. Basic Validation
    if (!threadId || !body?.trim() || !username?.trim()) {
      return NextResponse.json({ error: 'Message and username are required.' }, { status: 400 });
    }

    // 2. Get or Create Guest User
    // We reuse the logic from thread creation to keep it consistent
    let userId: number;
    const existingUsers = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      const guestEmail = `${username.toLowerCase().replace(/\s+/g, '')}-${Date.now()}@guest.sme`;
      const newUsers = await sql`
        INSERT INTO users (username, email, password_hash, avatar_initials)
        VALUES (${username}, ${guestEmail}, 'guest', ${username.slice(0, 2).toUpperCase()})
        RETURNING id
      `;
      userId = newUsers[0].id;
    }

    // 3. Insert the Post
    await sql`
      INSERT INTO posts (thread_id, user_id, body)
      VALUES (${threadId}, ${userId}, ${body.trim()})
    `;

    // 4. Update the Thread Stats
    // We increment the reply_count and update the last_reply_at timestamp
    await sql`
      UPDATE threads 
      SET reply_count = reply_count + 1, 
          last_reply_at = NOW() 
      WHERE id = ${threadId}
    `;

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (err: any) {
    console.error('Reply Error:', err.message);
    return NextResponse.json({ error: 'Failed to post reply.' }, { status: 500 });
  }
}
