import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css'; // This MUST be here to provide the styling

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
        {/* We need the fonts to make it look authentic */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,400&family=Barlow:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="masthead">
          <div className="masthead-top">
            <span>Est. 2024 — Steel City</span>
            <span className="masthead-date">{today}</span>
            <Link href="/admin" className="mod-link">🛡️ MOD PANEL</Link>
          </div>
          <div className="masthead-main">
            <h1 className="site-title">Sheffield Musical <span className="express">Express</span></h1>
          </div>
        </header>

        {/* This "children" part is where your dashboard/home page actually sits */}
        <main>{children}</main>

        <footer className="site-footer">
          <div>© 2026 Sheffield Musical Express · South Yorkshire</div>
        </footer>
      </body>
    </html>
  );
}
