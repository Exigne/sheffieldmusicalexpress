import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('username');

  if (!user) return NextResponse.json({ error: "Missing username" }, { status: 400 });

  try {
    // This clever query finds everyone you've either sent a message to OR received one from
    const contacts = await sql`
      SELECT DISTINCT 
        CASE 
          WHEN sender_username = ${user} THEN receiver_username 
          ELSE sender_username 
        END AS contact_name
      FROM direct_messages
      WHERE sender_username = ${user} OR receiver_username = ${user}
    `;
    
    // Extract just the array of names
    const contactNames = contacts.map(c => c.contact_name);
    return NextResponse.json(contactNames);
  } catch (err) {
    console.error("Fetch Contacts Error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
