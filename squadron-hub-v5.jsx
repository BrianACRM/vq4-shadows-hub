import { useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⚓" },
  { id: "events", label: "Events", icon: "📅" },
  { id: "resources", label: "Resources", icon: "🔍" },
  { id: "contacts", label: "Contacts", icon: "📞" },
];

const EVENTS = [
  { id: 1,  title: "USO Breakfast", date: "2026-05-21", org: "USO", time: "0500–0700", location: "Outside VQ-3 Geedunk", desc: "Free breakfast hosted by the USO.", cost: "Free", family: true },
  { id: 2,  title: "Midnight Coffee Club", date: "2026-05-28", org: "USO", time: "2300–0100", location: "VQ-3/4 Spaces (roaming cart)", desc: "USO roaming coffee and goodies through the VQ-3/4 spaces. Night crew, this one's for you.", cost: "Free", family: false },
  { id: 3,  title: "Midnight Coffee Club", date: "2026-05-29", org: "USO", time: "2300–0100", location: "VQ-3/4 Spaces (roaming cart)", desc: "Night two of the USO Midnight Coffee Club.", cost: "Free", family: false },
  { id: 4,  title: "Rock Painting", date: "2026-05-29", org: "TACAMO", time: "1630–1800", location: "The Herc — pavilion outside CNATT HIBAY", desc: "Open to all ages, sailors, and family members! Paint rocks or just come watch. Bring your own or use ours.", cost: "Free", family: true },
  { id: 5,  title: "Open Rec Saturday", date: "2026-05-30", org: "ODR", time: "1000–1300", location: "Outdoor Rec — Bldg 478", desc: "Ping pong, foosball, cornhole, giant Jenga, ladder ball, rock room climbing. Kids' craft available.", cost: "Free", family: true },
  { id: 6,  title: "TACAMO Family Yoga", date: "2026-06-05", org: "TACAMO", time: "1630", location: "The Herc pavilion (behind A-130)", desc: "Restorative yoga with the Health Promotion Office. Open to all TACAMO. Come and go as you please.", cost: "Free", family: true },
  { id: 7,  title: "Soup Lunch + USO Therapy Dogs", date: "2026-06-18", org: "USO", time: "1100–1300", location: "Training classroom, VQ-3/4 Spaces", desc: "Free soup lunch + therapy dogs. Free and open to all.", cost: "Free", family: true },
  { id: 8,  title: "ODR: Wichita Mtns Day Hike", date: "2026-05-16", org: "ODR", time: "Shuttle provided", location: "Wichita Mtns. Wildlife Refuge", desc: "Day hike. Lunch included. Shuttle from Tinker.", cost: "$5 military", family: true },
  { id: 9,  title: "ODR: Buffalo River Float (3-day)", date: "2026-05-22", org: "ODR", time: "May 22–25", location: "Buffalo National River, AR", desc: "3-day kayak camping float on America's first Scenic River. ~30 miles.", cost: "$40 AD/NG · $70 civilian", family: true },
  { id: 10, title: "ODR: Spring Kickoff Campout", date: "2026-05-29", org: "ODR", time: "May 29–30", location: "Wichita Mtns.", desc: "Kayak, SUP, day hike, Saturday meals provided.", cost: "$20 AD/NG · $30 civilian", family: true },
  { id: 11, title: "ODR: Summerfest", date: "2026-06-06", org: "ODR", time: "All day", location: "ALS Field, Tinker AFB", desc: "Live music, free pool, bowling specials, cornhole, car show.", cost: "Free (some for-fee)", family: true },
  { id: 12, title: "ODR: Kayaking Stinchcomb Refuge", date: "2026-06-07", org: "ODR", time: "Shuttle provided", location: "Lake Overholser, OKC", desc: "Kayaking at Stinchcomb Wildlife Refuge. More TBA.", cost: "TBA", family: true },
  { id: 13, title: "ODR: Great Campout", date: "2026-06-12", org: "ODR", time: "June 12–13", location: "ALS Field, Tinker AFB", desc: "Free campout — stars, outdoor movie, swim, s'mores, crafts, breakfast. Register with ODR.", cost: "Free", family: true },
  { id: 14, title: "ODR: Wichita Mtns Day Hike", date: "2026-06-14", org: "ODR", time: "Shuttle provided", location: "Wichita Mtns. Wildlife Refuge", desc: "Second hike of the season. Lunch included.", cost: "$5 military", family: true },
  { id: 15, title: "ODR: Buffalo River Float (2-day)", date: "2026-06-19", org: "ODR", time: "June 19–21", location: "Buffalo National River, AR", desc: "2-day kayak camping float. ~30 miles. Shuttle provided.", cost: "$40 AD/NG · $70 civilian", family: true },
  { id: 16, title: "ODR: Whitewater Rafting & Rock Climbing", date: "2026-06-25", org: "ODR", time: "June 25–28", location: "Cañon City / Colorado Springs, CO", desc: "1 day Royal Gorge rafting + 1 day rock climbing. Transport & food included. Must be 16+.", cost: "$200 AD/NG · $525 civilian", family: false },
  { id: 17, title: "ODR: High Points Adventure", date: "2026-08-21", org: "ODR", time: "Aug 21–24", location: "Leadville, Colorado", desc: "Summit Mt. Elbert (14,438'). Shuttle provided.", cost: "$75 AD/NG · $250 civilian", family: false },
];

const ORG_COLORS = {
  USO: "#f472b6", ODR: "#4ade80", TACAMO: "#60a5fa",
  FFSC: "#a78bfa", Chapel: "#c084fc", Command: "#8a9bbf",
};

const RESOURCE_CATEGORIES = [
  { id: "mentalhealth", label: "Mental Health",       icon: "🧠", color: "#34d399" },
  { id: "legal",        label: "Legal",               icon: "⚖️", color: "#facc15" },
  { id: "medical",      label: "Medical",             icon: "🏥", color: "#60a5fa" },
  { id: "family",       label: "Family & Fun",        icon: "👨‍👩‍👧", color: "#f472b6" },
  { id: "sapr",         label: "SAPR",                icon: "🛡️", color: "#f87171" },
  { id: "cmeo",         label: "CMEO",                icon: "🤝", color: "#a78bfa" },
  { id: "tad",          label: "TAD Travel",          icon: "✈️", color: "#38bdf8" },
  { id: "shuttle",      label: "TACAMO Shuttle",      icon: "🚌", color: "#fb923c" },
  { id: "saferide",     label: "Safe Ride Program",   icon: "🚕", color: "#fbbf24" },
  { id: "odr",          label: "Outdoor Rec (ODR)",   icon: "🏕️", color: "#4ade80" },
  { id: "vacation",     label: "Vacation Deals",      icon: "🌴", color: "#c9a95d" },
  { id: "dapa",         label: "DAPA Program",        icon: "ℹ️", color: "#8a9bbf" },
];

// ── SHUTTLE SCHEDULE (from flyer) ─────────────────────────────────────────────
// Each run: [TACAMO departs, Barracks arrives, DFAC/Galley arrives, Exchange arrives]
// null = not a stop on that run
const SHUTTLE_RUNS = [
  { tacamo: "0500", barracks: "0520", dfac: null,   exchange: null   },
  { tacamo: "0540", barracks: "0600", dfac: null,   exchange: null   },
  { tacamo: "0620", barracks: "0640", dfac: null,   exchange: null   },
  { tacamo: "0700", barracks: "0720", dfac: null,   exchange: null   },
  { tacamo: "0740", barracks: "0800", dfac: null,   exchange: null   },
  { tacamo: "1030", barracks: null,   dfac: "1050", exchange: null   },
  { tacamo: "1110", barracks: null,   dfac: "1130", exchange: null   },
  { tacamo: "1150", barracks: null,   dfac: "1210", exchange: null   },
  { tacamo: "1500", barracks: "1520", dfac: null,   exchange: null   },
  { tacamo: "1540", barracks: "1600", dfac: null,   exchange: "1610" },
  { tacamo: "1620", barracks: "1640", dfac: null,   exchange: "1650" },
  { tacamo: "1700", barracks: "1720", dfac: null,   exchange: "1730" },
  { tacamo: "1740", barracks: "1800", dfac: null,   exchange: "1810" },
  { tacamo: "1820", barracks: "1840", dfac: null,   exchange: "1850" },
  { tacamo: "1900", barracks: "1920", dfac: null,   exchange: "1930" },
  { tacamo: "1940", barracks: "2000", dfac: null,   exchange: "2010" },
  { tacamo: null,   barracks: "2015", dfac: null,   exchange: null,  last: true },
];

const PICKUP_LOCATIONS = [
  { stop: "TACAMO", detail: "Outside Bldg 820", icon: "⚓" },
  { stop: "BARRACKS", detail: "Arnold St. Parking Lot", icon: "🏠" },
  { stop: "DFAC / GALLEY", detail: "DFAC Parking Lot", icon: "🍽️" },
  { stop: "EXCHANGE", detail: "Between Exchange and Commissary", icon: "🛒" },
];

function getNow() {
  const now = new Date();
  return now.getHours() * 100 + now.getMinutes();
}

function timeToInt(t) {
  if (!t) return null;
  return parseInt(t.replace(":", ""), 10);
}

