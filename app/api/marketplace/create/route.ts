import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, description, price, condition, imageUrl, username } = await req.json();

    // 1. Get the user ID from the username
    const userRes = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`;
    if (userRes.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const seller_id = userRes[0].id;

    // 2. Insert the item
    const result = await sql`
      INSERT INTO marketplace (title, description, price, condition, image_url, seller_id)
      VALUES (${title}, ${description}, ${price}, ${condition}, ${imageUrl}, ${seller_id})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
