import { publicEnv } from "@/config/env";

/**
 * ARANCH PASS — single source of content configuration.
 * Edit copy here; deployment-specific pricing/contact values come from env.
 */

export const site = {
  brand: "ARANCH PASS",
  positioning: "The service identity that stays with the asset.",
  coreIdea: "The service ends. The connection stays.",
  stage: "Pre-launch · concept and prototype stage",
  contactEmail: publicEnv.contactEmail,
  whatsappHref: publicEnv.whatsappHref,
  /** Pricing is public only when explicitly enabled at build time. */
  pricingLabel: publicEnv.pricingLabel,
  pricingVisible: publicEnv.pricingVisible
};

/**
 * ASSET MAP
 *
 * The product itself is never a photograph. It is drawn as exact vector artwork
 * (src/components/PassArtwork.tsx) so the same physical object appears, pixel
 * identical, in the hero, the product chapter, the box, every scene and the
 * favicon.
 *
 * The photographs below are real, unbranded scenes. The pass is composited onto
 * them with <SceneShot />, and every frame is captioned as a composite so
 * nothing reads as a finished production photograph.
 */
/** Photography still to be shot, with the brief and aspect ratio for each. */
export const photographyBrief: { path: string; ratio: string; note: string }[] = [
  {
    path: "/images/real-printed-prototype.jpg",
    ratio: "3:2",
    note: "The first printed pass held in hand — proves the print, die-cut and stock.",
  },
  {
    path: "/images/real-adhesive-wear.jpg",
    ratio: "1:1",
    note: "Wear test: the same pass after weeks of humidity beside a purifier.",
  },
  {
    path: "/images/real-first-batch.jpg",
    ratio: "3:2",
    note: "Flat-lay of the first production batch with the numbered sequence visible.",
  },
];

export const nav = [
  { label: "Product", href: "#pass" },
  { label: "Workflow", href: "#ritual" },
  { label: "Portals", href: "#system" },
  { label: "Privacy", href: "#privacy" },
  { label: "Founder", href: "#founder" },
  { label: "FAQ", href: "#faq" },
];

export const bandItems = [
  "ATTACH",
  "RECORD",
  "SCAN",
  "REBOOK",
  "SERVICE HISTORY",
  "ONE ASSET CODE",
];

export const manifestoLines = [
  "The service date stays in a notebook.",
  "The phone number gets buried in WhatsApp.",
  "The customer forgets who came last time.",
  "The next job goes to whoever appears in search.",
];

export type RitualStep = {
  n: string;
  title: string;
  body: string;
};

export const ritualSteps: RitualStep[] = [
  {
    n: "01",
    title: "Pull",
    body: "Take one numbered pass from the box. Every pass carries its own QR and asset code.",
  },
  {
    n: "02",
    title: "Scan",
    body: "The technician signs in and claims the pass. It moves from issued to activated.",
  },
  {
    n: "03",
    title: "Record",
    body: "Customer, asset, service type and the next recommended date — entered once, on site.",
  },
  {
    n: "04",
    title: "Attach",
    body: "Place it in the approved position on the asset. The job now has somewhere to return to.",
  },
];

export type GridState = "issued" | "activated" | "due" | "rebooked";

export const gridLegend: { state: GridState; label: string; hint: string }[] = [
  { state: "issued", label: "Issued", hint: "Printed and numbered, not yet claimed" },
  { state: "activated", label: "Activated", hint: "Attached to an asset with a service record" },
  { state: "due", label: "Due soon", hint: "Next recommended service approaching" },
  { state: "rebooked", label: "Rebooked", hint: "Customer scanned and contacted the provider" },
];

export const privacyRows: { public: string; private: string }[] = [
  { public: "Provider name and public contact", private: "Customer phone number" },
  { public: "Safe asset label", private: "Address and location details" },
  { public: "Last service date", private: "Amount paid" },
  { public: "Next recommended date", private: "Private technician notes" },
  { public: "Safe work summary", private: "Invoices and private attachments" },
  { public: "WhatsApp / call actions", private: "Full sensitive service history" },
];