function ShuttleScreen() {
  const [activeStop, setActiveStop] = useState("tacamo");
  const now = getNow();

  const stopKey = { tacamo: "tacamo", barracks: "barracks", dfac: "dfac", exchange: "exchange" };
  const stopLabel = { tacamo: "TACAMO", barracks: "Barracks", dfac: "DFAC/Galley", exchange: "Exchange" };
  const stopColor = { tacamo: "#60a5fa", barracks: "#4ade80", dfac: "#fb923c", exchange: "#f472b6" };

  const runsForStop = SHUTTLE_RUNS.filter(r => r[activeStop] !== null);

  const nextRun = runsForStop.find(r => timeToInt(r[activeStop]) > now);

  return (
    <div>
      {/* Header card */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a3e, #2a2a5e)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14, padding: 18, marginBottom: 20,
      }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "#fff", letterSpacing: 1, marginBottom: 2 }}>🚌 TACAMO SHUTTLE</div>
        <div style={{ fontSize: 11, color: "#8a9bbf", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Monday – Friday · Bldg 820</div>

        {nextRun && (
          <div style={{
            background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 4,
          }}>
            <div style={{ fontSize: 10, color: "#4ade80", letterSpacing: 1, marginBottom: 3 }}>NEXT DEPARTURE FROM {stopLabel[activeStop].toUpperCase()}</div>
            <div style={{ fontSize: 26, fontWeight: "bold", color: "#4ade80" }}>{nextRun[activeStop]}</div>
          </div>
        )}
        {!nextRun && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, color: "#f87171" }}>No more runs today from this stop.</div>
          </div>
        )}
      </div>

      {/* Stop selector */}
      <div style={{ fontSize: 10, color: "#8a9bbf", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>View schedule from stop</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {Object.entries(stopLabel).map(([key, label]) => (
          <button key={key} onClick={() => setActiveStop(key)} style={{
            background: activeStop === key ? `${stopColor[key]}22` : "rgba(255,255,255,0.04)",
            border: `1px solid ${activeStop === key ? stopColor[key] : "rgba(255,255,255,0.09)"}`,
            borderRadius: 10, padding: "10px 8px", cursor: "pointer",
            color: activeStop === key ? stopColor[key] : "#8a9bbf",
            fontSize: 12, fontWeight: activeStop === key ? "bold" : "normal",
            fontFamily: "inherit",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Schedule table */}
      <div style={{ fontSize: 10, color: "#8a9bbf", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Full Schedule</div>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, overflow: "hidden", marginBottom: 20,
      }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "rgba(255,255,255,0.05)" }}>
          {["TACAMO", "Barracks", "DFAC", "Exchange"].map((h, i) => (
            <div key={i} style={{ padding: "8px 6px", fontSize: 10, color: "#8a9bbf", textAlign: "center", letterSpacing: 0.5, fontWeight: "bold" }}>{h}</div>
          ))}
        </div>
        {SHUTTLE_RUNS.map((run, i) => {
          const tacamoInt = timeToInt(run.tacamo);
          const isNext = nextRun && run === nextRun && activeStop === "tacamo";
          const isPast = tacamoInt && tacamoInt < now;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: run.last ? "rgba(248,113,113,0.06)" : isNext ? "rgba(74,222,128,0.08)" : "transparent",
            }}>
              {["tacamo", "barracks", "dfac", "exchange"].map((stop, j) => (
                <div key={j} style={{
                  padding: "9px 6px",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: run[stop] && !isPast ? "bold" : "normal",
                  color: run[stop]
                    ? isPast ? "#4a5568"
                      : stop === activeStop ? stopColor[stop]
                      : "#e8e4dc"
                    : "#2a3040",
                }}>
                  {run[stop] || "—"}
                  {run.last && stop === "barracks" && run[stop] && (
                    <span style={{ fontSize: 9, color: "#f87171", marginLeft: 3 }}>END</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Pickup locations */}
      <div style={{ fontSize: 10, color: "#8a9bbf", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Pickup Locations</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {PICKUP_LOCATIONS.map((loc, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 18 }}>{loc.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: "bold", color: "#c9a95d", letterSpacing: 0.5 }}>{loc.stop}</div>
              <div style={{ fontSize: 12, color: "#8a9bbf" }}>{loc.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>📞</span>
        <div>
          <div style={{ fontSize: 11, color: "#8a9bbf" }}>Questions about the shuttle?</div>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#4ade80" }}>SCW-1 CDO: (405) 831-4973</div>
        </div>
      </div>
    </div>
  );
}

// ── MH FLOWCHART (interactive, from the TACAMO Help Poster) ──────────────────
const MH_NODES = {
  start: {
    type: "question",
    text: "Are you feeling sad, stressed, hopeless, or over it?",
    yes: "howBad",
    no: "findCommunity",
  },
  howBad: {
    type: "question",
    text: "Are you having thoughts of hurting yourself or others?",
    yes: "crisis",
    no: "howSoon",
  },
  howSoon: {
    type: "question",
    text: "Do you need to talk to someone right now?",
    yes: "immediate",
    no: "schedule",
  },
  crisis: {
    type: "result",
    color: "#f87171",
    title: "Get Help Now",
    icon: "🆘",
    items: [
      { label: "Veterans / Military Crisis Line", value: "1-800-273-8255", highlight: true },
      { label: "Suicide Prevention Lifeline", value: "Call 988", highlight: true },
      { label: "Base Mental Health (walk-ins daily)", value: "405-582-6603", highlight: false },
      { label: "Walk in to 72nd MDG, 2nd Floor — you will be seen immediately", value: null, highlight: false },
    ],
    note: "Walk-ins are available daily at Base Mental Health (72nd MDG, 2nd floor) for anyone with thoughts of suicide. You will be screened and seen immediately.",
  },
  immediate: {
    type: "result",
    color: "#fb923c",
    title: "Talk to Someone Now",
    icon: "📞",
    items: [
      { label: "Military OneSource (24/7)", value: "1-800-342-9647", highlight: true },
      { label: "Veterans / Military Crisis Line", value: "1-800-273-8255", highlight: true },
      { label: "Virtual Counseling (Fleet & Family)", value: "1-855-205-6749", highlight: false },
      { label: "TACAMO Chaplain (same day, confidential)", value: "405-739-3318", highlight: false },
    ],
    note: "When calling Military OneSource, do NOT self-diagnose. Say: 'I need to talk about work stress / family issues / financial stress.' This gets you the right level of care.",
  },
  schedule: {
    type: "branch",
    title: "Which fits your situation?",
    color: "#60a5fa",
    options: [
      { label: "Off the record — I just need to talk", next: "offRecord" },
      { label: "Short-term counseling, non-medical", next: "mflc" },
      { label: "Medical counseling / medication", next: "medical" },
      { label: "Chaplain — spiritual or just to talk", next: "chaplain" },
    ],
  },
  offRecord: {
    type: "result",
    color: "#4ade80",
    title: "Military OneSource — Off the Record",
    icon: "🗣️",
    items: [
      { label: "Military OneSource", value: "1-800-342-9647", highlight: true },
      { label: "12 free sessions per topic per year", value: null, highlight: false },
      { label: "Face-to-face, phone, or video options", value: null, highlight: false },
      { label: "100% outside your military record", value: null, highlight: false },
    ],
    note: "Do NOT say 'I have depression or anxiety.' Say: 'I need to talk about work stressors, family, finances, marriage, parenting.' This ensures you get routed correctly.",
  },
  mflc: {
    type: "result",
    color: "#4ade80",
    title: "Military Family Life Counselor (MFLC)",
    icon: "🗣️",
    items: [
      { label: "TACAMO MFLC", value: "405-508-3463", highlight: true },
      { label: "Tinker AFB MFLC (at MFRC)", value: "405-739-2747", highlight: false },
      { label: "Leave voicemail — name & callback number", value: null, highlight: false },
      { label: "Non-medical, short-term, confidential", value: null, highlight: false },
    ],
    note: "Scheduling may take several weeks. Call early. The MFLC provides non-medical counseling for life stressors — work, family, relationships, deployment.",
  },
  medical: {
    type: "result",
    color: "#60a5fa",
    title: "Medical Counseling Options",
    icon: "🏥",
    items: [
      { label: "72nd Behavioral Health (1st Floor)", value: "405-734-2778", highlight: true },
      { label: "Base Mental Health (2nd Floor)", value: "405-582-6603", highlight: false },
      { label: "Your PCP (1st Floor, 72 Medical Clinic)", value: "Can manage most MH meds", highlight: false },
    ],
    note: "PRP/flight personnel: seeking care at the 72nd MDG may result in temporary PRP/flight down status until stability is demonstrated. If MH turns you away, your symptoms may not be severe enough — they will refer you to the right level of care.",
  },
  chaplain: {
    type: "result",
    color: "#c084fc",
    title: "TACAMO Chaplain",
    icon: "✝️",
    items: [
      { label: "TACAMO Chaplain", value: "405-739-3318", highlight: true },
      { label: "Alt line", value: "405-739-3999", highlight: false },
      { label: "Email", value: "TACAMO_CHAPLAIN@us.navy.mil", highlight: false },
      { label: "100% confidential · Same-day · Spiritual or non-spiritual", value: null, highlight: false },
    ],
    note: "The chaplain can provide support for relationships, stress, anxiety, work issues, violence, assault, alcohol or drugs — anything you're struggling with. Cannot be compelled to testify.",
  },
  findCommunity: {
    type: "result",
    color: "#4ade80",
    title: "Find Community & Purpose",
    icon: "🌟",
    items: [
      { label: "Check the Events tab for upcoming activities", value: null, highlight: false },
      { label: "Outdoor Recreation (ODR)", value: "405-734-5875", highlight: false },
      { label: "Join a faith group, hobby, or volunteer event", value: null, highlight: false },
      { label: "Command Ombudsman", value: "VQ4ombudsman@gmail.com · Shadowombudsman@gmail.com", highlight: false },
    ],
    note: "Finding community, hobbies, faith groups, outdoor fun, and mentors are all legitimate and powerful ways to support your mental health. You don't have to be in crisis to reach out.",
  },
};

function MHFlowChart() {
  const [path, setPath] = useState(["start"]);
  const currentId = path[path.length - 1];
  const node = MH_NODES[currentId];
  const canBack = path.length > 1;

  const go = next => setPath(p => [...p, next]);
  const back = () => setPath(p => p.slice(0, -1));
  const reset = () => setPath(["start"]);

  // breadcrumb dots
  const Dots = () => (
    <div style={{ display: "flex", gap: 5, marginBottom: 16, alignItems: "center" }}>
      {path.map((_, i) => (
        <div key={i} style={{
          width: i === path.length - 1 ? 18 : 7,
          height: 7, borderRadius: 4,
          background: i === path.length - 1 ? (node.color || "#c9a95d") : "rgba(255,255,255,0.15)",
          transition: "all 0.3s",
        }} />
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 19, fontWeight: "bold", color: "#34d399", marginBottom: 4 }}>🧠 Mental Health</div>
      <div style={{ fontSize: 12, color: "#8a9bbf", marginBottom: 18, lineHeight: 1.6 }}>
        Answer a few questions and we'll point you to the right resource — immediately.
      </div>

      {/* Immediate numbers always visible */}
      <div style={{
        background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
        borderRadius: 11, padding: "10px 14px", marginBottom: 18,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 10, color: "#f87171", fontWeight: "bold", letterSpacing: 1, marginBottom: 3 }}>CRISIS — CALL NOW</div>
          <div style={{ fontSize: 12, color: "#e8e4dc" }}>988 (press 1) &nbsp;·&nbsp; 1-800-273-8255</div>
        </div>
        <span style={{ fontSize: 20 }}>🆘</span>
      </div>

      {/* Flowchart card */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${node.color || "rgba(255,255,255,0.1)"}44`,
        borderTop: `3px solid ${node.color || "#c9a95d"}`,
        borderRadius: 14, padding: 20,
      }}>
        <Dots />

        {node.type === "question" && (
          <>
            <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, color: "#e8e4dc" }}>{node.text}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => go(node.yes)} style={{
                flex: 1, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.4)",
                borderRadius: 10, padding: "12px", color: "#4ade80", fontSize: 14,
                fontWeight: "bold", cursor: "pointer", fontFamily: "inherit",
              }}>Yes</button>
              <button onClick={() => go(node.no)} style={{
                flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10, padding: "12px", color: "#8a9bbf", fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
              }}>No</button>
            </div>
          </>
        )}

        {node.type === "branch" && (
          <>
            <div style={{ fontSize: 13, color: "#8a9bbf", marginBottom: 14 }}>{node.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {node.options.map((opt, i) => (
                <button key={i} onClick={() => go(opt.next)} style={{
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${node.color}33`,
                  borderRadius: 10, padding: "13px 16px",
                  color: "#e8e4dc", fontSize: 13, textAlign: "left",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span>{opt.label}</span>
                  <span style={{ color: node.color, fontSize: 14, marginLeft: 8 }}>›</span>
                </button>
              ))}
            </div>
          </>
        )}

        {node.type === "result" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{node.icon}</span>
              <div style={{ fontSize: 16, fontWeight: "bold", color: node.color }}>{node.title}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {node.items.map((item, i) => (
                <div key={i} style={{
                  background: item.highlight ? `${node.color}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${item.highlight ? node.color + "44" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 9, padding: "10px 13px",
                }}>
                  <div style={{ fontSize: 11, color: "#8a9bbf", marginBottom: item.value ? 3 : 0 }}>{item.label}</div>
                  {item.value && <div style={{ fontSize: 14, fontWeight: "bold", color: item.highlight ? node.color : "#e8e4dc" }}>{item.value}</div>}
                </div>
              ))}
            </div>
            {node.note && (
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 9, padding: 12, fontSize: 12, color: "#8a9bbf", lineHeight: 1.6,
              }}>
                ℹ️ {node.note}
              </div>
            )}
          </>
        )}
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {canBack && (
          <button onClick={back} style={{
            flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, padding: "10px", color: "#8a9bbf", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}>← Back</button>
        )}
        <button onClick={reset} style={{
          flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "10px", color: "#8a9bbf", fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>Start Over</button>
      </div>

      {/* Also available */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 10, color: "#8a9bbf", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>All Resources at a Glance</div>
        {[
          { label: "TACAMO MFLC", value: "405-508-3463" },
          { label: "Tinker MFLC / MFRC", value: "405-739-2747" },
          { label: "TACAMO Chaplain", value: "405-739-3318" },
          { label: "Base Mental Health", value: "405-582-6603" },
          { label: "Behavioral Health (1st Fl)", value: "405-734-2778" },
          { label: "Military OneSource (24/7)", value: "1-800-342-9647" },
          { label: "Virtual Counseling", value: "1-855-205-6749" },
          { label: "FAP", value: "405-582-6604" },
        ].map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between",
            padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)",
          }}>
            <span style={{ fontSize: 12, color: "#8a9bbf" }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: "bold", color: "#4ade80" }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAD TRAVEL ────────────────────────────────────────────────────────────────
const TAD_STEPS = [
  { id:"step1", step:"1", title:"TAD Request & Verify GOVCC/DTS", icon:"📋", summary:"Route your TAD request and verify your card and DTS profile before anything else.", checklist:["Route TAD request form through your chain of command","Once approved by Admin it will be returned to you","Verify GOVCC is active and won't expire during travel","Establish 4-digit PIN — call Citibank: 1-800-200-7056","Confirm billing address in CitiManager (website only, not app)","Confirm DTS email is one you can access during travel","Verify GOVCC number is correct in your DTS profile"], links:[{label:"DTS Login",url:"https://www.defensetravel.osd.mil/"},{label:"CitiManager",url:"https://home.cards.citidirect.com/"}], note:"You can only change your billing address on the CitiManager website — not the app." },
  { id:"step2", step:"2", title:"Create Authorization in DTS", icon:"🖥️", summary:"Book your flights, lodging, and rental car through DTS.", checklist:["Create and submit authorization in DTS","Monitor authorization status in DTS","Airline: MUST use contract airline. Non-contract requires justification","Lodging: MUST use on-base if available. If unavailable, GET A CERTIFICATE OF NON-AVAILABILITY (CNA)","Off-base lodging: book through DTS unless directed otherwise","Rental car: economy only if traveling alone. Larger requires justification"], stages:[{label:"CTO Submit",desc:"Flight/hotel/car not booked. If within 7 days of departure call SATO: 1-800-756-6111"},{label:"CTO Booked",desc:"SATO has booked. Itinerary sent to your DTS email."},{label:"CTO Ticketed",desc:"Ticket arrives 72 hrs before departure. No ticket 72 hrs out — contact Admin ASAP."},{label:"Approved",desc:"Authorization approved. If NOT approved 24 hrs before departure, reservations will be cancelled."}], links:[{label:"Per Diem Rates",url:"https://www.travel.dod.mil/Travel-Transportation-Rates/PerDiem/Per-Diem-Rate-Lookup/"}], note:"Authorization NOT approved within 24 hours of departure = airline reservations cancelled." },
  { id:"step3", step:"3", title:"During Travel", icon:"✈️", summary:"What to bring, what to use, and what to keep.", checklist:["Bring: copy of orders, GOVCC, and military ID","Use GOVCC ONLY for: airfare, lodging, rental car, gas, taxis, parking, meals","Keep ALL receipts — lodging, rental car, gas, parking, taxi, airport","Show CAC or orders at airline check-in to waive baggage fees","Tax-exempt states — ask hotel to remove taxes at check-in: AK, DE, FL, KS, KY, MA, MO, MT, NJ, NY, OR, PA, TX, VA, WI","Rental car: confirm government rate, decline ALL insurance, decline pre-paid fuel, decline toll transponders","No civilian drivers — period"], contacts:[{label:"Admin / CDO",value:"(405) 831-2448"},{label:"SATO (flight issues)",value:"1-800-756-6111"}], note:"Issues during travel? Contact Admin, the CDO, or your chain of command." },
  { id:"step4", step:"4", title:"Complete Post-Trip Voucher", icon:"🧾", summary:"Submit within 5 working days. Get your money back.", checklist:["Create voucher from your authorization in DTS","Submit within 5 working days of trip end","Aircrew: MC Letters required before any crew voucher is reviewed","Monitor voucher — authorizing official has 30 days to approve","Receipts required for ALL purchases over $75 (no exceptions)","Zero-balance lodging and rental car receipts required","Gas receipts for rental cars required (any amount)","No blurry or unreadable images — voucher will be kicked back","Screenshots of Citibank statements do NOT count as receipts","Claim taxes separately in DTS — remember tax-exempt states"], links:[{label:"Lost airline receipt",url:"https://www.cwtsatotravel.com/traveler_Info/common/itineraryInvoice.aspx?cid=2834"}], note:"PDFs are better than image files for DTS. Scan receipts immediately — Adobe Scan, CamScanner, or Scanner App." },
];

const WHO_TO_CALL = [
  { who:"SATO", color:"#38bdf8", number:"1-800-756-6111", when:["Booking or changing flights after DTS authorization is approved","Complex itineraries (multiple legs, OCONUS)","'TMC Constructed' shows in DTS but no flights selected"], note:"Admin cannot make or alter flights in DTS — only SATO can." },
  { who:"AIRLINE", color:"#4ade80", number:"AA: 1-800-433-7300 · Delta: 1-800-221-1212 · United: 1-800-864-8331 · SW: 1-800-435-9792", when:["Flight canceled or delayed day-of-travel","Rebooking at the airport gate or due to weather","Same-day flight swaps or airport-level help"], note:null },
  { who:"CITIBANK", color:"#fbbf24", number:"1-800-790-7206 (24/7)", when:["Card declined at merchant or ATM","Suspicious activity or fraud alert","Forgot PIN or locked out","Card blocked while traveling"], note:"Always call Citi first for GTCC issues. Admin cannot unlock or reset your card — only Citi can." },
  { who:"ADMIN", color:"#a78bfa", number:"CDO: (405) 831-2448", when:["DTS won't let you select a flight (policy flags or LOA issues)","Hotel or rental car issues in DTS","Changing travel dates in DTS","Submitting exceptions to policy","Unsure if trip is approved, funded, or routed correctly in DTS"], note:null },
];

function TADScreen() {
  const [sel, setSel] = useState(null);
  const [wtcOpen, setWtcOpen] = useState(null);
  const SL2 = ({c,children}) => <div style={{fontSize:10,color:c||"#8a9bbf",letterSpacing:2,textTransform:"uppercase",marginBottom:8,marginTop:16}}>{children}</div>;
  const Check = ({items}) => <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,padding:14,marginBottom:12}}>
    {items.map((b,i)=><div key={i} style={{display:"flex",gap:8,fontSize:12,color:"#c8c4bc",padding:"5px 0",borderTop:i>0?"1px solid rgba(255,255,255,0.05)":"none",lineHeight:1.5}}><span style={{color:"#34d399",flexShrink:0,marginTop:1}}>✓</span><span>{b}</span></div>)}
  </div>;
  if (sel) {
    const s = TAD_STEPS.find(x=>x.id===sel);
    return <div>
      <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:16}}>← Back to TAD Travel</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(56,189,248,0.2)",border:"1px solid rgba(56,189,248,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#38bdf8",fontWeight:"bold",flexShrink:0}}>{s.step}</div>
        <div style={{fontSize:17,fontWeight:"bold",color:"#38bdf8"}}>{s.title}</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,padding:14,marginBottom:12,fontSize:13,color:"#c8c4bc",lineHeight:1.65}}>{s.summary}</div>
      <SL2>Checklist</SL2><Check items={s.checklist}/>
      {s.stages&&<><SL2>Authorization Stages</SL2>{s.stages.map((st,i)=><div key={i} style={{background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:10,padding:12,marginBottom:8}}><div style={{fontSize:12,fontWeight:"bold",color:"#38bdf8",marginBottom:4}}>{st.label}</div><div style={{fontSize:12,color:"#8a9bbf",lineHeight:1.5}}>{st.desc}</div></div>)}</>}
      {s.contacts&&<><SL2>Key Contacts</SL2>{s.contacts.map((c,i)=><div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 14px",marginBottom:8}}><div style={{fontSize:10,color:"#8a9bbf",marginBottom:3}}>{c.label}</div><div style={{fontSize:13,color:"#4ade80",fontWeight:"bold"}}>{c.value}</div></div>)}</>}
      {s.note&&<div style={{background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.25)",borderRadius:11,padding:14,marginBottom:12,fontSize:13,color:"#c8c4bc",lineHeight:1.65}}>⚠️ {s.note}</div>}
      {s.links&&<><SL2>Quick Links</SL2>{s.links.map((l,i)=><div key={i} style={{background:"rgba(56,189,248,0.06)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:"#38bdf8"}}>{l.label}</span><span style={{fontSize:14,color:"#38bdf8"}}>↗</span></div>)}</>}
    </div>;
  }
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#38bdf8",marginBottom:4}}>✈️ TAD Travel</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:18,lineHeight:1.6}}>Step-by-step guide from TAD request to voucher. Tap a step to see the full checklist.</div>
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
      {TAD_STEPS.map(s=><button key={s.id} onClick={()=>setSel(s.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(56,189,248,0.2)",borderLeft:"3px solid #38bdf8",borderRadius:11,padding:15,display:"flex",alignItems:"center",gap:13,textAlign:"left",cursor:"pointer",color:"#e8e4dc"}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.35)",display:"flex",alignItems:"center",justifyContent:"center",color:"#38bdf8",fontSize:14,fontWeight:"bold",flexShrink:0}}>{s.step}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:"bold",color:"#38bdf8",marginBottom:2}}>{s.title}</div><div style={{fontSize:11,color:"#8a9bbf"}}>{s.summary}</div></div>
        <span style={{color:"#38bdf8",fontSize:14}}>›</span>
      </button>)}
    </div>
    <div style={{fontSize:11,color:"#8a9bbf",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Who Do I Call?</div>
    <div style={{display:"flex",flexDirection:"column",gap:9}}>
      {WHO_TO_CALL.map((w,i)=><div key={i} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${w.color}33`,borderRadius:11,overflow:"hidden"}}>
        <button onClick={()=>setWtcOpen(wtcOpen===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",color:"#e8e4dc",fontFamily:"inherit"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:w.color,flexShrink:0}}/><span style={{fontSize:13,fontWeight:"bold",color:w.color}}>{w.who}</span></div>
          <span style={{color:"#4a5568",fontSize:12}}>{wtcOpen===i?"▲":"▼"}</span>
        </button>
        {wtcOpen===i&&<div style={{padding:"0 14px 14px"}}>
          <div style={{fontSize:12,fontWeight:"bold",color:"#4ade80",marginBottom:8}}>📱 {w.number}</div>
          <div style={{fontSize:11,color:"#8a9bbf",marginBottom:6}}>Call when:</div>
          {w.when.map((wh,j)=><div key={j} style={{fontSize:12,color:"#c8c4bc",padding:"3px 0"}}>• {wh}</div>)}
          {w.note&&<div style={{marginTop:10,padding:10,background:"rgba(255,255,255,0.04)",borderRadius:8,fontSize:12,color:"#8a9bbf",lineHeight:1.5}}>ℹ️ {w.note}</div>}
        </div>}
      </div>)}
    </div>
  </div>;
}

// ── LEGAL ─────────────────────────────────────────────────────────────────────
const LEGAL_TASKS = [
  { id: "notary", need: "I need a notary", icon: "📋", who: "Your squadron legal office handles notarizations.", howTo: "Walk in during working hours with valid ID and the document to be notarized. No appointment needed for most standard notarizations.", contact: { label: "Squadron Legal Office", value: "[Add your legal office number]", type: "phone" }, bring: ["Valid military/govt ID", "Document to be notarized", "Any required witnesses"] },
  { id: "poa", need: "I need a Power of Attorney", icon: "📝", who: "Squadron legal handles standard POAs — typically same-day.", howTo: "Walk in or call ahead. Know what powers you want to grant and to whom.", contact: { label: "Squadron Legal Office", value: "[Add your legal office number]", type: "phone" }, bring: ["Valid ID", "Recipient's full legal name and address", "Specific powers to grant"] },
  { id: "will", need: "I need a Will", icon: "📜", who: "Wills require an appointment with Air Force Legal — free service.", howTo: "Call AF Legal to schedule. Allow 1–2 weeks for availability. Free for all active duty regardless of branch.", contact: { label: "AF Legal Office", value: "[Add AF Legal number]", type: "phone" }, bring: ["Valid ID", "List of assets and beneficiaries", "Guardian preferences if you have children"] },
  { id: "landlord", need: "I have a landlord dispute", icon: "🏠", who: "Base legal assistance can advise on tenant rights and SCRA.", howTo: "Schedule a legal assistance appointment. They can review your lease and advise on Servicemembers Civil Relief Act rights.", contact: { label: "Base Legal Assistance", value: "[Add base legal number]", type: "phone" }, bring: ["Copy of your lease", "Documentation of dispute", "Any notices from landlord"] },
  { id: "scra", need: "I need SCRA / deployment protections", icon: "⚓", who: "Legal can invoke SCRA protections for interest rates, leases, and more.", howTo: "Bring deployment orders to the legal office. SCRA can reduce loan interest rates to 6%, allow lease termination, and more.", contact: { label: "Base Legal Assistance", value: "[Add base legal number]", type: "phone" }, bring: ["Copy of deployment orders", "Loan or lease documents", "Account numbers for interest rate requests"] },
  { id: "fap", need: "Family Advocacy Program (FAP)", icon: "👨‍👩‍👧", who: "FAP provides support for families experiencing domestic concerns.", howTo: "Contact FAP directly at the 72nd Medical Group. Services are confidential.", contact: { label: "Family Advocacy Program", value: "405-582-6604", type: "phone" }, bring: [] },
];

const MEDICAL_RESOURCES = [
  { id: "pcp", icon: "🏥", title: "Primary Care Provider (PCP)", summary: "Your first stop for medical care and referrals.", primary: "72 Medical Clinic — 1st Floor", contact: "[Add MTF appointment line]", detail: "Your PCP can vector you to the appropriate level of care, manage medications, and generate referrals for specialist care." },
  { id: "behavioralhealth", icon: "🧠", title: "72nd Behavioral Health", summary: "Social worker counseling for life stressors.", primary: "405-734-2778", contact: "405-734-2778", detail: "Located 1st floor, Family Medicine. Social worker provides medical counseling for life stressors, suitable for less severe cases." },
  { id: "mentalhealth72", icon: "🏥", title: "Base Mental Health (72nd MDG)", summary: "Psychologists and psychiatrists. Walk-ins for suicidal ideation.", primary: "405-582-6603 or 405-734-7313", contact: "405-582-6603", detail: "2nd floor. Psychologists and Psychiatrists for severe symptoms. Walk-ins daily for SMs with thoughts of suicide." },
  { id: "tricare", icon: "💊", title: "TRICARE — Insurance & Referrals", summary: "Finding providers, referrals, pharmacy, coverage questions.", primary: "TRICARE West: 1-844-866-9378", contact: "1-844-866-9378", detail: "Use TRICARE Online to book MTF appointments. Always get pre-authorization before seeing an off-base specialist." },
  { id: "sapr_med", icon: "🛡️", title: "SAPR — Medical & Advocacy", summary: "24-hr hotline. Medical care regardless of report type.", primary: "SAPR 24-hr Hotline: 405-734-7272", contact: "405-734-7272", detail: "Medical care and victim advocacy available regardless of report type. See SAPR section for full reporting options." },
  { id: "fap_med", icon: "👨‍👩‍👧", title: "Family Advocacy Program", summary: "Support for family domestic concerns.", primary: "405-582-6604", contact: "405-582-6604", detail: "FAP at 72nd MDG provides prevention and treatment for families. Confidential and focused on family health." },
];

const FAMILY_RESOURCES = [
  { id: "mfrc", icon: "👨‍👩‍👧", title: "Military & Family Readiness Center", summary: "Counseling, financial planning, car buying, home buying, budgeting.", primary: "405-739-2747", link: null, detail: "Counseling services and financial planning classes including car buying 101, home buying 101, budgeting, and more. Also home to the Tinker MFLC." },
  { id: "odrfam", icon: "🏕️", title: "Outdoor Recreation Center (ODR)", summary: "Trips, axe throwing, bouldering gym, kayaks, camping gear.", primary: "405-734-5875 (Tue–Fri, 0700–1700)", link: "tinkerliving.com", detail: "ODR at Tinker runs a full schedule of trips and has an on-site bouldering gym and axe throwing range. Join their GroupMe for trip updates." },
  { id: "ombudsman", icon: "📬", title: "Command Ombudsman", summary: "Family communication link to VQ-4 leadership.", primary: "VQ4ombudsman@gmail.com", link: null, detail: "The Command Ombudsman is a volunteer family member serving as the information link between command families and leadership. Great first contact for family questions, events, and getting plugged in.\n\nVQ4ombudsman@gmail.com\nShadowombudsman@gmail.com" },
];

const SAPR_TREE = [
  { id: "start", q: "Did something happen to you or someone you know?", yes: "report_type", no: "resources_only" },
  { id: "report_type", q: "Do you want to make an official report?", yes: "unrestricted", no: "restricted" },
  { id: "unrestricted", result: true, title: "Unrestricted Report", desc: "Triggers an official investigation. You'll be connected with a victim advocate.", contacts: ["SAPR 24-hr Hotline: 405-734-7272", "NCIS: 1-877-579-3648", "Safe Helpline (24/7): 1-877-995-5247"] },
  { id: "restricted", result: true, title: "Restricted Report", desc: "Completely confidential — no investigation unless you choose to change your report. Full medical care and advocacy still available.", contacts: ["SAPR 24-hr Hotline (Confidential): 405-734-7272", "Safe Helpline (24/7): 1-877-995-5247"] },
  { id: "resources_only", result: true, title: "Resources & Support", desc: "Support and advocacy available any time — no report required.", contacts: ["Safe Helpline (24/7): 1-877-995-5247", "Military OneSource: 1-800-342-9647", "TACAMO Chaplain: 405-739-3318"] },
];

const CONTACTS = [
  { category: "Emergency", name: "Base Security / Emergency", phone: "911 or [add non-emergency]", email: "" },
  { category: "SAPR", name: "SAPR 24-hr Hotline", phone: "405-734-7272", email: "" },
  { category: "Mental Health", name: "Veterans / Military Crisis Line", phone: "1-800-273-8255 or 988", email: "" },
  { category: "Mental Health", name: "Military OneSource (24/7)", phone: "1-800-342-9647", email: "" },
  { category: "Mental Health", name: "TACAMO MFLC", phone: "405-508-3463", email: "" },
  { category: "Chaplain", name: "TACAMO Chaplain", phone: "405-739-3318 / 405-739-3999", email: "TACAMO_CHAPLAIN@us.navy.mil" },
  { category: "Medical", name: "72nd MDG Mental Health (2nd Floor)", phone: "405-582-6603 or 405-734-7313", email: "" },
  { category: "Medical", name: "72nd Behavioral Health (1st Floor)", phone: "405-734-2778", email: "" },
  { category: "Medical", name: "Family Advocacy Program (FAP)", phone: "405-582-6604", email: "" },
  { category: "Family Support", name: "Military & Family Readiness Center", phone: "405-739-2747", email: "" },
  { category: "Family Support", name: "Command Ombudsman", phone: "", email: "VQ4ombudsman@gmail.com" },
  { category: "Family Support", name: "Command Ombudsman (Shadow)", phone: "", email: "Shadowombudsman@gmail.com" },
  { category: "Family Support", name: "NMCRS — NAS JRB Fort Worth", phone: "817-782-6000", email: "" },
  { category: "Shuttle", name: "TACAMO Shuttle (SCW-1 CDO)", phone: "(405) 831-4973", email: "" },
  { category: "ODR", name: "Tinker Outdoor Recreation (ODR)", phone: "405-734-5875", email: "" },
  { category: "Legal", name: "Squadron Legal Office", phone: "[Add number]", email: "" },
  { category: "Legal", name: "AF Legal (Wills & Estate)", phone: "[Add number]", email: "" },
  { category: "DAPA", name: "Command DAPA", phone: "[Add number]", email: "" },
  { category: "CMEO", name: "Command CMEO Rep", phone: "[Add number]", email: "" },
];

const CAT_COLORS = {
  Emergency: "#f87171", SAPR: "#f87171", "Mental Health": "#34d399",
  Chaplain: "#c084fc", Medical: "#60a5fa", "Family Support": "#f472b6",
  Shuttle: "#fb923c", ODR: "#4ade80", Legal: "#facc15", DAPA: "#fb923c", CMEO: "#a78bfa",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getEventsForDay(year, month, day, events) {
  const s = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  return events.filter(e => e.date === s);
}

function CalendarView({ events }) {
  const today = new Date();
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const [sel, setSel] = useState(null);
  const first = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo+1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({length:dim},(_,i)=>i+1)];
  const prev = () => { mo===0?(setMo(11),setYr(y=>y-1)):setMo(m=>m-1); setSel(null); };
  const next = () => { mo===11?(setMo(0),setYr(y=>y+1)):setMo(m=>m+1); setSel(null); };
  const selEvs = sel ? getEventsForDay(yr, mo, sel, events) : [];
  const isToday = d => d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <button onClick={prev} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,width:30,height:30,color:"#e8e4dc",fontSize:14,cursor:"pointer"}}>‹</button>
        <div style={{fontSize:13,fontWeight:"bold",color:"#c9a95d"}}>{MONTHS[mo]} {yr}</div>
        <button onClick={next} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,width:30,height:30,color:"#e8e4dc",fontSize:14,cursor:"pointer"}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:3}}>
        {DAYS_SHORT.map(d=><div key={d} style={{textAlign:"center",fontSize:9,color:"#4a5568",paddingBottom:4}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((day,i)=>{
          if(!day) return <div key={`e${i}`}/>;
          const de=getEventsForDay(yr,mo,day,events);
          const isSel=sel===day,tod=isToday(day);
          return <button key={day} onClick={()=>setSel(isSel?null:day)} style={{background:isSel?"rgba(201,169,93,0.25)":tod?"rgba(201,169,93,0.1)":"rgba(255,255,255,0.03)",border:isSel?"1px solid rgba(201,169,93,0.6)":tod?"1px solid rgba(201,169,93,0.3)":"1px solid rgba(255,255,255,0.05)",borderRadius:6,padding:"4px 2px",minHeight:40,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:11,color:tod?"#c9a95d":"#e8e4dc",fontWeight:tod?"bold":"normal"}}>{day}</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center"}}>
              {de.slice(0,3).map((ev,idx)=><div key={idx} style={{width:5,height:5,borderRadius:"50%",background:ORG_COLORS[ev.org]||"#c9a95d"}}/>)}
            </div>
          </button>;
        })}
      </div>
      {sel&&(<div style={{marginTop:12}}>
        <div style={{fontSize:10,color:"#8a9bbf",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{MONTHS[mo]} {sel}</div>
        {selEvs.length===0?<div style={{fontSize:12,color:"#4a5568"}}>No events this day.</div>
          :selEvs.map(ev=><div key={ev.id} style={{background:"rgba(255,255,255,0.05)",borderLeft:`3px solid ${ORG_COLORS[ev.org]||"#c9a95d"}`,borderRadius:9,padding:11,marginBottom:7}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:"bold"}}>{ev.title}</span><span style={{fontSize:10,color:ORG_COLORS[ev.org]||"#c9a95d"}}>{ev.org}</span></div>
            {ev.time&&<div style={{fontSize:10,color:"#c9a95d",marginBottom:2}}>🕐 {ev.time}</div>}
            <div style={{fontSize:11,color:"#8a9bbf"}}>📍 {ev.location}</div>
            {ev.cost&&<div style={{fontSize:11,color:"#4ade80",marginTop:3}}>💰 {ev.cost}</div>}
          </div>)}
      </div>)}
      <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:7}}>
        {Object.entries(ORG_COLORS).map(([org,color])=><div key={org} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:color}}/><span style={{fontSize:9,color:"#4a5568"}}>{org}</span></div>)}
      </div>
    </div>
  );
}

function ListView({ events }) {
  const sorted = [...events].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const grouped = {};
  sorted.forEach(ev=>{
    const d=new Date(ev.date+"T12:00:00");
    const k=`${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if(!grouped[k]) grouped[k]=[];
    grouped[k].push(ev);
  });
  return <div>{Object.entries(grouped).map(([month,evs])=>(
    <div key={month} style={{marginBottom:20}}>
      <div style={{fontSize:10,color:"#c9a95d",letterSpacing:2,textTransform:"uppercase",marginBottom:10,paddingBottom:5,borderBottom:"1px solid rgba(201,169,93,0.15)"}}>{month}</div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {evs.map(ev=>{
          const d=new Date(ev.date+"T12:00:00");
          return <div key={ev.id} style={{display:"flex",gap:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${ORG_COLORS[ev.org]||"#c9a95d"}`,borderRadius:10,padding:12}}>
            <div style={{flexShrink:0,width:36,textAlign:"center",background:"rgba(201,169,93,0.08)",border:"1px solid rgba(201,169,93,0.2)",borderRadius:7,padding:"4px 2px"}}>
              <div style={{fontSize:9,color:"#8a9bbf"}}>{DAYS_SHORT[d.getDay()]}</div>
              <div style={{fontSize:17,fontWeight:"bold",color:"#c9a95d",lineHeight:1}}>{d.getDate()}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:12,fontWeight:"bold",lineHeight:1.3,flex:1}}>{ev.title}</span>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:20,background:`${ORG_COLORS[ev.org]||"#c9a95d"}22`,color:ORG_COLORS[ev.org]||"#c9a95d",marginLeft:6,flexShrink:0,alignSelf:"flex-start"}}>{ev.org}</span>
              </div>
              {ev.time&&<div style={{fontSize:10,color:"#c9a95d",marginBottom:2}}>🕐 {ev.time}</div>}
              <div style={{fontSize:11,color:"#8a9bbf",marginBottom:2}}>📍 {ev.location}</div>
              <div style={{fontSize:11,color:"#8a9bbf",lineHeight:1.5}}>{ev.desc}</div>
              {ev.cost&&<div style={{fontSize:10,color:"#4ade80",marginTop:3}}>💰 {ev.cost}</div>}
              {ev.family&&<div style={{fontSize:10,color:"#60a5fa",marginTop:2}}>👨‍👩‍👧 Family friendly</div>}
            </div>
          </div>;
        })}
      </div>
    </div>
  ))}</div>;
}

