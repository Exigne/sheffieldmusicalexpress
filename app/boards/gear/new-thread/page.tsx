"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function NewGearThread() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Identify who is posting from LocalStorage
    const savedUser = localStorage.getItem("sme_user");
    if (!savedUser) {
      // If not logged in, redirect to sign-in
      router.push("/sign-in");
    } else {
      setUsername(savedUser);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/threads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: 1, // 1 is for Gear & Kit
          username: username,
          title,
          body
        }),
      });

      if (res.ok) {
        const { threadId } = await res.json();
        router.push(`/threads/${threadId}`);
      }
    } catch (err) {
      alert("Failed to post. Check your connection to the Steel City servers.");
    } finally {
      setLoading(false);
    }
  };

  if (!username) return <div className="page-wrapper">Verifying credentials...</div>;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href="/boards/gear">Gear & Kit</Link>
          <span className="breadcrumb-sep">›</span>
          <span>New Discussion</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">🎸</div>
            <div>
              <h2 className="form-card-title">Post New Gear Thread</h2>
              <div className="form-card-sub">Posting as: <strong>{username}</strong></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="thread-form">
            <div className="form-group">
              <label className="form-label">Thread Title</label>
              <input
                className="form-input"
                placeholder="e.g., Looking for a reliable amp tech in S1..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Body</label>
              <textarea
                className="reply-textarea"
                rows={10}
                placeholder="Write your gear review, question, or ad here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <Link href="/boards/gear" className="btn-cancel">Cancel</Link>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Publishing..." : "Publish Thread →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
