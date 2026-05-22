import { useEffect, useMemo, useState } from "react";

const DEFAULT_EVENTS = [
  { title: "USO Breakfast", date: "May 21, 2026", time: "0500-0700", place: "Outside VQ-3 Geedunk", tag: "Free, family friendly", org: "USO", desc: "Free breakfast hosted by the USO." },
  { title: "Midnight Coffee Club", date: "May 28, 2026", time: "2300-0100", place: "VQ-3/4 Spaces, roaming cart", tag: "Free, night crew", org: "USO", desc: "USO roaming coffee and goodies through the VQ-3/4 spaces." },
  { title: "Midnight Coffee Club", date: "May 29, 2026", time: "2300-0100", place: "VQ-3/4 Spaces, roaming cart", tag: "Free, night crew", org: "USO", desc: "Night two of the USO Midnight Coffee Club." },
  { title: "Rock Painting", date: "May 29, 2026", time: "1630-1800", place: "The Herc pavilion outside CNATT HIBAY", tag: "Free, family friendly", org: "TACAMO", desc: "Open to all ages, sailors, and family members. Paint rocks or just come watch. Bring your own or use ours." },
  { title: "Open Rec Saturday", date: "May 30, 2026", time: "1000-1300", place: "Outdoor Rec, Bldg 478", tag: "Free, family friendly", org: "ODR", desc: "Ping pong, foosball, cornhole, giant Jenga, ladder ball, rock room climbing. Kids' craft available." },
  { title: "TACAMO Family Yoga", date: "June 5, 2026", time: "1630", place: "The Herc pavilion, behind A-130", tag: "Free, family friendly", org: "TACAMO", desc: "Restorative yoga with the Health Promotion Office. Open to all TACAMO. Come and go as you please." },
  { title: "Soup Lunch + USO Therapy Dogs", date: "June 18, 2026", time: "1100-1300", place: "Training classroom, VQ-3/4 Spaces", tag: "Free, family friendly", org: "USO", desc: "Free soup lunch and therapy dogs. Free and open to all." },
  { title: "ODR: Wichita Mtns Day Hike", date: "May 16, 2026", time: "Shuttle provided", place: "Wichita Mtns. Wildlife Refuge", tag: "$5 military, family friendly", org: "ODR", desc: "Day hike. Lunch included. Shuttle from Tinker." },
  { title: "ODR: Buffalo River Float, 3-day", date: "May 22-25, 2026", time: "Shuttle provided", place: "Buffalo National River, AR", tag: "$40 AD/NG, $70 civilian", org: "ODR", desc: "Three-day kayak camping float on America's first Scenic River, about 30 miles." },
  { title: "ODR: Spring Kickoff Campout", date: "May 29-30, 2026", time: "Overnight", place: "Wichita Mtns.", tag: "$20 AD/NG, $30 civilian", org: "ODR", desc: "Kayak, SUP, day hike, Saturday meals provided." },
  { title: "ODR: Summerfest", date: "June 6, 2026", time: "All day", place: "ALS Field, Tinker AFB", tag: "Free, some for-fee", org: "ODR", desc: "Live music, free pool, bowling specials, cornhole, car show." },
  { title: "ODR: Kayaking Stinchcomb Refuge", date: "June 7, 2026", time: "Shuttle provided", place: "Lake Overholser, OKC", tag: "TBA, family friendly", org: "ODR", desc: "Kayaking at Stinchcomb Wildlife Refuge. More TBA." },
  { title: "ODR: Great Campout", date: "June 12-13, 2026", time: "Overnight", place: "ALS Field, Tinker AFB", tag: "Free, family friendly", org: "ODR", desc: "Free campout with stars, outdoor movie, swim, s'mores, crafts, and breakfast. Register with ODR." },
  { title: "ODR: Wichita Mtns Day Hike", date: "June 14, 2026", time: "Shuttle provided", place: "Wichita Mtns. Wildlife Refuge", tag: "$5 military, family friendly", org: "ODR", desc: "Second hike of the season. Lunch included." },
  { title: "ODR: Buffalo River Float, 2-day", date: "June 19-21, 2026", time: "Shuttle provided", place: "Buffalo National River, AR", tag: "$40 AD/NG, $70 civilian", org: "ODR", desc: "Two-day kayak camping float, about 30 miles. Shuttle provided." },
  { title: "ODR: Whitewater Rafting & Rock Climbing", date: "June 25-28, 2026", time: "Trip", place: "Canon City / Colorado Springs, CO", tag: "$200 AD/NG, $525 civilian, 16+", org: "ODR", desc: "One day Royal Gorge rafting plus one day rock climbing. Transport and food included. Must be 16+." },
  { title: "ODR: High Points Adventure", date: "August 21-24, 2026", time: "Trip", place: "Leadville, Colorado", tag: "$75 AD/NG, $250 civilian", org: "ODR", desc: "Summit Mt. Elbert, 14,438 feet. Shuttle provided." },
];