// ── Small shared UI ───────────────────────────────────────────────────────────
const Chip = ({label,value,type}) => (
  <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 14px",marginBottom:8}}>
    <div style={{fontSize:10,color:"#8a9bbf",marginBottom:3}}>{label}</div>
    <div style={{fontSize:13,color:type==="link"?"#60a5fa":type==="phone"?"#4ade80":"#e8e4dc",fontWeight:"bold"}}>{value}</div>
  </div>
);
const SL = ({children}) => <div style={{fontSize:10,color:"#8a9bbf",letterSpacing:2,textTransform:"uppercase",marginBottom:8,marginTop:18}}>{children}</div>;
const InfoBox = ({children}) => <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,padding:14,marginBottom:12,fontSize:13,color:"#c8c4bc",lineHeight:1.65}}>{children}</div>;

function LegalScreen() {
  const [sel, setSel] = useState(null);
  if (sel) {
    const t = LEGAL_TASKS.find(x=>x.id===sel);
    return <div>
      <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:16}}>← Back to Legal</button>
      <div style={{fontSize:22,marginBottom:8}}>{t.icon}</div>
      <div style={{fontSize:17,fontWeight:"bold",color:"#facc15",marginBottom:8}}>{t.need}</div>
      <InfoBox>{t.who}</InfoBox>
      <SL>What to Do</SL><InfoBox>{t.howTo}</InfoBox>
      {t.bring?.length>0&&<><SL>What to Bring</SL><div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,padding:13,marginBottom:12}}>{t.bring.map((b,i)=><div key={i} style={{fontSize:13,color:"#c8c4bc",padding:"4px 0",borderTop:i>0?"1px solid rgba(255,255,255,0.05)":"none"}}>• {b}</div>)}</div></>}
      <SL>Contact</SL><Chip {...t.contact}/>
    </div>;
  }
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#facc15",marginBottom:4}}>⚖️ Legal</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:18,lineHeight:1.6}}>Tap what you need — we'll tell you exactly who to contact and what to bring.</div>
    <div style={{display:"flex",flexDirection:"column",gap:9}}>
      {LEGAL_TASKS.map(t=><button key={t.id} onClick={()=>setSel(t.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(250,204,21,0.15)",borderRadius:11,padding:15,display:"flex",alignItems:"center",gap:13,textAlign:"left",cursor:"pointer",color:"#e8e4dc"}}>
        <span style={{fontSize:22}}>{t.icon}</span>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:"bold",color:"#facc15"}}>{t.need}</div><div style={{fontSize:11,color:"#8a9bbf",marginTop:2}}>{t.who.split(".")[0]}.</div></div>
        <span style={{color:"#facc15",fontSize:14}}>›</span>
      </button>)}
    </div>
  </div>;
}

