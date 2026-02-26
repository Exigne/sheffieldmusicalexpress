import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Grab all fields including the new marketplace data
    const { 
      title, 
      body, 
      boardId, 
      username: manualUsername,
      price,
      condition,
      imageUrl 
    } = await req.json();

    const cookieStore = await cookies();
    
    // Check for cookie FIRST, then fall back to the username sent in the form
    const username = cookieStore.get('username')?.value || manualUsername;

    if (!username) {
      return NextResponse.json({ error: 'Please log in to post.' }, { status: 401 });
    }

    // 2. Grab the User ID
    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // 3. Save the new thread WITH marketplace columns
    // If it's a normal board, these values will just be null/empty
    const threadRes = await sql`
      INSERT INTO threads (
        title, 
        board_id, 
        user_id, 
        price, 
        condition, 
        image_url
      ) 
      VALUES (
        ${title}, 
        ${boardId}, 
        ${userId}, 
        ${price || null}, 
        ${condition || null}, 
        ${imageUrl || null}
      ) 
      RETURNING id
    `;
    const threadId = threadRes[0].id;

    // 4. Save the initial description as the first post
    await sql`
      INSERT INTO posts (body, thread_id, user_id) 
      VALUES (${body}, ${threadId}, ${userId})
    `;

    return NextResponse.json({ id: threadId });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
