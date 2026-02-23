"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BoardInteractive({ board, initialThreads }: any) {
  const [threads, setThreads] = useState(initialThreads);
  const [isComposing, setIsComposing] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if the user is logged in when the pop-out opens
  useEffect(() => {
    setUser(localStorage.getItem("sme_user"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !user) return;
    setLoading(true);

    try {
      const res = await fetch("/api/threads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardSlug: board.slug, username: user, title, body }),
      });

      if (res.ok) {
        const { threadId } = await res.json();
        
        // Instantly add the new thread to the top of the pop-out list!
        const newThread = {
          id: threadId,
          title,
          username: user,
          avatar_initials: user.slice(0, 2).toUpperCase(),
          created_at: new Date().toISOString(),
          reply_count: 0
        };
        
        setThreads([newThread, ...threads]);
        setIsComposing(false); // Close the form
        setTitle(""); // Clear the inputs
        setBody("");
      } else {
        alert("Failed to post. Please try again.");
      }
    } catch (err) {
      alert("Connection error.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* HEADER */}
      <div className="board-header" style={{ marginTop: '0', paddingBottom: '20px', borderBottom: '1px solid var(--aged)' }}>
        <div className="board-header-icon">{board.icon}</div>
        <div>
          <h2 className="board-header-title" style={{ fontSize: '2.2rem' }}>{board.name}</h2>
          <p className="board-header-desc">{board.description}</p>
        </div>
      </div>

      {/* COMPOSER FORM OR THREAD LIST */}
      {isComposing ? (
        <div style={{ marginTop: '20px', background: '#fdfdfc', padding: '20px', border: '1px solid var(--ink)' }}>
          <h3 style={{ fontFamily: 'Playfair Display', margin: '0 0 15px 0' }}>Start a New Conversation</h3>
          <form onSubmit={handleSubmit} className="thread-form">
            <input
              className="form-input"
              placeholder="Thread Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ marginBottom: '10px' }}
            />
            <textarea
              className="reply-textarea"
              rows={6}
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              style={{ marginBottom: '15px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Posting..." : "Post Thread"}
              </button>
              <button type="button" onClick={() => setIsComposing(false)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div className="section-label" style={{ margin: 0 }}>Latest Conversations</div>
            
            {/* The "New Thread" Button Logic */}
            {user ? (
              <button onClick={() => setIsComposing(true)} className="btn-post" style={{ border: 'none', cursor: 'pointer' }}>
                + New Thread
              </button>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--rust)', background: '#fdf0ee', padding: '5px 10px', borderRadius: '4px' }}>
                🔒 Please register or sign in to make a post.
              </div>
            )}
          </div>

          <div className="thread-list">
            {threads.length === 0 ? (
              <div className="no-threads">No threads here yet. Be the first!</div>
            ) : (
              threads.map((thread: any) => (
                <div key={thread.id} className="thread-item">
                  <div className="thread-avatar">{thread.avatar_initials || '?'}</div>
                  <div className="thread-main">
                    <Link href={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
                    <div className="thread-sub">Posted by <strong>{thread.username}</strong></div>
                  </div>
                  <div className="thread-replies">
                    <strong>{thread.reply_count || 0}</strong> replies
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