function MedicalScreen() {
  const [sel, setSel] = useState(null);
  if (sel) {
    const r = MEDICAL_RESOURCES.find(x=>x.id===sel);
    return <div>
      <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:16}}>← Back to Medical</button>
      <div style={{fontSize:24,marginBottom:8}}>{r.icon}</div>
      <div style={{fontSize:17,fontWeight:"bold",color:"#60a5fa",marginBottom:8}}>{r.title}</div>
      <InfoBox>{r.detail}</InfoBox>
      <SL>Contact</SL><Chip label="Phone" value={r.contact} type="phone"/>
    </div>;
  }
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#60a5fa",marginBottom:4}}>🏥 Medical</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:18,lineHeight:1.6}}>72nd MDG resources, TRICARE, mental health, and specialty care.</div>
    <div style={{display:"flex",flexDirection:"column",gap:9}}>
      {MEDICAL_RESOURCES.map(r=><button key={r.id} onClick={()=>setSel(r.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:11,padding:14,display:"flex",alignItems:"center",gap:12,textAlign:"left",cursor:"pointer",color:"#e8e4dc"}}>
        <span style={{fontSize:22}}>{r.icon}</span>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:"bold",marginBottom:2}}>{r.title}</div><div style={{fontSize:11,color:"#8a9bbf"}}>{r.summary}</div><div style={{fontSize:11,color:"#4ade80",marginTop:3}}>📱 {r.primary}</div></div>
        <span style={{color:"#60a5fa",fontSize:14}}>›</span>
      </button>)}
    </div>
  </div>;
}

