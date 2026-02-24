import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. GET: Fetch the user's current settings when the page loads
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ error: "No username provided" }, { status: 400 });

  try {
    const users = await sql`SELECT email FROM users WHERE username = ${username} LIMIT 1`;
    if (users.length > 0) {
      return NextResponse.json({ email: users[0].email });
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (err) {
    console.error("Settings GET Error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 2. POST: Save the new email or password to the database
export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Update Email
    if (email) {
      await sql`UPDATE users SET email = ${email} WHERE username = ${username}`;
    }

    // Update Password
    if (password) {
      await sql`UPDATE users SET password_hash = ${password} WHERE username = ${username}`;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Settings POST Error:", err.message);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
