"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Placeholder for authentication logic
    // In a real app, you would fetch('/api/auth/signin')
    setTimeout(() => {
      if (username && password) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>Member Sign In</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">✍️</div>
            <div>
              <h2 className="form-card-title">Sign In</h2>
              <div className="form-card-sub">Access your SME account and join the session.</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="thread-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-actions" style={{ flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
              <button type="submit" className="btn-submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? "Verifying..." : "Sign In →"}
              </button>
              <a href="/register" style={{ fontSize: '0.8rem', color: 'var(--rust)' }}>
                Don't have an account? Register for free.
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
