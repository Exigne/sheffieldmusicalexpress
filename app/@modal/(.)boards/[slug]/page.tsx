export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm';

export default async function BoardModal(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;

  // 1. Fetch Board Details
  const boardRes = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
  const board = boardRes[0];

  if (!board) return null;

  const isGear = slug === 'gear-exchange';

  // 2. Fetch Items - Smart detection of which table to use
  let items: any[] = [];
  try {
    if (isGear) {
      items = await sql`
        SELECT g.id, g.title, g.price, g.condition, g.created_at, u.username 
        FROM gear_listings g
        JOIN users u ON g.user_id = u.id
        WHERE g.board_id = ${board.id}
        ORDER BY g.created_at DESC
      `;
    } else {
      items = await sql`
        SELECT t.id, t.title, t.reply_count, t.created_at, u.username,
        COALESCE(MAX(p.created_at), t.created_at) as last_interaction
        FROM threads t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN posts p ON p.thread_id = t.id
        WHERE t.board_id = ${board.id}
        GROUP BY t.id, t.title, t.reply_count, t.created_at, u.username
        ORDER BY last_interaction DESC
      `;
    }
  } catch (error) {
    console.error("Failed to fetch board items:", error);
  }

  function timeAgo(dateInput: string | Date): string {
    if (!dateInput) return '';
    const diff = Date.now() - new Date(dateInput).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <Modal>
      {/* 🏛️ HEADER */}
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {isGear ? 'Marketplace' : 'Forum Board'}
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: '5px 0 0 0', lineHeight: '1' }}>
              {board.name}
            </h1>
          </div>
          <a href="#new-post-modal" style={{ 
            background: 'var(--ink)', color: 'white', padding: '10px 20px', 
            fontFamily: 'Bebas Neue', fontSize: '1.2rem', textDecoration: 'none' 
          }}>
            {isGear ? '+ POST ADVERT' : '+ NEW THREAD'}
          </a>
        </div>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px', color: '#444' }}>
          {board.description}
        </p>
      </div>

      {/* 📝 LISTING AREA */}
      <div style={{ minHeight: '300px' }}>
        <ul className="thread-list">
          {items.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontStyle: 'italic', background: 'var(--paper)', border: '1px solid var(--aged)' }}>
              No listings found here yet.
            </div>
          ) : (
            items.map((item: any) => (
              <li key={item.id} className="thread-item">
                <div className="thread-avatar">{item.username?.slice(0, 2).toUpperCase() || '??'}</div>
                <div className="thread-main">
                  <Link 
                    href={`/threads/${item.id}?type=${isGear ? 'gear' : 'thread'}`} 
                    className="thread-title"
                  >
                    {item.title}
                  </Link>
                  <div className="thread-sub">
                    By <span style={{fontWeight: 'bold'}}>{item.username}</span> · {timeAgo(item.created_at)}
                  </div>
                </div>

                {/* SHOW PRICE ONLY FOR GEAR */}
                {isGear ? (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--rust)', fontWeight: 'bold', fontSize: '1.4rem', fontFamily: 'Bebas Neue' }}>
                      {item.price || 'TBC'}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono' }}>
                      {item.condition}
                    </div>
                  </div>
                ) : (
                  <div className="thread-replies"><strong>{item.reply_count || 0}</strong> replies</div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ✍️ FORM SECTION */}
      <div id="new-post-modal" style={{ 
        marginTop: '40px', 
        background: 'white', 
        padding: '25px', 
        border: '3px solid var(--ink)',
        boxShadow: '10px 10px 0px var(--aged)' 
      }}>
        <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '15px' }}>
          {isGear ? 'Create New Listing' : 'Start a Discussion'}
        </h3>
        <CreateThreadForm boardId={board.id} boardSlug={board.slug} />
      </div>
    </Modal>
  );
}
