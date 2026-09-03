import type { DemoConfig } from "./DemoTemplate";

export const containerWatchdog: DemoConfig = {
  mode: "incoming",
  headerLeft: "Incoming",
  headerRight: "2:47 AM",
  fieldLabel: "From:",
  fieldValue: "notices@yourforwarder.com",
  subject: "Arrival Notice — TEMU4434211, PO# 260357",
  chips: ["arrival_notice.pdf"],
  bodyText:
    "Please find attached the arrival notice for the above shipment. Kindly arrange pickup before last free day.",
  items: [
    { text: "Notice parsed — container, PO, HBL matched", detail: "PO-260357" },
    { text: "Last free day computed", detail: "Fri, Aug 28" },
    { text: "Demurrage countdown armed", detail: "6 free days" },
    { text: "Pickup number requested", detail: "drafted" },
    { text: "Drayage scheduled — St. Louis ramp", detail: "Thu AM" },
    { text: "Open orders waiting on this box notified", detail: "2 orders" },
  ],
  stampText: "Awaiting your OK",
  switchLabel: "Container Watchdog",
};

export const collectionsClerk: DemoConfig = {
  mode: "compose",
  headerLeft: "New message",
  headerRight: "7:09 AM",
  fieldLabel: "To:",
  fieldValue: "clerk@slabclerk.com",
  subject: "Re: Morning report — Tuesday",
  chips: [],
  bodyText:
    "Send collection notices to everyone past 60 days — skip the two on payment plans.",
  items: [
    { text: "Aged receivables pulled", detail: "14 accounts past 60" },
    { text: "Payment plans excluded", detail: "2 accounts" },
    { text: "Per-account emails drafted — invoice rows attached", detail: "12 drafts" },
    { text: "Routed to each account's rep", detail: "cc: office" },
    { text: "Follow-ups scheduled — day 7, day 14", detail: "automatic" },
    { text: "Escalation on silence only", detail: "to you" },
  ],
  stampText: "Awaiting your OK",
};

export const slabOfferDesk: DemoConfig = {
  mode: "incoming",
  headerLeft: "Incoming",
  headerRight: "Supplier offer",
  fieldLabel: "From:",
  fieldValue: "exports@quarrygroup.com",
  subject: "MONALISA 3CM — Lot Ready for Dispatch",
  chips: ["IMG_8841.jpg", "IMG_8842.jpg", "pricelist.pdf"],
  bodyText:
    "Dear Sir, fresh lot ready. Kindly find pictures attached and confirm your interest at the earliest.",
  items: [
    { text: "11 bundles extracted — sizes + lot numbers", detail: "from photos" },
    { text: "Price normalized", detail: "$5.90/sqft FOB" },
    { text: "Checked against your racks", detail: "deep in 1 color" },
    { text: "Sell-through checked — 3cm moves faster here", detail: "2x" },
    { text: "Counter drafted — B-12, B-14", detail: "at $5.50" },
    { text: "Closeup request queued — veining unclear", detail: "drafted" },
  ],
  stampText: "Awaiting your OK",
  switchLabel: "Slab Offer Desk",
};

export const poEntry: DemoConfig = {
  mode: "compose",
  headerLeft: "New message",
  headerRight: "7:41 AM",
  fieldLabel: "To:",
  fieldValue: "clerk@slabclerk.com",
  subject: "Fwd: Taj Mahal container — supplier docs",
  chips: ["proforma_TD-038.pdf", "packing_list_SLD2.pdf"],
  bodyText:
    "Enter the PO and schedule delivery — 22 bundles landing Savannah Thursday.",
  items: [
    { text: "Attachments read — proforma + packing list", detail: "2 files" },
    { text: "Prices checked against the order", detail: "3cm Taj Mahal" },
    { text: "Purchase order entered — 22 bundles, 187 slabs", detail: "PO-260521" },
    { text: "Track & trace armed — ETA Savannah, Thu", detail: "MSKU 884-2210" },
    { text: "Drayage carrier assigned — delivery scheduled", detail: "2 stops" },
    { text: "Reply drafted to you", detail: "for your OK" },
  ],
  stampText: "Awaiting your OK",
};

export const slabDesk: DemoConfig = {
  mode: "incoming",
  headerLeft: "Incoming",
  headerRight: "8:12 AM",
  fieldLabel: "From:",
  fieldValue: "susan@midwestcabinet.com",
  subject: "Coffee Brown — pics price size please",
  chips: [],
  bodyText:
    "Customer coming in Thursday. Need to know what you've got and what it costs.",
  items: [
    { text: "Bundles found on the floor", detail: "3 · C-260188" },
    { text: "Slab count and sizes pulled", detail: "26 slabs" },
    { text: "Bundle photos attached", detail: "3 sets" },
    { text: "Her tier priced, delivered", detail: "$14.25/sqft" },
    { text: "Two look-alikes in stock added", detail: "same range" },
    { text: "Reply drafted with all of it", detail: "for your OK" },
  ],
  stampText: "Awaiting your OK",
  switchLabel: "Slab Desk",
};