function FamilyScreen() {
  const [sel, setSel] = useState(null);
  if (sel) {
    const r = FAMILY_RESOURCES.find(x=>x.id===sel);
    return <div>
      <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:16}}>← Back to Family & Fun</button>
      <div style={{fontSize:24,marginBottom:8}}>{r.icon}</div>
      <div style={{fontSize:17,fontWeight:"bold",color:"#f472b6",marginBottom:8}}>{r.title}</div>
      <InfoBox>{r.detail}</InfoBox>
      <SL>Contact</SL><Chip label="Phone / Info" value={r.primary} type="phone"/>
      {r.link&&<Chip label="Website" value={r.link} type="link"/>}
    </div>;
  }
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#f472b6",marginBottom:4}}>👨‍👩‍👧 Family & Fun</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:18,lineHeight:1.6}}>Programs and support for you and your family.</div>
    <div style={{display:"flex",flexDirection:"column",gap:9}}>
      {FAMILY_RESOURCES.map(r=><button key={r.id} onClick={()=>setSel(r.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(244,114,182,0.15)",borderRadius:11,padding:14,display:"flex",alignItems:"center",gap:12,textAlign:"left",cursor:"pointer",color:"#e8e4dc"}}>
        <span style={{fontSize:22}}>{r.icon}</span>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:"bold",marginBottom:2}}>{r.title}</div><div style={{fontSize:11,color:"#8a9bbf"}}>{r.summary}</div></div>
        <span style={{color:"#f472b6",fontSize:14}}>›</span>
      </button>)}
    </div>
  </div>;
}

