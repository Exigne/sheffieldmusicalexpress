import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. GET: Fetch all available gear, newest first
export async function GET() {
  try {
    const items = await sql`
      SELECT * FROM marketplace_items 
      WHERE status = 'available' 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(items ?? []);
  } catch (err) {
    console.error("Marketplace Fetch Error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 2. POST: Add a new piece of gear to the exchange (Now with Images!)
export async function POST(request: Request) {
  try {
    const { seller, title, description, price, condition, category, image_url } = await request.json();
    
    if (!seller || !title || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO marketplace_items (seller_username, title, description, price, condition, category, image_url)
      VALUES (${seller}, ${title}, ${description}, ${price}, ${condition}, ${category}, ${image_url || null})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Marketplace Post Error:", err.message);
    return NextResponse.json({ error: "Failed to post item" }, { status: 500 });
  }
}
