import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevents the browser from caching old data

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, artist, venue, gig_date, description, ticket_url
      FROM gig_guide
      WHERE gig_date >= CURRENT_DATE
      ORDER BY gig_date ASC
      LIMIT 10
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
