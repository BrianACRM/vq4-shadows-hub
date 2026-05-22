import { useState, useRef, useCallback } from "react";

// ─── helpers ──────────────────────────────────────────────────────────────────
function ts() {
  return new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function uid() { return Math.random().toString(36).slice(2, 9); }

const CATEGORY_OPTIONS = ["Events","Mental Health","Legal","Medical","Family & Fun","SAPR","CMEO","TAD Travel","Shuttle","Safe Ride","Outdoor Rec","Vacation Deals","DAPA","Contacts","Checkin"];
const STATUS_OPTIONS   = ["draft","published"];

// ─── initial seed content ─────────────────────────────────────────────────────
const SEED_ITEMS = [
  { id:"a1", type:"event",    status:"published", title:"USO Breakfast",            category:"Events",      date:"2026-05-21", submittedBy:"Auto-import", submittedAt:"May 21, 09:00 AM", preview:"Free breakfast hosted by the USO. 0500–0700 outside VQ-3 Geedunk." },
  { id:"a2", type:"event",    status:"published", title:"Rock Painting",             category:"Events",      date:"2026-05-29", submittedBy:"Auto-import", submittedAt:"May 21, 09:00 AM", preview:"Open to all ages. 1630–1800 at The Herc pavilion." },
  { id:"a3", type:"resource", status:"published", title:"Sheppard Annex Lake Texoma",category:"Vacation Deals",date:"",       submittedBy:"LT Bruce",    submittedAt:"May 20, 02:14 PM", preview:"Cabins from $70/night at Lake Texoma. Reserve: (903) 523-4613." },
  { id:"a4", type:"resource", status:"draft",     title:"SAPR Awareness Update",    category:"SAPR",        date:"",          submittedBy:"Email Parser", submittedAt:"May 19, 11:30 AM", preview:"Updated SARC contact information and restricted reporting options." },
];

// ─── Claude API call ──────────────────────────────────────────────────────────
async function parseWithClaude(rawText, fileType = "text") {
  const systemPrompt = `You are an AI content manager for VQ-4/TACAMO Hub, a US Navy squadron community app. Your job is to extract structured information from raw text (emails, PDFs, flyers, Word docs, or any pasted content) and categorize it for the app.

The app has these sections: Events, Mental Health, Legal, Medical, Family & Fun, SAPR, CMEO, TAD Travel, Shuttle, Safe Ride, Outdoor Rec, Vacation Deals, DAPA, Contacts, Checkin.

Respond ONLY with valid JSON — no markdown, no explanation. Extract:
{
  "type": "event" OR "resource" OR "contact" OR "checkin",
  "title": "short clear title (max 8 words)",
  "category": one of the app sections listed above,
  "date": "YYYY-MM-DD if present, else null",
  "time": "e.g. 0800 or 1300-1500 or null",
  "location": "location if mentioned, else null",
  "summary": "2-3 sentence plain English summary for sailors",
  "primaryContact": "phone or email if present, else null",
  "cost": "cost info if present, else null",
  "url": "website URL if present, else null",
  "mandatory": true or false,
  "familyFriendly": true or false,
  "confidence": 0-100,
  "adminNote": "anything the admin should double-check, or null"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: `Please extract structured content from this ${fileType}:\n\n${rawText}` }],
    }),
  });
  const data = await response.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── pdf/doc text extraction (basic) ─────────────────────────────────────────
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      // For PDFs we read as text (basic extraction)
      reader.onload = e => resolve({ text: e.target.result, type: "PDF" });
      reader.readAsText(file);
    } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      reader.onload = e => resolve({ text: e.target.result, type: "Word document" });
      reader.readAsText(file);
    } else if (file.type.startsWith("image/")) {
      reader.onload = e => resolve({ text: `[Image file: ${file.name}]`, type: "image", dataUrl: e.target.result });
      reader.readAsDataURL(file);
    } else {
      reader.onload = e => resolve({ text: e.target.result, type: "document" });
      reader.readAsText(file);
    }
    reader.onerror = reject;
  });
}

// ─── Image parse via Claude vision ───────────────────────────────────────────
async function parseImageWithClaude(dataUrl, fileName) {
  const base64 = dataUrl.split(",")[1];
  const mediaType = dataUrl.split(";")[0].split(":")[1];
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: `This is a flyer or document image for a US Navy squadron community app (VQ-4/TACAMO Hub). Extract all information and return ONLY valid JSON with these fields:
{
  "type": "event" OR "resource" OR "contact",
  "title": "short clear title (max 8 words)",
  "category": one of: Events, Mental Health, Legal, Medical, Family & Fun, SAPR, CMEO, TAD Travel, Shuttle, Safe Ride, Outdoor Rec, Vacation Deals, DAPA, Contacts, Checkin,
  "date": "YYYY-MM-DD if present, else null",
  "time": "time if present else null",
  "location": "location if present else null",
  "summary": "2-3 sentence summary for sailors",
  "primaryContact": "phone or email if present else null",
  "cost": "cost if present else null",
  "url": "website if present else null",
  "mandatory": true or false,
  "familyFriendly": true or false,
  "confidence": 0-100,
  "adminNote": "anything to double-check or null"
}` }
        ]
      }]
    }),
  });
  const data = await response.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SmartAdmin() {
  const [authed, setAuthed]         = useState(false);
  const [pw, setPw]                 = useState("");
  const [pwErr, setPwErr]           = useState(false);
  const [section, setSection]       = useState("dashboard");
  const [items, setItems]           = useState(SEED_ITEMS);
  const [toast, setToast]           = useState(null);

  // ingest panel state
  const [pasteText, setPasteText]   = useState("");
  const [dragOver, setDragOver]     = useState(false);
  const [parsing, setParsing]       = useState(false);
  const [parseStage, setParseStage] = useState("");
  const [extracted, setExtracted]   = useState(null);
  const [parseError, setParseError] = useState(null);
  const [droppedFile, setDroppedFile] = useState(null);

  // edit modal state
  const [editing, setEditing]       = useState(null); // item being edited
  const fileInputRef = useRef();

  const showToast = (msg, color="#4ade80") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  // ── auth ────────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (pw === "navy2026" || pw === "admin") { setAuthed(true); setPwErr(false); }
    else setPwErr(true);
  };

  // ── file drop ───────────────────────────────────────────────────────────────
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;
    setDroppedFile(file);
    setPasteText("");
    setExtracted(null);
    setParseError(null);
    await runParse(null, file);
  }, []);

  const runParse = async (text, file) => {
    setParsing(true);
    setParseError(null);
    setExtracted(null);
    try {
      let result;
      if (file) {
        setParseStage(`Reading ${file.name}…`);
        const { text: fileText, type, dataUrl } = await readFileAsText(file);
        if (dataUrl) {
          setParseStage("Reading image with AI vision…");
          result = await parseImageWithClaude(dataUrl, file.name);
        } else {
          setParseStage(`Analyzing ${type} with AI…`);
          result = await parseWithClaude(fileText || `File: ${file.name}`, type);
        }
      } else {
        setParseStage("Analyzing text with AI…");
        result = await parseWithClaude(text, "pasted text");
      }
      setExtracted(result);
      setParseStage("Done");
    } catch (err) {
      setParseError("AI parsing failed. Check your connection and try again.");
      setParseStage("");
    } finally {
      setParsing(false);
    }
  };

  const handlePasteAnalyze = () => {
    if (!pasteText.trim()) return;
    setDroppedFile(null);
    runParse(pasteText, null);
  };

  const handlePublish = (asDraft = false) => {
    if (!extracted) return;
    const newItem = {
      id: uid(),
      type: extracted.type || "resource",
      status: asDraft ? "draft" : "published",
      title: extracted.title || "Untitled",
      category: extracted.category || "Events",
      date: extracted.date || "",
      submittedBy: "Smart Ingest",
      submittedAt: ts(),
      preview: extracted.summary || "",
    };
    setItems(prev => [newItem, ...prev]);
    setExtracted(null);
    setPasteText("");
    setDroppedFile(null);
    setParseStage("");
    showToast(asDraft ? "✓ Saved as draft" : "✓ Published to app");
  };

  const toggleStatus = (id) => {
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, status: i.status === "published" ? "draft" : "published" }
      : i
    ));
    showToast("✓ Status updated");
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    showToast("✓ Removed", "#f87171");
  };

  const saveEdit = () => {
    setItems(prev => prev.map(i => i.id === editing.id ? { ...editing } : i));
    setEditing(null);
    showToast("✓ Changes saved");
  };

  const stats = {
    published: items.filter(i => i.status === "published").length,
    drafts: items.filter(i => i.status === "draft").length,
    events: items.filter(i => i.type === "event").length,
    resources: items.filter(i => i.type === "resource").length,
  };

  const NAV = [
    { id:"dashboard", label:"Dashboard",    icon:"📊" },
    { id:"ingest",    label:"Add Content",  icon:"✨" },
    { id:"content",   label:"All Content",  icon:"📋" },
    { id:"settings",  label:"Settings",     icon:"⚙️" },
  ];

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#080c18", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ fontSize:44, marginBottom:16 }}>⚓</div>
        <div style={{ fontSize:24, color:"#c9a95d", fontWeight:"bold", letterSpacing:2, marginBottom:4 }}>VQ-4 / TACAMO HUB</div>
        <div style={{ fontSize:11, color:"#4a5568", letterSpacing:3, textTransform:"uppercase", marginBottom:36 }}>Admin Dashboard</div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,169,93,0.2)", borderRadius:16, padding:32 }}>
          <div style={{ fontSize:13, color:"#8a9bbf", marginBottom:20 }}>Enter admin password to continue</div>
          <input
            type="password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", border:`1px solid ${pwErr ? "#f87171" : "rgba(255,255,255,0.12)"}`, borderRadius:10, padding:"12px 16px", color:"#e8e4dc", fontSize:14, outline:"none", marginBottom:12, fontFamily:"inherit" }}
          />
          {pwErr && <div style={{ fontSize:12, color:"#f87171", marginBottom:12 }}>Incorrect. Demo: <strong>navy2026</strong></div>}
          <button onClick={handleLogin} style={{ width:"100%", background:"linear-gradient(135deg,#c9a95d,#8b6914)", border:"none", borderRadius:10, padding:"12px", color:"#0a0e1a", fontSize:14, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit" }}>Sign In →</button>
          <div style={{ fontSize:11, color:"#4a5568", marginTop:16 }}>Demo password: <strong style={{ color:"#8a9bbf" }}>navy2026</strong></div>
        </div>
      </div>
    </div>
  );

  // ── MAIN ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#080c18", minHeight:"100vh", color:"#e8e4dc", display:"flex" }}>

      {/* Sidebar */}
      <div style={{ width:220, background:"rgba(13,27,62,0.95)", borderRight:"1px solid rgba(201,169,93,0.15)", display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:14, color:"#c9a95d", fontWeight:"bold", letterSpacing:1 }}>⚓ VQ-4 ADMIN</div>
          <div style={{ fontSize:10, color:"#4a5568", letterSpacing:2, marginTop:3 }}>CONTENT MANAGER</div>
        </div>
        <nav style={{ flex:1, padding:"12px 0" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)} style={{ width:"100%", background:section===n.id ? "rgba(201,169,93,0.1)" : "none", border:"none", borderLeft:section===n.id ? "3px solid #c9a95d" : "3px solid transparent", padding:"12px 20px", display:"flex", alignItems:"center", gap:10, color:section===n.id ? "#c9a95d" : "#8a9bbf", fontSize:13, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:11, color:"#4a5568", marginBottom:8 }}>Logged in as Admin</div>
          <button onClick={() => setAuthed(false)} style={{ background:"none", border:"none", color:"#4a5568", fontSize:11, cursor:"pointer", padding:0 }}>← Sign out</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>

        {/* ── DASHBOARD ── */}
        {section === "dashboard" && (
          <div>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:24, fontWeight:"bold", color:"#c9a95d" }}>Dashboard</div>
              <div style={{ fontSize:13, color:"#8a9bbf", marginTop:4 }}>VQ-4/TACAMO Hub content overview</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
              {[
                { label:"Published", value:stats.published, color:"#4ade80", icon:"✅" },
                { label:"Drafts",    value:stats.drafts,    color:"#fb923c", icon:"📝" },
                { label:"Events",    value:stats.events,    color:"#60a5fa", icon:"📅" },
                { label:"Resources", value:stats.resources, color:"#c9a95d", icon:"🔍" },
              ].map((s,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:20 }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:30, fontWeight:"bold", color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:11, color:"#8a9bbf", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              {/* Recent activity */}
              <div>
                <div style={{ fontSize:12, color:"#8a9bbf", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Recent Activity</div>
                {items.slice(0,5).map((item,i) => (
                  <div key={item.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:14, marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:"bold" }}>{item.title}</span>
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:item.status==="published"?"rgba(74,222,128,0.15)":"rgba(251,146,60,0.15)", color:item.status==="published"?"#4ade80":"#fb923c" }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#4a5568" }}>{item.submittedBy} · {item.submittedAt}</div>
                  </div>
                ))}
              </div>

              {/* Quick add */}
              <div>
                <div style={{ fontSize:12, color:"#8a9bbf", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Quick Actions</div>
                <button onClick={() => setSection("ingest")} style={{ width:"100%", background:"linear-gradient(135deg,rgba(201,169,93,0.15),rgba(201,169,93,0.05))", border:"1px solid rgba(201,169,93,0.3)", borderRadius:12, padding:20, color:"#c9a95d", fontSize:14, cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:10 }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>✨</div>
                  <div style={{ fontWeight:"bold", marginBottom:4 }}>Add New Content</div>
                  <div style={{ fontSize:12, color:"#8a9bbf", lineHeight:1.5 }}>Paste text, email, or drop a PDF/flyer. AI extracts everything automatically.</div>
                </button>
                <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:16, fontSize:12, color:"#8a9bbf", lineHeight:1.7 }}>
                  <strong style={{ color:"#c9a95d" }}>How updates work:</strong><br/>
                  1. Paste email or drop file<br/>
                  2. AI extracts title, date, category, contacts<br/>
                  3. Review the extraction<br/>
                  4. Hit Publish — it goes live instantly
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INGEST ── */}
        {section === "ingest" && (
          <div style={{ maxWidth:900 }}>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:24, fontWeight:"bold", color:"#c9a95d" }}>✨ Add Content</div>
              <div style={{ fontSize:13, color:"#8a9bbf", marginTop:4 }}>Paste any text or drop any file. The AI reads it and fills in all the fields.</div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

              {/* LEFT — Input */}
              <div>
                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background:dragOver ? "rgba(201,169,93,0.12)" : "rgba(255,255,255,0.03)", border:`2px dashed ${dragOver ? "#c9a95d" : "rgba(255,255,255,0.12)"}`, borderRadius:14, padding:"28px 20px", textAlign:"center", cursor:"pointer", marginBottom:16, transition:"all 0.2s" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{droppedFile ? "📄" : "📂"}</div>
                  <div style={{ fontSize:14, color:dragOver ? "#c9a95d" : "#8a9bbf", marginBottom:4 }}>
                    {droppedFile ? droppedFile.name : "Drop a file here"}
                  </div>
                  <div style={{ fontSize:11, color:"#4a5568" }}>PDF, Word doc, image, or any text file</div>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) handleDrop({ preventDefault:()=>{}, dataTransfer:{ files:[e.target.files[0]] } }); }} />
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
                  <div style={{ fontSize:11, color:"#4a5568" }}>OR PASTE TEXT</div>
                  <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
                </div>

                {/* Paste area */}
                <textarea
                  value={pasteText}
                  onChange={e => { setPasteText(e.target.value); setExtracted(null); setParseError(null); setDroppedFile(null); }}
                  placeholder={"Paste anything here:\n\n• Email about an upcoming event\n• Copied text from a flyer\n• Information about a program\n• Contact info to add\n• MWR event details\n\nThe AI will extract and categorize everything automatically."}
                  rows={12}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:16, color:"#e8e4dc", fontSize:13, fontFamily:"inherit", lineHeight:1.6, resize:"vertical", outline:"none" }}
                />

                <div style={{ display:"flex", gap:10, marginTop:12 }}>
                  <button
                    onClick={handlePasteAnalyze}
                    disabled={parsing || !pasteText.trim()}
                    style={{ flex:1, background:parsing || !pasteText.trim() ? "rgba(201,169,93,0.2)" : "linear-gradient(135deg,#c9a95d,#8b6914)", border:"none", borderRadius:10, padding:"12px", color:"#0a0e1a", fontSize:14, fontWeight:"bold", cursor:parsing||!pasteText.trim()?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {parsing ? <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> {parseStage}</> : "🤖 Analyze with AI"}
                  </button>
                  {(pasteText || droppedFile) && (
                    <button onClick={() => { setPasteText(""); setDroppedFile(null); setExtracted(null); setParseError(null); setParseStage(""); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 16px", color:"#8a9bbf", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Clear</button>
                  )}
                </div>

                {parseError && (
                  <div style={{ marginTop:12, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", borderRadius:10, padding:14, fontSize:13, color:"#f87171" }}>⚠️ {parseError}</div>
                )}
              </div>

              {/* RIGHT — Extraction result */}
              <div>
                {!extracted && !parsing && (
                  <div style={{ height:"100%", minHeight:300, background:"rgba(255,255,255,0.02)", border:"2px dashed rgba(255,255,255,0.06)", borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, padding:24 }}>
                    <div style={{ fontSize:36, opacity:0.3 }}>🤖</div>
                    <div style={{ fontSize:13, color:"#4a5568", textAlign:"center", lineHeight:1.6 }}>AI extraction results will appear here.<br/>Paste text or drop a file to get started.</div>
                  </div>
                )}

                {parsing && (
                  <div style={{ height:"100%", minHeight:300, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(201,169,93,0.2)", borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
                    <div style={{ fontSize:36 }}>🤖</div>
                    <div style={{ fontSize:14, color:"#c9a95d" }}>{parseStage || "Reading content…"}</div>
                    <div style={{ display:"flex", gap:6 }}>
                      {["Reading","Classifying","Extracting","Formatting"].map((s,i) => (
                        <div key={s} style={{ fontSize:10, padding:"3px 8px", background:"rgba(201,169,93,0.1)", border:"1px solid rgba(201,169,93,0.2)", borderRadius:20, color:"#c9a95d", animation:`pulse 1.5s ease-in-out ${i*0.3}s infinite` }}>{s}</div>
                      ))}
                    </div>
                  </div>
                )}

                {extracted && !parsing && (
                  <div>
                    {/* Confidence */}
                    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:11, color:"#8a9bbf" }}>AI Confidence</span>
                      <div style={{ flex:1, background:"rgba(255,255,255,0.08)", borderRadius:4, height:6 }}>
                        <div style={{ width:`${extracted.confidence}%`, height:"100%", borderRadius:4, background:extracted.confidence>80?"#4ade80":extracted.confidence>60?"#fb923c":"#f87171" }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:"bold", color:extracted.confidence>80?"#4ade80":"#fb923c" }}>{extracted.confidence}%</span>
                    </div>

                    {/* Type badge */}
                    <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,169,93,0.15)", border:"1px solid rgba(201,169,93,0.35)", borderRadius:20, padding:"4px 14px", fontSize:11, color:"#c9a95d", marginBottom:16, fontWeight:"bold", letterSpacing:1 }}>
                      {extracted.type?.toUpperCase() || "CONTENT"}
                    </div>

                    {/* Editable fields */}
                    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", marginBottom:16 }}>
                      {[
                        { key:"title",          label:"Title",    icon:"📌" },
                        { key:"category",       label:"Category", icon:"🏷️" },
                        { key:"date",           label:"Date",     icon:"📅" },
                        { key:"time",           label:"Time",     icon:"🕐" },
                        { key:"location",       label:"Location", icon:"📍" },
                        { key:"primaryContact", label:"Contact",  icon:"📞" },
                        { key:"cost",           label:"Cost",     icon:"💰" },
                        { key:"url",            label:"URL",      icon:"🔗" },
                        { key:"summary",        label:"Summary",  icon:"📝" },
                      ].filter(f => extracted[f.key] && extracted[f.key] !== "null").map((field, i) => (
                        <div key={field.key} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:i%2===0?"transparent":"rgba(255,255,255,0.01)" }}>
                          <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{field.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:10, color:"#4a5568", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{field.label}</div>
                            <input
                              value={extracted[field.key] || ""}
                              onChange={e => setExtracted(prev => ({ ...prev, [field.key]: e.target.value }))}
                              style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"6px 10px", color:"#e8e4dc", fontSize:13, outline:"none", fontFamily:"inherit" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Flags */}
                    <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                      {extracted.mandatory && <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(248,113,113,0.15)", color:"#f87171", border:"1px solid rgba(248,113,113,0.3)" }}>⚠️ Mandatory</span>}
                      {extracted.familyFriendly && <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(96,165,250,0.15)", color:"#60a5fa", border:"1px solid rgba(96,165,250,0.3)" }}>👨‍👩‍👧 Family Friendly</span>}
                    </div>

                    {/* Admin note */}
                    {extracted.adminNote && extracted.adminNote !== "null" && (
                      <div style={{ background:"rgba(251,146,60,0.08)", border:"1px solid rgba(251,146,60,0.25)", borderRadius:10, padding:14, marginBottom:16, fontSize:12, color:"#fb923c", lineHeight:1.6 }}>
                        ⚠️ <strong>Admin Note:</strong> {extracted.adminNote}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={() => handlePublish(false)} style={{ flex:1, background:"linear-gradient(135deg,#4ade80,#16a34a)", border:"none", borderRadius:10, padding:"12px", color:"#0a0e1a", fontSize:13, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit" }}>✓ Publish to App</button>
                      <button onClick={() => handlePublish(true)} style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"12px", color:"#e8e4dc", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save as Draft</button>
                      <button onClick={() => { setExtracted(null); setParseStage(""); }} style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10, padding:"12px 14px", color:"#f87171", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* How it works */}
            <div style={{ marginTop:28, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:24 }}>
              <div style={{ fontSize:13, color:"#8a9bbf", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>What You Can Drop or Paste</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[
                  { icon:"📧", label:"Email", desc:"Forward or paste an email from MWR, FFSC, ODR, USO, or any org." },
                  { icon:"📄", label:"PDF Flyer", desc:"Drop a PDF event flyer — AI reads the text and image content." },
                  { icon:"🖼️", label:"Image Flyer", desc:"Drop a JPG or PNG flyer — AI uses vision to extract all details." },
                  { icon:"📝", label:"Word Doc", desc:"Drop a .docx or paste copied Word text." },
                  { icon:"📋", label:"Plain Text", desc:"Any copied text — program descriptions, contact info, schedules." },
                  { icon:"🔗", label:"Copy-Paste from Web", desc:"Copy text from any website or Facebook post and paste it in." },
                ].map((item,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:14 }}>
                    <div style={{ fontSize:20, marginBottom:6 }}>{item.icon}</div>
                    <div style={{ fontSize:12, fontWeight:"bold", color:"#c9a95d", marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:11, color:"#8a9bbf", lineHeight:1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ALL CONTENT ── */}
        {section === "content" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div>
                <div style={{ fontSize:24, fontWeight:"bold", color:"#c9a95d" }}>All Content</div>
                <div style={{ fontSize:13, color:"#8a9bbf", marginTop:4 }}>{items.length} items · {stats.published} published · {stats.drafts} drafts</div>
              </div>
              <button onClick={() => setSection("ingest")} style={{ background:"linear-gradient(135deg,#c9a95d,#8b6914)", border:"none", borderRadius:10, padding:"10px 20px", color:"#0a0e1a", fontSize:13, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit" }}>＋ Add Content</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {items.map(item => (
                <div key={item.id} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:item.status==="published"?"#4ade80":"#fb923c", flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4, flexWrap:"wrap" }}>
                      <span style={{ fontSize:14, fontWeight:"bold" }}>{item.title}</span>
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(201,169,93,0.15)", color:"#c9a95d" }}>{item.category}</span>
                      {item.date && <span style={{ fontSize:11, color:"#60a5fa" }}>📅 {item.date}</span>}
                    </div>
                    <div style={{ fontSize:11, color:"#8a9bbf" }}>{item.preview}</div>
                    <div style={{ fontSize:10, color:"#4a5568", marginTop:4 }}>Added by {item.submittedBy} · {item.submittedAt}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <button onClick={() => setEditing({ ...item })} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"6px 12px", color:"#8a9bbf", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Edit</button>
                    <button onClick={() => toggleStatus(item.id)} style={{ background:item.status==="published"?"rgba(251,146,60,0.12)":"rgba(74,222,128,0.12)", border:`1px solid ${item.status==="published"?"rgba(251,146,60,0.3)":"rgba(74,222,128,0.3)"}`, borderRadius:8, padding:"6px 12px", color:item.status==="published"?"#fb923c":"#4ade80", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                      {item.status==="published" ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => deleteItem(item.id)} style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:8, padding:"6px 12px", color:"#f87171", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {section === "settings" && (
          <div style={{ maxWidth:560 }}>
            <div style={{ fontSize:24, fontWeight:"bold", color:"#c9a95d", marginBottom:28 }}>Settings</div>
            {[
              { label:"Command Name", placeholder:"VQ-4 / TACAMO", desc:"Shown in the app header." },
              { label:"Admin Password", placeholder:"Change shared password", desc:"Anyone with this password can update the app." },
              { label:"Ombudsman Email 1", placeholder:"VQ4ombudsman@gmail.com", desc:"Primary ombudsman contact." },
              { label:"Ombudsman Email 2", placeholder:"Shadowombudsman@gmail.com", desc:"Secondary ombudsman contact." },
              { label:"CDO Phone", placeholder:"(405) 831-2448", desc:"Command Duty Officer — shown on home screen." },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:20, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:"bold", marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:11, color:"#8a9bbf", marginBottom:12 }}>{s.desc}</div>
                <input placeholder={s.placeholder} style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 12px", color:"#e8e4dc", fontSize:13, outline:"none", fontFamily:"inherit" }}/>
              </div>
            ))}

            <div style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:"bold", color:"#4ade80", marginBottom:4 }}>🤖 AI Auto-Categorization</div>
              <div style={{ fontSize:11, color:"#8a9bbf", marginBottom:12 }}>When enabled, AI reads new content and suggests category, date, contacts, and type automatically.</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:22, background:"#4ade80", borderRadius:11, position:"relative" }}>
                  <div style={{ position:"absolute", right:3, top:3, width:16, height:16, background:"#fff", borderRadius:"50%" }}/>
                </div>
                <span style={{ fontSize:12, color:"#4ade80" }}>Enabled</span>
              </div>
            </div>

            <div style={{ background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:"bold", color:"#38bdf8", marginBottom:4 }}>📧 Email Parser</div>
              <div style={{ fontSize:11, color:"#8a9bbf", marginBottom:12 }}>Set up an email address that auto-forwards to this system. New emails get parsed and added as drafts automatically.</div>
              <input placeholder="app-updates@gmail.com (your parser inbox)" style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:8, padding:"10px 12px", color:"#e8e4dc", fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8 }}/>
              <div style={{ fontSize:11, color:"#4a5568" }}>Requires Zapier/Make.com integration — see deployment guide.</div>
            </div>

            <button onClick={() => showToast("✓ Settings saved")} style={{ background:"linear-gradient(135deg,#c9a95d,#8b6914)", border:"none", borderRadius:10, padding:"11px 24px", color:"#0a0e1a", fontSize:13, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit" }}>Save Settings</button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:24 }}>
          <div style={{ background:"#0d1b3e", border:"1px solid rgba(201,169,93,0.3)", borderRadius:16, padding:28, width:"100%", maxWidth:500, maxHeight:"80vh", overflowY:"auto" }}>
            <div style={{ fontSize:16, fontWeight:"bold", color:"#c9a95d", marginBottom:20 }}>Edit Item</div>
            {[
              { key:"title", label:"Title" },
              { key:"category", label:"Category" },
              { key:"date", label:"Date" },
              { key:"preview", label:"Description" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:"#8a9bbf", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{f.label}</div>
                <input value={editing[f.key] || ""} onChange={e => setEditing(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"10px 12px", color:"#e8e4dc", fontSize:13, outline:"none", fontFamily:"inherit" }}/>
              </div>
            ))}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:"#8a9bbf", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Status</div>
              <select value={editing.status} onChange={e => setEditing(prev => ({ ...prev, status: e.target.value }))}
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"10px 12px", color:"#e8e4dc", fontSize:13, outline:"none", width:"100%" }}>
                <option value="published" style={{ background:"#0d1b3e" }}>Published</option>
                <option value="draft" style={{ background:"#0d1b3e" }}>Draft</option>
              </select>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={saveEdit} style={{ flex:1, background:"linear-gradient(135deg,#c9a95d,#8b6914)", border:"none", borderRadius:10, padding:"11px", color:"#0a0e1a", fontSize:13, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
              <button onClick={() => setEditing(null)} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"11px 18px", color:"#8a9bbf", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:toast.color||"#4ade80", color:"#0a0e1a", padding:"10px 24px", borderRadius:30, fontSize:13, fontWeight:"bold", zIndex:200, boxShadow:`0 4px 24px ${(toast.color||"#4ade80")}66` }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
