"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "./LangProvider";

// The live demo, embedded — but not until someone asks for it.
//
// Measured on a production build of /work/aliva: TTFB 29 ms, DOM ready 252 ms,
// `load` 5582 ms. The whole 5.3-second tail was this one iframe pulling a second
// Vercel deployment into the page. `loading="lazy"` did not help: Chrome's lazy
// threshold for iframes is thousands of pixels, so an iframe below the brand
// manual is still inside it and still loads on arrival.
//
// So it starts as a facade: the real screenshot, and a button. Nothing
// third-party is fetched until the visitor says yes, and the panel still looks
// like the site rather than like a blank box.
export default function DemoFrame({
  src,
  title,
  poster,
}: {
  src: string;
  title: string;
  poster?: string;
}) {
  const { t } = useLang();
  const [live, setLive] = useState(false);

  if (live) {
    return (
      <iframe
        src={src}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{ display: "block", width: "100%", height: "74vh", border: 0, background: "#fff" }}
      />
    );
  }

  return (
    <button type="button" className="demoframe" onClick={() => setLive(true)}>
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "top center" }}
        />
      )}
      <span className="demoframe__scrim" />
      <span className="demoframe__cta">
        <span className="demoframe__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M5 3.4v9.2a.6.6 0 0 0 .93.5l7-4.6a.6.6 0 0 0 0-1l-7-4.6a.6.6 0 0 0-.93.5Z" /></svg>
        </span>
        <span>
          <strong>{t("work.demo.load")}</strong>
          <em>{t("work.demo.hint")}</em>
        </span>
      </span>
    </button>
  );
}
