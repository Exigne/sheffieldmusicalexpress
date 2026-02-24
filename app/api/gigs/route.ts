import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, artist, venue, gig_date
      FROM gig_guide
      WHERE gig_date >= CURRENT_DATE
      ORDER BY gig_date ASC
      LIMIT 3
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}
