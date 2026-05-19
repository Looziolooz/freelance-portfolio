export default function SectionHeader({
  num,
  title,
  meta,
}: {
  num: string;
  title: string;
  meta?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        alignItems: "flex-end",
        gap: 24,
        padding: "0 0 28px",
        borderBottom: "1px solid var(--fg)",
        marginBottom: 56,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--muted)",
          letterSpacing: 1,
        }}
      >
        {num}
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(32px, 5.5vw, 88px)",
          letterSpacing: -2,
          fontWeight: 500,
          lineHeight: 0.98,
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {title}
      </h2>
      {meta && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: 1.4,
            textAlign: "right",
          }}
        >
          {meta}
        </div>
      )}
    </div>
  );
}
