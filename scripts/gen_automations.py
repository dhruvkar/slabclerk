#!/usr/bin/env python3
"""Generate /automations/ pages from PAGES config. Run from repo root:
   python3 scripts/gen_automations.py
"""
import os, html

PAGES = [
    {
        "slug": "container-watchdog",
        "title": "Container Watchdog",
        "lede": "Track &amp; trace on every box — and the demurrage clock beaten before it starts.",
        "video": "/assets/container-watchdog.mp4",
        "bullets": [
            ("Reads arrival notices as they land.", "Container, PO, and HBL matched to your system the minute the forwarder's email arrives."),
            ("Counts down the free days.", "Last free day computed from the notice — you hear about the clock days before it costs money, not on the demurrage invoice."),
            ("Chases the whole cycle.", "ETA changes, pickup numbers, drayage scheduling, empty returns — drafted and sent on your OK."),
            ("Knows what's waiting.", "Every open order tied to the box, so a slipped sailing tells the right customer, not just you."),
        ],
        "evidence": "At one four-branch importer we studied, the owner's reply to a demurrage invoice was three words and three exclamation points — the charges had accrued before anyone saw the clock. The watchdog counts free days from the arrival notice, not from the bill.",
    },
    {
        "slug": "collections-clerk",
        "title": "Collections Clerk",
        "lede": "Your aged receivables, chased account by account — drafted nightly, tracked to paid.",
        "video": "/assets/collections-clerk.mp4",
        "bullets": [
            ("One drafted email per account.", "Invoice rows and links pulled from your system, in your voice, addressed to the person who owes you."),
            ("Routed to the rep who owns the account.", "Your office copied, so collections and sales stop working from different lists."),
            ("Promises tracked.", "Follow-ups fire on day 7 and day 14 automatically; payment plans and disputes are excluded without being told twice."),
            ("Escalates only silence.", "You see the accounts that ignored three notes — not the forty that needed one."),
        ],
        "evidence": "One owner we watched sat down and hand-typed forty collection emails in a day — each one aged-invoice rows copied out of the ERP — then spent two weeks personally chasing replies. That is a nightly draft run now.",
    },
    {
        "slug": "slab-offer-desk",
        "title": "Slab Offer Desk",
        "lede": "Every supplier offer, priced apples-to-apples and answered the same day.",
        "video": "/assets/slab-offer-desk.mp4",
        "bullets": [
            ("Reads the photo blasts.", "Bundles, sizes, and lot numbers extracted from the pictures quarries actually send."),
            ("Normalizes to your unit.", "$/sqft FOB with a landed estimate alongside — every offer comparable at a glance."),
            ("Checks your racks first.", "Flags the color you're already deep in and the thickness that moves faster in your market."),
            ("Drafts the answer.", "The counter with bundle numbers and your price — or the standard data request when the supplier left out sizes or FOB."),
        ],
        "evidence": "The purchasing head at one importer answered sixty-two offer threads in a single week — retyping bundle numbers off supplier photos into every reply. The desk reads the photos, so he only picks and prices.",
    },
]

