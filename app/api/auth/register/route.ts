import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json();

    console.log("Registration attempt for:", username);

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
    // FIX: Added the missing ${} around hashedPassword
    const result = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hashedPassword})
      RETURNING id, username
    `;

    console.log("User created successfully:", result[0].username);

    return NextResponse.json({ 
      success: true, 
      userId: result[0].id,
      username: result[0].username 
    });

  } catch (err: any) {
    // This logs the REAL error to your Netlify/Terminal logs
    console.error("FULL DATABASE ERROR:", err);
    
    // Return the specific error to the frontend so you can see it
    return NextResponse.json({ 
      error: `Database Error: ${err.message || 'Unknown connection issue'}` 
    }, { status: 500 });
  }
}