const RESOURCES = [
  { id: "mental", label: "Mental Health", detail: "Crisis line, chaplain, FFSC, and command help", tone: "green" },
  { id: "legal", label: "Legal", detail: "Notary, POA, wills, SCRA, landlord help, and FAP", tone: "gold" },
  { id: "medical", label: "Medical", detail: "Primary care, behavioral health, TRICARE, SAPR medical, and FAP", tone: "blue" },
  { id: "shuttle", label: "TACAMO Shuttle", detail: "Stop times, pickup points, and CDO contact", tone: "amber" },
  { id: "family", label: "Family & Fun", detail: "ODR, USO, youth events, and off-duty ideas", tone: "pink" },
  { id: "sapr", label: "SAPR", detail: "Restricted reporting, hotline, and victim advocacy", tone: "red" },
  { id: "cmeo", label: "CMEO", detail: "Command Managed Equal Opportunity resources", tone: "purple" },
  { id: "tad", label: "TAD Travel", detail: "Checklist, DTS reminders, and who to call", tone: "blue" },
  { id: "saferide", label: "Safe Ride Program", detail: "Plan a safe ride before you need one", tone: "gold" },
  { id: "odr", label: "Outdoor Rec (ODR)", detail: "Trips, gear, bouldering, axe throwing, and events", tone: "green" },
  { id: "vacation", label: "Vacation Deals", detail: "Military discounts, cabins, parks, and travel", tone: "gold" },
  { id: "dapa", label: "DAPA Program", detail: "Drug and Alcohol Program Advisor support", tone: "amber" },
];

const VACATION_DEALS = [
  { title: "IHOOT Foundation", detail: "Free weeklong vacation accommodations for active duty, veterans, and families. Locations include Holiday Inn Club Vacations properties in Branson, Galveston, Massachusetts, and Vermont. Current requests are accepting arrivals beyond June 30, 2026. Website: ihoot.org", tag: "Free" },
  { title: "Armed Forces Vacation Club", detail: "Weeklong resort vacations at thousands of resorts in over 100 countries. Free membership for eligible active duty, Guard/Reserve, and retired military.", tag: "Discounted" },
  { title: "American Forces Travel", detail: "Official MWR travel portal for discounted flights, hotels, rental cars, cruises, and vacation packages. Website: americanforcestravel.com", tag: "Travel" },
  { title: "Tinker ITT", detail: "Information, Tickets & Travel at Tinker. Check before buying theme park, concert, sporting event, Universal, Disney, SeaWorld, or other tickets. Website: tinkerliving.com/information-tickets-travel", tag: "Discounted" },
  { title: "American Valor Foundation Mountain Treks", detail: "Four-day Colorado Rockies backpacking retreat for active duty, retired military, first responders, and spouses. 2026 trip: Del Norte, CO, trail days June 5-8, travel days June 4-9. Must apply.", tag: "Free / Subsidized" },
  { title: "Sheppard AFB Annex Lake Texoma", detail: "Cabins, RV sites, campsites, boating, kayaks, canoes, lodge amenities, and seasonal snack bar. Cabins $70-$120/night, RV spaces $30/night, pontoon $300/day, bass boat $250/day. Reservations: (903) 523-4613, 8am-5pm daily.", tag: "Low Cost" },
  { title: "Blue Star Museums", detail: "Free museum admission for active duty, National Guard, Reserve, and families from Armed Forces Day, May 16, through Labor Day, Sept. 7, 2026. Up to five family members per military ID holder.", tag: "Free" },
  { title: "Waves of Honor", detail: "One free park admission per year to SeaWorld or Busch Gardens for active duty, Guard, and Reserve members, plus discounted admission for up to three direct dependents. Website: wavesofhonor.com", tag: "Free" },
  { title: "Military Epic Pass", detail: "Discounted ski pass for 40+ resorts. Original file listed active duty, retired, and dependents at $185, veterans/veteran dependents at $601 for the 2025-2026 season. Verify on epicpass.com before purchase.", tag: "Discounted" },
  { title: "Tents for Troops", detail: "Complimentary RV and tent camping sites nationwide for active duty and military families, typically minimum two-night stays. State parks may also waive day-use and camping fees with military ID.", tag: "Free" },
];

