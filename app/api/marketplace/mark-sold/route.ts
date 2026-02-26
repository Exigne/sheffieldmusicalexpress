import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { itemId, username } = await req.json();

    // Verify the person marking it as sold is actually the owner
    const item = await sql`
      SELECT m.id FROM marketplace m
      JOIN users u ON m.seller_id = u.id
      WHERE m.id = ${itemId} AND u.username = ${username}
    `;

    if (item.length === 0) {
      return NextResponse.json({ error: "Unauthorized or item not found" }, { status: 403 });
    }

    // Update the status
    await sql`UPDATE marketplace SET is_sold = TRUE WHERE id = ${itemId}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
