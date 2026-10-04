// Shared synthetic demo data — Northstar Remote Operations Demo

export const LOCATIONS = [
  { id: "depot", name: "Central Depot", type: "depot", status: "operational", lat: 48.2, lng: 16.4, lastReport: "8m ago", reportAge: 8, confidence: 98 },
  { id: "ridge", name: "Ridge Site", type: "forward", status: "stale", lat: 48.5, lng: 16.8, lastReport: "7h ago", reportAge: 420, confidence: 71 },
  { id: "valley", name: "Valley Site", type: "forward", status: "warning", lat: 48.1, lng: 16.9, lastReport: "2h ago", reportAge: 120, confidence: 87 },
  { id: "lake", name: "Lake Site", type: "forward", status: "alert", lat: 47.9, lng: 16.6, lastReport: "1h ago", reportAge: 60, confidence: 92 },
  { id: "forest", name: "Forest Site", type: "forward", status: "operational", lat: 48.3, lng: 16.2, lastReport: "45m ago", reportAge: 45, confidence: 95 },
];

export const INVENTORY_ITEMS = [
  // Generator Fuel (liters)
  { id: "inv-1", locationId: "depot", item: "Generator Fuel", unit: "L", confirmed: 4800, estimated: 4800, estimatedLow: 4800, estimatedHigh: 4800, lastObserved: "8m ago", reportAge: 8, source: "manual", confidence: 98, status: "fresh", category: "fuel" },
  { id: "inv-2", locationId: "ridge", item: "Generator Fuel", unit: "L", confirmed: 520, estimated: 470, estimatedLow: 420, estimatedHigh: 560, lastObserved: "7h ago", reportAge: 420, source: "loRa", confidence: 71, status: "stale", category: "fuel" },
  { id: "inv-3", locationId: "valley", item: "Generator Fuel", unit: "L", confirmed: 310, estimated: 295, estimatedLow: 272, estimatedHigh: 318, lastObserved: "2h ago", reportAge: 120, source: "loRa", confidence: 87, status: "warning", category: "fuel" },
  { id: "inv-4", locationId: "lake", item: "Generator Fuel", unit: "L", confirmed: 180, estimated: 175, estimatedLow: 162, estimatedHigh: 188, lastObserved: "1h ago", reportAge: 60, source: "loRa", confidence: 92, status: "critical", category: "fuel" },
  { id: "inv-5", locationId: "forest", item: "Generator Fuel", unit: "L", confirmed: 620, estimated: 615, estimatedLow: 603, estimatedHigh: 627, lastObserved: "45m ago", reportAge: 45, source: "loRa", confidence: 95, status: "fresh", category: "fuel" },
  // Potable Water (liters)
  { id: "inv-6", locationId: "ridge", item: "Potable Water", unit: "L", confirmed: 840, estimated: 790, estimatedLow: 720, estimatedHigh: 880, lastObserved: "7h ago", reportAge: 420, source: "loRa", confidence: 71, status: "stale", category: "water" },
  { id: "inv-7", locationId: "valley", item: "Potable Water", unit: "L", confirmed: 1100, estimated: 1065, estimatedLow: 1020, estimatedHigh: 1110, lastObserved: "2h ago", reportAge: 120, source: "loRa", confidence: 87, status: "fresh", category: "water" },
  { id: "inv-8", locationId: "lake", item: "Potable Water", unit: "L", confirmed: 290, estimated: 285, estimatedLow: 262, estimatedHigh: 308, lastObserved: "1h ago", reportAge: 60, source: "manual", confidence: 92, status: "warning", category: "water" },
  // Sensor Batteries (units)
  { id: "inv-9", locationId: "ridge", item: "Sensor Batteries", unit: "units", confirmed: 24, estimated: 21, estimatedLow: 17, estimatedHigh: 26, lastObserved: "7h ago", reportAge: 420, source: "loRa", confidence: 71, status: "stale", category: "batteries" },
  { id: "inv-10", locationId: "valley", item: "Sensor Batteries", unit: "units", confirmed: 12, estimated: 11, estimatedLow: 9, estimatedHigh: 13, lastObserved: "2h ago", reportAge: 120, source: "loRa", confidence: 87, status: "warning", category: "batteries" },
  // Maintenance Kits (units)
  { id: "inv-11", locationId: "ridge", item: "Maintenance Kits", unit: "units", confirmed: 5, estimated: 4, estimatedLow: 3, estimatedHigh: 5, lastObserved: "7h ago", reportAge: 420, source: "loRa", confidence: 71, status: "stale", category: "maintenance" },
  { id: "inv-12", locationId: "valley", item: "Maintenance Kits", unit: "units", confirmed: 8, estimated: 8, estimatedLow: 7, estimatedHigh: 9, lastObserved: "2h ago", reportAge: 120, source: "loRa", confidence: 87, status: "fresh", category: "maintenance" },
  // Replacement Filters (units)
  { id: "inv-13", locationId: "lake", item: "Replacement Filters", unit: "units", confirmed: 4, estimated: 4, estimatedLow: 3, estimatedHigh: 5, lastObserved: "1h ago", reportAge: 60, source: "loRa", confidence: 92, status: "fresh", category: "filters" },
  { id: "inv-14", locationId: "forest", item: "Replacement Filters", unit: "units", confirmed: 12, estimated: 12, estimatedLow: 11, estimatedHigh: 13, lastObserved: "45m ago", reportAge: 45, source: "loRa", confidence: 95, status: "fresh", category: "filters" },
];

