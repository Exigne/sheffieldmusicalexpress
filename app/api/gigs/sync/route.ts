import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // 1. Skiddle API configuration for Sheffield (5-mile radius, Live Music)
    // Note: We are using Skiddle's public test API key here for development.
    const apiKey = process.env.SKIDDLE_API_KEY || '008f1e60ad66af94dd01bc3b3d1787c8'; 
    const url = `https://www.skiddle.com/api/v1/events/search/?api_key=${apiKey}&latitude=53.3811&longitude=-1.4701&radius=5&eventcode=LIVE&limit=50`;

    // 2. Fetch data from Skiddle
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "No events found from Skiddle" }, { status: 404 });
    }

    let newGigsAdded = 0;

    // 3. Loop through the events and save them to your Neon database
    for (const event of data.results) {
      const externalId = `skiddle_${event.id}`;
      const title = event.eventname;
      const venue = event.venue?.name || "TBA";
      const eventDate = event.date; // YYYY-MM-DD
      const description = event.description || "No description provided.";
      const ticketLink = event.link;
      const imageUrl = event.largeimageurl || event.imageurl || "";
      const price = event.entryprice || "See link for price";

      // The 'ON CONFLICT DO NOTHING' tells Postgres to ignore the gig if external_id already exists
      try {
        await sql`
          INSERT INTO gig_guide (title, venue, event_date, description, ticket_link, image_url, price, posted_by, external_id)
          VALUES (${title}, ${venue}, ${eventDate}, ${description}, ${ticketLink}, ${imageUrl}, ${price}, 'API_SKIDDLE', ${externalId})
          ON CONFLICT (external_id) DO NOTHING
        `;
        newGigsAdded++; // We can't strictly count only new ones this easily without checking rows affected, but this is fine for the loop
      } catch (dbErr) {
        console.error("Failed to insert gig:", title, dbErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Checked ${data.results.length} events. Database sync complete.` 
    });

  } catch (err) {
    console.error("Sync Error:", err);
    return NextResponse.json({ error: "Failed to run gig sync" }, { status: 500 });
  }
}
