"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReplyForm({ threadId }: { threadId: number }) {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(localStorage.getItem("sme_user"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !user) return;
    setLoading(true);

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, username: user, body }),
      });

      if (res.ok) {
        setBody(""); // Clear the text box
        router.refresh(); // Instantly load the new post
      } else {
        alert("Failed to post reply.");
      }
    } catch (err) {
      alert("Connection error.");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div style={{ marginTop: '30px', padding: '20px', background: '#fdf0ee', border: '1px solid var(--rust)', borderRadius: '4px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 10px 0', color: 'var(--rust)', fontWeight: 'bold' }}>🔒 You must be logged in to reply.</p>
        <Link href="/sign-in" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>Sign In</Link>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '40px', background: '#fdfdfc', padding: '20px', border: '1px solid var(--ink)', borderRadius: '4px' }}>
      <h3 style={{ fontFamily: 'Playfair Display', margin: '0 0 15px 0' }}>Write a Reply</h3>
      <div style={{ fontSize: '0.8rem', marginBottom: '10px', color: '#666' }}>Posting as: <strong>{user}</strong></div>
      <form onSubmit={handleSubmit} className="thread-form">
        <textarea
          className="reply-textarea"
          rows={5}
          placeholder="Add your voice to the conversation..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <div style={{ marginTop: '10px' }}>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
