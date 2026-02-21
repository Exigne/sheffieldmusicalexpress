import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    console.log("Attempting to register user:", username);

    // 1. Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Insert into Neon
    // We generate avatar initials from the first two letters of the username
    const initials = username.slice(0, 2).toUpperCase();

    const result = await sql`
      INSERT INTO users (username, email, password_hash, avatar_initials)
      VALUES (${username}, ${email}, ${password}, ${initials})
      RETURNING id
    `;

    console.log("User created successfully with ID:", result[0].id);

    return NextResponse.json({ 
      success: true, 
      userId: result[0].id 
    }, { status: 201 });

  } catch (err: any) {
    console.error("NEON DATABASE ERROR:", err.message);
    
    // Check for duplicate username/email error
    if (err.message.includes('unique constraint')) {
      return NextResponse.json({ error: "Username or Email already taken" }, { status: 409 });
    }

    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
