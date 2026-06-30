"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";
import AgentChat from "./AgentChat";

// Assistant page hero: SPLIT layout — the live assistant (eyebrow, title, body,
// status + the actual chat) fills the LEFT column; a mouse-scrub background video
// fills the RIGHT. Reskinned to the Parchment & Forest system (Fraunces / General
// Sans, ink on parchment). The video is seeked by horizontal mouse movement and
// never autoplays; reduced-motion parks it on a frame and skips the scrub.
export default function AssistantHero() {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Park the video on a representative frame once metadata is ready.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => {
      if (video.duration) video.currentTime = video.duration * 0.08;
    };
    video.addEventListener("loadedmetadata", onMeta);
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // Head-tracking scrub: map the cursor's horizontal position to a point in the
  // clip, so the head follows the cursor (left edge → start of the turn, right
  // edge → end). An onSeeked queue coalesces seeks to avoid flooding.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    let targetTime = video.currentTime || 0;
    let seeking = false;

    const onMove = (e: MouseEvent) => {
      if (!video.duration) return;
      const x = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
      targetTime = x * video.duration;
      if (!seeking) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };
    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.02) {
        video.currentTime = targetTime;
      } else {
        seeking = false;
      }
    };

    window.addEventListener("mousemove", onMove);
    video.addEventListener("seeked", onSeeked);
    return () => {
      window.removeEventListener("mousemove", onMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [reduce]);

  return (
    <section className="ah" aria-label={t("home.assist.title")}>
      <div className="ah-grid">
        <div className="ah-left">
          <span className="ah-eyebrow">{t("home.assist.tag")}</span>
          <h1 className="ah-title">{t("home.assist.title")}</h1>
          <span className="ah-meta">{t("home.svc.agents.title")}</span>
          <p className="ah-body">{t("home.assist.body")}</p>

          <div className="ah-status">
            <span className="ah-status__pill">
              <span className="ah-dot" aria-hidden="true" />
              {t("agent.chat.online")}
            </span>
            <span className="ah-status__note">Risponde in tempo reale · IT · EN · SV</span>
          </div>

          <div className="ah-chat">
            <AgentChat
              agentType="welcome"
              initialMessage={t("agent.chat.welcome")}
              agentInitials="LH"
              agentName={t("assistant.label")}
            />
          </div>
        </div>

        <div className="ah-right">
          <video
            ref={videoRef}
            className="ah-video"
            src="/assistant-hero.mp4"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>
      </div>

      <style>{`
        .ah {
          /* Warm ochre theme for the assistant page — matches the image's own
             backdrop so the video dissolves seamlessly into the page. Defined in
             the component's scoped CSS (not an inline per-element override). */
          --ah-bg: #EA9B04;
          --ah-ink: #241A0B;
          --ah-deep: #3E2C0C;
          position: relative; background: var(--ah-bg); color: var(--ah-ink);
        }
        .ah-grid { display: grid; grid-template-columns: 1fr; }
        .ah-left {
          display: flex; flex-direction: column; gap: 12px; min-width: 0;
          padding: clamp(24px, 6vw, 40px) clamp(20px, 5vw, 40px) clamp(40px, 7vw, 64px);
        }
        .ah-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: var(--ah-deep); }
        .ah-title { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 4.4vw, 52px); line-height: 1.04; letter-spacing: -0.02em; color: var(--ah-ink); }
        .ah-meta { font-family: var(--font-mono); font-size: 12px; color: var(--ah-ink); opacity: .6; }
        .ah-body { margin: 4px 0 4px; font-size: clamp(15px, 1.5vw, 17px); line-height: 1.6; color: var(--ah-ink); opacity: .9; max-width: 54ch; }
        .ah-status { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .ah-status__pill {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .08em;
          color: var(--ah-bg); background: var(--ah-ink);
          border: 2px solid var(--ah-ink); border-radius: 9999px; padding: 3px 11px; box-shadow: var(--shadow-badge);
        }
        .ah-dot { width: 8px; height: 8px; border-radius: 50%; background: #57C98A; display: inline-block; }
        .ah-status__note { font-family: var(--font-mono); font-size: 12px; color: var(--ah-ink); opacity: .62; }
        .ah-chat { margin-top: 10px; }

        .ah-right { position: relative; overflow: hidden; background: var(--ah-bg); }
        .ah-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }

        /* Mobile / tablet: video as a banner on top, then the assistant + chat. */
        @media (max-width: 979px) {
          .ah-right { height: clamp(200px, 36vh, 320px); order: -1; }
        }
        /* Desktop: true split, video sticky full-height on the right. */
        @media (min-width: 980px) {
          .ah-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: 100svh; align-items: start; }
          /* Cap the text + chat to a calm reading column so the chat never crowds
             the image — clear parchment breathing room sits between them. */
          /* Centre the text + chat within the left half so it sits more toward the
             middle, with even breathing room on both sides (no edge-hugging). */
          .ah-left { max-width: 560px; justify-self: center; padding-top: calc(var(--topbar-h) + clamp(28px, 4vw, 56px)); justify-content: center; }
          .ah-right { height: 100svh; position: sticky; top: 0; }
          /* Dissolve the video's left edge into the parchment column — no hard seam. */
          .ah-video { -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 14%, #000 34%); mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 14%, #000 34%); }
        }
      `}</style>
    </section>
  );
}
