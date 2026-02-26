"use client";
import { useState } from "react";

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
        window.location.href = "/"; // Hard redirect to dashboard
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
    <div style={{ 
      background: 'var(--aged)', 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px' 
    }}>
      
      <div style={{ 
        background: 'white', 
        width: '100%', 
        maxWidth: '500px', 
        border: '6px solid var(--ink)', 
        boxShadow: '15px 15px 0px var(--rust)', 
        padding: '40px' 
      }}>
        
        {/* HEADER */}
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', lineHeight: '0.9', marginBottom: '10px', color: 'var(--ink)' }}>
          SIGN IN
        </h1>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '30px' }}>
          ACCESS YOUR SME ACCOUNT
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.2rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.2rem', outline: 'none' }}
            />
          </div>

          {/* ERROR BOX */}
          {error && (
            <div style={{ background: 'var(--rust)', color: 'white', padding: '15px', fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', fontWeight: 'bold', border: '3px solid var(--ink)' }}>
              ERROR: {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{ 
              background: 'var(--ink)', 
              color: 'white', 
              padding: '15px', 
              fontFamily: 'Bebas Neue', 
              fontSize: '2rem', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              boxShadow: '6px 6px 0px var(--rust)', 
              marginTop: '10px', 
              transition: 'transform 0.1s, box-shadow 0.1s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseDown={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = '2px 2px 0px var(--rust)';
              }
            }}
            onMouseUp={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translate(0px, 0px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px var(--rust)';
              }
            }}
          >
            {loading ? "VERIFYING..." : "SIGN IN →"}
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div style={{ 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '3px solid var(--ink)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px', 
          fontFamily: 'IBM Plex Mono', 
          fontSize: '0.85rem' 
        }}>
          <a href="/register" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 'bold' }}>
            DON'T HAVE AN ACCOUNT? <span style={{ color: 'var(--rust)' }}>REGISTER FOR FREE.</span>
          </a>
          
          <a href="mailto:matt@sheffieldmusicexpress.co.uk?subject=SME%20Password%20Reset%20Request" style={{ color: '#666', textDecoration: 'none' }}>
            FORGOT PASSWORD? <span style={{ color: 'var(--ink)', fontWeight: 'bold' }}>EMAIL MATT FOR HELP →</span>
          </a>
        </div>
        
      </div>
    </div>
  );
}