function SAPRScreen() {
  const [step, setStep] = useState("start");
  const node = SAPR_TREE.find(n=>n.id===step);
  const answer = a => setStep(a==="yes"?node.yes:node.no);
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#f87171",marginBottom:4}}>🛡️ SAPR</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:18,lineHeight:1.6}}>Confidential help always available — no report required to access support.</div>
    <div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:12,padding:16,marginBottom:16}}>
      <div style={{fontSize:10,color:"#f87171",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Reporting Decision Tree</div>
      {!node.result?(<>
        <div style={{fontSize:14,lineHeight:1.7,marginBottom:14}}>{node.q}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>answer("yes")} style={{flex:1,background:"#f87171",border:"none",borderRadius:8,color:"#fff",padding:"10px",fontSize:13,cursor:"pointer",fontWeight:"bold"}}>Yes</button>
          <button onClick={()=>answer("no")} style={{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#e8e4dc",padding:"10px",fontSize:13,cursor:"pointer"}}>No / Not Sure</button>
        </div>
      </>):(<>
        <div style={{fontSize:14,fontWeight:"bold",color:"#f87171",marginBottom:6}}>{node.title}</div>
        <div style={{fontSize:13,color:"#e8e4dc",lineHeight:1.6,marginBottom:12}}>{node.desc}</div>
        {node.contacts.map((c,i)=><div key={i} style={{fontSize:12,color:"#c9a95d",padding:"5px 0",borderTop:i>0?"1px solid rgba(255,255,255,0.06)":"none"}}>• {c}</div>)}
        <button onClick={()=>setStep("start")} style={{marginTop:12,background:"none",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#8a9bbf",padding:"6px 14px",fontSize:12,cursor:"pointer"}}>Start Over</button>
      </>)}
    </div>
    <Chip label="SAPR 24-hr Hotline (Tinker AFB)" value="405-734-7272" type="phone"/>
    <Chip label="Safe Helpline (National, 24/7)" value="1-877-995-5247" type="phone"/>
    <Chip label="Safe Helpline Online Chat" value="safehelpline.org" type="link"/>
  </div>;
}

function CMEOScreen() {
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#a78bfa",marginBottom:4}}>🤝 CMEO</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:16,lineHeight:1.6}}>Command Managed Equal Opportunity — your rights and how to use them.</div>
    <InfoBox>The CMEO program ensures every sailor has the right to serve in an environment free from discrimination and harassment based on race, color, religion, sex, or national origin.</InfoBox>
    <SL>Your Rights</SL>
    <div style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:11,padding:14,marginBottom:14}}>
      {["Freedom from discrimination based on race, color, religion, sex, or national origin.","Sexual harassment is prohibited under military regulations and the UCMJ.","Retaliation for filing an EO complaint is strictly prohibited.","You may file informally (chain of command/CMEO) or formally through official EO channels."].map((r,i)=><div key={i} style={{fontSize:13,color:"#c8c4bc",padding:"5px 0",borderTop:i>0?"1px solid rgba(255,255,255,0.05)":"none",lineHeight:1.6}}>• {r}</div>)}
    </div>
    <SL>Contacts</SL>
    {[{label:"Command CMEO Rep",value:"[Add CMEO contact]"},{label:"Installation EO Office",value:"[Add base EO number]"},{label:"DOD EO Hotline",value:"1-800-336-8809"}].map((c,i)=><Chip key={i} label={c.label} value={c.value} type="phone"/>)}
  </div>;
}

function SafeRideScreen() {
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#fbbf24",marginBottom:4}}>🚕 Safe Ride Program</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:16,lineHeight:1.6}}>
      If you've been drinking — use it. No questions. No judgment. No consequences.
    </div>
    <div style={{background:"rgba(251,191,36,0.1)",border:"2px solid rgba(251,191,36,0.4)",borderRadius:13,padding:20,marginBottom:16,textAlign:"center"}}>
      <div style={{fontSize:12,color:"#fbbf24",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Call / Text Anytime</div>
      <div style={{fontSize:28,fontWeight:"bold",color:"#fbbf24",marginBottom:6}}>[Add safe ride number]</div>
      <div style={{fontSize:12,color:"#8a9bbf"}}>Available 24/7 — especially during liberty, holidays, and weekends.</div>
    </div>
    <InfoBox>This program exists specifically so you don't drive impaired. One call protects you, your shipmates, and everyone else on the road. There are zero negative consequences for using it.</InfoBox>
  </div>;
}

function DAPAScreen() {
  return <div>
    <div style={{fontSize:17,fontWeight:"bold",color:"#8a9bbf",marginBottom:4}}>ℹ️ DAPA Program</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:16,lineHeight:1.6}}>
      The Drug and Alcohol Program Advisor (DAPA) manages substance abuse prevention and education. If you need help, they connect you with resources — their job is not to get you in trouble.
    </div>
    {[
      {title:"Counseling & Referral", desc:"Struggling with alcohol or substance use? DAPA can connect you with confidential counseling before it becomes a career issue."},
      {title:"SARP — Substance Abuse Rehab", desc:"Voluntary entry into SARP is always viewed more favorably than a DUI or positive UA. Treatment covered by TRICARE."},
      {title:"Education & Prevention", desc:"Mandatory and voluntary education — holiday safety briefs, responsible drinking awareness, and more."},
    ].map((p,i)=><div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:12,marginBottom:8}}>
      <div style={{fontSize:13,fontWeight:"bold",color:"#8a9bbf",marginBottom:3}}>{p.title}</div>
      <div style={{fontSize:12,color:"#6a7b8f",lineHeight:1.6}}>{p.desc}</div>
    </div>)}
    <SL>Contact</SL>
    <Chip label="Command DAPA" value="[Add DAPA contact]" type="phone"/>
  </div>;
}

function ODRScreen() {
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#4ade80",marginBottom:4}}>🏕️ Outdoor Recreation (ODR)</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:16,lineHeight:1.6}}>Tinker AFB ODR — trips, axe throwing, bouldering, kayaks, camping gear, and more.</div>
    <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:12,padding:14,marginBottom:16}}>
      <Chip label="Phone (Tue–Fri, 0700–1700)" value="405-734-5875" type="phone"/>
      <Chip label="After Hours" value="GroupMe (sign up for updates)" type="info"/>
      <Chip label="Website" value="tinkerliving.com" type="link"/>
    </div>
    <SL>Recurring Activities</SL>
    {[{title:"🪓 Axe Throwing",days:"Every Wednesday",time:"0700–1700",location:"Bldg 478",cost:"Free — military, dependents, 1 civilian guest"},{title:"🧗 Bouldering Gym",days:"Tuesday–Friday",time:"0700–1700",location:"Bldg 478",cost:"Free"}].map((r,i)=><div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:11,padding:14,marginBottom:9}}>
      <div style={{fontSize:14,fontWeight:"bold",color:"#4ade80",marginBottom:4}}>{r.title}</div>
      <div style={{fontSize:12,color:"#8a9bbf"}}>📅 {r.days} · 🕐 {r.time}</div>
      <div style={{fontSize:12,color:"#8a9bbf"}}>📍 {r.location}</div>
      <div style={{fontSize:12,color:"#c9a95d",marginTop:4}}>💰 {r.cost}</div>
    </div>)}
    <SL>Upcoming Trips</SL>
    <InfoBox>See the Events tab for the full 2026 ODR trip schedule — Wichita Hikes, Buffalo River Floats, Summerfest, Colorado Rafting & Rock Climbing, High Points Summit, and more.</InfoBox>
  </div>;
}

