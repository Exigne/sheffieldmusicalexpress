"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder for actual registration logic
    setTimeout(() => {
      setMessage("Account created! You can now post as an official member.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <a href="/">Home</a>
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
              <span className="form-hint">This is how you'll appear on boards.</span>
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

            {message && <div className="form-error" style={{ background: '#eefdf3', borderColor: '#27ae60', color: '#27ae60' }}>{message}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Registering..." : "Join the Community →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
