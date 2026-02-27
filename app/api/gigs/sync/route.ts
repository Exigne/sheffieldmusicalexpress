import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // We are using the public test key, but looking for any event with the keyword "Sheffield"
    const apiKey = process.env.SKIDDLE_API_KEY || '84f9ff622ae0c4b3ffb7397bb3d83b16'; 
    const url = `https://www.skiddle.com/api/v1/events/search/?api_key=${apiKey}&keyword=Sheffield&limit=10`;

    // 1. Fetch data from Skiddle
    const res = await fetch(url);
    const data = await res.json();

    // 2. DIAGNOSTIC CHECK: Let's see exactly what Skiddle returned
    if (data.error !== 0) {
      return NextResponse.json({ 
        diagnostic: "Skiddle API Error", 
        skiddle_message: data.errormessage || "Unknown API Error",
        raw_data: data 
      });
    }

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ 
        diagnostic: "API Connected, but 0 events found", 
        skiddle_message: "The API key worked, but Skiddle has no test events for Sheffield right now.",
        url_used: url
      });
    }

    let newGigsAdded = 0;

    // 3. If it actually works, save the REAL data to the database
    for (const event of data.results) {
      const externalId = `skiddle_${event.id}`;
      const title = event.eventname;
      const venue = event.venue?.name || "TBA";
      const eventDate = event.date; 
      const description = event.description || "No description provided.";
      const ticketLink = event.link;
      const imageUrl = event.largeimageurl || event.imageurl || "";
      const price = event.entryprice || "See link for price";

      try {
        await sql`
          INSERT INTO gig_guide (title, venue, event_date, description, ticket_link, image_url, price, posted_by, external_id)
          VALUES (${title}, ${venue}, ${eventDate}, ${description}, ${ticketLink}, ${imageUrl}, ${price}, 'API_SKIDDLE', ${externalId})
          ON CONFLICT (external_id) DO NOTHING
        `;
        newGigsAdded++;
      } catch (dbErr) {
        console.error("Failed to insert gig:", title);
      }
    }

    // 4. Return success with the ACTUAL data so you can see it
    return NextResponse.json({ 
      success: true, 
      source: "REAL SKIDDLE API DATA",
      events_found: data.results.length,
      first_event_name: data.results[0].eventname,
      raw_skiddle_data: data.results
    });

  } catch (err) {
    return NextResponse.json({ error: "Script failed completely", details: err });
  }
}
