import { describe, expect, it } from "vitest";

import { leadEmailHtml, leadEmailTemplate } from "../email-template";

// The email lands user-typed strings inside HTML that gets opened in Lorenzo's
// inbox, so escaping is not cosmetic here: an unescaped message would let any
// visitor inject markup (or a phishing layout) into his mail client.
describe("lead email", () => {
  const html = leadEmailHtml({
    subject: 'Preventivo <b>"sito"</b>',
    message: "Riga uno\nRiga due\n\n<script>alert(1)</script>",
    replyto: "maria@example.it",
    fromName: "Maria & Co.",
  });

  it("escapes every user field", () => {
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Preventivo &lt;b&gt;&quot;sito&quot;&lt;/b&gt;");
    expect(html).toContain("Maria &amp; Co.");
  });

  it("keeps paragraphs as line breaks", () => {
    expect(html).toContain("Riga uno<br/>Riga due");
  });

  it("wears the brand: black bar, ochre action with dark text, forest link", () => {
    expect(html).toContain("#1B1813");
    expect(html).toContain("#E8A12C");
    // the button's text colour is the ink, never white (DESIGN.md rule)
    expect(html).toMatch(/background:#E8A12C[\s\S]{0,400}color:#221E17/);
    expect(html).toContain("#143A2B");
  });

  it("declares exactly the variables its template markup uses", () => {
    const tpl = leadEmailTemplate();
    const used = new Set([...tpl.html.matchAll(/\{\{\{(\w+)\}\}\}/g)].map((m) => m[1]));
    const declared = new Set(tpl.variables.map((v) => v.key));
    // Both directions: an undeclared placeholder renders literally in the sent
    // mail; a declared-but-unused variable is drift waiting to confuse someone.
    expect([...used].sort()).toEqual([...declared].sort());
  });
});
