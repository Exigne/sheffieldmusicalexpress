import type { Metadata } from 'next';
import Link from 'next/link';
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
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link href="/admin" style={{ color: 'var(--rust)', fontSize: '0.65rem', textDecoration: 'none' }}>🛡️ MOD PANEL</Link>
              <span>Free to join · Open to all</span>
            </div>
          </div>
          <div className="masthead-main">
            <div className="masthead-eyebrow">The Voice of Sheffield&apos;s Music Community</div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 className="site-title">
                Sheffield Musical <span className="express">Express</span>
              </h1>
            </Link>
            <p className="tagline">Where Steel City Musicians Connect, Create &amp; Collaborate</p>
          </div>
        </header>

        {/* NAV */}
        <nav className="main-nav">
          <ul>
            <li><Link href="/">🏠 Home</Link></li>
            <li><Link href="/boards/gear">🎸 Gear &amp; Kit</Link></li>
            <li><Link href="/boards/technique">🎵 Technique</Link></li>
            <li><Link href="/boards/gigs">🎤 Gigs &amp; Venues</Link></li>
            <li><Link href="/boards/band-wanted">🤝 Band Wanted</Link></li>
            <li><Link href="/boards/production">🎧 Production</Link></li>
            <li><Link href="/boards/records">📻 Record Fair</Link></li>
            <li className="nav-auth-split">
              <Link href="/register" style={{ background: 'var(--ink)', color: 'var(--bright-gold)' }}>🗞️ Join</Link>
            </li>
            <li><Link href="/sign-in">✍️ Sign In</Link></li>
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
            <Link href="/rules">Rules &amp; Guidelines</Link> ·{' '}
            <Link href="/contact">Contact Mods</Link> ·{' '}
            <Link href="/privacy">Privacy Policy</Link>
            <br />
            Powered by steel, passion &amp; too much reverb.
          </div>
        </footer>
      </body>
    </html>
  );
}
