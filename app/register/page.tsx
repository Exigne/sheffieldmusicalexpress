"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

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
        // Redirect to home or login after 2 seconds
        setTimeout(() => router.push("/"), 2000);
      } else {
        setIsError(true);
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Connection error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "600px", margin: "0 auto" }}>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
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
