import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });

  try {
    const beats = await sql`SELECT * FROM saved_beats WHERE username = ${username} ORDER BY created_at DESC`;
    return NextResponse.json(beats);
  } catch (e) {
    console.error("Fetch beats error:", e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, name, bpm, tracks } = await request.json();
    
    if (!username || !name || !tracks) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Save the beat directly into the database
    await sql`
      INSERT INTO saved_beats (username, name, bpm, tracks)
      VALUES (${username}, ${name}, ${bpm}, ${JSON.stringify(tracks)}::jsonb)
    `;
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Save beat error:", e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
