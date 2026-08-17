"use client";

import { use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import BrandDeck from "@/components/BrandDeck";
import DemoFrame from "@/components/DemoFrame";
import FlowDiagram from "@/components/FlowDiagram";
import WorkflowDemo from "@/components/WorkflowDemo";
import SocialDemo from "@/components/SocialDemo";
import VisibilityDemo from "@/components/VisibilityDemo";
import WebDataDemo from "@/components/WebDataDemo";
import { useLang } from "@/components/LangProvider";
import { getProject } from "@/lib/projects";
import { getBrandKit } from "@/lib/brand-kits";
import { brandShots } from "@/lib/brand-shots";
import { hasWorkflow } from "@/lib/workflows";

// Projects whose output is a THING (posts, a search result, a sheet) rather than
// a message, and so earns a second panel showing the thing itself.
const ARTEFACT_DEMOS: Record<string, React.ComponentType> = {
  social: SocialDemo,
  seo: VisibilityDemo,
  mercato: WebDataDemo,
};

// In-site project viewer. Live demos are embedded in an iframe so the visitor
// stays on the portfolio instead of being sent to the external deploy. The
// "open in a new tab" control is always present as the fallback for sites that
// block framing (X-Frame-Options). Repo-only projects show the cover + code link.
export default function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLang();
  const project = getProject(slug);
  const kit = getBrandKit(slug);
  const Artefact = project ? ARTEFACT_DEMOS[project.key] : undefined;

  const pagePad: React.CSSProperties = {
    paddingTop: "calc(var(--topbar-h) + var(--space-10))",
    paddingBottom: "var(--space-16)",
  };

  const back = (
    <Link
      href="/work"
      className="label"
      style={{ display: "inline-block", marginBottom: 24, textDecoration: "none" }}
    >
      ← {t("work.back")}
    </Link>
  );

  if (!project || project.hidden) {
    return (
      <>
        <Nav />
        <main className="container" style={pagePad}>
          {back}
          <p style={{ fontSize: "var(--fs-lg)", color: "var(--ink-muted)" }}>{t("work.notfound")}</p>
        </main>
      </>
    );
  }

  const title = t(`work.proj.${project.key}`);
  const tags = t(`work.proj.${project.key}.tags`);
  const blurb = t(`work.proj.${project.key}.blurb`);
  const valueKey = `work.proj.${project.key}.value`;
  const value = t(valueKey);
  const hasValue = value !== valueKey;

  return (
    <>
      <Nav />
      <main className="container" style={pagePad}>
      {back}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
          borderBottom: "3px solid var(--ink-border)",
          paddingBottom: 18,
          margin: "8px 0 28px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "var(--tracking-tight)",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>
          {/* The stack belongs to the diagram's first stage when there is one.
              Printed here as well it read as a stutter: the same line twice,
              forty pixels apart. */}
          {!hasValue && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-xs)",
                color: "var(--ink-muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginTop: 10,
              }}
            >
              {tags}
            </p>
          )}
        </div>
      </header>

      {/* The blurb and the VALORE panel used to stack here as two separate
          blocks: what the project is, then what it changed, stated without a
          link between them. The diagram carries exactly that copy with the
          order and the causality drawn in, so it replaces them — when it was
          first added below them the visitor read the identical sentences twice
          in a row. A project with no value line keeps the plain paragraph,
          because the diagram needs all three stages to mean anything. */}
      {hasValue ? (
        <FlowDiagram project={project} />
      ) : (
        <p style={{ fontSize: "var(--fs-lg)", lineHeight: "var(--lh-loose)", maxWidth: 680, marginBottom: 28 }}>
          {blurb}
        </p>
      )}

      {project.concept && (
        <p
          style={{
            display: "flex",
            gap: 8,
            maxWidth: 680,
            marginBottom: 28,
            fontSize: "var(--fs-sm)",
            lineHeight: 1.55,
            color: "var(--ink-muted)",
          }}
        >
          <span aria-hidden="true" style={{ flexShrink: 0 }}>ⓘ</span>
          <span>{t("work.concept.note")}</span>
        </p>
      )}

      {/* Attribution for work built on someone else's licensed material. CC BY
          requires the credit to be visible wherever the derived work is shown,
          so it renders here rather than sitting in a repo file nobody opens. */}
      {project.credit && (
        <p
          style={{
            display: "flex",
            gap: 8,
            maxWidth: 680,
            marginBottom: 28,
            fontSize: "var(--fs-sm)",
            lineHeight: 1.55,
            color: "var(--ink-muted)",
          }}
        >
          <span aria-hidden="true" style={{ flexShrink: 0 }}>↳</span>
          <span>{project.credit}</span>
        </p>
      )}

      {/* The brand manual comes BEFORE the demo, because that is the order of
          the job: the identity is agreed on paper, then the site gets built.
          Projects with no client brand (the automation demos) have no kit and
          skip it. */}
      {kit && (
        <BrandDeck
          kit={kit}
          slug={slug}
          demo={project.demo}
          stack={tags}
          siteImage={project.image}
          siteVideo={project.coverVideo}
        />
      )}

      {project.demo ? (
        <>
          <div style={{ marginTop: 44, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <span className="label">{t("work.demohint")}</span>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener"
              className="label"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent-green-deep)", textDecoration: "none" }}
            >
              {t("work.openlive")} <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="offset block offset--panel" style={{ display: "block", width: "100%" }}>
            <div className="offset__layer" />
            <div className="offset__fg" style={{ overflow: "hidden" }}>
              <DemoFrame
                src={project.demo}
                title={title}
                poster={brandShots(slug)[0] ?? project.image}
              />
            </div>
          </div>
        </>
      ) : hasWorkflow(project.key) ? (
        // The automations have nothing to iframe, but they are not cover-image
        // projects either: the thing being sold is the decision the workflow
        // makes, so the visitor drives it here instead of reading a caption
        // promising a demo that never arrives.
        <>
          <div className="offset block offset--panel" style={{ display: "block", width: "100%" }}>
            <div className="offset__layer" />
            <div className="offset__fg neo-panel-cream" style={{ padding: "clamp(18px, 2.6vw, 32px)" }}>
              <WorkflowDemo projectKey={project.key} />
            </div>
          </div>

          {/* Three of the six automations also have an ARTEFACT worth showing.
              The workflow above answers "what does it decide"; this answers
              "what do I actually receive", which is the question a buyer asks
              second and the one no diagram can settle. The other three produce
              an email or a WhatsApp reply, already rendered in full inside the
              workflow's third stage, so a second panel would just repeat it. */}
          {Artefact && (
            <div className="offset block offset--panel" style={{ display: "block", width: "100%", marginTop: "clamp(24px, 3vw, 40px)" }}>
              <div className="offset__layer" />
              <div className="offset__fg neo-panel-cream" style={{ padding: "clamp(18px, 2.6vw, 32px)" }}>
                <Artefact />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="offset block offset--panel" style={{ display: "block", width: "100%", maxWidth: 920 }}>
          <div className="offset__layer" />
          <div className="offset__fg neo-panel-cream" style={{ overflow: "hidden" }}>
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={title}
                style={{ display: "block", width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: project.imagePosition ?? "center" }}
              />
            )}
            <p style={{ margin: 0, padding: "20px 24px", color: "var(--ink-muted)", fontSize: "var(--fs-sm)" }}>
              {t("work.codeonly")}
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 44,
          paddingTop: 28,
          borderTop: "3px solid var(--ink-border)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 2.4vw, 30px)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {t("work.cta.lead")}
        </p>
        <a
          href="/contatti"
          className="neo-btn neo-btn-lg neo-btn--primary"
          style={{ textDecoration: "none", padding: "13px 26px", fontSize: 16 }}
        >
          {t("work.cta.btn")} <span className="btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>
      </main>
    </>
  );
}
