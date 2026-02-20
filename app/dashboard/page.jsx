"use client";

import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,400&family=Barlow:wght@300;400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sme-dashboard {
    --ink: #1a1208;
    --paper: #f0e8d5;
    --aged: #dfd3b4;
    --rust: #c0392b;
    --gold: #e6b800;
    --steel: #8b9eaa;
    --surface: #ffffff;
    --muted: #888;
    min-height: 100vh;
    background: var(--paper);
    font-family: 'Barlow', sans-serif;
    color: var(--ink);
  }

  /* ── SIDEBAR ── */
  .sme-sidebar {
    position: fixed;
    top: 0; left: 0;
    width: 220px;
    height: 100vh;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    z-index: 100;
    border-right: 4px solid var(--rust);
  }

  .sme-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .sme-logo-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.08em;
    color: #f0e8d5;
    line-height: 1;
  }

  .sme-logo-title span { color: var(--gold); }

  .sme-logo-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: var(--steel);
    text-transform: uppercase;
    margin-top: 4px;
  }

  .sme-nav {
    flex: 1;
    padding: 16px 0;
    overflow-y: auto;
  }

  .sme-nav-section {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    padding: 14px 20px 6px;
  }

  .sme-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    border-left: 3px solid transparent;
    transition: all 0.15s;
    user-select: none;
  }

  .sme-nav-item:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
  }

  .sme-nav-item.active {
    color: #fff;
    border-left-color: var(--rust);
    background: rgba(192,57,43,0.12);
    font-weight: 600;
  }

  .sme-nav-icon { font-size: 1rem; width: 20px; text-align: center; }

  .sme-nav-badge {
    margin-left: auto;
    background: var(--rust);
    color: #fff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 2px;
  }

  .sme-sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .sme-user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sme-avatar {
    width: 36px; height: 36px;
    background: var(--rust);
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .sme-user-name {
    font-size: 0.82rem;
    color: #fff;
    font-weight: 600;
  }

  .sme-user-role {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    color: var(--steel);
    letter-spacing: 0.08em;
  }

  /* ── MAIN ── */
  .sme-main {
    margin-left: 220px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* ── TOPBAR ── */
  .sme-topbar {
    background: #fff;
    border-bottom: 1px solid var(--aged);
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .sme-page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.1em;
    color: var(--ink);
  }

  .sme-topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .sme-search {
    display: flex;
    align-items: center;
    background: var(--paper);
    border: 1px solid var(--aged);
    padding: 6px 14px;
    gap: 8px;
    font-size: 0.82rem;
    color: var(--muted);
    font-family: 'IBM Plex Mono', monospace;
    cursor: text;
    min-width: 200px;
  }

  .sme-btn {
    background: var(--rust);
    color: #fff;
    border: none;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.12em;
    padding: 8px 18px;
    cursor: pointer;
    border: 2px solid var(--ink);
    box-shadow: 2px 2px 0 var(--ink);
    transition: box-shadow 0.12s, transform 0.12s;
  }

  .sme-btn:hover {
    box-shadow: none;
    transform: translate(2px, 2px);
  }

  /* ── CONTENT ── */
  .sme-content {
    padding: 28px 32px;
    flex: 1;
  }

  /* ── STAT CARDS ── */
  .sme-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .sme-stat-card {
    background: var(--surface);
    border: 1px solid var(--aged);
    border-top: 4px solid var(--ink);
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .sme-stat-card.rust { border-top-color: var(--rust); }
  .sme-stat-card.gold { border-top-color: var(--gold); }
  .sme-stat-card.steel { border-top-color: var(--steel); }

  .sme-stat-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .sme-stat-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    line-height: 1;
    letter-spacing: 0.04em;
    color: var(--ink);
  }

  .sme-stat-card.rust .sme-stat-number { color: var(--rust); }
  .sme-stat-card.gold .sme-stat-number { color: var(--gold); }
  .sme-stat-card.steel .sme-stat-number { color: var(--steel); }

  .sme-stat-delta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    color: #2ecc71;
    margin-top: 4px;
  }

  .sme-stat-icon {
    position: absolute;
    right: 16px; top: 16px;
    font-size: 1.6rem;
    opacity: 0.15;
  }

  /* ── TWO COLUMN ── */
  .sme-grid-2 {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 20px;
    margin-bottom: 20px;
  }

  /* ── PANEL ── */
  .sme-panel {
    background: var(--surface);
    border: 1px solid var(--aged);
  }

  .sme-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--aged);
  }

  .sme-panel-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem;
    letter-spacing: 0.12em;
    color: var(--ink);
  }

  .sme-panel-link {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--rust);
    text-transform: uppercase;
    cursor: pointer;
    border-bottom: 1px solid var(--rust);
  }

  /* ── THREAD ROW ── */
  .sme-thread-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--aged);
    cursor: pointer;
    transition: background 0.1s;
  }

  .sme-thread-row:last-child { border-bottom: none; }
  .sme-thread-row:hover { background: rgba(26,18,8,0.025); }

  .sme-thread-av {
    width: 40px; height: 40px;
    background: var(--ink);
    color: var(--paper);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .sme-thread-av.r { background: var(--rust); }
  .sme-thread-av.g { background: var(--gold); color: var(--ink); }
  .sme-thread-av.s { background: var(--steel); }

  .sme-thread-body { flex: 1; min-width: 0; }

  .sme-thread-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.88rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 3px;
  }

  .sme-thread-meta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.62rem;
    color: var(--muted);
  }

  .sme-tag {
    background: var(--ink);
    color: var(--paper);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.58rem;
    padding: 1px 5px;
    margin-right: 5px;
    letter-spacing: 0.05em;
  }

  .sme-tag.rust { background: var(--rust); }

  .sme-thread-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    color: var(--muted);
    text-align: right;
    min-width: 32px;
  }

  /* ── BOARD LIST ── */
  .sme-board-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--aged);
    cursor: pointer;
    transition: background 0.1s;
  }

  .sme-board-row:last-child { border-bottom: none; }
  .sme-board-row:hover { background: rgba(26,18,8,0.025); }

  .sme-board-icon { font-size: 1.3rem; width: 28px; text-align: center; }

  .sme-board-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.06em;
    flex: 1;
  }

  .sme-board-count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    color: var(--muted);
  }

  /* ── ACTIVITY FEED ── */
  .sme-feed-item {
    display: flex;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--aged);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .sme-feed-item:last-child { border-bottom: none; }

  .sme-feed-dot {
    width: 8px; height: 8px;
    background: var(--rust);
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 5px;
  }

  .sme-feed-dot.g { background: #2ecc71; }
  .sme-feed-dot.b { background: var(--steel); }

  .sme-feed-text { color: #444; }
  .sme-feed-text strong { color: var(--ink); }
  .sme-feed-time {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    color: #bbb;
    margin-top: 2px;
  }

  /* ── ONLINE MEMBERS ── */
  .sme-members {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .sme-member-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--aged);
    font-size: 0.8rem;
  }

  .sme-member-row:last-child { border-bottom: none; }

  .sme-online-dot {
    width: 7px; height: 7px;
    background: #2ecc71;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sme-member-name { flex: 1; font-weight: 600; }
  .sme-member-role {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    color: var(--muted);
    letter-spacing: 0.06em;
  }
`;

const navItems = [
  { section: "Main" },
  { icon: "📊", label: "Dashboard", id: "dashboard" },
  { icon: "💬", label: "All Threads", id: "threads", badge: "12" },
  { icon: "🔔", label: "Notifications", id: "notifs", badge: "3" },
  { section: "Forums" },
  { icon: "🎸", label: "Gear & Kit", id: "gear" },
  { icon: "🤝", label: "Band Wanted", id: "band" },
  { icon: "🎤", label: "Gigs & Scene", id: "gigs" },
  { icon: "🎧", label: "Production", id: "prod" },
  { icon: "🎵", label: "Technique", id: "tech" },
  { icon: "📻", label: "Record Fair", id: "records" },
  { section: "Admin" },
  { icon: "👥", label: "Members", id: "members" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

const recentThreads = [
  { av: "TK", avClass: "r", title: "Finally got my hands on a '78 Les Paul — worth every penny?", board: "Gear", tag: "rust", user: "ToneKing_Sheff", time: "2h ago", replies: 34 },
  { av: "MB", avClass: "g", title: "Looking for a bassist — post-punk with brass. Serious only.", board: "Band", tag: "", user: "MiriamBeat", time: "4h ago", replies: 11 },
  { av: "JJ", avClass: "", title: "Leadmill closed again Friday — bouncer drama, full story inside", board: "Gigs", tag: "", user: "JoJoPunk", time: "6h ago", replies: 58 },
  { av: "RS", avClass: "s", title: "Reaper vs Ableton — which one for live looping?", board: "Production", tag: "", user: "ReelSounds", time: "Yesterday", replies: 27 },
  { av: "DC", avClass: "", title: "Charity shop score — full Neve 8-ch desk for £40. No, really.", board: "Gear", tag: "", user: "DaveC_Vinyl", time: "Yesterday", replies: 83 },
];

const boards = [
  { icon: "🎸", name: "Gear & Kit Talk", posts: "1,842", threads: "312" },
  { icon: "🤝", name: "Band Wanted / Available", posts: "734", threads: "198" },
  { icon: "🎤", name: "Gigs & Local Scene", posts: "2,110", threads: "445" },
  { icon: "🎧", name: "Recording & Production", posts: "967", threads: "221" },
  { icon: "🎵", name: "Technique & Theory", posts: "1,234", threads: "289" },
  { icon: "📻", name: "Record Fairs & Vinyl", posts: "588", threads: "134" },
];

const feed = [
  { dot: "", text: <><strong>ElaJameson</strong> replied to <strong>"Pentatonic scale is overrated"</strong> — 102 replies now 🔥</>, time: "5 mins ago" },
  { dot: "g", text: <><strong>SteelCityRiff</strong> joined the forum. Welcome!</>, time: "18 mins ago" },
  { dot: "", text: <><strong>ToneKing_Sheff</strong> started a new thread in Gear & Kit</>, time: "2 hours ago" },
  { dot: "b", text: <><strong>DaveC_Vinyl</strong> updated the <strong>Record Fair</strong> board rules</>, time: "3 hours ago" },
  { dot: "g", text: <><strong>MiriamBeat</strong> and <strong>BarnabyFunk</strong> joined. Two new members!</>, time: "5 hours ago" },
];

const members = [
  { initials: "TK", name: "ToneKing_Sheff", role: "Gear Head" },
  { initials: "DC", name: "DaveC_Vinyl", role: "Moderator" },
  { initials: "RS", name: "ReelSounds", role: "Member" },
  { initials: "EJ", name: "ElaJameson", role: "Member" },
  { initials: "SC", name: "SteelCityRiff", role: "New Member" },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <>
      <style>{styles}</style>
      <div className="sme-dashboard">

        {/* SIDEBAR */}
        <aside className="sme-sidebar">
          <div className="sme-logo">
            <div className="sme-logo-title">Sheffield Musical <span>Express</span></div>
            <div className="sme-logo-sub">Admin Dashboard</div>
          </div>

          <nav className="sme-nav">
            {navItems.map((item, i) =>
              item.section ? (
                <div key={i} className="sme-nav-section">{item.section}</div>
              ) : (
                <div
                  key={item.id}
                  className={`sme-nav-item${activeNav === item.id ? " active" : ""}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className="sme-nav-icon">{item.icon}</span>
                  {item.label}
                  {item.badge && <span className="sme-nav-badge">{item.badge}</span>}
                </div>
              )
            )}
          </nav>

          <div className="sme-sidebar-footer">
            <div className="sme-user-chip">
              <div className="sme-avatar">A</div>
              <div>
                <div className="sme-user-name">Admin</div>
                <div className="sme-user-role">Super Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="sme-main">

          {/* TOPBAR */}
          <div className="sme-topbar">
            <div className="sme-page-title">Dashboard</div>
            <div className="sme-topbar-right">
              <div className="sme-search">🔍 Search threads, members…</div>
              <button className="sme-btn">+ New Thread</button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="sme-content">

            {/* STATS */}
            <div className="sme-stats">
              <div className="sme-stat-card rust">
                <div className="sme-stat-label">Total Posts</div>
                <div className="sme-stat-number">7,475</div>
                <div className="sme-stat-delta">↑ 124 this week</div>
                <div className="sme-stat-icon">💬</div>
              </div>
              <div className="sme-stat-card gold">
                <div className="sme-stat-label">Members</div>
                <div className="sme-stat-number">842</div>
                <div className="sme-stat-delta">↑ 14 this week</div>
                <div className="sme-stat-icon">👥</div>
              </div>
              <div className="sme-stat-card steel">
                <div className="sme-stat-label">Active Threads</div>
                <div className="sme-stat-number">1,599</div>
                <div className="sme-stat-delta">↑ 38 this week</div>
                <div className="sme-stat-icon">🗂️</div>
              </div>
              <div className="sme-stat-card">
                <div className="sme-stat-label">Online Now</div>
                <div className="sme-stat-number">38</div>
                <div className="sme-stat-delta">↑ 5 vs yesterday</div>
                <div className="sme-stat-icon">🟢</div>
              </div>
            </div>

            {/* THREADS + ACTIVITY */}
            <div className="sme-grid-2">

              {/* Recent Threads */}
              <div className="sme-panel">
                <div className="sme-panel-header">
                  <div className="sme-panel-title">Recent Threads</div>
                  <div className="sme-panel-link">View All</div>
                </div>
                {recentThreads.map((t, i) => (
                  <div className="sme-thread-row" key={i}>
                    <div className={`sme-thread-av ${t.avClass}`}>{t.av}</div>
                    <div className="sme-thread-body">
                      <div className="sme-thread-title">{t.title}</div>
                      <div className="sme-thread-meta">
                        <span className={`sme-tag${t.tag === "rust" ? " rust" : ""}`}>{t.board}</span>
                        by <strong>{t.user}</strong> · {t.time}
                      </div>
                    </div>
                    <div className="sme-thread-count">{t.replies}</div>
                  </div>
                ))}
              </div>

              {/* Activity Feed */}
              <div className="sme-panel">
                <div className="sme-panel-header">
                  <div className="sme-panel-title">Activity Feed</div>
                  <div className="sme-panel-link">Clear</div>
                </div>
                {feed.map((f, i) => (
                  <div className="sme-feed-item" key={i}>
                    <div>
                      <div className={`sme-feed-dot ${f.dot}`} />
                    </div>
                    <div>
                      <div className="sme-feed-text">{f.text}</div>
                      <div className="sme-feed-time">{f.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOARDS + ONLINE */}
            <div className="sme-grid-2">

              {/* Boards */}
              <div className="sme-panel">
                <div className="sme-panel-header">
                  <div className="sme-panel-title">Forum Boards</div>
                  <div className="sme-panel-link">Manage</div>
                </div>
                {boards.map((b, i) => (
                  <div className="sme-board-row" key={i}>
                    <div className="sme-board-icon">{b.icon}</div>
                    <div className="sme-board-name">{b.name}</div>
                    <div className="sme-board-count">{b.posts} posts · {b.threads} threads</div>
                  </div>
                ))}
              </div>

              {/* Online Members */}
              <div className="sme-panel">
                <div className="sme-panel-header">
                  <div className="sme-panel-title">Online Now</div>
                  <div className="sme-panel-link">All Members</div>
                </div>
                <div className="sme-members">
                  {members.map((m, i) => (
                    <div className="sme-member-row" key={i}>
                      <div className="sme-online-dot" />
                      <div className="sme-thread-av" style={{ width: 30, height: 30, fontSize: "0.8rem" }}>{m.initials}</div>
                      <div className="sme-member-name">{m.name}</div>
                      <div className="sme-member-role">{m.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
