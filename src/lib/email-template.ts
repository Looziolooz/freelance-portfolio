// The branded email for lead notifications, sent by /api/lead via Resend.
//
// This is the site's identity translated to the one medium that hates CSS:
// tables, inline styles, 600px, nothing external. The choices map 1:1 onto
// DESIGN.md — parchment ground, ink text, the near-black footer bar the site
// uses, ochre ONLY as the action (with dark text, never white), forest for
// links, mono uppercase labels with the editorial hairline. Fraunces cannot be
// loaded by most clients, so display type falls back to Georgia, which is the
// exact fallback the site's own font stack declares; the hard offset shadows
// stay home, borders carry the structure alone.
//
// Every user-supplied string passes through esc(): the lead's name, address and
// message land inside HTML, and an unescaped message would let anyone inject
// markup into Lorenzo's inbox.

const INK = "#221E17";
const PARCHMENT = "#F5EEDF";
const PANEL = "#EFE6D1";
const OCHRE = "#E8A12C";
const FOREST = "#143A2B";
const MUTED = "#6B6253";
const BLACK = "#1B1813";
const CREAM = "#F4F1EA";

const DISPLAY = "Georgia, 'Times New Roman', serif";
const BODY = "Helvetica, Arial, sans-serif";
const MONO = "'Courier New', Courier, monospace";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const label = (text: string) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="font-family:${MONO};font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${MUTED};white-space:nowrap;padding-right:14px;">${text}</td>
      <td width="100%" style="border-bottom:1px solid #D8CFBC;line-height:1px;font-size:1px;">&nbsp;</td>
    </tr>
  </table>`;

type Rendered = {
  subject: string;
  date: string;
  message: string;
  fromName: string;
  replyto: string;
  /** Goes inside the mailto ?subject= of the reply button. */
  replySubject: string;
};

function shell(v: Rendered): string {
  const { subject, date, message, fromName, replyto, replySubject } = v;
  return `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:${PARCHMENT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PARCHMENT};">
    <tr><td align="center" style="padding:28px 14px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- header: the near-black bar both site footers sit on -->
        <tr><td style="background:${BLACK};border:3px solid ${INK};border-bottom:0;padding:18px 26px;">
          <span style="font-family:${DISPLAY};font-size:22px;font-weight:bold;color:${CREAM};letter-spacing:-0.5px;">LO<span style="color:${OCHRE};">.</span>oz</span>
          <span style="font-family:${MONO};font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#A89E8B;float:right;padding-top:8px;">Nuovo lead</span>
        </td></tr>

        <!-- card -->
        <tr><td style="background:${CREAM};border:3px solid ${INK};padding:30px 26px;">

          <h1 style="margin:0 0 6px;font-family:${DISPLAY};font-size:26px;line-height:1.15;font-weight:bold;color:${INK};">${subject}</h1>
          <p style="margin:0 0 22px;font-family:${MONO};font-size:11px;letter-spacing:1px;color:${MUTED};">${date}</p>

          ${label("Messaggio")}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 24px;">
            <tr><td style="background:${PANEL};border:3px solid ${INK};padding:18px 20px;font-family:${BODY};font-size:15px;line-height:1.65;color:${INK};">${message}</td></tr>
          </table>

          ${label("Chi scrive")}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 26px;">
            <tr>
              <td style="font-family:${BODY};font-size:15px;line-height:1.7;color:${INK};padding:10px 0 0;">
                <strong>${fromName}</strong><br/>
                <a href="mailto:${replyto}" style="color:${FOREST};font-weight:bold;">${replyto}</a>
              </td>
            </tr>
          </table>

          <!-- the one ochre on the page: the action, with dark text -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:${OCHRE};border:3px solid ${INK};">
              <a href="mailto:${replyto}?subject=${replySubject}"
                 style="display:inline-block;padding:13px 26px;font-family:${MONO};font-size:13px;font-weight:bold;letter-spacing:1px;color:${INK};text-decoration:none;">Rispondi a ${fromName} &#8594;</a>
            </td></tr>
          </table>

        </td></tr>

        <!-- footer bar -->
        <tr><td style="background:${BLACK};border:3px solid ${INK};border-top:0;padding:14px 26px;">
          <span style="font-family:${MONO};font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#A89E8B;">Dal form di <a href="https://looz.design" style="color:${OCHRE};text-decoration:none;">looz.design</a> &middot; rispondendo scrivi direttamente al lead</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** The email as sent inline by /api/lead: values escaped here and now. */
export function leadEmailHtml(input: {
  subject: string;
  message: string;
  replyto: string;
  fromName: string;
}): string {
  return shell({
    subject: esc(input.subject),
    fromName: esc(input.fromName),
    replyto: esc(input.replyto),
    // Paragraphs survive, markup does not.
    message: esc(input.message).replace(/\r?\n/g, "<br/>"),
    replySubject: encodeURIComponent("Re: " + input.subject),
    date: new Intl.DateTimeFormat("it-IT", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Rome",
    }).format(new Date()),
  });
}

/**
 * The same design as a managed Resend template (templates.create shape).
 * Triple braces on purpose: the CALLER passes pre-escaped values, the same
 * escaping /api/lead already applies before sending inline. MESSAGE_HTML
 * carries the <br/> paragraphs, so Resend must not re-escape it.
 */
export function leadEmailTemplate() {
  return {
    name: "lead-notification",
    html: shell({
      subject: "{{{SUBJECT}}}",
      date: "{{{DATE}}}",
      message: "{{{MESSAGE_HTML}}}",
      fromName: "{{{FROM_NAME}}}",
      replyto: "{{{REPLYTO}}}",
      replySubject: "{{{REPLY_SUBJECT}}}",
    }),
    variables: [
      { key: "SUBJECT", type: "string", fallbackValue: "Nuovo lead dal sito" },
      { key: "DATE", type: "string", fallbackValue: "" },
      { key: "MESSAGE_HTML", type: "string", fallbackValue: "" },
      { key: "FROM_NAME", type: "string", fallbackValue: "Lead dal sito" },
      { key: "REPLYTO", type: "string", fallbackValue: "hello@looz.design" },
      { key: "REPLY_SUBJECT", type: "string", fallbackValue: "Re:%20lead" },
    ],
  };
}
