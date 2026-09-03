#!/usr/bin/env python3
"""Generate /automations/ pages from PAGES config. Run from repo root:
   python3 scripts/gen_automations.py
"""
import os, html

PAGES = [
    {
        "slug": "hold-sentry",
        "title": "Hold Sentry",
        "lede": "Sweeps every open hold, checks the slabs are still there, and drafts the chase in the rep's name.",
        "video": "/assets/hold-sentry.mp4",
        "bullets": [
            ("Knows which holds went quiet.", "Age counted from the day the hold sheet went out."),
            ("Checks the slabs are still there.", "A hold on material that already shipped gets closed."),
            ("Chases in the rep's name.", "Bundle numbers, what's still on the floor, and a note that reads like the rep wrote it."),
            ("Answers extensions.", "Held to the new date, expiry re-armed, confirmation drafted back to the customer."),
        ],
        "evidence": "Four reps at one importer put 504 holds on the floor in ninety days. Three hundred ninety-seven of them went silent, and thirty-two ever got a follow-up. Every one of those was a slab pulled off the rack with a customer's name on it.",
    },
    {
        "slug": "slab-desk",
        "title": "Slab Desk",
        "lede": "Answers the price, size and availability email the same hour, with the photos and their price already in it.",
        "video": "/assets/slab-desk.mp4",
        "bullets": [
            ("Reads the ask.", "Color, finish, thickness and the job behind it, however the customer phrased it."),
            ("Looks at the floor.", "Bundles actually in the yard, with the slab count and the real sizes off each one."),
            ("Prices it for that customer.", "Their tier, their freight, delivered. Look-alikes in the same range get added when the color is running thin."),
            ("Drafts the whole reply.", "Photos attached. Nothing sends until you say so."),
        ],
        "evidence": "Six of every ten emails the reps we studied opened was a version of the same request: do you have it, what does it cost, send photos. One rep answered it so often she had taken to emailing slab photo links to herself, three a day for ninety days, so she could forward them off her phone.",
    },
    {
        "slug": "new-arrivals",
        "title": "New Arrivals",
        "lede": "Matches every landed box to the accounts that wanted those colors, split by whose book it is.",
        "video": "/assets/new-arrivals.mp4",
        "bullets": [
            ("Triggers off receiving.", "The box is racked and counted, so the note goes out while the material is actually sellable."),
            ("Matches on twelve months of wanting.", "Who bought that color, who held it, and who asked and got told no."),
            ("Split by whose book it is.", "Each rep gets their own accounts. Nobody sends a company-wide blast."),
            ("One note per account.", "Their price, bundle photos attached, drafted and waiting on an OK."),
        ],
        "evidence": "Across ninety days of one importer's sales mail, the reps sent almost nothing announcing new material. The purchasing side sent three hundred and twelve emails about incoming containers, and all of it stayed internal. The stone landed and the customers who had asked for it never heard.",
    },
    {
        "slug": "container-watchdog",
        "title": "Container Watchdog",
        "lede": "Every box tracked, and the demurrage clock counted down before it costs you money.",
        "video": "/assets/container-watchdog.mp4",
        "bullets": [
            ("Reads arrival notices as they land.", "It matches container, PO, and HBL to your system the minute the forwarder's email arrives."),
            ("Counts down the free days.", "It works out the last free day from the notice itself. You hear about the clock days early, while there is still time to move the box."),
            ("Chases the whole cycle.", "ETA changes, pickup numbers, drayage, empty returns. Everything gets drafted and sent on your OK."),
            ("Knows what's waiting.", "Every open order tied to the box, so a slipped sailing reaches the customer who is waiting on it."),
        ],
        "evidence": "At one four-branch importer we studied, the owner's reply to a demurrage invoice was three words and three exclamation points. The charges had already accrued before anyone saw the clock. The watchdog counts free days from the arrival notice, not from the bill.",
    },
    {
        "slug": "collections-clerk",
        "title": "Collections Clerk",
        "lede": "Chases your aged receivables account by account, and tracks every promise until it's paid.",
        "video": "/assets/collections-clerk.mp4",
        "bullets": [
            ("One drafted email per account.", "Invoice rows and links pulled from your system, in your voice, addressed to the person who owes you."),
            ("Routed to the rep who owns the account.", "Your office copied, so collections and sales stop working from different lists."),
            ("Promises tracked.", "Follow-ups fire on day 7 and day 14 automatically; payment plans and disputes are excluded without being told twice."),
            ("Escalates only silence.", "You see the accounts that ignored three notes."),
        ],
        "evidence": "One owner we watched sat down and hand-typed forty collection emails in a single day, each one built from aged-invoice rows he copied out of the ERP. Then he spent two weeks chasing the replies himself. That whole cycle is a nightly draft run now.",
    },
    {
        "slug": "slab-offer-desk",
        "title": "Slab Offer Desk",
        "lede": "Turns every supplier photo blast into an apples-to-apples price and drafts your answer the same day.",
        "video": "/assets/slab-offer-desk.mp4",
        "bullets": [
            ("Reads the photo blasts.", "Bundles, sizes, and lot numbers extracted from the pictures quarries actually send."),
            ("Normalizes to your unit.", "$/sqft FOB with a landed estimate alongside, so every offer is comparable at a glance."),
            ("Checks your racks first.", "It flags the color you're already deep in and the thickness that moves faster in your market."),
            ("Drafts the answer.", "The counter with bundle numbers and your price, or the standard data request when the supplier left out sizes or FOB."),
        ],
        "evidence": "The purchasing head at one importer answered sixty-two offer threads in one week, and every reply meant retyping bundle numbers off the supplier's photos. The desk reads the photos. He just picks and prices.",
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
  .board { margin-top: 2.75rem; border: 1px solid var(--rule-strong); background: var(--report-bg); box-shadow: 0 12px 32px var(--shadow); }
  .board-head { padding: 0.85rem 1.4rem; border-bottom: 1px solid var(--rule-strong);
    font-family: "IBM Plex Mono", monospace; font-size: 0.75rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--ink-soft); display: flex; justify-content: space-between; }
  .board-head b { color: var(--ink); font-weight: 600; }
  .board-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15.5rem, 1fr));
    gap: 1px; background: var(--rule); }
  .cell { background: var(--report-bg); padding: 1rem 1.2rem; display: flex; align-items: center;
    gap: 0.9rem; text-decoration: none; border: none; font: inherit; text-align: left; cursor: pointer; }
  a.cell:hover .cell-label, button.cell:hover .cell-label { color: var(--stamp); }
  .sw { width: 2.4rem; height: 1.3rem; border: 2px solid var(--ink); background: var(--report-bg);
    position: relative; flex-shrink: 0; }
  .sw::after { content: ""; position: absolute; top: 0.1rem; left: 0.1rem; width: 0.85rem; height: 0.85rem;
    background: var(--paper); border: 2px solid var(--ink); transition: left 0.15s ease, background 0.15s ease; }
  .cell.on .sw { background: var(--stamp); }
  .cell.on .sw::after { left: 1.15rem; }
  .cell-label { font-family: "IBM Plex Mono", monospace; font-size: 0.78rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--ink); line-height: 1.4; }
  .cell .state { display: block; font-size: 0.68rem; color: var(--ink-faint); letter-spacing: 0.1em; }
  .cell.on .state { color: var(--stamp); }
  .board-foot { padding: 0.8rem 1.4rem; border-top: 1px solid var(--rule-strong);
    font-family: "IBM Plex Mono", monospace; font-size: 0.72rem; letter-spacing: 0.06em; color: var(--ink-faint); }
  .receipt { margin-top: 3.25rem; border: 1px solid var(--rule-strong); background: var(--report-bg);
    box-shadow: 0 12px 32px var(--shadow); overflow-x: auto; }
  .receipt table { border-collapse: collapse; width: 100%; min-width: 38rem;
    font-family: "IBM Plex Mono", monospace; font-size: 0.82rem; line-height: 1.5;
    font-variant-numeric: tabular-nums; }
  .receipt td { padding: 0.6rem 1.4rem; border-bottom: 1px solid var(--rule); vertical-align: top; white-space: nowrap; }
  .receipt tr:last-child td { border-bottom: none; }
  .receipt .cat { color: var(--stamp); font-weight: 600; letter-spacing: 0.06em; width: 9.5rem; }
  .receipt .detail { color: var(--ink); white-space: normal; min-width: 16rem; }
  .receipt .flag { color: var(--ink-soft); text-align: right; }
  .receipt-lede { max-width: 40rem; color: var(--ink-soft); margin: 3.25rem 0 0; }
  .receipt-lede strong { color: var(--ink); font-weight: 600; }
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
  <script>
    document.querySelectorAll("button.cell").forEach(function (b) {
      b.addEventListener("click", function () { b.classList.toggle("on"); });
    });
  </script>
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
    <a class="btn" href="https://cal.com/dhruvkar/30min">Book a walkthrough</a>
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
            desc="What the clerk handles. Each automation was watched in a real importer's inbox before it was built.",
            css=CSS,
        )
        + f"""
  <div class="hero">
    <h1>What the clerk handles.</h1>
    <p class="lede">Each of these was watched in a real importer's inbox before it was built. <strong>Flip one on and it runs every night from then on.</strong> You only email the clerk to check in or ask for something extra.</p>
  </div>

  <div class="board">
    <div class="board-head"><span><b>Switchboard</b></span><span>7 of 16 shown running</span></div>
    <div class="board-grid">
      <a class="cell on" href="/automations/hold-sentry/"><span class="sw"></span><span class="cell-label">Hold Sentry<span class="state">On &middot; watch it work</span></span></a>
      <a class="cell on" href="/automations/slab-desk/"><span class="sw"></span><span class="cell-label">Slab Desk<span class="state">On &middot; watch it work</span></span></a>
      <a class="cell on" href="/automations/new-arrivals/"><span class="sw"></span><span class="cell-label">New Arrivals<span class="state">On &middot; watch it work</span></span></a>
      <a class="cell on" href="/automations/container-watchdog/"><span class="sw"></span><span class="cell-label">Container Watchdog<span class="state">On &middot; watch it work</span></span></a>
      <a class="cell on" href="/automations/collections-clerk/"><span class="sw"></span><span class="cell-label">Collections Clerk<span class="state">On &middot; watch it work</span></span></a>
      <a class="cell on" href="/automations/slab-offer-desk/"><span class="sw"></span><span class="cell-label">Slab Offer Desk<span class="state">On &middot; watch it work</span></span></a>
      <a class="cell on" href="/#po-entry"><span class="sw"></span><span class="cell-label">PO Entry<span class="state">On &middot; watch it work</span></span></a>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Dunning Responder<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Friday AP Run<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Proof of Payment<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Truck Desk<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Price Integrity<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Credit Desk<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Doc Sender<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Sales Scoreboard<span class="state">Ask on the walkthrough</span></span></button>
      <button class="cell" type="button"><span class="sw"></span><span class="cell-label">Daily Brief<span class="state">Ask on the walkthrough</span></span></button>
    </div>
    <div class="board-foot">The greyed switches exist. They get flipped on during your setup, yard by yard.</div>
  </div>

  <p class="receipt-lede">Once they're on, this is what checking in looks like. <strong>Not a dashboard. One email on Friday.</strong></p>

  <div class="receipt">
    <div class="board-head"><span><b>Weekly check-in</b> &middot; Friday 4:30 PM</span><span>sample</span></div>
    <table>
      <tr><td class="cat">CONTAINERS</td><td class="detail">14 chased end to end</td><td class="flag">0 demurrage days</td></tr>
      <tr><td class="cat">COLLECTIONS</td><td class="detail">$18,400 in, 3 promises kept</td><td class="flag">2 escalated to you</td></tr>
      <tr><td class="cat">POS ENTERED</td><td class="detail">4 from supplier docs, line by line</td><td class="flag">312 slabs</td></tr>
      <tr><td class="cat">HOLDS</td><td class="detail">5 confirmed, 3 released back to the racks</td><td class="flag">8 checked</td></tr>
      <tr><td class="cat">OFFERS</td><td class="detail">9 priced, 2 counters sent</td><td class="flag">1 lot bought</td></tr>
      <tr><td class="cat">YOUR PART</td><td class="detail">It needed you twice this week, for two OKs</td><td class="flag">4 minutes</td></tr>
    </table>
  </div>

  <ul class="index-list">
{rows}
  </ul>

  <div class="cta-row">
    <a class="btn" href="https://cal.com/dhruvkar/30min">Book a walkthrough</a>
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
