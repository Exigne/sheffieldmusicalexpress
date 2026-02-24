import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. GET: Fetch the conversation history between two users
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user1 = searchParams.get('user1');
  const user2 = searchParams.get('user2');

  if (!user1 || !user2) {
    return NextResponse.json({ error: "Missing usernames" }, { status: 400 });
  }

  try {
    // Grab all messages where User 1 sent to User 2, OR User 2 sent to User 1
    const messages = await sql`
      SELECT * FROM direct_messages 
      WHERE (sender_username = ${user1} AND receiver_username = ${user2})
         OR (sender_username = ${user2} AND receiver_username = ${user1})
      ORDER BY created_at ASC
    `;
    
    // Optional: Mark messages as read if user1 is fetching them and user2 sent them
    // (We can expand on this later for unread notification badges!)
    
    return NextResponse.json(messages ?? []);
  } catch (err) {
    console.error("Fetch Messages Error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 2. POST: Save a new private message to the database
export async function POST(request: Request) {
  try {
    const { sender, receiver, content } = await request.json();
    
    if (!sender || !receiver || !content.trim()) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await sql`
      INSERT INTO direct_messages (sender_username, receiver_username, content)
      VALUES (${sender}, ${receiver}, ${content})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Send Message Error:", err.message);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
