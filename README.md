# MISSION-SUSTAINABILITY TWIN (MST)
## Predictive Logistics & Forward Supply Chain SaaS Platform (PS 26251)

**Mission-Sustainability Twin (MST)** is an enterprise decision-support platform designed for forward logistics operations facing intermittent telemetry, terrain disruptions, and critical supply dependencies.

Unlike conventional VRP dashboards, MST combines **uncertainty-aware inventory estimation**, **predictive depletion curves**, **capability cascade dependency graphs**, **classical MILP & hybrid QUBO candidate planning**, **Monte Carlo disruption stress-testing**, and **Human-in-the-Loop authorization governance**.

---

### Core Architecture & The 8 Solution Pillars

1. **Uncertainty-Aware Logistics Twin**: Retains last confirmed observations, report age, and expanding belief-state uncertainty intervals as reports age.
2. **Predictive Consumption & Depletion Engine**: Forecasts consumption and depletion windows with statistical prediction bounds.
3. **Mission-Sustainability Dependency Graph**: Propagates resource stockouts into downstream capability impacts (e.g. Fuel → Generators → Cold Storage / Comms) to compute **Days of Mission Sustainability (DMS)**.
4. **Dynamic Mission-Aware Routing**: Evaluates terrain accessibility, pass closures, vehicle capacity bounds, and daytime access windows.
5. **Resilience & Robustness Certification**: Stress-tests candidate logistics plans against 100+ sampled disruption scenarios (pass closures, fleet downtime, demand spikes).
6. **Adaptive Classical & Hybrid Optimization**: Fast classical MILP heuristics for urgent planning alongside experimental QUBO/QAOA benchmarks.
7. **Human-in-the-Loop Governance & Separation of Duties**: AI recommends; authorized human commanders review and approve. Enforces separation of duties (authors cannot self-approve).
8. **Resilient Field Data Telemetry**: Ingests offline-buffered LoRa telemetry from ESP32 edge nodes with idempotent ingestion and timestamp preservation.

---

### Application Modules & Navigation Structure

```
WORKSPACE
├── /app              Overview (Tactical summary, priority alerts, DMS metric)
├── /app/network      Network & Locations (Schematic grid, route corridors, site drawer)
├── /app/inventory    Inventory Twin (Belief-state stock, confidence scores, observation logging)
├── /app/forecasts    Forecasts (7-day exponential smoothing, depletion intervals)
└── /app/dependencies Dependency Graph (Resource-to-capability failure cascade)

PLANNING
├── /app/planning     Plan Builder (10-step guided logistics workflow with constraints & solver)
├── /app/scenarios    Scenario Lab (Monte Carlo disruption stress-testing & survival rates)
├── /app/comparison   Plan Comparison (Side-by-side trade-off matrix & explainability)
└── /app/approvals    Approvals (Human decision record, comment history, audit trail)

OPERATIONS
├── /app/telemetry    Telemetry & Sync (LoRa device fleet, offline buffer sync simulation)
├── /app/alerts       Alerts (Active critical warnings, acknowledgment controls)
└── /app/reports      Reports (CSV dataset export, print-friendly PDF layout)

ADMINISTRATION
├── /app/team         Team & Roles (Multi-tenancy, RBAC, separation-of-duties policy)
├── /app/integrations Integrations (LoRa bridge, SAP ERP connector, weather hazards, Webhooks)
├── /app/billing      Billing (Sandbox tier management, quota meters, simulated checkout)
├── /app/security     Security & Audit (Honest E2EE WebCrypto demo, tamper-evident audit ledger)
└── /app/settings     Settings (Onboarding checklist, DMS thresholds, deterministic demo reset)
```

---

### Honest Cryptographic Security Architecture

MST implements and documents two distinct security boundaries:

- **Operational Analytics Data**: Inventory, consumption, vehicles, routes, forecasts, and plans are encrypted with TLS in transit and AES-256 at rest. Authorized backend services process operational data to compute forecasts and optimize plans.
- **E2EE Confidential Collaboration**: Private commander notes and tactical rationales are encrypted on the client device using WebCrypto AES-GCM before transmission. Ciphertext is stored on the server; the backend possesses no decryption keys.

---

### Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to access the marketing portal and `http://localhost:3000/app` to enter the tactical workspace.

3. **Build & Verify Production Bundle**:
   ```bash
   npm run build
   ```
   All 21 static and dynamic routes compile cleanly with zero TypeScript errors.
