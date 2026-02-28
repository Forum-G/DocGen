/**
 * Lightweight Markdown → HTML renderer.
 * Supports: headings, tables, fenced code blocks,
 * inline code, bold, italic, unordered lists, and horizontal rules.
 */
export function renderMarkdownToHTML(md) {
  if (!md) return "";

  let html = md;

  // Fenced code blocks (must come before inline code)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, _lang, code) => {
    const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Headings
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm,  "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm,   "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm,    "<h1>$1</h1>");

  // Tables
  html = html.replace(/(\|.+\|\n)+/g, (table) => {
    const rows = table.trim().split("\n");
    let result = "<table>";
    rows.forEach((row, i) => {
      const cells = row.split("|").filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);
      if (cells.every((c) => c.trim().match(/^[-:]+$/))) return; // skip separator row
      const tag = i === 0 ? "th" : "td";
      result += "<tr>" + cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("") + "</tr>";
    });
    result += "</table>";
    return result;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g,     "<em>$1</em>");

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr/>");

  return html;
}

/**
 * Generates a print-ready HTML page string for PDF export.
 */
export function buildPrintHTML(title, version, markdownHTML) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${title} ${version} — API Docs</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Newsreader:wght@400;600;700&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 15px;
      line-height: 1.75;
      color: #1a1a1a;
      padding: 48px 64px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { font-size: 2.2em; font-weight: 700; margin-bottom: 8px; border-bottom: 3px solid #F59E0B; padding-bottom: 12px; }
    h2 { font-size: 1.4em; font-weight: 600; margin: 32px 0 12px; border-left: 4px solid #F59E0B; padding-left: 12px; }
    h3 { font-size: 1.1em; font-weight: 600; margin: 20px 0 8px; color: #333; }
    h4 { font-size: .88em; font-weight: 600; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: .06em; color: #666; }
    p  { margin-bottom: 12px; }
    code {
      font-family: 'JetBrains Mono', monospace;
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: .84em;
    }
    pre {
      font-family: 'JetBrains Mono', monospace;
      background: #1a1a1a;
      color: #e2e8f0;
      padding: 20px;
      border-radius: 8px;
      overflow: auto;
      font-size: .84em;
      margin: 16px 0;
      line-height: 1.55;
    }
    pre code { background: none; padding: 0; color: inherit; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: .88em; }
    th { background: #f8f8f8; padding: 10px 14px; text-align: left; font-weight: 600; border: 1px solid #ddd; }
    td { padding: 9px 14px; border: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) td { background: #fafafa; }
    ul, ol { margin: 12px 0 12px 24px; }
    li { margin-bottom: 4px; }
    hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    strong { font-weight: 600; }
    @media print {
      body { padding: 24px 32px; }
      pre { break-inside: avoid; }
      h2  { break-before: auto; }
    }
  </style>
</head>
<body>${markdownHTML}</body>
</html>`;
}