export const roadmap = [
  {
    code: "CAT-01",
    title: "RO & water purifiers",
    status: "Intended first pilot",
    tone: "first" as const,
    body: "Filter changes, sanitisation and membrane replacement run on predictable cycles — and are almost always serviced by independent local providers.",
  },
  {
    code: "CAT-02",
    title: "AC servicing",
    status: "Roadmap candidate",
    tone: "later" as const,
    body: "Seasonal servicing with clear due windows. Not built, not scheduled — evaluated after the first pilot returns data.",
  },
  {
    code: "CAT-03",
    title: "Two-wheelers",
    status: "Roadmap candidate",
    tone: "later" as const,
    body: "A moving asset with a long service life and many small workshops. Architecture allows it; nothing has been developed for it yet.",
  },
];

export type CompareValue = "yes" | "no" | "varies";

export const compareColumns = [
  "Notebook / WhatsApp",
  "Static number sticker",
  "Field-service CRM",
  "ARANCH PASS",
];

export const compareRows: { label: string; values: CompareValue[] }[] = [
  { label: "Physical identity attached to the asset", values: ["no", "yes", "no", "yes"] },
  { label: "Unique asset code per unit", values: ["no", "no", "varies", "yes"] },
  { label: "Structured service history", values: ["no", "no", "yes", "yes"] },
  { label: "Customer-initiated rebooking path", values: ["varies", "varies", "varies", "yes"] },
  { label: "Individual technician accountability", values: ["no", "no", "yes", "yes"] },
  { label: "Due-service list", values: ["no", "no", "yes", "yes"] },
  { label: "No customer app required", values: ["yes", "yes", "varies", "yes"] },
  { label: "Designed for small independent providers", values: ["yes", "yes", "varies", "yes"] },
];

export const segments = [
  {
    code: "S-01",
    title: "Independent technician",
    body: "Keep every completed job searchable without maintaining another complicated system.",
  },
  {
    code: "S-02",
    title: "Local service centre",
    body: "Give each technician an individual login and every asset one permanent reference.",
  },
  {
    code: "S-03",
    title: "Dealer / installer",
    body: "Keep warranty, first service and future replacement contact connected to the installed asset.",
  },
  {
    code: "S-04",
    title: "AMC team",
    body: "Know what becomes due without rebuilding the history from scattered messages.",
  },
  {
    code: "S-05",
    title: "Multi-technician operator",
    body: "See which passes are active, who recorded what, and which assets are approaching a service.",
  },
  {
    code: "S-06",
    title: "Future multi-branch business",
    body: "Planned, not built: branch-level separation of assets, technicians and due lists.",
  },
];

export const offers = [
  {
    code: "OFFER-A",
    title: "Software",
    lede: "The record-keeping layer on its own.",
    items: [
      "Provider dashboard",
      "Individual technician accounts",
      "Service history per asset",
      "Due-service tracking",
      "Downloadable pass IDs / QRs where applicable",
    ],
    price: publicEnv.softwarePrice,
    featured: false,
  },
  {
    code: "OFFER-B",
    title: "Pass pack",
    lede: "The physical half of the identity.",
    items: [
      "Physical numbered passes",
      "Variable QR and asset codes",
      "Packaging and shipping",
      "Requires an active or included hosting period",
    ],
    price: publicEnv.passPackPrice,
    featured: false,
  },
  {
    code: "OFFER-C",
    title: "Combined pilot",
    lede: "What the first providers are likely to test.",
    items: [
      "Software access",
      "First 50 passes",
      "Onboarding and import help",
      "Direct pilot support",
    ],
    price: publicEnv.combinedPilotPrice,
    featured: true,
  },
];

export const principles = [
  {
    n: "01",
    title: "Field-first",
    body: "Designed around what a technician will actually finish on a phone, standing next to the asset, at the end of a job.",
  },
  {
    n: "02",
    title: "Provider-visible",
    body: "ARANCH PASS exists to keep the original provider reachable. We are not building a marketplace that resells their customer.",
  },
  {
    n: "03",
    title: "Privacy-led",
    body: "A public scan never means public customer data. Sensitive fields require authenticated access or customer verification.",
  },
  {
    n: "04",
    title: "No customer app",
    body: "Scanning should work from a normal phone camera. Nothing to install, nothing to sign up for.",
  },
];

