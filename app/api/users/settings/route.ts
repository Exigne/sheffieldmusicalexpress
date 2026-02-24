import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET: Fetch the user's current initials and bio when the page loads
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ error: "No username provided" }, { status: 400 });

  try {
    const users = await sql`SELECT avatar_initials, bio FROM users WHERE username = ${username} LIMIT 1`;
    if (users.length > 0) {
      return NextResponse.json({ 
        initials: users[0].avatar_initials || "", 
        bio: users[0].bio || "" 
      });
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST: Save the new initials and bio to the database
export async function POST(request: Request) {
  try {
    const { username, initials, bio } = await request.json();
    if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Update the user's profile
    await sql`
      UPDATE users 
      SET avatar_initials = ${initials}, bio = ${bio} 
      WHERE username = ${username}
    `;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
