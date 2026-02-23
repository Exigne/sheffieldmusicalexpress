import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Grab the username from the URL
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ role: 'member' });

  try {
    // 2. Look up the user's role in the database
    const users = await sql`SELECT role FROM users WHERE username = ${username} LIMIT 1`;
    
    if (users.length > 0) {
      return NextResponse.json({ role: users[0].role });
    }
    
    return NextResponse.json({ role: 'member' });
  } catch (err) {
    console.error("Role Check Error", err);
    return NextResponse.json({ role: 'member' });
  }
}
