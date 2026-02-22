"use client";

import { useState } from "react";
import Link from 'next/link';

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Save the username so the Smart Navbar sees it
        localStorage.setItem("sme_user", username);
        
        // 2. HARD REDIRECT to the home page (Fixes the stuck screen issue)
        window.location.href = "/"; 
      } else {
        setError(data.error || "Invalid Sheffield credentials.");
        setLoading(false); // Only turn off loading if there's an error
      }
    } catch (err) {
      setError("Connection error. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
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
              <Link href="/register" style={{ fontSize: '0.8rem', color: 'var(--rust)', textDecoration: 'none' }}>
                Don't have an account? Register for free.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
