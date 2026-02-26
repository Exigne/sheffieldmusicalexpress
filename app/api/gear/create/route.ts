import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, description, price, condition, imageUrl, username, boardId } = await req.json();

    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    const userId = userRes[0]?.id;

    if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Save to the NEW gear_listings table
    const result = await sql`
      INSERT INTO gear_listings (title, description, price, condition, image_url, user_id, board_id)
      VALUES (${title}, ${description}, ${price}, ${condition}, ${imageUrl}, ${userId}, ${boardId})
      RETURNING id
    `;

    return NextResponse.json({ id: result[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
