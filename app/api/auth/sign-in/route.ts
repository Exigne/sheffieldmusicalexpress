import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Find the user in Neon
    const users = await sql`
      SELECT * FROM users 
      WHERE username = ${username} 
      AND password_hash = ${password} 
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({ success: true, username: users[0].username });
  } catch (err: any) {
    console.error("AUTH ERROR:", err.message);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
