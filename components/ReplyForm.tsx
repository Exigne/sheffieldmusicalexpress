"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OptimisticPost = {
  id: string;
  body: string;
  username: string;
  avatar_initials: string;
};

export default function ReplyForm({ threadId }: { threadId: number }) {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimisticPosts, setOptimisticPosts] = useState<OptimisticPost[]>([]);

  useEffect(() => {
    setUser(localStorage.getItem("sme_user"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !user) return;
    setLoading(true);

    const tempPost: OptimisticPost = {
      id: `temp-${Date.now()}`,
      body: body.trim(),
      username: user,
      avatar_initials: user.slice(0, 2).toUpperCase(),
    };

    // 1. Show the post instantly and clear the box
    setOptimisticPosts((prev) => [...prev, tempPost]);
    setBody("");
    setLoading(false);

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, username: user, body: tempPost.body }),
      });

      if (res.ok) {
        // 2. Wait 1.5s so the optimistic post is visible, THEN refresh the
        //    server cache so the board page shows the updated reply count
        //    when the user navigates back
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        // 3. If it failed, remove the optimistic post and restore the text
        setOptimisticPosts((prev) => prev.filter((p) => p.id !== tempPost.id));
        setBody(tempPost.body);
        alert("Failed to post reply. Please try again.");
      }
    } catch (err) {
      setOptimisticPosts((prev) => prev.filter((p) => p.id !== tempPost.id));
      setBody(tempPost.body);
      alert("Connection error.");
    }
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
    <div style={{ marginTop: '20px' }}>

      {/* New posts appear here instantly */}
      {optimisticPosts.map((post) => (
        <div
          key={post.id}
          style={{
            display: 'flex',
            gap: '15px',
            padding: '20px',
            background: 'var(--paper)',
            border: '1px solid var(--aged)',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <div style={{ width: '50px', flexShrink: 0 }}>
            <div className="thread-avatar" style={{ margin: '0 auto' }}>
              {post.avatar_initials}
            </div>
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--aged)',
              paddingBottom: '10px',
              marginBottom: '10px',
            }}>
              <strong style={{ color: 'var(--rust)' }}>{post.username}</strong>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Just now</span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#222' }}>
              {post.body}
            </div>
          </div>
        </div>
      ))}

      {/* Reply form */}
      <div style={{ background: '#fdfdfc', padding: '20px', border: '1px solid var(--ink)', borderRadius: '4px' }}>
        <h3 style={{ fontFamily: 'Playfair Display', margin: '0 0 15px 0' }}>Write a Reply</h3>
        <div style={{ fontSize: '0.8rem', marginBottom: '10px', color: '#666' }}>
          Posting as: <strong>{user}</strong>
        </div>
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
    </div>
  );
}