export const VEHICLES = [
  { id: "v1", name: "Truck Alpha", capacity: "1200 L fuel equivalent", status: "available", location: "depot", driver: "Team A", eta: null },
  { id: "v2", name: "Truck Bravo", capacity: "800 L fuel equivalent", status: "unavailable", location: "Valley Site", driver: "Team B", eta: "Maintenance until D+2" },
  { id: "v3", name: "Van Charlie", capacity: "400 L fuel equivalent", status: "available", location: "depot", driver: "Team C", eta: null },
  { id: "v4", name: "Truck Delta", capacity: "1000 L fuel equivalent", status: "en-route", location: "Ridge Site → Depot", driver: "Team D", eta: "3h" },
];

export const ALERTS = [
  { id: "a1", severity: "critical", type: "Forecast Shortage", entity: "Lake Site — Generator Fuel", message: "Estimated depletion in 3–5 days at current consumption rate", time: "2m ago", acknowledged: false },
  { id: "a2", severity: "high", type: "Stale Report", entity: "Ridge Site — All items", message: "Last confirmed report 7h ago. Uncertainty growing.", time: "6h ago", acknowledged: false },
  { id: "a3", severity: "high", type: "Route Closure", entity: "Depot → Lake Site (Route B)", message: "Route B closed due to terrain assessment. Rerouting required.", time: "1h ago", acknowledged: false },
  { id: "a4", severity: "medium", type: "Vehicle Unavailable", entity: "Truck Bravo", message: "Vehicle in maintenance. Capacity reduced for D+1 planning window.", time: "3h ago", acknowledged: true },
  { id: "a5", severity: "medium", type: "Approval Required", entity: "Plan P-042 — Valley Resupply", message: "Plan awaiting approval by authorized reviewer.", time: "30m ago", acknowledged: false },
  { id: "a6", severity: "low", type: "Sync Complete", entity: "Device LORA-RIDGE-01", message: "Delayed messages synchronized. 14 observations ingested.", time: "20m ago", acknowledged: true },
];

