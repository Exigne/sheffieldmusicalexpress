"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Success! Welcome to the SME community.");
        
        // 1. Automatically log the user in so they don't have to type it again
        localStorage.setItem("sme_user", username);
        
        // 2. Hard redirect to the dashboard after a tiny delay so they see the success message
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        setIsError(true);
        setMessage(data.error || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      setIsError(true);
      setMessage("Connection error. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Register Free</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">🗞️</div>
            <div>
              <div className="form-card-title">Join the Express</div>
              <div className="form-card-sub">Claim your name in the Steel City music scene</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="thread-form">
            <div className="form-group">
              <label className="form-label">Desired Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., LeadLungs_S1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="form-hint">This is how you'll appear on boards and articles.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {message && (
              <div className="form-error" style={{ 
                background: isError ? '#fdf0ee' : '#eefdf3', 
                borderColor: isError ? 'var(--rust)' : '#27ae60', 
                color: isError ? 'var(--rust)' : '#27ae60' 
              }}>
                {message}
              </div>
            )}

            <div className="form-actions" style={{ flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
              <button type="submit" className="btn-submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? "Registering..." : "Join the Community →"}
              </button>
              <Link href="/sign-in" style={{ fontSize: '0.8rem', color: 'var(--rust)', textDecoration: 'none' }}>
                Already have an account? Sign in here.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
