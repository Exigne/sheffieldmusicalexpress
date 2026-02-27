import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // 1. Get your real API key
    const apiKey = process.env.SKIDDLE_API_KEY || '84f9ff622ae0c4b3ffb7397bb3d83b16';
    
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing from environment variables." }, { status: 500 });
    }

    // 2. ONLY fetch Live Music (eventcode=LIVE) within 10 miles of Sheffield
    const url = `https://www.skiddle.com/api/v1/events/search/?api_key=${apiKey}&latitude=53.3811&longitude=-1.4701&radius=10&eventcode=LIVE&limit=50`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error !== 0) {
      return NextResponse.json({ error: "Skiddle API Error", details: data.errormessage }, { status: 400 });
    }

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ message: "No upcoming gigs found in Sheffield at this moment." });
    }

    let newGigsAdded = 0;

    // 3. Save the actual gigs to your Neon database
    for (const event of data.results) {
      const externalId = `skiddle_${event.id}`;
      const title = event.eventname;
      const venue = event.venue?.name || "TBA";
      const eventDate = event.date; 
      const description = event.description || "No description provided.";
      const ticketLink = event.link;
      const imageUrl = event.largeimageurl || event.imageurl || "";
      const price = event.entryprice || "See ticket link";

      try {
        // We use RETURNING id so we can count exactly how many NEW gigs were added vs skipped
        const result = await sql`
          INSERT INTO gig_guide (title, venue, event_date, description, ticket_link, image_url, price, posted_by, external_id)
          VALUES (${title}, ${venue}, ${eventDate}, ${description}, ${ticketLink}, ${imageUrl}, ${price}, 'API_SKIDDLE', ${externalId})
          ON CONFLICT (external_id) DO NOTHING
          RETURNING id;
        `;
        
        if (result.length > 0) {
          newGigsAdded++;
        }
      } catch (dbErr) {
        console.error("Failed to insert gig:", title);
      }
    }

    // 4. Return a clean, simple message!
    return NextResponse.json({ 
      success: true, 
      message: `Checked ${data.results.length} upcoming Sheffield gigs. Added ${newGigsAdded} new gigs to your database.`
    });

  } catch (err) {
    console.error("Sync Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