export const PLANS = [
  {
    id: "P-041", name: "Emergency Lake Resupply", status: "pending-approval", created: "2h ago", createdBy: "Planner A",
    horizon: "3 days", locations: ["lake"], vehicle: "Truck Alpha",
    objective: "Prevent fuel depletion at Lake Site",
    feasible: true, solverStatus: "Feasible (not proven optimal)", runtime: 2.3,
    robustnessRate: 72, scenariosRun: 100,
    explanation: "Lake Site fuel estimated to deplete in 3–5 days. Route A is accessible. Truck Alpha available. Robustness: 72/100 scenarios survived."
  },
  {
    id: "P-042", name: "Valley Resupply — Standard", status: "pending-approval", created: "1h ago", createdBy: "Planner A",
    horizon: "7 days", locations: ["valley"], vehicle: "Van Charlie",
    objective: "Replenish fuel and water at Valley Site",
    feasible: true, solverStatus: "Feasible (not proven optimal)", runtime: 3.1,
    robustnessRate: 81, scenariosRun: 100,
    explanation: "Valley fuel forecast shows shortage risk in 7 days. Water levels adequate. Van Charlie available via Route C."
  },
  {
    id: "P-040", name: "Ridge Resupply (Previous)", status: "approved", created: "1d ago", createdBy: "Planner B",
    horizon: "5 days", locations: ["ridge"], vehicle: "Truck Delta",
    objective: "Fuel and battery resupply to Ridge Site",
    feasible: true, solverStatus: "Feasible", runtime: 1.8,
    robustnessRate: 84, scenariosRun: 100,
    explanation: "Approved and in execution. Truck Delta en-route."
  },
];

export const FORECAST_DATA = {
  "ridge-fuel": {
    item: "Generator Fuel", location: "Ridge Site", unit: "L",
    method: "Exponential Smoothing (α=0.3)", horizon: 7,
    depleteDay: 5, shortageRisk: 0.68,
    series: [
      { day: -7, actual: 680 }, { day: -6, actual: 640 }, { day: -5, actual: 600 },
      { day: -4, actual: 565 }, { day: -3, actual: 540 }, { day: -2, actual: 520 },
      { day: -1, actual: 520, forecast: 515, low: 495, high: 535 },
      { day: 0, actual: 470, forecast: 468, low: 432, high: 504 },
      { day: 1, forecast: 415, low: 365, high: 465 },
      { day: 2, forecast: 358, low: 293, high: 423 },
      { day: 3, forecast: 298, low: 218, high: 378 },
      { day: 4, forecast: 235, low: 139, high: 331 },
      { day: 5, forecast: 168, low: 58, high: 278 },
      { day: 6, forecast: 98, low: 0, high: 218 },
      { day: 7, forecast: 24, low: 0, high: 154 },
    ]
  },
  "lake-fuel": {
    item: "Generator Fuel", location: "Lake Site", unit: "L",
    method: "Moving Average (7-day)", horizon: 5,
    depleteDay: 3, shortageRisk: 0.91,
    series: [
      { day: -7, actual: 420 }, { day: -6, actual: 395 }, { day: -5, actual: 368 },
      { day: -4, actual: 345 }, { day: -3, actual: 318 }, { day: -2, actual: 295 },
      { day: -1, actual: 265, forecast: 262, low: 248, high: 276 },
      { day: 0, actual: 180, forecast: 178, low: 158, high: 198 },
      { day: 1, forecast: 138, low: 110, high: 166 },
      { day: 2, forecast: 94, low: 58, high: 130 },
      { day: 3, forecast: 48, low: 4, high: 92 },
      { day: 4, forecast: 0, low: 0, high: 42 },
      { day: 5, forecast: 0, low: 0, high: 0 },
    ]
  }
};

