import { useEffect, useRef, useState } from "react";

const emptyEvent = {
  title: "",
  date: "",
  time: "",
  place: "",
  org: "TACAMO",
  tag: "Family friendly",
  desc: "",
};

function displayDate(value) {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function SimpleAdmin() {
  const [password, setPassword] = useState("");
  const [event, setEvent] = useState(emptyEvent);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [events, setEvents] = useState([]);
  const dateInputRef = useRef(null);

  useEffect(() => {
    fetch(`./api/events.php?list=${Date.now()}`, { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(data => setEvents(Array.isArray(data?.events) ? data.events : []))
      .catch(() => setEvents([]));
  }, []);

  const update = (key, value) => {
    setStatus("");
    setEvent(prev => ({ ...prev, [key]: value }));
  };

  const submit = async e => {
    e.preventDefault();
    if (!event.title.trim() || !event.date.trim() || !password.trim()) {
      setStatus("Password, event name, and date are required.");
      return;
    }

    setBusy(true);
    setStatus("Saving...");
    try {
      const response = await fetch("./api/events.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "add", event: { ...event, date: displayDate(event.date) } }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Save failed.");
      }
      setEvents(result.events || []);
      setEvent(emptyEvent);
      setStatus("Saved. The event is live for everyone after refresh.");
    } catch (err) {
      setStatus(`${err.message} If you are previewing locally, this needs the SiteGround PHP endpoint to run.`);
    } finally {
      setBusy(false);
    }
  };

  const deleteEvent = async index => {
    if (!password.trim()) {
      setStatus("Enter the admin password before deleting.");
      return;
    }
    if (!confirm("Delete this event from the live list?")) return;
    setBusy(true);
    setStatus("Deleting...");
    try {
      const response = await fetch("./api/events.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "delete", index }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Delete failed.");
      }
      setEvents(result.events || []);
      setStatus("Deleted. The event is removed for everyone after refresh.");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="mark">VQ-4</div>
        <div>
          <strong>Event Admin</strong>
          <span>Add it once. Everyone sees it.</span>
        </div>
        <a href="./">View Site</a>
      </header>

      <main className="admin-main">
        <form className="admin-form" onSubmit={submit}>
          <p className="eyebrow">Required</p>
          <h1>Add Event</h1>

          <label>
            Admin password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" autoComplete="current-password" />
          </label>

          <label>
            Event name
            <input value={event.title} onChange={e => update("title", e.target.value)} placeholder="USO Breakfast" />
          </label>

          <div className="form-grid">
            <label>
              Date
              <div className="date-pick-row">
                <input ref={dateInputRef} type="date" value={event.date} onChange={e => update("date", e.target.value)} />
                <button type="button" onClick={() => {
                  if (dateInputRef.current?.showPicker) dateInputRef.current.showPicker();
                  else dateInputRef.current?.focus();
                }}>Pick</button>
              </div>
            </label>
            <label>
              Time
              <input value={event.time} onChange={e => update("time", e.target.value)} placeholder="1100-1300" />
            </label>
          </div>

          <label>
            Location
            <input value={event.place} onChange={e => update("place", e.target.value)} placeholder="Training classroom, VQ-3/4 Spaces" />
          </label>

          <div className="form-grid">
            <label>
              Group
              <select value={event.org} onChange={e => update("org", e.target.value)}>
                <option>USO</option>
                <option>ODR</option>
                <option>TACAMO</option>
                <option>FFSC</option>
                <option>Chapel</option>
                <option>Command</option>
              </select>
            </label>
            <label>
              Tag
              <input value={event.tag} onChange={e => update("tag", e.target.value)} placeholder="Free, family friendly" />
            </label>
          </div>

          <label>
            Details
            <textarea value={event.desc} onChange={e => update("desc", e.target.value)} placeholder="Write this like a normal person. What is it, who is invited, and what should they know?" rows={4} />
          </label>

          <button type="submit" disabled={busy}>{busy ? "Saving..." : "Add Event"}</button>
          {status && <p className="admin-status">{status}</p>}
        </form>

        <section className="admin-list">
          <p className="eyebrow">Live list</p>
          <h2>Current Events</h2>
          {events.slice(0, 10).map(item => (
            <article key={`${item.date}-${item.title}`}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.date} | {item.time || "Time TBD"} | {item.place || "Location TBD"}</span>
              </div>
              <button type="button" onClick={() => deleteEvent(events.indexOf(item))} disabled={busy}>Delete</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
