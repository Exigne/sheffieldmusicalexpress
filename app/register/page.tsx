"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("sme_user", username);
        window.location.href = "/"; // Hard redirect to dashboard
      } else {
        setError(data.error || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      setError("Connection error.");
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--aged)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '500px', border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--rust)', padding: '40px' }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', lineHeight: '0.9', marginBottom: '10px' }}>JOIN SME</h1>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '30px' }}>CREATE YOUR ARTIST PROFILE</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.7rem' }}>USERNAME</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.7rem' }}>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.7rem' }}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }} />
          </div>

          {error && <div style={{ background: 'var(--rust)', color: 'white', padding: '10px', fontFamily: 'IBM Plex Mono', fontWeight: 'bold' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ background: 'var(--ink)', color: 'white', padding: '15px', fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', cursor: 'pointer', boxShadow: '6px 6px 0px var(--rust)' }}>
            {loading ? "CREATING..." : "REGISTER NOW →"}
          </button>
        </form>

        <div style={{ marginTop: '30px', borderTop: '3px solid var(--ink)', paddingTop: '20px' }}>
          <a href="/login" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.85rem', color: 'var(--ink)', textDecoration: 'none', fontWeight: 'bold' }}>
            ALREADY A MEMBER? <span style={{ color: 'var(--rust)' }}>SIGN IN HERE.</span>
          </a>
        </div>
      </div>
    </div>
  );
}