export const TELEMETRY_DEVICES = [
  { id: "d1", name: "LORA-RIDGE-01", location: "Ridge Site", status: "offline", lastContact: "7h ago", battery: 68, firmware: "v2.1.4", buffered: 14, failed: 0 },
  { id: "d2", name: "LORA-VALLEY-01", location: "Valley Site", status: "online", lastContact: "2m ago", battery: 82, firmware: "v2.1.4", buffered: 0, failed: 0 },
  { id: "d3", name: "LORA-LAKE-01", location: "Lake Site", status: "online", lastContact: "5m ago", battery: 45, firmware: "v2.0.9", buffered: 0, failed: 2 },
  { id: "d4", name: "LORA-FOREST-01", location: "Forest Site", status: "online", lastContact: "1m ago", battery: 91, firmware: "v2.1.4", buffered: 0, failed: 0 },
  { id: "d5", name: "LORA-DEPOT-01", location: "Central Depot", status: "online", lastContact: "30s ago", battery: 100, firmware: "v2.1.4", buffered: 0, failed: 0 },
];

export const DEPENDENCY_NODES = [
  { id: "fuel", label: "Generator Fuel", type: "resource", threshold: 100, unit: "L", currentEst: 470, locationId: "ridge" },
  { id: "generator", label: "Generator Power", type: "capability", threshold: 0.5, unit: "hours/day", currentEst: 18, dependencies: ["fuel"] },
  { id: "cold-storage", label: "Cold Storage", type: "capability", threshold: 1, unit: "units", currentEst: 1, dependencies: ["generator"] },
  { id: "comms", label: "Communications", type: "capability", threshold: 1, unit: "units", currentEst: 1, dependencies: ["generator"] },
  { id: "sensors", label: "Field Sensors", type: "capability", threshold: 5, unit: "units", currentEst: 8, dependencies: ["batteries"] },
  { id: "batteries", label: "Sensor Batteries", type: "resource", threshold: 4, unit: "units", currentEst: 21, locationId: "ridge" },
  { id: "reporting", label: "Inventory Reporting", type: "capability", threshold: 1, unit: "units", currentEst: 1, dependencies: ["sensors", "comms"] },
  { id: "operations", label: "Site Operations", type: "capability", threshold: 1, unit: "units", currentEst: 1, dependencies: ["cold-storage", "reporting"] },
];

export const DMS = 18.4; // Demo Days of Mission Sustainability (estimated operational continuity)

export interface RouteSegment {
  id: string;
  name: string;
  fromId: string;
  toId: string;
  distanceKm: number;
  travelTimeHours: number;
  status: "open" | "degraded" | "closed";
  accessWindow: string;
  terrain: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  notes?: string;
}

