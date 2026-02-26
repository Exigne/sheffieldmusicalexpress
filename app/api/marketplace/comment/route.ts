import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { itemId, username, comment } = await req.json();
    await sql`
      INSERT INTO marketplace_comments (item_id, username, comment)
      VALUES (${itemId}, ${username}, ${comment})
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
