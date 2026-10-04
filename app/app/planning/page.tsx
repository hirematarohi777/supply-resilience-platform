"use client";

import { useState } from "react";
import Link from "next/link";
import { LOCATIONS, INVENTORY_ITEMS, VEHICLES, ROUTES, PLANS } from "@/lib/demoData";
import {
  ClipboardList, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle,
  Clock, Shield, ArrowRight, Play, RefreshCw, Send, CheckSquare,
  Sliders, Truck, MapPin, Package, Cpu, Scale
} from "lucide-react";

export default function PlanBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [horizon, setHorizon] = useState("5 days");
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["lake", "valley"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["fuel", "water"]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(["v1", "v3"]);
  const [priorities, setPriorities] = useState({
    stockout: 90,
    continuity: 85,
    deliveryWindow: 70,
    travelTime: 40,
    cost: 30,
  });
  const [hardConstraints, setHardConstraints] = useState({
    enforceCapacity: true,
    respectClosedRoutes: true,
    daylightOnly: true,
  });

  // Solver states
  const [solverRunning, setSolverRunning] = useState(false);
  const [solverBackend, setSolverBackend] = useState<"classical" | "qubo">("classical");
  const [candidateGenerated, setCandidateGenerated] = useState(false);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);

  const steps = [
    { num: 1, label: "Horizon" },
    { num: 2, label: "Targets" },
    { num: 3, label: "Freshness" },
    { num: 4, label: "Fleet" },
    { num: 5, label: "Corridors" },
    { num: 6, label: "Priorities" },
    { num: 7, label: "Generate" },
    { num: 8, label: "Feasibility" },
    { num: 9, label: "Stress Test" },
    { num: 10, label: "Approval" },
  ];

  const handleRunSolver = () => {
    setSolverRunning(true);
    setTimeout(() => {
      setSolverRunning(false);
      setCandidateGenerated(true);
      setCurrentStep(8);
    }, 1200);
  };

  const toggleLocation = (id: string) => {
    setSelectedLocations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleVehicle = (id: string) => {
    setSelectedVehicles(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Plan Builder</h1>
          <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
            10-Step Guided Logistics Workflow
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
          Synthesize field uncertainty, vehicle availability, and corridor access windows into robust forward replenishment plans.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "14px 18px", marginBottom: 24, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 700 }}>
          {steps.map((st, idx) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setCurrentStep(st.num)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
                    color: isCurrent ? "var(--fg)" : isDone ? "#15803d" : "var(--fg-muted)"
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: isCurrent ? "var(--fg)" : isDone ? "rgba(34,197,94,0.1)" : "var(--bg-secondary)",
                    color: isCurrent ? "white" : isDone ? "#15803d" : "var(--fg-muted)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800
                  }}>
                    {isDone ? <CheckCircle2 size={13} /> : st.num}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500 }}>{st.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div style={{ width: 20, height: 1, background: "var(--border)", margin: "0 4px" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 28, minHeight: 440 }}>
        {/* STEP 1: HORIZON */}
        {currentStep === 1 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 1: Select Planning Horizon</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
              Specify the forward tactical window for demand forecasts, vehicle cycle times, and depot dispatching.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {["3 days (Urgent)", "5 days (Tactical)", "7 days (Weekly)", "14 days (Strategic)"].map(h => {
                const val = h.split(" ")[0] + " " + h.split(" ")[1];
                const isSelected = horizon.startsWith(h.split(" ")[0]);
                return (
                  <div
                    key={h}
                    onClick={() => setHorizon(val)}
                    style={{
                      padding: 16, borderRadius: 10, cursor: "pointer",
                      border: isSelected ? "2px solid var(--fg)" : "1px solid var(--border)",
                      background: isSelected ? "var(--bg-secondary)" : "white"
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{h}</div>
                    <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 6 }}>
                      {h.includes("3") ? "Immediate crisis prevention" : h.includes("5") ? "Recommended balanced schedule" : "Extended buffer provisioning"}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "10px 14px", background: "var(--bg)", borderRadius: 8, fontSize: 12, color: "var(--fg-muted)" }}>
              <Clock size={13} style={{ verticalAlign: "middle", marginRight: 6 }} />
              DMS impact calculations will evaluate capability survival through Day +{horizon.split(" ")[0]}.
            </div>
          </div>
        )}

        {/* STEP 2: LOCATIONS & CATEGORIES */}
        {currentStep === 2 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 2: Select Locations & Categories</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
              Designate which forward sites and critical commodities require replenishment.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 10 }}>Target Formations / Sites</div>
                {LOCATIONS.filter(l => l.type === "forward").map(loc => (
                  <label key={loc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={selectedLocations.includes(loc.id)} onChange={() => toggleLocation(loc.id)} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{loc.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{loc.lastReport} ({loc.confidence}% conf)</span>
                  </label>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 10 }}>Supply Categories</div>
                {[
                  { id: "fuel", name: "Generator Fuel (Liters)", crit: "Critical" },
                  { id: "water", name: "Potable Water (Liters)", crit: "High" },
                  { id: "batteries", name: "Sensor Batteries (Units)", crit: "Medium" },
                  { id: "filters", name: "Replacement Filters (Units)", crit: "Standard" },
                ].map(cat => (
                  <label key={cat.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => setSelectedCategories(prev => prev.includes(cat.id) ? prev.filter(x => x !== cat.id) : [...prev, cat.id])}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: cat.crit === "Critical" ? "#dc2626" : "var(--fg-muted)" }}>{cat.crit}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INVENTORY FRESHNESS */}
        {currentStep === 3 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 3: Review Telemetry Freshness & Uncertainty</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
              The planner will use belief-state estimates with uncertainty intervals rather than treating old reports as absolute facts.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {INVENTORY_ITEMS.filter(i => selectedLocations.includes(i.locationId)).map(item => (
                <div key={item.id} style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.item} — {LOCATIONS.find(l => l.id === item.locationId)?.name}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>Last confirmed: {item.confirmed} {item.unit} ({item.lastObserved} via {item.source})</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Est: {item.estimated} {item.unit}</div>
                    <div style={{ fontSize: 11, color: item.confidence < 75 ? "#b45309" : "#15803d" }}>
                      Range: [{item.estimatedLow}–{item.estimatedHigh}] · {item.confidence}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, fontSize: 12, color: "#b45309" }}>
              <AlertTriangle size={13} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Ridge Site data is 7 hours old. Uncertainty bounds are expanded by ±14% during solver evaluation.
            </div>
          </div>
        )}

        {/* STEP 4: FLEET CAPACITIES */}
        {currentStep === 4 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 4: Fleet Availability & Capacities</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
              Select dispatchable vehicles. Capacities represent documented hard bounds.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {VEHICLES.map(v => (
                <div
                  key={v.id}
                  onClick={() => v.status !== "unavailable" && toggleVehicle(v.id)}
                  style={{
                    padding: 14, borderRadius: 8, border: "1px solid var(--border)",
                    opacity: v.status === "unavailable" ? 0.5 : 1,
                    cursor: v.status === "unavailable" ? "not-allowed" : "pointer",
                    background: selectedVehicles.includes(v.id) ? "var(--bg-secondary)" : "white"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{v.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: v.status === "available" ? "#15803d" : "#dc2626" }}>
                      {v.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>Payload Limit: {v.capacity}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 4 }}>Crew: {v.driver} · Base: {v.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: CORRIDORS & WINDOWS */}
        {currentStep === 5 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 5: Route Corridors & Delivery Windows</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
              Active accessibility windows and route restrictions.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {ROUTES.map(r => (
                <div key={r.id} style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{r.terrain} · {r.distanceKm} km · {r.travelTimeHours}h nominal transit</div>
                    {r.notes && <div style={{ fontSize: 10.5, color: "#b45309", marginTop: 2 }}>{r.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: r.status === "open" ? "rgba(34,197,94,0.1)" : r.status === "degraded" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                      color: r.status === "open" ? "#15803d" : r.status === "degraded" ? "#b45309" : "#dc2626"
                    }}>
                      {r.status.toUpperCase()}
                    </span>
                    <div style={{ fontSize: 10.5, color: "var(--fg-muted)", marginTop: 4 }}>{r.accessWindow}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: PRIORITIES & HARD CONSTRAINTS */}
        {currentStep === 6 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 6: Optimization Objectives & Constraints</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
              Define multi-objective weightings and non-negotiable operational boundaries.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 12 }}>Objective Weights</div>
                {Object.entries(priorities).map(([k, val]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{k.replace(/([A-Z])/g, " $1")}</span>
                      <span>{val}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={val}
                      onChange={e => setPriorities({ ...priorities, [k]: Number(e.target.value) })}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 12 }}>Hard Constraints (Non-negotiable)</div>
                {[
                  { k: "enforceCapacity", label: "Strict Vehicle Capacity Limits", desc: "No vehicle load may exceed 100% rated capacity" },
                  { k: "respectClosedRoutes", label: "Exclude Closed Corridors", desc: "Never route transport through blocked passes (e.g. Route B)" },
                  { k: "daylightOnly", label: "Adhere to Daylight Access Windows", desc: "Disallow transit on mountain passes outside 06:00-20:00" },
                ].map(c => (
                  <label key={c.k} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={hardConstraints[c.k as keyof typeof hardConstraints]}
                      onChange={() => setHardConstraints({ ...hardConstraints, [c.k]: !hardConstraints[c.k as keyof typeof hardConstraints] })}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: GENERATE CANDIDATE PLANS */}
        {currentStep === 7 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 7: Solve & Synthesize Candidate Plans</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
              Select solver backend and execute constraint satisfaction & mission continuity optimization.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div
                onClick={() => setSolverBackend("classical")}
                style={{
                  padding: 16, borderRadius: 10, cursor: "pointer",
                  border: solverBackend === "classical" ? "2px solid var(--fg)" : "1px solid var(--border)",
                  background: solverBackend === "classical" ? "var(--bg-secondary)" : "white"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5 }}>
                  <Cpu size={16} /> Classical Solver (Recommended)
                </div>
                <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 6 }}>
                  Mixed-Integer Linear Programming (MILP) heuristic. Proven feasibility, deterministic runtimes (&lt;2.5s).
                </div>
              </div>
              <div
                onClick={() => setSolverBackend("qubo")}
                style={{
                  padding: 16, borderRadius: 10, cursor: "pointer",
                  border: solverBackend === "qubo" ? "2px solid var(--fg)" : "1px solid var(--border)",
                  background: solverBackend === "qubo" ? "var(--bg-secondary)" : "white"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5 }}>
                  <Scale size={16} /> Hybrid QUBO Simulator (Experimental)
                </div>
                <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 6 }}>
                  QAOA parameter formulation benchmark. Benchmark comparison against classical baseline.
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <button
                onClick={handleRunSolver}
                disabled={solverRunning}
                style={{
                  padding: "12px 28px", borderRadius: 8, background: "var(--fg)", color: "white",
                  fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8
                }}
              >
                {solverRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                {solverRunning ? "Solving Formulations..." : "Run Optimization Solver"}
              </button>
              <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 8 }}>
                Evaluates 2,400 routing permutations against inventory depletion curves
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: REVIEW ASSUMPTIONS & FEASIBILITY */}
        {currentStep === 8 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 8: Review Assumptions & Feasibility</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
              Candidate Plan <span style={{ fontWeight: 700, color: "var(--fg)" }}>P-044 (Synthesized Multi-Node)</span> successfully produced.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", fontWeight: 700 }}>Solver Status</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d", marginTop: 4 }}>Feasible (Proven)</div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>Runtime: 2.14 seconds</div>
              </div>
              <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", fontWeight: 700 }}>Continuity Impact</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--fg)", marginTop: 4 }}>DMS +9.2 Days</div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>Stockout risk reduced by 88%</div>
              </div>
              <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", fontWeight: 700 }}>Dispatch Schedule</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--fg)", marginTop: 4 }}>2 Sorties (Alpha + Charlie)</div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>Total travel: 124 km · 4.8h</div>
              </div>
            </div>

            {/* Trade-off summary */}
            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", color: "var(--fg-muted)" }}>Identified Trade-Offs</div>
              <ul style={{ fontSize: 12.5, lineHeight: 1.8, paddingLeft: 18, margin: 0, color: "var(--fg)" }}>
                <li>Route B is bypassed via Route A (+20 km), adding 1.3 hours travel time to respect terrain hazard.</li>
                <li>Truck Alpha prioritized for Lake Site due to severe fuel depletion curve (depletion expected in 3 days).</li>
                <li>Ridge Site replenishment deferred to Day 2 because current battery stock satisfies 14-day threshold.</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 9: STRESS TEST IN SCENARIO LAB */}
        {currentStep === 9 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 9: Disruption Stress Testing</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
              Validate candidate plan robustness before human authorization.
            </p>
            <div style={{ padding: 20, background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Monte Carlo Robustness Assessment</div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>100 sampled disruption scenarios (Route closures, demand spikes, telemetry dropouts)</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#15803d" }}>86%</div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>Scenario Survival Rate</div>
                </div>
              </div>
              <div style={{ width: "100%", height: 8, background: "white", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: "86%", height: "100%", background: "#22c55e" }} />
              </div>
              <p style={{ fontSize: 11.5, color: "var(--fg-muted)", margin: 0 }}>
                Weakest component: Lake Site route in the event of double closure. Contingency recommended: preposition auxiliary fuel drums at Valley pass.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/app/scenarios" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
                Open Scenario Lab for Custom Disruptions <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* STEP 10: SUBMIT FOR APPROVAL */}
        {currentStep === 10 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Step 10: Human Authorization & Decision Record</div>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
              MST enforces Human-in-the-Loop decision governance. AI recommends; authorized commanders authorize.
            </p>
            {submittedForApproval ? (
              <div style={{ padding: 24, textAlign: "center", background: "rgba(34,197,94,0.08)", borderRadius: 10, border: "1px solid rgba(34,197,94,0.2)" }}>
                <CheckCircle2 size={36} color="#15803d" style={{ margin: "0 auto 10px" }} />
                <div style={{ fontSize: 16, fontWeight: 800, color: "#15803d" }}>Plan P-044 Submitted to Approval Queue</div>
                <p style={{ fontSize: 12.5, color: "var(--fg-muted)", marginTop: 6, maxWidth: 500, margin: "6px auto 16px" }}>
                  Assigned to authorized Approver (Maj. David Miller). The decision will be logged to the tamper-evident audit ledger.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <Link href="/app/approvals" style={{ padding: "8px 18px", borderRadius: 6, background: "var(--fg)", color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                    View Approvals Queue
                  </Link>
                  <Link href="/app/comparison" style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "white", textDecoration: "none", fontSize: 13 }}>
                    Compare Against Baselines
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 8 }}>
                    Decision Dossier Summary
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                    <div><strong>Plan Identifier:</strong> P-044 (Multi-Node Tactical Resupply)</div>
                    <div><strong>Target Formations:</strong> Lake Site, Valley Site</div>
                    <div><strong>Required Fleet:</strong> Truck Alpha, Van Charlie</div>
                    <div><strong>Robustness Score:</strong> 86 / 100 simulated disruptions survived</div>
                    <div><strong>Author:</strong> Elena Rostova (Planner) · Separation-of-duties verified</div>
                  </div>
                </div>
                <button
                  onClick={() => setSubmittedForApproval(true)}
                  style={{
                    padding: "10px 24px", borderRadius: 8, background: "#15803d", color: "white", border: "none",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6
                  }}
                >
                  <Send size={14} /> Submit Plan for Formal Approval
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 6,
            border: "1px solid var(--border)", background: "white", fontSize: 12.5, fontWeight: 600,
            cursor: currentStep === 1 ? "not-allowed" : "pointer", opacity: currentStep === 1 ? 0.5 : 1
          }}
        >
          <ChevronLeft size={14} /> Previous Step
        </button>

        <span style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>
          Step {currentStep} of {steps.length}
        </span>

        <button
          onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
          disabled={currentStep === steps.length}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 6,
            background: "var(--fg)", color: "white", border: "none", fontSize: 12.5, fontWeight: 600,
            cursor: currentStep === steps.length ? "not-allowed" : "pointer", opacity: currentStep === steps.length ? 0.5 : 1
          }}
        >
          Next Step <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
