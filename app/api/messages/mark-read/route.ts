import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { currentUser, chattingWith } = await req.json();

    // This tells the database: "I am looking at the screen, clear the notifications for this person."
    await sql`
      UPDATE direct_messages 
      SET is_read = TRUE 
      WHERE receiver_username = ${currentUser} 
      AND sender_username = ${chattingWith} 
      AND is_read = FALSE
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark Read Error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