CSS = """
  :root {
    --paper: #F5F4F0; --report-bg: #EFEDE7; --ink: #1B2025; --ink-soft: #59616A;
    --ink-faint: #8A9099; --rule: #DAD8D1; --rule-strong: #B9B7AE;
    --stamp: #B0392C; --shadow: rgba(27, 32, 37, 0.07);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --paper: #14171B; --report-bg: #10141A; --ink: #E8E6E0; --ink-soft: #A0A7AE;
      --ink-faint: #6E757D; --rule: #2C323A; --rule-strong: #414952;
      --stamp: #E0604C; --shadow: rgba(0, 0, 0, 0.35);
    }
  }
  :root[data-theme="dark"] {
    --paper: #14171B; --report-bg: #10141A; --ink: #E8E6E0; --ink-soft: #A0A7AE;
    --ink-faint: #6E757D; --rule: #2C323A; --rule-strong: #414952;
    --stamp: #E0604C; --shadow: rgba(0, 0, 0, 0.35);
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink);
    font-family: "Public Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 1.0625rem; line-height: 1.65; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 58rem; margin: 0 auto; padding: 0 1.5rem; }
  h1, h2 { font-family: "Big Shoulders", "Arial Narrow", sans-serif; text-wrap: balance; margin: 0; }
  header { border-bottom: 2px solid var(--ink); padding: 1.1rem 0; }
  .masthead { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .brand { font-family: "Big Shoulders", "Arial Narrow", sans-serif; font-weight: 700;
    font-size: 1.65rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .brand a { color: var(--ink); text-decoration: none; }
  .masthead .tag { font-family: "IBM Plex Mono", monospace; font-size: 0.72rem;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
  .hero { padding: 3.5rem 0 2.5rem; }
  .hero h1 { font-size: clamp(2.4rem, 6vw, 3.8rem); font-weight: 700; line-height: 1.04;
    text-transform: uppercase; max-width: 20ch; }
  .lede { max-width: 36rem; margin: 1.25rem 0 0; font-size: 1.15rem; color: var(--ink-soft); }
  .lede strong { color: var(--ink); font-weight: 600; }
  .demo { display: block; width: 100%; max-width: 52rem; margin: 1rem 0 0;
    border: 1px solid var(--rule-strong); box-shadow: 0 12px 32px var(--shadow); }
  section { padding: 3.25rem 0 0; }
  .fit-list { list-style: none; margin: 0; padding: 0; max-width: 40rem; display: grid; gap: 1.1rem; }
  .fit-list li { color: var(--ink-soft); }
  .fit-list li strong { color: var(--ink); font-weight: 600; }
  .note { margin: 3.25rem 0 0; max-width: 40rem; border-left: 3px solid var(--stamp);
    padding: 0.25rem 0 0.25rem 1.75rem; color: var(--ink-soft); }
  .note .label { font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--stamp); display: block; margin-bottom: 0.5rem; }
  .cta-row { display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap; padding: 3.25rem 0 4rem; }
  .btn { display: inline-block; background: var(--ink); color: var(--paper);
    font-family: "Big Shoulders", "Arial Narrow", sans-serif; font-weight: 600; font-size: 1.15rem;
    letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none;
    padding: 0.8rem 1.7rem; border: 2px solid var(--ink); }
  .btn:hover { background: var(--stamp); border-color: var(--stamp); color: #FBFAF7; }
  .btn:focus-visible, a:focus-visible { outline: 3px solid var(--stamp); outline-offset: 3px; }
  .more { font-family: "IBM Plex Mono", monospace; font-size: 0.85rem; letter-spacing: 0.04em;
    color: var(--stamp); text-decoration: none; }
  .more:hover { text-decoration: underline; }
  footer { border-top: 1px solid var(--rule); padding: 1.5rem 0 2.5rem;
    font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--ink-faint); display: flex; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap; }
  .index-list { list-style: none; margin: 2.5rem 0 0; padding: 0; display: grid; }
  .index-list li { border-bottom: 1px solid var(--rule); padding: 1.5rem 0; }
  .index-list li:last-child { border-bottom: none; }
  .index-list h2 { font-size: 1.6rem; font-weight: 600; text-transform: uppercase; }
  .index-list h2 a { color: var(--ink); text-decoration: none; }
  .index-list h2 a:hover { color: var(--stamp); }
  .index-list p { margin: 0.4rem 0 0.6rem; color: var(--ink-soft); max-width: 38rem; }
"""

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{desc}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>&#129704;</text></svg>">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders:opsz,wght@10..72,500;10..72,600;10..72,700&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap">
<style>{css}</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="masthead">
      <div class="brand"><a href="/">SlabClerk</a></div>
      <div class="tag"><a class="more" href="/automations/" style="color:var(--ink-soft)">Automations</a></div>
    </div>
  </header>
"""

FOOT = """
  <footer>
    <span>SlabClerk</span>
    <span>Watching the yard since it was ours</span>
  </footer>
</div>
</body>
</html>
"""


def page_html(p):
    bullets = "\n".join(
        f'      <li><strong>{b[0]}</strong> {b[1]}</li>' for b in p["bullets"]
    )
    return (
        HEAD.format(title=p["title"], desc=p["lede"].replace("&amp;", "&"), css=CSS)
        + f"""
  <div class="hero">
    <h1>{p["title"]}</h1>
    <p class="lede">{p["lede"]}</p>
  </div>

  <video class="demo" autoplay muted loop playsinline preload="metadata" src="{p["video"]}" aria-label="Demo: {p["title"]}"></video>

  <section>
    <ul class="fit-list">
{bullets}
    </ul>
  </section>

  <div class="note">
    <span class="label">Seen in the wild</span>
    {p["evidence"]}
  </div>

  <div class="cta-row">
    <a class="btn" href="/#walkthrough">Book a walkthrough</a>
    <a class="more" href="/automations/">&larr; All automations</a>
  </div>
"""
        + FOOT
    )


def index_html():
    rows = "\n".join(
        f"""      <li>
        <h2><a href="/automations/{p["slug"]}/">{p["title"]}</a></h2>
        <p>{p["lede"]}</p>
        <a class="more" href="/automations/{p["slug"]}/">Watch it work &rarr;</a>
      </li>"""
        for p in PAGES
    )
    return (
        HEAD.format(
            title="SlabClerk Automations",
            desc="What the clerk handles — each automation watched in a real importer's inbox before it was built.",
            css=CSS,
        )
        + f"""
  <div class="hero">
    <h1>What the clerk handles.</h1>
    <p class="lede">Each of these was watched in a real importer's inbox before it was built. <strong>Twelve more are on the full sheet — ask on the walkthrough.</strong></p>
  </div>

  <ul class="index-list">
{rows}
  </ul>

  <div class="cta-row">
    <a class="btn" href="/#walkthrough">Book a walkthrough</a>
    <a class="more" href="/">&larr; SlabClerk home</a>
  </div>
"""
        + FOOT
    )


root = os.path.join(os.path.dirname(__file__), "..")
for p in PAGES:
    d = os.path.join(root, "automations", p["slug"])
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "index.html"), "w") as f:
        f.write(page_html(p))
    print("wrote", p["slug"])
with open(os.path.join(root, "automations", "index.html"), "w") as f:
    f.write(index_html())
print("wrote index")
