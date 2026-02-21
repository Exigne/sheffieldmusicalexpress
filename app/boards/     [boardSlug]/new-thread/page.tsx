"use client";

import { useState, use } from "react";  // ← Add 'use' from React
import { useRouter } from "next/navigation";

const BOARDS = [
  { slug: "gear", icon: "🎸", name: "Gear & Kit Talk" },
  { slug: "band-wanted", icon: "🤝", name: "Band Wanted / Available" },
  { slug: "gigs", icon: "🎤", name: "Gigs & Local Scene" },
  { slug: "production", icon: "🎧", name: "Recording & Production" },
  { slug: "technique", icon: "🎵", name: "Technique & Theory" },
  { slug: "records", icon: "📻", name: "Record Fairs & Vinyl" },
];

export default function NewThreadPage({
  params,
}: {
  params: Promise<{ boardSlug: string }>;  // ← Still Promise in type
}) {
  const { boardSlug } = use(params);  // ← Use React.use() to unwrap in Client Component
  const router = useRouter();
  
  const board = BOARDS.find((b) => b.slug === boardSlug) ?? BOARDS[0];

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body.trim() || !username.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardSlug: board.slug,
          title: title.trim(),
          body: body.trim(),
          username: username.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(`/threads/${data.threadId}`);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content-area">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <a href={`/boards/${board.slug}`}>{board.icon} {board.name}</a>
          <span className="breadcrumb-sep">›</span>
          <span>New Thread</span>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">{board.icon}</div>
            <div>
              <div className="form-card-title">Start a New Thread</div>
              <div className="form-card-sub">Posting in <strong>{board.name}</strong></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="thread-form">

            {/* BOARD PICKER */}
            <div className="form-group">
              <label className="form-label">Board</label>
              <select
                className="form-select"
                defaultValue={board.slug}
                onChange={(e) => router.push(`/boards/${e.target.value}/new-thread`)}
              >
                {BOARDS.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.icon} {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* USERNAME */}
            <div className="form-group">
              <label className="form-label">Your Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ToneKing_Sheff"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={50}
                required
              />
              <div className="form-hint">No account needed yet — just pick a name.</div>
            </div>

            {/* TITLE */}
            <div className="form-group">
              <label className="form-label">Thread Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Best budget guitar for a beginner?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                required
              />
              <div className="form-hint">{title.length}/255 characters</div>
            </div>

            {/* BODY */}
            <div className="form-group">
              <label className="form-label">Your Post</label>
              <textarea
                className="reply-textarea"
                placeholder="Write your post here…"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {/* ERROR */}
            {error && <div className="form-error">{error}</div>}

            {/* SUBMIT */}
            <div className="form-actions">
              <a href={`/boards/${board.slug}`} className="btn-cancel">
                Cancel
              </a>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Posting…" : "Post Thread →"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-widget">
          <div className="widget-header">Posting Tips</div>
          <div className="widget-body tips-list">
            <div className="tip-item">✅ Search first to avoid duplicates</div>
            <div className="tip-item">✅ Keep your title clear and specific</div>
            <div className="tip-item">✅ Be respectful — we&apos;re all here to help</div>
            <div className="tip-item">✅ Add detail — the more context, the better replies</div>
            <div className="tip-item">🚫 No spam or self-promotion</div>
            <div className="tip-item">🚫 No buying/selling outside the Gear board</div>
          </div>
        </div>

        <a href="/" className="btn-register">← Back to Home</a>
      </aside>
    </div>
  );
}
