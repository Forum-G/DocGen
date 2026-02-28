import { useState } from "react";
import { SAMPLE_ENDPOINTS } from "./constants.js";
import { generateAPIDocs } from "./api.js";
import { renderMarkdownToHTML, buildPrintHTML } from "./markdown.js";

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT      = "#F59E0B";
const ACCENT_TEXT = "#FDE68A";
const ACCENT_DIM  = "#78350F";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "30px", height: "30px", background: ACCENT,
        borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "16px", lineHeight: 1 }}>⚡</span>
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>
          DOCGEN
        </div>
        <div style={{ fontSize: "10px", color: "#333", letterSpacing: "0.08em", marginTop: "-2px" }}>
          API DOCUMENTATION GENERATOR
        </div>
      </div>
    </div>
  );
}

function Header({ hasOutput, onExport }) {
  return (
    <header style={{
      borderBottom: "1px solid #181818", padding: "0 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "54px", background: "#080808", flexShrink: 0,
    }}>
      <Logo />
      {hasOutput && (
        <button onClick={onExport} className="btn-ghost">
          ↓ Export PDF
        </button>
      )}
    </header>
  );
}

function ConfigBar({ apiTitle, setApiTitle, apiVersion, setApiVersion, loading, disabled, onGenerate }) {
  return (
    <div style={{
      borderBottom: "1px solid #141414", padding: "10px 24px",
      display: "flex", gap: "10px", alignItems: "flex-end",
      background: "#0a0a0a", flexShrink: 0,
    }}>
      {[
        { label: "API Name",  value: apiTitle,    set: setApiTitle,    width: "200px" },
        { label: "Version",   value: apiVersion,  set: setApiVersion,  width: "110px" },
      ].map(({ label, value, set, width }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {label}
          </label>
          <input
            value={value}
            onChange={(e) => set(e.target.value)}
            style={{
              background: "#141414", border: "1px solid #222", borderRadius: "6px",
              color: "#e2e8f0", padding: "6px 10px", fontSize: "12px",
              width, fontFamily: "inherit",
            }}
          />
        </div>
      ))}

      <button
        onClick={onGenerate}
        disabled={loading || disabled}
        className="btn-primary"
        style={{ marginLeft: "auto" }}
      >
        {loading ? (
          <>
            <span className="spinner" />
            GENERATING...
          </>
        ) : "⚡ GENERATE DOCS"}
      </button>
    </div>
  );
}

function PanelHeader({ color, label, right }) {
  return (
    <div style={{
      padding: "9px 16px", borderBottom: "1px solid #141414",
      background: "#080808", display: "flex", alignItems: "center", gap: "8px",
    }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, display: "inline-block", transition: "background .3s" }} />
      <span style={{ fontSize: "10px", color: "#444", letterSpacing: "0.1em" }}>{label}</span>
      {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
    </div>
  );
}

function EditorPanel({ value, onChange }) {
  const lineCount = value.split("\n").length;

  return (
    <div style={{ width: "50%", borderRight: "1px solid #141414", display: "flex", flexDirection: "column" }}>
      <PanelHeader
        color="#2a2a2a"
        label="ENDPOINT DEFINITIONS"
        right={<span style={{ fontSize: "10px", color: "#2a2a2a" }}>{lineCount} lines</span>}
      />
      <div style={{ flex: 1, position: "relative", display: "flex", overflow: "hidden" }}>
        {/* Gutter */}
        <div style={{
          width: "38px", background: "#080808", borderRight: "1px solid #141414",
          padding: "14px 0", overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column",
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{
              height: "21px", display: "flex", alignItems: "center",
              justifyContent: "flex-end", paddingRight: "7px",
              fontSize: "10px", color: "#2a2a2a", lineHeight: "21px", flexShrink: 0,
            }}>
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1, background: "#0d0d0d", border: "none", resize: "none",
            color: "#e2e8f0", fontSize: "12px", lineHeight: "21px",
            padding: "14px 14px 14px 10px",
            fontFamily: "'JetBrains Mono', monospace", tabSize: 2,
          }}
          placeholder={`POST /api/users\nDescription: Create a user\nHeaders:\n  Content-Type: application/json\nBody:\n  name: string (required)\nResponses:\n  201: Created\n  400: Bad request`}
        />
      </div>
    </div>
  );
}

function TabBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {["editor", "preview"].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="btn-tab"
          data-active={active === tab}
          style={{
            background: active === tab ? "#141414" : "none",
            border: active === tab ? `1px solid ${ACCENT}44` : "1px solid transparent",
            color: active === tab ? ACCENT : "#444",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "fadein .3s" }}>
      {[90, 60, 80, 45, 70, 55, 85].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? "22px" : "13px", width: `${w}%`, marginBottom: i === 0 ? "6px" : 0 }} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px", textAlign: "center" }}>
      <div style={{ fontSize: "38px", opacity: 0.4 }}>📄</div>
      <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#333" }}>AWAITING GENERATION</div>
      <div style={{ fontSize: "11px", color: "#222", maxWidth: "220px", lineHeight: "1.7" }}>
        Paste endpoint definitions on the left, then click ⚡ Generate Docs
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{
      background: "#1f0a0a", border: "1px solid #7f1d1d", borderRadius: "8px",
      padding: "16px", color: "#fca5a5", fontSize: "12px", animation: "fadein .3s",
    }}>
      ⚠ {message}
    </div>
  );
}

function OutputPanel({ loading, error, markdown, activeTab, onTabChange }) {
  return (
    <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
      <PanelHeader
        color={markdown ? ACCENT : "#2a2a2a"}
        label={activeTab === "editor" ? "MARKDOWN SOURCE" : "RENDERED PREVIEW"}
        right={markdown ? <TabBar active={activeTab} onChange={onTabChange} /> : null}
      />
      <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        {error && <ErrorBanner message={error} />}
        {loading && <SkeletonLoader />}
        {!loading && !error && markdown && activeTab === "editor" && (
          <pre style={{
            margin: 0, fontSize: "11.5px", lineHeight: "1.7",
            color: "#7dd3fc", whiteSpace: "pre-wrap",
            fontFamily: "'JetBrains Mono', monospace", animation: "fadein .3s",
          }}>
            {markdown}
          </pre>
        )}
        {!loading && !error && markdown && activeTab === "preview" && (
          <div
            className="md-preview"
            style={{ animation: "fadein .3s" }}
            dangerouslySetInnerHTML={{ __html: renderMarkdownToHTML(markdown) }}
          />
        )}
        {!loading && !error && !markdown && <EmptyState />}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [input,      setInput]      = useState(SAMPLE_ENDPOINTS);
  const [apiTitle,   setApiTitle]   = useState("My API");
  const [apiVersion, setApiVersion] = useState("v1.0.0");
  const [markdown,   setMarkdown]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [activeTab,  setActiveTab]  = useState("editor");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setMarkdown("");
    try {
      const md = await generateAPIDocs(apiTitle, apiVersion, input);
      setMarkdown(md);
      setActiveTab("preview");
    } catch (e) {
      setError(e.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const html = renderMarkdownToHTML(markdown);
    const page = buildPrintHTML(apiTitle, apiVersion, html);
    const w = window.open("", "_blank");
    w.document.write(page);
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        textarea, input { outline: none; }

        /* Buttons */
        .btn-primary {
          background: ${ACCENT}; border: none; border-radius: 8px; color: #000;
          padding: 8px 22px; font-size: 11px; font-weight: 700; font-family: inherit;
          letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px;
          cursor: pointer; transition: all .2s;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px ${ACCENT}55;
        }
        .btn-primary:disabled { opacity: .45; cursor: not-allowed; }

        .btn-ghost {
          background: #141414; border: 1px solid #222; border-radius: 6px;
          color: #94a3b8; padding: 7px 16px; font-size: 11px; letter-spacing: 0.06em;
          font-family: inherit; cursor: pointer; transition: all .15s;
        }
        .btn-ghost:hover { background: #1e1e1e; }

        .btn-tab {
          border-radius: 4px; padding: 3px 10px; font-size: 10px;
          letter-spacing: 0.08em; text-transform: uppercase; font-family: inherit;
          cursor: pointer; transition: all .15s;
        }
        .btn-tab:hover { color: ${ACCENT} !important; }

        /* Spinner */
        .spinner {
          width: 11px; height: 11px; border: 2px solid #0003;
          border-top-color: #000; border-radius: 50%;
          animation: spin .7s linear infinite; display: inline-block;
        }

        /* Skeleton loader */
        .skeleton {
          border-radius: 4px;
          background: linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        /* Markdown preview styles */
        .md-preview { font-family: 'Newsreader', Georgia, serif; font-size: 15px; line-height: 1.75; color: #e2e8f0; }
        .md-preview h1 { font-size: 1.9em; font-weight: 700; margin-bottom: 8px; padding-bottom: 12px; border-bottom: 2px solid ${ACCENT}; color: #fff; }
        .md-preview h2 { font-size: 1.3em; font-weight: 600; margin: 28px 0 10px; color: #fff; padding-left: 12px; border-left: 3px solid ${ACCENT}; }
        .md-preview h3 { font-size: 1.05em; font-weight: 600; margin: 18px 0 8px; color: ${ACCENT_TEXT}; }
        .md-preview h4 { font-size: .82em; font-weight: 600; margin: 14px 0 6px; color: #64748b; text-transform: uppercase; letter-spacing: .08em; }
        .md-preview p  { margin-bottom: 10px; color: #cbd5e1; }
        .md-preview code { font-family: 'JetBrains Mono', monospace; background: #1c1c1c; border: 1px solid #2d2d2d; padding: 2px 7px; border-radius: 4px; font-size: .82em; color: ${ACCENT_TEXT}; }
        .md-preview pre { background: #111; border: 1px solid #222; border-radius: 8px; padding: 18px; overflow-x: auto; margin: 14px 0; }
        .md-preview pre code { background: none; border: none; padding: 0; color: #e2e8f0; font-size: .85em; }
        .md-preview table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: .82em; font-family: 'JetBrains Mono', monospace; }
        .md-preview th { background: #151515; border: 1px solid #222; padding: 9px 12px; text-align: left; color: ${ACCENT}; font-weight: 600; font-size: .78em; text-transform: uppercase; letter-spacing: .06em; }
        .md-preview td { border: 1px solid #1c1c1c; padding: 8px 12px; color: #cbd5e1; vertical-align: top; }
        .md-preview tr:nth-child(even) td { background: #0e0e0e; }
        .md-preview ul  { margin: 10px 0 10px 18px; color: #cbd5e1; }
        .md-preview li  { margin-bottom: 3px; }
        .md-preview strong { color: #f1f5f9; font-weight: 600; }
        .md-preview hr  { border: none; border-top: 1px solid #1e1e1e; margin: 20px 0; }

        /* Animations */
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadein  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0D0D0D",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: "#e2e8f0", display: "flex", flexDirection: "column",
      }}>
        <Header hasOutput={!!markdown} onExport={handleExport} />

        <ConfigBar
          apiTitle={apiTitle}   setApiTitle={setApiTitle}
          apiVersion={apiVersion} setApiVersion={setApiVersion}
          loading={loading}
          disabled={!input.trim()}
          onGenerate={handleGenerate}
        />

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <EditorPanel value={input} onChange={setInput} />
          <OutputPanel
            loading={loading}
            error={error}
            markdown={markdown}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </>
  );
}