export const ROUTES: RouteSegment[] = [
  { id: "R-01", name: "Depot — Ridge Primary", fromId: "depot", toId: "ridge", distanceKm: 42, travelTimeHours: 1.8, status: "open", accessWindow: "06:00 - 20:00 (Daylight)", terrain: "Mountain pass (Paved/Gravel)", riskLevel: "medium", notes: "Clear weather, light gravel near summit" },
  { id: "R-02", name: "Depot — Valley Highway", fromId: "depot", toId: "valley", distanceKm: 31, travelTimeHours: 0.9, status: "open", accessWindow: "24/7 All-weather", terrain: "Paved state highway", riskLevel: "low", notes: "Optimal condition, dual-lane highway" },
  { id: "R-03", name: "Depot — Lake Pass (Route A)", fromId: "depot", toId: "lake", distanceKm: 58, travelTimeHours: 2.5, status: "open", accessWindow: "07:00 - 17:00", terrain: "Gravel road / High altitude", riskLevel: "medium", notes: "Passable with 4x4 or heavy transport Alpha" },
  { id: "R-04", name: "Depot — Lake Route B", fromId: "depot", toId: "lake", distanceKm: 38, travelTimeHours: 1.2, status: "closed", accessWindow: "Closed until clearance", terrain: "Canyon corridor", riskLevel: "critical", notes: "Closed due to rockfall risk and terrain assessment. Reroute via Route A required." },
  { id: "R-05", name: "Depot — Forest Trail", fromId: "depot", toId: "forest", distanceKm: 26, travelTimeHours: 0.8, status: "open", accessWindow: "24/7 All-weather", terrain: "Paved rural road", riskLevel: "low", notes: "Normal operational flow" },
  { id: "R-06", name: "Valley — Lake Connector", fromId: "valley", toId: "lake", distanceKm: 34, travelTimeHours: 1.6, status: "degraded", accessWindow: "08:00 - 16:00", terrain: "Unpaved track", riskLevel: "high", notes: "Muddy sections after rainfall; travel time +45%" },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Administrator" | "Planner" | "Approver" | "Viewer" | "Auditor";
  department: string;
  mfaEnabled: boolean;
  status: "active" | "invited";
  lastActive: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "u-1", name: "Capt. Sarah Chen", email: "s.chen@northstar-ops.example", role: "Owner", department: "Executive Logistics", mfaEnabled: true, status: "active", lastActive: "Just now" },
  { id: "u-2", name: "Vikram Rathore", email: "v.rathore@northstar-ops.example", role: "Administrator", department: "IT & Telemetry", mfaEnabled: true, status: "active", lastActive: "14m ago" },
  { id: "u-3", name: "Elena Rostova", email: "e.rostova@northstar-ops.example", role: "Planner", department: "Forward Supply Planning", mfaEnabled: true, status: "active", lastActive: "1h ago" },
  { id: "u-4", name: "Maj. David Miller", email: "d.miller@northstar-ops.example", role: "Approver", department: "Operations Command", mfaEnabled: true, status: "active", lastActive: "35m ago" },
  { id: "u-5", name: "Amina Al-Mansoor", email: "a.mansoor@northstar-ops.example", role: "Auditor", department: "Compliance & Safety", mfaEnabled: false, status: "active", lastActive: "2d ago" },
  { id: "u-6", name: "Kenji Sato", email: "k.sato@northstar-ops.example", role: "Viewer", department: "Field Depot Support", mfaEnabled: false, status: "invited", lastActive: "Never" },
];

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  organization: string;
  action: string;
  resource: string;
  details: string;
  hashSignature: string;
  status: "success" | "warning" | "denied";
}

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "evt-901", timestamp: "Today, 08:42 UTC", actor: "Maj. David Miller (Approver)", organization: "Northstar Remote Operations", action: "PLAN_APPROVED", resource: "Plan P-040 (Ridge Resupply)", details: "Plan approved with condition: verify fuel gauge calibration on arrival", hashSignature: "sha256:4a8b9f...d71e", status: "success" },
  { id: "evt-902", timestamp: "Today, 07:15 UTC", actor: "Elena Rostova (Planner)", organization: "Northstar Remote Operations", action: "SCENARIO_RUN", resource: "Scenario Set: S-Lake-Stress", details: "Executed 100 Monte Carlo disruption samples; survival rate 72%", hashSignature: "sha256:1b3c8e...a94f", status: "success" },
  { id: "evt-903", timestamp: "Today, 06:30 UTC", actor: "ESP32 Gateway (LORA-01)", organization: "Northstar Remote Operations", action: "TELEMETRY_SYNC", resource: "LORA-RIDGE-01", details: "Synchronized 14 buffered inventory observations after connectivity restored", hashSignature: "sha256:9f2d4a...5c1b", status: "success" },
  { id: "evt-904", timestamp: "Yesterday, 21:10 UTC", actor: "Vikram Rathore (Admin)", organization: "Northstar Remote Operations", action: "ROLE_ASSIGNED", resource: "Elena Rostova -> Planner", details: "Granted forward plan authoring and scenario execution permissions", hashSignature: "sha256:e3c1a8...8b2d", status: "success" },
  { id: "evt-905", timestamp: "Yesterday, 18:05 UTC", actor: "Unknown IP (198.51.100.44)", organization: "Northstar Remote Operations", action: "AUTH_FAILURE", resource: "/api/v1/plans/export", details: "Tenant isolation check blocked cross-tenant access attempt", hashSignature: "sha256:c7a2b9...3f0a", status: "denied" },
];

