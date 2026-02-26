import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Find the user in Neon
    const users = await sql`
      SELECT * FROM users 
      WHERE username = ${username} 
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = users[0];

    // Compare password with bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Return user data (but not password_hash)
    return NextResponse.json({ 
      success: true, 
      username: user.username,
      userId: user.id 
    });
  } catch (err: any) {
    console.error("AUTH ERROR:", err.message);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
