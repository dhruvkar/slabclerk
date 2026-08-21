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