export const INTEGRATIONS_LIST = [
  { id: "lora-bridge", name: "LoRa Resilient Telemetry Bridge", type: "Field Telemetry", status: "connected", lastSync: "8m ago", description: "ESP32 SX1276 nodes transmitting sensor readings with offline buffering", icon: "Radio" },
  { id: "erp-sap", name: "ERP / SAP S/4HANA Supply Connector", type: "Enterprise ERP", status: "connected", lastSync: "1h ago", description: "Bimonthly ledger balance sync and requisition automation", icon: "Database" },
  { id: "weather-service", name: "Terrain & Weather Hazard Feed", type: "Geospatial Data", status: "connected", lastSync: "15m ago", description: "NOAA/ECMWF terrain risk and pass accessibility weather forecasting", icon: "CloudRain" },
  { id: "webhook-dispatch", name: "Operational Webhook Dispatcher", type: "Webhooks", status: "active", lastSync: "Real-time", description: "HMAC-SHA256 signed event streams for approval decisions & critical shortages", icon: "Zap" },
];

export const BILLING_SUMMARY = {
  currentTier: "Growth Plan",
  pricePerMonth: "$890/mo",
  billingCycle: "Annual (Billed $10,680/yr)",
  nextBillingDate: "November 1, 2026",
  sandboxMode: true,
  quotas: {
    locations: { used: 5, total: 10, unit: "Sites", label: "Monitored Forward Sites" },
    vehicles: { used: 4, total: 8, unit: "Units", label: "Fleet Transport Units" },
    scenarios: { used: 420, total: 1000, unit: "Runs", label: "Scenario Runs / Month" },
    storage: { used: 1.4, total: 20, unit: "GB", label: "Telemetry & Twin History" },
    seats: { used: 6, total: 15, unit: "Seats", label: "Active Team Seats" }
  },
  invoices: [
    { id: "INV-2026-009", date: "Oct 1, 2026", amount: "$890.00", status: "Paid (Sandbox)", pdf: "invoice_oct_2026.pdf" },
    { id: "INV-2026-008", date: "Sep 1, 2026", amount: "$890.00", status: "Paid (Sandbox)", pdf: "invoice_sep_2026.pdf" },
    { id: "INV-2026-007", date: "Aug 1, 2026", amount: "$890.00", status: "Paid (Sandbox)", pdf: "invoice_aug_2026.pdf" },
  ]
};

export const ONBOARDING_CHECKLIST = [
  { id: 1, step: "Create Organization & Workspace", status: "completed", desc: "Northstar Remote Operations initialized with UTC timezone and Metric units." },
  { id: 2, step: "Define Network Sites & Depots", status: "completed", desc: "1 Central Depot + 4 Forward Sites mapped with synthetic GPS coordinates." },
  { id: 3, step: "Add Supply Categories & Baseline Stock", status: "completed", desc: "Configured fuel, potable water, batteries, maintenance kits, and filters." },
  { id: 4, step: "Set Days of Operational Continuity Thresholds", status: "completed", desc: "Critical alert threshold set at DMS < 7 days." },
  { id: 5, step: "Register Transport Vehicles & Capacities", status: "completed", desc: "4 vehicles registered with fuel-equivalent payload capacity limits." },
  { id: 6, step: "Connect Field Telemetry Bridge", status: "completed", desc: "5 LoRa nodes configured with local buffering simulator." },
  { id: 7, step: "Invite Team Members & Set Permissions", status: "completed", desc: "Roles assigned for Owner, Planner, Approver, and Auditor." },
  { id: 8, step: "Verify Separation-of-Duties Policy", status: "active", desc: "Require distinct users for plan generation vs plan authorization." },
  { id: 9, step: "Execute First Disruption Scenario Run", status: "pending", desc: "Stress test candidate plan against route closures and demand spikes." }
];