const RESOURCE_DETAILS = {
  legal: {
    eyebrow: "Legal help",
    title: "Legal",
    summary: "Original app covered notary, Power of Attorney, wills, landlord disputes, SCRA/deployment protections, and Family Advocacy Program.",
    items: [
      { label: "Notary", value: "Squadron legal handles notarizations. Bring valid military/government ID, document to be notarized, and any required witnesses." },
      { label: "Power of Attorney", value: "Squadron legal handles standard POAs, typically same-day. Know who receives the POA and what powers you want to grant." },
      { label: "Will", value: "Wills require an appointment with Air Force Legal. Bring ID, asset/beneficiary list, and guardian preferences if you have children." },
      { label: "Landlord dispute", value: "Base legal assistance can review your lease and advise on tenant rights and SCRA." },
      { label: "SCRA / deployment protections", value: "Legal can help with SCRA protections for interest rates, leases, and more. Bring deployment orders and account or lease documents." },
      { label: "Family Advocacy Program", value: "FAP provides support for family domestic concerns. Contact: 405-582-6604." },
    ],
  },
  medical: {
    eyebrow: "Medical support",
    title: "Medical",
    summary: "Original app listed primary care, behavioral health, base mental health, TRICARE, SAPR medical advocacy, and Family Advocacy Program.",
    items: [
      { label: "Primary Care Provider", value: "72 Medical Clinic, 1st Floor. Your PCP can vector care, manage meds, and generate referrals. Appointment line needs to be added." },
      { label: "72nd Behavioral Health", value: "405-734-2778. Located 1st floor, Family Medicine. Social worker counseling for life stressors and less severe cases." },
      { label: "Base Mental Health", value: "405-582-6603 or 405-734-7313. 2nd floor. Psychologists and psychiatrists. Walk-ins daily for service members with thoughts of suicide." },
      { label: "TRICARE West", value: "1-844-866-9378. Use TRICARE Online for MTF appointments and get pre-authorization before off-base specialists." },
      { label: "SAPR Medical & Advocacy", value: "SAPR 24-hr Hotline: 405-734-7272. Medical care and victim advocacy are available regardless of report type." },
      { label: "Family Advocacy Program", value: "405-582-6604. Prevention and treatment support for families." },
    ],
  },
  shuttle: {
    eyebrow: "Transportation",
    title: "TACAMO Shuttle",
    summary: "Bldg 820, barracks, DFAC, and Exchange shuttle information.",
    items: [
      { label: "Schedule", value: "Use the Shuttle tab for current/next stop highlighting." },
      { label: "Pickup points", value: "TACAMO, Barracks, DFAC/Galley, and Exchange." },
      { label: "Questions", value: "SCW-1 CDO: (405) 831-4973" },
    ],
  },
  family: {
    eyebrow: "Family support",
    title: "Family & Fun",
    summary: "Original app included Military & Family Readiness Center, Outdoor Recreation, and Command Ombudsman information.",
    items: [
      { label: "Military & Family Readiness Center", value: "405-739-2747. Counseling, financial planning, car buying, home buying, budgeting, and Tinker MFLC." },
      { label: "Outdoor Recreation Center", value: "405-734-5875, Tue-Fri 0700-1700. Trips, axe throwing, bouldering gym, kayaks, and camping gear." },
      { label: "Command Ombudsman", value: "VQ4ombudsman@gmail.com and Shadowombudsman@gmail.com. Family communication link to VQ-4 leadership." },
    ],
  },
  sapr: {
    eyebrow: "Confidential help",
    title: "SAPR",
    summary: "Sexual Assault Prevention and Response resources. If someone is in immediate danger, call 911.",
    items: [
      { label: "Tinker SAPR Hotline", value: "405-734-7272" },
      { label: "Reporting options", value: "Ask a SARC or VA about restricted and unrestricted reporting before sharing details broadly." },
      { label: "Privacy note", value: "Use official SAPR channels for confidential guidance." },
    ],
  },
  tad: {
    eyebrow: "Travel admin",
    title: "TAD Travel",
    summary: "Original app included a full TAD workflow from request through voucher, including DTS, GOVCC, SATO, airline, Citi, and admin guidance.",
    items: [
      { label: "Step 1: TAD Request & GOVCC/DTS", value: "Route TAD request, verify GOVCC active/not expiring, establish PIN via Citibank 1-800-200-7056, confirm CitiManager billing address, DTS email, and GOVCC number." },
      { label: "Step 2: DTS Authorization", value: "Book flights, lodging, and rental car through DTS. Use contract airline. Use on-base lodging if available, or get a CNA. If within 7 days and CTO Submit, call SATO: 1-800-756-6111." },
      { label: "Step 3: During Travel", value: "Bring orders, GOVCC, and military ID. Use GOVCC for official travel costs, keep receipts, show CAC/orders for baggage fees, decline rental insurance/pre-paid fuel/toll transponders, no civilian drivers." },
      { label: "Step 4: Voucher", value: "Submit voucher within 5 working days. Receipts required for purchases over $75, zero-balance lodging and rental car receipts, gas receipts, readable files, and separate tax claims." },
      { label: "Who to call", value: "SATO 1-800-756-6111, Citibank 1-800-790-7206, Admin/CDO (405) 831-2448, airlines for day-of-travel disruptions." },
    ],
  },
  cmeo: {
    eyebrow: "Command support",
    title: "CMEO",
    summary: "Command Managed Equal Opportunity resource. Original app listed this as a resource category and contact placeholder.",
    items: [
      { label: "Command CMEO Rep", value: "Add number. Use your command CMEO representative for equal opportunity questions or concerns." },
      { label: "When to use", value: "Questions involving discrimination, harassment, command climate, or equal opportunity concerns." },
    ],
  },
  saferide: {
    eyebrow: "Safety",
    title: "Safe Ride Program",
    summary: "Original app listed Safe Ride as a resource category for getting home safely.",
    items: [
      { label: "Plan ahead", value: "Use a safe ride before you need one. Add local command-specific Safe Ride details and phone number before launch." },
      { label: "Emergency", value: "If someone is in immediate danger, call 911." },
    ],
  },
  odr: {
    eyebrow: "Outdoor recreation",
    title: "Outdoor Rec (ODR)",
    summary: "Original app included ODR as a resource and many ODR events.",
    items: [
      { label: "Tinker ODR", value: "405-734-5875. Trips, axe throwing, bouldering gym, kayaks, camping gear, and outdoor events." },
      { label: "Upcoming ODR events", value: "Wichita Mtns hikes, Buffalo River floats, Spring Kickoff Campout, Summerfest, Stinchcomb Refuge kayaking, Great Campout, Whitewater Rafting & Rock Climbing, and High Points Adventure." },
    ],
  },
  dapa: {
    eyebrow: "Command support",
    title: "DAPA Program",
    summary: "Drug and Alcohol Program Advisor resource. Original app listed DAPA as a resource category and contact placeholder.",
    items: [
      { label: "Command DAPA", value: "Add number. Use DAPA for command drug and alcohol program questions, self-referral guidance, and support routing." },
      { label: "Privacy", value: "Talk to the DAPA or chain of command for official guidance on reporting and support options." },
    ],
  },
};