// ── VACATION DEALS DATA ───────────────────────────────────────────────────────
const VACATION_DEALS = [
  {
    id: "ihoot",
    icon: "🏖️",
    title: "IHOOT Foundation",
    subtitle: "Free weeklong vacation — once a year",
    color: "#60a5fa",
    tag: "FREE",
    who: "Active duty, veterans, and their families",
    desc: "In Honor of Our Troops (IHOOT) is a 501(c)(3) non-profit that provides free weeklong vacation accommodations at resort properties. Locations include Holiday Inn Club Vacations properties in Branson, Galveston TX, Massachusetts, and Vermont. New requests are currently accepting arrivals beyond June 30, 2026.",
    url: "https://ihoot.org",
    urlLabel: "ihoot.org",
    note: "Standard program dates/destinations are periodically suspended — check the website for current availability.",
  },
  {
    id: "afvc",
    icon: "🌴",
    title: "Armed Forces Vacation Club (AFVC)",
    subtitle: "Weeklong resort vacations at very low prices",
    color: "#4ade80",
    tag: "DISCOUNTED",
    who: "Active duty, Guard/Reserve, retired military",
    desc: "The AFVC offers weeklong resort vacations at thousands of resorts in over 100 countries. Features last-minute 'space available' deals, short-stay options, and travel certificates. Membership is free for eligible military.",
    url: "https://www.afvclub.com",
    urlLabel: "afvclub.com",
    note: null,
  },
  {
    id: "amforcestravel",
    icon: "✈️",
    title: "American Forces Travel",
    subtitle: "MWR travel program — discounts on flights, hotels, cars",
    color: "#c084fc",
    tag: "DISCOUNTED",
    who: "Active duty, Guard/Reserve, retirees, DoD civilians, eligible MWR patrons",
    desc: "The official MWR travel portal offering discounted flights, hotels, rental cars, and vacation packages. Start here before booking anything — rates are often significantly below commercial prices.",
    url: "https://www.americanforcestravel.com",
    urlLabel: "americanforcestravel.com",
    note: null,
  },
  {
    id: "tinkeritt",
    icon: "🎟️",
    title: "Tinker ITT — Information, Tickets & Travel",
    subtitle: "Your first stop before buying any tickets",
    color: "#fb923c",
    tag: "DISCOUNTED",
    who: "Active duty, Guard/Reserve, retirees, DoD civilians at Tinker",
    desc: "Tinker's ITT office offers discounted tickets to theme parks, events, and attractions across the US. Currently offering 2026 Universal Orlando Military Freedom Passes and much more. Visit the website or stop by on base.",
    url: "https://tinkerliving.com/information-tickets-travel/",
    urlLabel: "tinkerliving.com/information-tickets-travel",
    note: "Check here before buying tickets to Universal, Disney, SeaWorld, concerts, or sporting events.",
  },
  {
    id: "avf",
    icon: "🏔️",
    title: "American Valor Foundation — Mountain Treks",
    subtitle: "4-day Colorado Rockies backpacking retreat for couples",
    color: "#34d399",
    tag: "FREE / SUBSIDIZED",
    who: "Active duty, retired military, first responders and spouses",
    desc: "A Kyle Family Foundation dedicated to supporting veterans, first responders, and their families. WayForward Adventures guides groups on 4-day, 3-night backpacking trips in the Colorado Rockies. Trail meals prepared, camp set up, and guided faith-based conversations throughout. 2026 trip: Del Norte, CO — Trail days June 5–8, Travel days June 4–9. Must apply.",
    url: "https://americanvalorfoundation.org/american-valor-foundation-mountain-treks/",
    urlLabel: "americanvalorfoundation.org",
    note: "Altitude ranges from 8,000–13,000 ft. This is a challenging backcountry trip — watch the video on the website before applying.",
  },
  {
    id: "sheppard",
    icon: "⛵",
    title: "Sheppard AFB Annex — Lake Texoma",
    subtitle: "Cabins, RV sites, and boating at Lake Texoma, TX",
    color: "#38bdf8",
    tag: "LOW COST",
    who: "Active duty may book 3 months out (1st of month). Retired: 6th. DoD/civilian: 11th.",
    desc: "Located on beautiful Lake Texoma, the Sheppard AFB Recreation Annex offers 46+ fully equipped cabins ($70–$120/night), 30 campsites, 41 full hook-up RV spaces ($30/night), and boat rentals (pontoon $300/day, bass boat $250/day, kayaks/canoes available). Lodge includes pool table, fitness center, fitness room, and seasonal snack bar. From OKC: I-35 South to Gainesville, TX → Hwy 82 East → Exit 624 Whitesboro.",
    url: "https://82fss.com/sheppard-annex/",
    urlLabel: "82fss.com/sheppard-annex",
    note: "Reservations: (903) 523-4613, 8am–5pm daily. Full payment required within 15 days to confirm. $20 cancellation fee within 72 hrs; military commitment/medical emergency = full refund.",
    contact: "(903) 523-4613",
  },
  {
    id: "bluestar",
    icon: "🏛️",
    title: "Blue Star Museums",
    subtitle: "Free museum admission — Armed Forces Day through Labor Day",
    color: "#fbbf24",
    tag: "FREE",
    who: "Active duty, National Guard, Reserve, and their families (ID card holders)",
    desc: "Over 2,000 museums nationwide offer free admission for active duty military and their families from Armed Forces Day (May 16) through Labor Day (Sept 7, 2026). Deployed? Your family can still use it with a DD Form 1173 dependent ID. The service member does not need to be present.",
    url: "https://militarybridge.com/blue-star-museums-2026-free-admission-for-active-duty-military-their-families/",
    urlLabel: "Find participating museums",
    note: "Valid May 16 – September 7, 2026. Up to 5 family members per military ID holder.",
  },
  {
    id: "wavesofhonor",
    icon: "🎡",
    title: "Waves of Honor — SeaWorld / Busch Gardens",
    subtitle: "One free park admission per year + discounted tickets for family",
    color: "#f472b6",
    tag: "FREE",
    who: "Active duty, reservists, National Guard",
    desc: "United Parks and Resorts offers one free admission per year to SeaWorld or Busch Gardens for active duty, Guard, and Reserve members. Up to three direct dependents receive discounted admission. Includes all SeaWorld and Busch Gardens locations.",
    url: "https://wavesofhonor.com",
    urlLabel: "wavesofhonor.com",
    note: null,
  },
  {
    id: "epicpass",
    icon: "⛷️",
    title: "Military Epic Pass",
    subtitle: "Heavily discounted ski pass for 40+ resorts",
    color: "#a78bfa",
    tag: "DISCOUNTED",
    who: "Active duty, retired, and dependents — $185. Veterans/veteran dependents — $601.",
    desc: "The Military Epic Pass provides access to 40+ ski resorts including Vail, Beaver Creek, Breckenridge, Keystone, Park City, and more. Active duty, retired military, and their dependents pay $185 for the 2025–2026 season — a fraction of the $1,000+ regular price.",
    url: "https://www.epicpass.com/passes/military.aspx",
    urlLabel: "epicpass.com/passes/military",
    note: "Verify eligibility and purchase through the Epic Pass website. ID verification required.",
  },
  {
    id: "tentsfortroops",
    icon: "⛺",
    title: "Tents for Troops",
    subtitle: "Complimentary RV and tent sites nationwide",
    color: "#4ade80",
    tag: "FREE",
    who: "Active duty and military families",
    desc: "A nationwide program connecting military families with complimentary RV and tent camping sites for a minimum two-night stay. State parks also frequently waive day-use and camping fees with military ID on a walk-up or reservation basis.",
    url: "https://www.tentsfortroops.org",
    urlLabel: "tentsfortroops.org",
    note: null,
  },
];

const TAG_STYLE = {
  "FREE":          { bg: "rgba(74,222,128,0.2)",  color: "#4ade80",  border: "rgba(74,222,128,0.4)"  },
  "DISCOUNTED":    { bg: "rgba(96,165,250,0.2)",  color: "#60a5fa",  border: "rgba(96,165,250,0.4)"  },
  "LOW COST":      { bg: "rgba(251,191,36,0.2)",  color: "#fbbf24",  border: "rgba(251,191,36,0.4)"  },
  "FREE / SUBSIDIZED": { bg: "rgba(52,211,153,0.2)", color: "#34d399", border: "rgba(52,211,153,0.4)" },
};

