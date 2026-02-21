export default function ContactPage() {
  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span>Contact Mods</span>
        </nav>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-hidden-icon">✉️</div>
            <div>
              <h2 className="form-card-title">Contact the Editors</h2>
              <div className="form-card-sub">Have an issue? We're here to help.</div>
            </div>
          </div>

          <div className="thread-form">
            <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
              If you need to report a post, appeal a ban, or suggest a new board category, drop us a line at:
            </p>
            <div style={{ 
              background: 'var(--paper)', 
              padding: '15px', 
              border: '1px solid var(--aged)', 
              textAlign: 'center',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '1.1rem'
            }}>
              editors@sheffieldmusicalexpress.co.uk
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '15px', color: 'var(--muted)' }}>
              Please allow 24-48 hours for a response from our volunteer mod team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
