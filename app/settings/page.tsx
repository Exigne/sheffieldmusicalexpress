"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [initials, setInitials] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Placeholder for API call to update user record in Neon
    setTimeout(() => {
      setMessage("Profile updated successfully!");
      setLoading(false);
      router.refresh();
    }, 1000);
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>Account Settings</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">⚙️</div>
            <div>
              <h2 className="form-card-title">Profile Settings</h2>
              <div className="form-card-sub">Customize how you appear to the Sheffield scene.</div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="thread-form">
            <div className="form-group">
              <label className="form-label">Avatar Initials</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. JD"
                maxLength={2}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
              />
              <span className="form-hint">Max 2 characters. These appear in the black circle next to your posts.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Musician Bio / Gear List</label>
              <textarea
                className="reply-textarea"
                rows={4}
                placeholder="e.g. Bassist for 'The Steel City Stompers'. Playing an '82 Precision."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {message && <div className="form-error" style={{ background: '#eefdf3', borderColor: '#27ae60', color: '#27ae60' }}>{message}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
