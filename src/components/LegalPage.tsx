"use client";

import Nav from "./Nav";
import CinematicFooter from "./CinematicFooter";

// Shared shell for the legal pages (privacy, cookie): brand nav + footer + a
// readable prose column. Content is authored per page.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))", paddingBottom: "clamp(70px, 9vw, 130px)" }}
      >
        <article className="legal">
          <h1>{title}</h1>
          <p className="legal-meta">{updated}</p>
          {children}
        </article>
      </main>
      <CinematicFooter />

      <style>{`
        .legal { max-width: 760px; margin: 0 auto; }
        .legal h1 { font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 5vw, 50px); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 6px; color: var(--ink-body); }
        .legal .legal-meta { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); margin: 0 0 clamp(22px, 4vw, 34px); }
        .legal h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(19px, 2.2vw, 25px); line-height: 1.2; letter-spacing: -0.01em; margin: clamp(28px, 4vw, 38px) 0 10px; color: var(--ink-body); }
        .legal p, .legal li { font-family: var(--font-ui); font-size: 15.5px; line-height: 1.66; color: var(--ink-body); }
        .legal p { margin: 0 0 12px; }
        .legal ul { margin: 0 0 12px; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
        .legal a { color: var(--accent-green-deep); text-underline-offset: 3px; }
        .legal strong { font-weight: 600; }
        .legal .legal-note {
          border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
          background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow);
          padding: 16px 18px; margin: 0 0 clamp(22px, 4vw, 34px);
          font-size: 13.5px; line-height: 1.6;
        }
        .legal .legal-note strong { color: var(--accent-green-deep); }
      `}</style>
    </>
  );
}