const CONTACTS = [
  { role: "Base Security / Emergency", value: "911 or local non-emergency number", type: "Emergency" },
  { role: "SAPR 24-hr Hotline", value: "405-734-7272", type: "Emergency" },
  { role: "Veterans / Military Crisis Line", value: "988, press 1", type: "Emergency" },
  { role: "Military OneSource, 24/7", value: "1-800-342-9647", type: "Mental Health" },
  { role: "TACAMO MFLC", value: "405-508-3463", type: "Mental Health" },
  { role: "TACAMO Chaplain", value: "405-739-3318 / 405-739-3999, TACAMO_CHAPLAIN@us.navy.mil", type: "Chaplain" },
  { role: "72nd MDG Mental Health, 2nd Floor", value: "405-582-6603 or 405-734-7313", type: "Medical" },
  { role: "72nd Behavioral Health, 1st Floor", value: "405-734-2778", type: "Medical" },
  { role: "Family Advocacy Program", value: "405-582-6604", type: "Medical" },
  { role: "Military & Family Readiness Center", value: "405-739-2747", type: "Family Support" },
  { role: "Command Ombudsman", value: "VQ4ombudsman@gmail.com", type: "Family Support" },
  { role: "Command Ombudsman, Shadow", value: "Shadowombudsman@gmail.com", type: "Family Support" },
  { role: "NMCRS, NAS JRB Fort Worth", value: "817-782-6000", type: "Family Support" },
  { role: "TACAMO Shuttle, SCW-1 CDO", value: "(405) 831-4973", type: "Shuttle" },
  { role: "Tinker Outdoor Recreation", value: "405-734-5875", type: "ODR" },
  { role: "Squadron Legal Office", value: "Add number", type: "Legal" },
  { role: "AF Legal, Wills & Estate", value: "Add number", type: "Legal" },
  { role: "Command DAPA", value: "Add number", type: "DAPA" },
  { role: "Command CMEO Rep", value: "Add number", type: "CMEO" },
];

