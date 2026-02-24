import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ count: 0 });

  try {
    const result = await sql`
      SELECT COUNT(*) as unread_count 
      FROM direct_messages 
      WHERE receiver_username = ${username} AND is_read = FALSE
    `;
    
    return NextResponse.json({ count: Number(result[0].unread_count) });
  } catch (err) {
    return NextResponse.json({ count: 0 });
  }
}
