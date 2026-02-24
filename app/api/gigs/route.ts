// Change 'gig_guide' to 'gigs' in your SQL queries
export async function GET() {
  try {
    const rows = await sql`
      SELECT id, artist, venue, gig_date, description, ticket_url
      FROM gigs 
      WHERE gig_date >= CURRENT_DATE
      ORDER BY gig_date ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