export const holdSentry: DemoConfig = {
  mode: "incoming",
  headerLeft: "Nightly sweep",
  headerRight: "2:12 AM",
  fieldLabel: "Reading:",
  fieldValue: "every open hold in the yard",
  subject: "41 holds on the floor — 12 have gone quiet",
  chips: [],
  bodyText:
    "Slabs reserved against a customer's name, with no answer since the hold sheet went out.",
  items: [
    { text: "H-0452 · Calacatta Lasa · 3 slabs", detail: "11 days, no answer" },
    { text: "Slabs confirmed still on the floor", detail: "3 of 3" },
    { text: "Chase drafted in the rep's name", detail: "\"still need this?\"" },
    { text: "Extension request answered", detail: "held to Sep 17" },
    { text: "Aged past your policy, sent to the owner", detail: "2 holds" },
    { text: "Day 7 and day 14 follow-ups armed", detail: "12 holds" },
  ],
  stampText: "Awaiting your OK",
  switchLabel: "Hold Sentry",
};

export const newArrivals: DemoConfig = {
  mode: "incoming",
  headerLeft: "Incoming",
  headerRight: "6:03 AM",
  fieldLabel: "From:",
  fieldValue: "warehouse@yourcompany.com",
  subject: "Container unloaded — 22 bundles received",
  chips: ["receiving_C-260412.pdf"],
  bodyText:
    "Box is off the chassis and racked. Lava Oro, Taj Beach, Blue Dunes, Sparkle White.",
  items: [
    { text: "Bundles received and racked", detail: "22 · 4 colors" },
    { text: "Matched to twelve months of asks", detail: "31 accounts" },
    { text: "Two asked for Lava Oro in June", detail: "flagged first" },
    { text: "Split by whose book it is", detail: "5 reps" },
    { text: "Photos pulled per bundle", detail: "22 sets" },
    { text: "One note drafted per account, their price", detail: "31 drafts" },
  ],
  stampText: "Awaiting your OK",
  switchLabel: "New Arrivals",
};

// --- Grid tiles: 4 items, short strings, no cold-open switch. Rendered on a
// --- 780x560 canvas so the type stays legible at 2-up grid size.
export const slabDeskMini: DemoConfig = {
  mode: "incoming",
  headerLeft: "Incoming",
  headerRight: "8:12 AM",
  fieldLabel: "From:",
  fieldValue: "susan@midwestcabinet.com",
  subject: "Coffee Brown, pics price size",
  chips: [],
  bodyText: "Customer coming in Thursday. What have you got?",
  items: [
    { text: "3 bundles on the floor", detail: "C-260188" },
    { text: "26 slabs, sizes pulled", detail: "photos" },
    { text: "Priced at her tier", detail: "$14.25" },
    { text: "Reply drafted", detail: "your OK" },
  ],
  stampText: "Awaiting your OK",
  compact: true,
};

export const holdSentryMini: DemoConfig = {
  mode: "incoming",
  headerLeft: "Nightly sweep",
  headerRight: "2:12 AM",
  fieldLabel: "Reading:",
  fieldValue: "every open hold",
  subject: "12 holds have gone quiet",
  chips: [],
  bodyText: "Slabs reserved against a customer's name, no answer since.",
  items: [
    { text: "H-0452, 3 slabs", detail: "11 days" },
    { text: "Still on the floor", detail: "3 of 3" },
    { text: "Chase drafted", detail: "rep's name" },
    { text: "Day 7 + 14 armed", detail: "12 holds" },
  ],
  stampText: "Awaiting your OK",
  compact: true,
};

export const containerWatchdogMini: DemoConfig = {
  mode: "incoming",
  headerLeft: "Incoming",
  headerRight: "2:47 AM",
  fieldLabel: "From:",
  fieldValue: "notices@yourforwarder.com",
  subject: "Arrival Notice, TEMU4434211",
  chips: ["arrival_notice.pdf"],
  bodyText: "Kindly arrange pickup before last free day.",
  items: [
    { text: "Notice parsed, PO matched", detail: "260357" },
    { text: "Last free day", detail: "Fri Aug 28" },
    { text: "Pickup requested", detail: "drafted" },
    { text: "2 orders waiting, told", detail: "sent" },
  ],
  stampText: "Awaiting your OK",
  compact: true,
};

export const collectionsClerkMini: DemoConfig = {
  mode: "compose",
  headerLeft: "New message",
  headerRight: "7:09 AM",
  fieldLabel: "To:",
  fieldValue: "clerk@slabclerk.com",
  subject: "Re: Morning report",
  chips: [],
  bodyText: "Collection notices to everyone past 60 days. Skip the payment plans.",
  items: [
    { text: "14 accounts past 60", detail: "pulled" },
    { text: "Payment plans skipped", detail: "2" },
    { text: "12 emails drafted", detail: "per account" },
    { text: "Day 7 + 14 follow-ups", detail: "armed" },
  ],
  stampText: "Awaiting your OK",
  compact: true,
};
