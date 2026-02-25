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
        localStorage.setItem("sme_user", username);
        document.cookie = `username=${username}; path=/; max-age=604800; SameSite=Lax`;
        window.location.href = "/";
      } else {
        setError(data.error || "Invalid Sheffield credentials.");
        setLoading(false);
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
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? "Verifying..." : "Sign In →"}
              </button>

              <div style={{ 
                width: '100%', 
                borderTop: '1px solid var(--aged)', 
                paddingTop: '15px', 
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <Link href="/register" style={{ fontSize: '0.85rem', color: 'var(--ink)', textDecoration: 'none', fontWeight: 'bold' }}>
                  Don't have an account? <span style={{color: 'var(--rust)'}}>Register for free.</span>
                </Link>

                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  Forgot your password?{' '}
                  <a 
                    href="mailto:matt@sheffieldmusicexpress.co.uk?subject=SME%20Password%20Reset%20Request" 
                    style={{ color: 'var(--rust)', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Email Matt for help →
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
