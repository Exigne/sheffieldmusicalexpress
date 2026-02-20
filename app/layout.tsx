import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sheffield Musical Express',
  description: 'Where Steel City Musicians Connect, Create & Collaborate',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,400&family=Barlow:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* MASTHEAD */}
        <header className="masthead">
          <div className="masthead-top">
            <span>Est. 2024 — Steel City, South Yorkshire</span>
            <span className="masthead-date">{today}</span>
            <span>Free to join · Open to all</span>
          </div>
          <div className="masthead-main">
            <div className="masthead-eyebrow">The Voice of Sheffield&apos;s Music Community</div>
            <h1 className="site-title">
              Sheffield Musical <span className="express">Express</span>
            </h1>
            <p className="tagline">Where Steel City Musicians Connect, Create &amp; Collaborate</p>
          </div>
        </header>

        {/* NAV */}
        <nav className="main-nav">
          <ul>
            <li><a href="/">🏠 Home</a></li>
            <li><a href="/boards/gear">🎸 Gear &amp; Kit</a></li>
            <li><a href="/boards/technique">🎵 Technique</a></li>
            <li><a href="/boards/gigs">🎤 Gigs &amp; Venues</a></li>
            <li><a href="/boards/band-wanted">🤝 Band Wanted</a></li>
            <li><a href="/boards/production">🎧 Production</a></li>
            <li><a href="/boards/records">📻 Record Fair</a></li>
            <li><a href="/sign-in">✍️ Sign In</a></li>
          </ul>
        </nav>

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <footer className="site-footer">
          <div>
            <div className="footer-title">
              Sheffield Musical <span className="express">Express</span>
            </div>
            <div style={{ marginTop: '6px' }}>
              © {new Date().getFullYear()} SME Community Forum · Sheffield, South Yorkshire
            </div>
          </div>
          <div style={{ textAlign: 'right', lineHeight: '1.9' }}>
            <a href="/rules">Rules &amp; Guidelines</a> ·{' '}
            <a href="/contact">Contact Mods</a> ·{' '}
            <a href="/privacy">Privacy Policy</a>
            <br />
            Powered by steel, passion &amp; too much reverb.
          </div>
        </footer>
      </body>
    </html>
  );
}
