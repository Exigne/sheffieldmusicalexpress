"use client";

import { useState, use } from "react";
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
  params: Promise<{ boardSlug: string }>;
}) {
  const { boardSlug } = use(params);
  const router = useRouter();
  
  // Find the current board details based on the URL
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
        setError(data.error ?? "Something went wrong.");
        return;
      }

      // Success! Redirect to the newly created thread
      router.push(`/threads/${data.threadId}`);
      router.refresh(); 
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content-area">
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <a href={`/boards/${board.slug}`}>{board.icon} {board.name}</a>
          <span className="breadcrumb-sep">›</span>
          <span>New Thread</span>
        </div>

        <div className="form-card">
          <h2 className="form-card-title">Start a New Thread in {board.name}</h2>
          
          <form onSubmit={handleSubmit} className="thread-form">
            <div className="form-group">
              <label className="form-label">Your Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="reply-textarea"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {error && <div className="form-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Posting..." : "Post Thread →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