function VacationDealsScreen() {
  const [sel, setSel] = useState(null);
  if (sel) {
    const deal = VACATION_DEALS.find(d => d.id === sel);
    const ts = TAG_STYLE[deal.tag] || TAG_STYLE["DISCOUNTED"];
    return <div>
      <button onClick={() => setSel(null)} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:16}}>← Back to Vacation Deals</button>
      <div style={{fontSize:28,marginBottom:8}}>{deal.icon}</div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
        <div style={{fontSize:17,fontWeight:"bold",color:deal.color}}>{deal.title}</div>
        <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`,fontWeight:"bold",letterSpacing:0.5}}>{deal.tag}</span>
      </div>
      <div style={{fontSize:12,color:"#8a9bbf",marginBottom:16,lineHeight:1.6}}>{deal.subtitle}</div>
      <div style={{background:`${deal.color}10`,border:`1px solid ${deal.color}30`,borderRadius:11,padding:14,marginBottom:14}}>
        <div style={{fontSize:10,color:deal.color,fontWeight:"bold",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Who's Eligible</div>
        <div style={{fontSize:13,color:"#e8e4dc",lineHeight:1.6}}>{deal.who}</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,padding:14,marginBottom:14,fontSize:13,color:"#c8c4bc",lineHeight:1.65}}>{deal.desc}</div>
      {deal.note && <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:11,padding:12,marginBottom:14,fontSize:12,color:"#c8c4bc",lineHeight:1.6}}>⚠️ {deal.note}</div>}
      {deal.contact && <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 14px",marginBottom:10}}>
        <div style={{fontSize:10,color:"#8a9bbf",marginBottom:3}}>Reservations</div>
        <div style={{fontSize:14,fontWeight:"bold",color:"#4ade80"}}>{deal.contact}</div>
      </div>}
      <div style={{background:`${deal.color}10`,border:`1px solid ${deal.color}30`,borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:"#8a9bbf",marginBottom:3}}>Website / More Info</div>
          <div style={{fontSize:13,color:deal.color,fontWeight:"bold"}}>{deal.urlLabel}</div>
        </div>
        <span style={{fontSize:18,color:deal.color}}>↗</span>
      </div>
    </div>;
  }
  return <div>
    <div style={{fontSize:19,fontWeight:"bold",color:"#c9a95d",marginBottom:4}}>🌴 Vacation Deals</div>
    <div style={{fontSize:12,color:"#8a9bbf",marginBottom:8,lineHeight:1.6}}>Programs, non-profits, and military-exclusive deals most sailors don't know about. Tap any for full details and links.</div>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
      {Object.entries(TAG_STYLE).map(([tag,ts])=><span key={tag} style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`,fontWeight:"bold"}}>{tag}</span>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {VACATION_DEALS.map(deal => {
        const ts = TAG_STYLE[deal.tag] || TAG_STYLE["DISCOUNTED"];
        return <button key={deal.id} onClick={()=>setSel(deal.id)} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${deal.color}28`,borderLeft:`3px solid ${deal.color}`,borderRadius:11,padding:15,display:"flex",alignItems:"center",gap:13,textAlign:"left",cursor:"pointer",color:"#e8e4dc"}}>
          <span style={{fontSize:24,flexShrink:0}}>{deal.icon}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
              <span style={{fontSize:13,fontWeight:"bold",color:deal.color}}>{deal.title}</span>
              <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`,fontWeight:"bold"}}>{deal.tag}</span>
            </div>
            <div style={{fontSize:11,color:"#8a9bbf",lineHeight:1.4}}>{deal.subtitle}</div>
          </div>
          <span style={{color:deal.color,fontSize:14,flexShrink:0}}>›</span>
        </button>;
      })}
    </div>
    <div style={{marginTop:18,background:"rgba(201,169,93,0.08)",border:"1px solid rgba(201,169,93,0.2)",borderRadius:11,padding:14,fontSize:12,color:"#8a9bbf",lineHeight:1.6}}>
      💡 <strong style={{color:"#c9a95d"}}>Pro tip:</strong> Always check Tinker ITT before buying tickets to anything — theme parks, concerts, sporting events. The savings are real.
    </div>
  </div>;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function SquadronHub() {
  const [activeTab, setActiveTab] = useState("home");
  const [calView, setCalView] = useState("list");
  const [activeResource, setActiveResource] = useState(null);
  const [orgFilter, setOrgFilter] = useState("All");

  const goResource = id => { setActiveResource(id); setActiveTab("resources"); };
  const orgs = ["All", ...Object.keys(ORG_COLORS)];
  const filteredEvents = orgFilter==="All" ? EVENTS : EVENTS.filter(e=>e.org===orgFilter);

  return (
    <div style={{fontFamily:"'Georgia','Times New Roman',serif",background:"#0a0e1a",minHeight:"100vh",color:"#e8e4dc",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#0d1b3e,#1a2a5e,#0d1b3e)",padding:"15px 20px 12px",borderBottom:"1px solid rgba(201,169,93,0.3)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:33,height:33,borderRadius:"50%",background:"linear-gradient(135deg,#c9a95d,#8b6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,boxShadow:"0 0 12px rgba(201,169,93,0.4)"}}>⚓</div>
          <div>
            <div style={{fontSize:13,fontWeight:"bold",color:"#c9a95d",letterSpacing:1}}>VQ-4 / TACAMO</div>
            <div style={{fontSize:9,color:"#8a9bbf",letterSpacing:2,textTransform:"uppercase"}}>Tinker AFB · Command Resource App</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:80}}>

        {/* HOME */}
        {activeTab==="home" && <div style={{padding:20}}>
          <div style={{fontSize:21,fontWeight:"bold",color:"#c9a95d",marginBottom:3}}>Welcome Aboard.</div>
          <div style={{fontSize:12,color:"#8a9bbf",marginBottom:20,lineHeight:1.6}}>Everything you need — events, resources, contacts — right here.</div>
          <div style={{fontSize:10,color:"#8a9bbf",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Quick Access</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:20}}>
            {[
              {icon:"👨‍👩‍👧",label:"Family & Fun",action:()=>goResource("family")},
              {icon:"🚌",label:"TACAMO Shuttle",action:()=>goResource("shuttle")},
              {icon:"🧠",label:"Mental Health Help",action:()=>goResource("mentalhealth")},
              {icon:"🌴",label:"Vacation Deals",action:()=>goResource("vacation")},
              {icon:"✈️",label:"TAD Travel",action:()=>goResource("tad")},
              {icon:"🛡️",label:"SAPR Resources",action:()=>goResource("sapr")},
            ].map((item,i)=><button key={i} onClick={item.action} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(201,169,93,0.18)",borderRadius:11,padding:"13px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,color:"#e8e4dc",cursor:"pointer"}}>
              <span style={{fontSize:20}}>{item.icon}</span>
              <span style={{fontSize:10,textAlign:"center",lineHeight:1.3}}>{item.label}</span>
            </button>)}
          </div>
          <div style={{fontSize:10,color:"#8a9bbf",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Coming Up</div>
          {EVENTS.slice(0,3).map(ev=><div key={ev.id} onClick={()=>setActiveTab("events")} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${ORG_COLORS[ev.org]||"#c9a95d"}`,borderRadius:10,padding:12,cursor:"pointer",marginBottom:7}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:12,fontWeight:"bold"}}>{ev.title}</span>
              <span style={{fontSize:9,color:ORG_COLORS[ev.org]||"#c9a95d",marginLeft:6,flexShrink:0}}>{ev.org}</span>
            </div>
            <div style={{fontSize:11,color:"#8a9bbf"}}>{ev.time&&`${ev.time} · `}{ev.location}</div>
          </div>)}
          <button onClick={()=>setActiveTab("events")} style={{width:"100%",background:"rgba(201,169,93,0.08)",border:"1px solid rgba(201,169,93,0.2)",borderRadius:10,padding:"9px",color:"#c9a95d",fontSize:12,cursor:"pointer",marginBottom:18,fontFamily:"inherit"}}>See all events →</button>
          <div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:12,padding:13,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:18}}>🆘</span>
            <div>
              <div style={{fontSize:11,fontWeight:"bold",color:"#f87171"}}>Crisis? You're not alone.</div>
              <div style={{fontSize:11,color:"#8a9bbf"}}>Military Crisis Line: <strong style={{color:"#e8e4dc"}}>988 (press 1)</strong></div>
              <div style={{fontSize:11,color:"#8a9bbf"}}>SAPR Hotline: <strong style={{color:"#e8e4dc"}}>405-734-7272</strong></div>
              <div style={{fontSize:11,color:"#8a9bbf"}}>TACAMO Chaplain: <strong style={{color:"#e8e4dc"}}>405-739-3318</strong></div>
            </div>
          </div>
        </div>}

        {/* EVENTS */}
        {activeTab==="events" && <div style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:19,fontWeight:"bold",color:"#c9a95d"}}>Community Events</div>
            <div style={{display:"flex",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:3,gap:2}}>
              {["list","calendar"].map(v=><button key={v} onClick={()=>setCalView(v)} style={{background:calView===v?"rgba(201,169,93,0.25)":"transparent",border:calView===v?"1px solid rgba(201,169,93,0.4)":"1px solid transparent",borderRadius:6,padding:"4px 10px",cursor:"pointer",color:calView===v?"#c9a95d":"#8a9bbf",fontSize:11}}>
                {v==="list"?"☰ List":"▦ Cal"}
              </button>)}
            </div>
          </div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
            {orgs.map(org=><button key={org} onClick={()=>setOrgFilter(org)} style={{background:orgFilter===org?"#c9a95d":"rgba(255,255,255,0.05)",border:`1px solid ${orgFilter===org?"#c9a95d":"rgba(255,255,255,0.1)"}`,borderRadius:20,padding:"4px 11px",color:orgFilter===org?"#0a0e1a":"#8a9bbf",fontSize:10,cursor:"pointer",whiteSpace:"nowrap",fontWeight:orgFilter===org?"bold":"normal"}}>{org}</button>)}
          </div>
          {calView==="list"?<ListView events={filteredEvents}/>:<CalendarView events={filteredEvents}/>}
        </div>}

        {/* RESOURCES */}
        {activeTab==="resources" && <div style={{padding:20}}>
          {!activeResource&&<>
            <div style={{fontSize:19,fontWeight:"bold",color:"#c9a95d",marginBottom:4}}>Resources</div>
            <div style={{fontSize:12,color:"#8a9bbf",marginBottom:16,lineHeight:1.6}}>Tap a category to find exactly what you need.</div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {RESOURCE_CATEGORIES.map(cat=><button key={cat.id} onClick={()=>setActiveResource(cat.id)} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${cat.color}28`,borderLeft:`3px solid ${cat.color}`,borderRadius:11,padding:16,display:"flex",alignItems:"center",gap:14,textAlign:"left",cursor:"pointer",color:"#e8e4dc"}}>
                <span style={{fontSize:24}}>{cat.icon}</span>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:"bold",color:cat.color}}>{cat.label}</div></div>
                <span style={{color:cat.color,fontSize:14}}>›</span>
              </button>)}
            </div>
          </>}
          {activeResource&&<>
            <button onClick={()=>setActiveResource(null)} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",gap:6}}>← All Resources</button>
            {activeResource==="mentalhealth"&&<MHFlowChart/>}
            {activeResource==="legal"&&<LegalScreen/>}
            {activeResource==="medical"&&<MedicalScreen/>}
            {activeResource==="family"&&<FamilyScreen/>}
            {activeResource==="sapr"&&<SAPRScreen/>}
            {activeResource==="cmeo"&&<CMEOScreen/>}
            {activeResource==="tad"&&<TADScreen/>}
            {activeResource==="shuttle"&&<ShuttleScreen/>}
            {activeResource==="saferide"&&<SafeRideScreen/>}
            {activeResource==="vacation"&&<VacationDealsScreen/>}
            {activeResource==="dapa"&&<DAPAScreen/>}
            {activeResource==="odr"&&<ODRScreen/>}
          </>}
        </div>}

        {/* CONTACTS */}
        {activeTab==="contacts" && <div style={{padding:20}}>
          <div style={{fontSize:19,fontWeight:"bold",color:"#c9a95d",marginBottom:16}}>Key Contacts</div>
          {Object.entries(CONTACTS.reduce((acc,c)=>{ (acc[c.category]=acc[c.category]||[]).push(c); return acc; },{})).map(([cat,cs])=><div key={cat} style={{marginBottom:16}}>
            <div style={{fontSize:10,color:CAT_COLORS[cat]||"#c9a95d",letterSpacing:2,textTransform:"uppercase",marginBottom:8,paddingBottom:5,borderBottom:`1px solid ${CAT_COLORS[cat]||"#c9a95d"}22`}}>{cat}</div>
            {cs.map((c,i)=><div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:12,marginBottom:6}}>
              <div style={{fontSize:12,fontWeight:"bold",marginBottom:4}}>{c.name}</div>
              {c.phone&&<div style={{fontSize:12,color:"#4ade80"}}>📱 {c.phone}</div>}
              {c.email&&<div style={{fontSize:12,color:"#60a5fa",marginTop:2}}>✉ {c.email}</div>}
            </div>)}
          </div>)}
        </div>}

        {/* SHUTTLE — accessed from DAPA or as standalone */}
        {activeTab==="shuttle" && <div style={{padding:20}}>
          <button onClick={()=>setActiveTab("home")} style={{background:"none",border:"none",color:"#8a9bbf",fontSize:13,cursor:"pointer",marginBottom:18}}>← Home</button>
          <ShuttleScreen/>
        </div>}
      </div>

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(10,14,26,0.96)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(201,169,93,0.2)",display:"flex",zIndex:50}}>
        {NAV_ITEMS.map(item=><button key={item.id} onClick={()=>{setActiveTab(item.id);if(item.id!=="resources")setActiveResource(null);}} style={{flex:1,background:"none",border:"none",padding:"10px 4px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>
          <span style={{fontSize:17,filter:activeTab===item.id?"none":"grayscale(0.8) opacity(0.5)"}}>{item.icon}</span>
          <span style={{fontSize:9,letterSpacing:0.5,color:activeTab===item.id?"#c9a95d":"#4a5568",fontWeight:activeTab===item.id?"bold":"normal"}}>{item.label.toUpperCase()}</span>
        </button>)}
      </div>
    </div>
  );
}