export const transparency = {
  exists: [
    "Product workflow defined end to end",
    "Approved pass design direction",
    "Approved paperboard box direction",
    "Interactive software prototypes",
    "Initial pilot hypothesis",
  ],
  remains: [
    "Printed physical prototype",
    "Material and QR-wear testing",
    "Provider pilots in the field",
    "Technician usability data",
    "Final pricing",
    "Commercial terms",
  ],
};

export const faqs: { q: string; a: string }[] = [
  {
    q: "What exactly is ARANCH PASS?",
    a: "A physical pass attached to a serviced asset, plus the software behind it. The technician scans the pass to record a service; the customer later scans the same pass to see safe service information and contact the provider who did the work.",
  },
  {
    q: "Who is it for?",
    a: "Independent service businesses and small service centres in India — starting with RO and water-purifier service. It is built for providers who currently rely on notebooks, memory and WhatsApp threads.",
  },
  {
    q: "Does the customer need an app?",
    a: "No. The scan is designed to open in a normal phone camera and browser. Requiring an install would defeat the purpose of leaving a way back on the asset.",
  },
  {
    q: "What appears when someone scans a pass?",
    a: "The intended public view shows the provider identity and public contact, a safe asset label, the last service date, the next recommended date, a safe work summary and the asset code — plus WhatsApp and call actions.",
  },
  {
    q: "Can anyone see customer details?",
    a: "No. Customer name, phone number, address, amount paid, private notes and attachments are not part of the public view. Those require authenticated provider access, or customer verification such as an OTP once that feature is built.",
  },
  {
    q: "How does a technician update a service?",
    a: "They sign in, scan the pass and complete a short form: customer, asset category, service type, date, work summary and the next recommended date. Technician identity is filled automatically from the login.",
  },
  {
    q: "What happens if the pass is damaged?",
    a: "The plan is to allow a replacement pass to be issued and linked to the same asset record, so the history carries over. Damage and wear behaviour is one of the things the material tests are meant to answer.",
  },
  {
    q: "What happens if a subscription ends?",
    a: "This is still being decided. Our intent is that historical records remain exportable to the provider and that scan pages degrade gracefully rather than disappearing without notice. We will publish the final policy before charging anyone.",
  },
  {
    q: "Can businesses add multiple technicians?",
    a: "Yes — that is a core part of the design. Named technician accounts are intended to be generous rather than the main pricing lever; future limits are expected to sit around active assets, branches and automation.",
  },
  {
    q: "Does it send automatic WhatsApp reminders?",
    a: "Not today, and we will not promise it until messaging APIs, template approval and consent handling are confirmed. The first version focuses on a due-service list the provider can act on.",
  },
  {
    q: "Which service categories will launch first?",
    a: "RO and water purifiers are the intended first pilot. AC servicing and two-wheelers are roadmap candidates only — nothing has been built for them.",
  },
  {
    q: "How much will it cost?",
    a: "Not decided. Any figure we published today would be a guess. Pricing will be set after pilot providers tell us what the pass pack and software are actually worth in their workflow.",
  },
  {
    q: "When will the pilot begin?",
    a: "No date is being announced. Announcing one before the printed prototype and material tests exist would be a claim we cannot support. Pilot-list members hear first.",
  },
  {
    q: "Are the images final production products?",
    a: "No. The pass and box shown here are approved design directions and concept visuals. No production batch has been printed or shipped.",
  },
  {
    q: "What happens to customer data?",
    a: "The data belongs to the service provider who collected it. The architecture is privacy-led by design, and it remains subject to a production security review before any real customer data is handled.",
  },
];

export const footerLinks: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    items: [
      { label: "The pass", href: "#pass" },
      { label: "How it works", href: "#ritual" },
      { label: "The system", href: "#system" },
      { label: "Public vs private", href: "#privacy" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Founder", href: "#founder" },
      { label: "Principles", href: "#mission" },
      { label: "Pre-launch status", href: "#transparency" },
      { label: "FAQ", href: "#faq" },
      { label: "Join the pilot", href: "#pilot" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy policy (placeholder)", href: "#transparency" },
      { label: "Terms of use (placeholder)", href: "#transparency" },
      { label: "Contact", href: "#pilot" },
    ],
  },
];
