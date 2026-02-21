export default function PrivacyPage() {
  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>Privacy Policy</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">🔒</div>
            <div>
              <h2 className="form-card-title">Privacy & Data</h2>
              <div className="form-card-sub">How we handle your information.</div>
            </div>
          </div>

          <div className="thread-form" style={{ lineHeight: '1.6', fontSize: '0.85rem', color: '#555' }}>
            <p>At <strong>Sheffield Musical Express</strong>, we value your privacy. We only collect the information necessary to provide the forum service:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Email:</strong> Used only for account verification and password resets.</li>
              <li><strong>Username:</strong> Displayed publicly next to your posts.</li>
              <li><strong>Cookies:</strong> Used to keep you signed in to your account.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>We do not sell your data to third parties. Your posts are public and indexed by search engines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