const SHUTTLE = [
  ["TACAMO", "0500", "0540", "0620", "0700", "0740", "1500", "1540", "1620", "1700", "1740", "1820", "1900", "1940"],
  ["Barracks", "0520", "0600", "0640", "0720", "0800", "1520", "1600", "1640", "1720", "1800", "1840", "1920", "2000"],
  ["DFAC", "1050", "1130", "1210"],
  ["Exchange", "1610", "1650", "1730", "1810", "1850", "1930"],
];

function militaryTimeToMinutes(time) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(2));
}

function getNextShuttleStop(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return SHUTTLE.flatMap(([stop, ...times]) =>
    times.map(time => ({ stop, time, minutes: militaryTimeToMinutes(time) }))
  )
    .filter(run => run.minutes >= currentMinutes)
    .sort((a, b) => a.minutes - b.minutes)[0] || null;
}

function Home({ setTab, openResource, events }) {
  const nextEvents = events.slice(0, 3);
  const helpContacts = CONTACTS.slice(0, 4);
  return (
    <main className="screen">
      <section className="hero">
        <img src="./e6b-hero.jpg" alt="U.S. Navy E-6B Mercury aircraft in flight" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">VQ-4 Shadows</p>
          <h1>Squadron support, all in one place.</h1>
          <p>Events, resources, contacts, shuttle info, and family support for sailors and families who need the answer fast.</p>
        </div>
      </section>

      <section className="help-panel">
        <div className="section-head tight">
          <div>
            <p className="eyebrow">Help now</p>
            <h2>Important numbers</h2>
          </div>
          <button onClick={() => setTab("contacts")}>All contacts</button>
        </div>
        <div className="help-grid">
          {helpContacts.map(contact => (
            <article key={contact.role} className={contact.type === "Emergency" ? "urgent" : ""}>
              <span>{contact.role}</span>
              <strong>{contact.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="quick-grid">
        {[
          ["Shuttle", "Next ride", () => setTab("shuttle")],
          ["Mental Health", "Talk to someone", () => openResource("mental")],
          ["Vacation Deals", "Military discounts", () => openResource("vacation")],
          ["Events", "What is coming up", () => setTab("events")],
        ].map(([label, detail, action]) => (
          <button key={label} className="quick-tile" onClick={action}>
            <span>{label}</span>
            <small>{detail}</small>
          </button>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Coming up</p>
            <h2>On the board</h2>
          </div>
          <button onClick={() => setTab("events")}>All events</button>
        </div>
        <div className="event-list">
          {nextEvents.map(event => <EventCard key={event.title} event={event} compact />)}
        </div>
      </section>
    </main>
  );
}

function EventCard({ event, compact = false }) {
  return (
    <article className={compact ? "event-card compact" : "event-card"}>
      <div className="date-chip">{event.date}</div>
      <div>
        <div className="event-topline">
          <h3>{event.title}</h3>
          <span>{event.org}</span>
        </div>
        <p>{event.time} at {event.place}</p>
        {event.desc && <p>{event.desc}</p>}
        <em>{event.tag}</em>
      </div>
    </article>
  );
}

function PageHomeButton({ setTab }) {
  return <button className="page-home-button" onClick={() => setTab("home")}>Home</button>;
}

function Events({ setTab, events }) {
  const [filter, setFilter] = useState("All");
  const orgs = useMemo(() => ["All", ...Array.from(new Set(events.map(event => event.org)))], [events]);
  const visible = useMemo(() => filter === "All" ? events : events.filter(e => e.org === filter), [filter, events]);
  return (
    <main className="screen">
      <PageHomeButton setTab={setTab} />
      <header className="page-title">
        <p className="eyebrow">Morale and movement</p>
        <h1>Events</h1>
      </header>
      <div className="segmented">
        {orgs.map(org => <button key={org} className={filter === org ? "active" : ""} onClick={() => setFilter(org)}>{org}</button>)}
      </div>
      <div className="event-list roomy">
        {visible.map(event => <EventCard key={`${event.date}-${event.title}`} event={event} />)}
      </div>
    </main>
  );
}

function Resources({ selectedResource, setSelectedResource, setTab }) {
  if (selectedResource === "vacation") {
    return (
      <main className="screen">
        <PageHomeButton setTab={setTab} />
        <button className="back-button" onClick={() => setSelectedResource(null)}>Back to Resources</button>
        <header className="page-title">
          <p className="eyebrow">Military discounts</p>
          <h1>Vacation Deals</h1>
        </header>
        <div className="deal-list">
          {VACATION_DEALS.map(deal => (
            <article key={deal.title} className="deal-card">
              <span>{deal.tag}</span>
              <strong>{deal.title}</strong>
              <p>{deal.detail}</p>
            </article>
          ))}
        </div>
      </main>
    );
  }

  if (selectedResource === "mental") {
    return (
      <main className="screen">
        <PageHomeButton setTab={setTab} />
        <button className="back-button" onClick={() => setSelectedResource(null)}>Back to Resources</button>
        <header className="page-title">
          <p className="eyebrow">Support</p>
          <h1>Mental Health</h1>
        </header>
        <div className="contact-list">
          {CONTACTS.filter(contact => ["Emergency", "Mental Health", "Chaplain"].includes(contact.type)).map(contact => (
            <article key={contact.role} className={contact.type === "Emergency" ? "urgent" : ""}>
              <span>{contact.type}</span>
              <strong>{contact.role}</strong>
              <p>{contact.value}</p>
            </article>
          ))}
        </div>
      </main>
    );
  }

  if (RESOURCE_DETAILS[selectedResource]) {
    const detail = RESOURCE_DETAILS[selectedResource];
    return (
      <main className="screen">
        <PageHomeButton setTab={setTab} />
        <button className="back-button" onClick={() => setSelectedResource(null)}>Back to Resources</button>
        <header className="page-title">
          <p className="eyebrow">{detail.eyebrow}</p>
          <h1>{detail.title}</h1>
        </header>
        <section className="resource-detail">
          <p>{detail.summary}</p>
          <div>
            {detail.items.map(item => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="screen">
      <PageHomeButton setTab={setTab} />
      <header className="page-title">
        <p className="eyebrow">No hunting around</p>
        <h1>Resources</h1>
      </header>
      <div className="resource-list">
        {RESOURCES.map(resource => (
          <button key={resource.id} className={`resource-row ${resource.tone}`} onClick={() => setSelectedResource(resource.id)}>
            <span>{resource.label}</span>
            <small>{resource.detail}</small>
          </button>
        ))}
      </div>
    </main>
  );
}

function Shuttle({ setTab }) {
  const nextStop = getNextShuttleStop();
  return (
    <main className="screen">
      <PageHomeButton setTab={setTab} />
      <header className="page-title">
        <p className="eyebrow">Monday-Friday</p>
        <h1>TACAMO Shuttle</h1>
      </header>
      <section className="shuttle-hero">
        <span>Next stop</span>
        {nextStop ? (
          <>
            <strong>{nextStop.stop} at {nextStop.time}</strong>
            <p>Highlighted in green below based on the current time.</p>
          </>
        ) : (
          <>
            <strong>No more runs today</strong>
            <p>Check the morning schedule for the next duty day.</p>
          </>
        )}
      </section>
      <div className="shuttle-grid">
        {SHUTTLE.map(([stop, ...times]) => (
          <article key={stop}>
            <h2>{stop}</h2>
            <div>{times.map(time => (
              <span key={time} className={nextStop?.stop === stop && nextStop?.time === time ? "next-run" : ""}>{time}</span>
            ))}</div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Contacts({ setTab }) {
  return (
    <main className="screen">
      <PageHomeButton setTab={setTab} />
      <header className="page-title">
        <p className="eyebrow">Call sheet</p>
        <h1>Key Contacts</h1>
      </header>
      <div className="contact-list">
        {CONTACTS.map(contact => (
          <article key={contact.role} className={contact.type === "Emergency" ? "urgent" : ""}>
            <span>{contact.type}</span>
            <strong>{contact.role}</strong>
            <p>{contact.value}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default function ShadowHub() {
  const [tab, setTab] = useState("home");
  const [selectedResource, setSelectedResource] = useState(null);
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  useEffect(() => {
    fetch("./content.json", { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (Array.isArray(data?.events) && data.events.length > 0) {
          setEvents(data.events);
        }
      })
      .catch(() => {});
  }, []);
  const openResource = id => {
    setSelectedResource(id);
    setTab("resources");
  };
  const tabs = [
    ["home", "Home"],
    ["events", "Events"],
    ["resources", "Resources"],
    ["shuttle", "Shuttle"],
    ["contacts", "Contacts"],
  ];

  return (
    <div className="shadow-app">
      <header className="topbar">
        <div className="mark">VQ-4</div>
        <div>
          <strong>Shadows Hub</strong>
          <span>Sailor and family support</span>
        </div>
        <a href="./admin" aria-label="Admin">Admin</a>
      </header>

      {tab === "home" && <Home setTab={setTab} openResource={openResource} events={events} />}
      {tab === "events" && <Events setTab={setTab} events={events} />}
      {tab === "resources" && <Resources selectedResource={selectedResource} setSelectedResource={setSelectedResource} setTab={setTab} />}
      {tab === "shuttle" && <Shuttle setTab={setTab} />}
      {tab === "contacts" && <Contacts setTab={setTab} />}

      <nav className="bottom-nav" aria-label="Primary">
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
