import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json();

    // 1. Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users 
      WHERE username = ${username} OR email = ${email} 
      LIMIT 1
    `;

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Username or email already taken" }, { status: 400 });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert the new user
    // Note: Ensure your table has these exact columns (username, email, password_hash)
    const result = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, hashedPassword)
      RETURNING id, username
    `;

    return NextResponse.json({ 
      success: true, 
      userId: result[0].id,
      username: result[0].username 
    });

  } catch (err: any) {
    console.error("REGISTRATION ERROR:", err.message);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
