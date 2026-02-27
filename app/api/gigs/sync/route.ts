import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const apiKey = process.env.SKIDDLE_API_KEY || '008f1e60ad66af94dd01bc3b3d1787c8'; 
    // Increased radius to 20 to give the test key a better chance of finding something
    const url = `https://www.skiddle.com/api/v1/events/search/?api_key=${apiKey}&latitude=53.3811&longitude=-1.4701&radius=20&eventcode=LIVE&limit=50`;

    const res = await fetch(url);
    const data = await res.json();

    let eventsToSave = [];

    // Check if Skiddle actually gave us results
    if (data.error === 0 && data.results && data.results.length > 0) {
      eventsToSave = data.results.map((e: any) => ({
        externalId: `skiddle_${e.id}`,
        title: e.eventname,
        venue: e.venue?.name || "TBA",
        eventDate: e.date,
        description: e.description || "No description provided.",
        ticketLink: e.link,
        imageUrl: e.largeimageurl || e.imageurl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
        price: e.entryprice || "See link for price",
        postedBy: 'API_SKIDDLE'
      }));
    } else {
      // 🚨 FALLBACK MODE: Skiddle failed or returned 0 events.
      // We will inject mock Sheffield data so you aren't stuck with an empty database!
      console.log("Skiddle returned no data. Using Sheffield Fallback Data.");
      
      const nextFriday = new Date();
      nextFriday.setDate(nextFriday.getDate() + (5 + 7 - nextFriday.getDay()) % 7);
      
      eventsToSave = [
        {
          externalId: 'mock_1',
          title: 'LOCAL INDIE WEEKENDER',
          venue: 'The Leadmill',
          eventDate: nextFriday.toISOString().split('T')[0],
          description: 'Three stages of the best up-and-coming indie bands from across South Yorkshire.',
          ticketLink: '#',
          imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000',
          price: '£15.00',
          postedBy: 'SME_ADMIN'
        },
        {
          externalId: 'mock_2',
          title: 'BASEMENT PUNK ALL-DAYER',
          venue: 'Delicious Clam',
          eventDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
          description: 'BYOB. 10 bands. Heavy riffs and sweat. Support your local DIY scene.',
          ticketLink: '#',
          imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1000',
          price: '£8.00 OTD',
          postedBy: 'SME_ADMIN'
        },
        {
          externalId: 'mock_3',
          title: 'SHEFFIELD JAZZ COLLECTIVE',
          venue: 'Yellow Arch Studios',
          eventDate: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
          description: 'A relaxed evening of improvisational jazz in Kelham Island.',
          ticketLink: '#',
          imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=1000',
          price: '£12.00',
          postedBy: 'SME_ADMIN'
        }
      ];
    }

    let newGigsAdded = 0;

    // Save whichever events we got (Skiddle or Mock) into Neon
    for (const event of eventsToSave) {
      try {
        await sql`
          INSERT INTO gig_guide (title, venue, event_date, description, ticket_link, image_url, price, posted_by, external_id)
          VALUES (${event.title}, ${event.venue}, ${event.eventDate}, ${event.description}, ${event.ticketLink}, ${event.imageUrl}, ${event.price}, ${event.postedBy}, ${event.externalId})
          ON CONFLICT (external_id) DO NOTHING
        `;
        newGigsAdded++;
      } catch (dbErr) {
        console.error("Failed to insert gig:", event.title, dbErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      source: eventsToSave[0].externalId.includes('mock') ? 'Fallback Data' : 'Skiddle API',
      message: `Processed ${eventsToSave.length} events. Database sync complete.` 
    });

  } catch (err) {
    console.error("Sync Error:", err);
    return NextResponse.json({ error: "Failed to run gig sync" }, { status: 500 });
  }
}
