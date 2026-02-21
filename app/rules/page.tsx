export default function RulesPage() {
  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>Community Rules</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">📜</div>
            <div>
              <h2 className="form-card-title">Community Guidelines</h2>
              <div className="form-card-sub">Keep the Steel City scene sounding great.</div>
            </div>
          </div>

          <div className="thread-form" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            <p>Welcome to <strong>SME</strong>. To keep this a helpful space for all Sheffield musicians, please follow these simple rules:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li><strong>Be Civil:</strong> Respect your fellow musicians. No personal attacks or harassment.</li>
              <li><strong>Stay Local:</strong> Focus on the Sheffield and South Yorkshire music scene.</li>
              <li><strong>No Spam:</strong> Do not post the same gig or gear ad multiple times.</li>
              <li><strong>Gear Safety:</strong> SME is not responsible for transactions. Meet in public places for gear swaps.</li>
              <li><strong>Keep it Musical:</strong> This is a community for music, performance, and production.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
