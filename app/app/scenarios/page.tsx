"use client";

import { useState } from "react";
import { PLANS } from "@/lib/demoData";
import { FlaskConical, Play, AlertTriangle, CheckCircle2, Shield, Info, BarChart2 } from "lucide-react";

const DISRUPTION_TYPES = [
  { id: "route", label: "Temporary route closure", desc: "Selected route becomes inaccessible for a defined duration" },
  { id: "vehicle", label: "Vehicle unavailability", desc: "A vehicle is removed from the available fleet" },
  { id: "demand", label: "Demand increase", desc: "Consumption at one or more sites spikes above forecast" },
  { id: "delay", label: "Delivery delay", desc: "Transit time increases due to conditions" },
  { id: "weather", label: "Weather-related delay", desc: "Travel time increases due to weather impact" },
  { id: "stale", label: "Delayed inventory reporting", desc: "Observations from a site are delayed or missing" },
];

export default function ScenariosPage() {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [selectedDisruptions, setSelectedDisruptions] = useState(["route", "vehicle", "demand"]);
  const [scenarios, setScenarios] = useState(100);
  const [seed, setSeed] = useState(42);
  const [severity, setSeverity] = useState("moderate");
  const [planId, setPlanId] = useState(PLANS[0].id);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setRan(true); }, 2500);
  };

  const toggleDisruption = (id: string) => {
    setSelectedDisruptions(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const results = {
    feasibilityRate: 72,
    survivalRate: 68,
    sustainabilityImpact: -3.2,
    vulnerableLocations: ["Lake Site", "Ridge Site"],
    recurringFailures: ["Route B closure + Vehicle Bravo unavailable simultaneously"],
    contingency: "Pre-position Truck Alpha at Forest Site hub to cover Lake fallback route.",
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Scenario Lab</h1>
        <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Disruption stress-testing for candidate logistics plans</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Configuration</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Plan to Test</label>
              <select value={planId} onChange={e => setPlanId(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 13, outline: "none" }}>
                {PLANS.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Scenario Count</label>
                <input type="number" value={scenarios} onChange={e => setScenarios(Number(e.target.value))} min={10} max={500}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 13, outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Random Seed</label>
                <input type="number" value={seed} onChange={e => setSeed(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 13, outline: "none" }} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Severity</label>
              <select value={severity} onChange={e => setSeverity(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 13, outline: "none" }}>
                {["mild", "moderate", "severe"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Disruption Types</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {DISRUPTION_TYPES.map(d => (
                  <label key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={selectedDisruptions.includes(d.id)} onChange={() => toggleDisruption(d.id)} style={{ marginTop: 3 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{d.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleRun} disabled={running || selectedDisruptions.length === 0}
              style={{
                width: "100%", padding: "11px", borderRadius: 9, background: running ? "#6b7280" : "var(--fg)",
                color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}>
              {running ? (
                <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", animation: "spin 1s linear infinite" }} /> Running {scenarios} scenarios...</>
              ) : (
                <><Play size={13} /> Run Scenario Test</>
              )}
            </button>
          </div>

          <div style={{ padding: "12px 14px", background: "rgba(59,130,246,0.05)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.15)", fontSize: 11, color: "#1d4ed8", lineHeight: 1.7 }}>
            <Shield size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Scenarios use reproducible random seeds. All compared plans are evaluated against the same scenario set. Results are performance across tested scenarios — not unconditional real-world success probabilities.
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!ran && !running && (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 40, textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--fg-muted)" }}>
              <FlaskConical size={32} style={{ marginBottom: 16, opacity: 0.4 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No results yet</div>
              <div style={{ fontSize: 13 }}>Configure disruption parameters and click "Run Scenario Test" to generate a Robustness Report.</div>
            </div>
          )}

          {running && (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 40, textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTop: "3px solid var(--fg)", animation: "spin 1s linear infinite", marginBottom: 16 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Running {scenarios} disruption scenarios...</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 6 }}>Seed: {seed} · Severity: {severity}</div>
            </div>
          )}

          {ran && !running && (
            <>
              {/* Report header */}
              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "16px 20px" }}>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", marginBottom: 2 }}>Robustness Report — Scenario-Based Assessment</div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{planId} · {scenarios} scenarios · Seed {seed} · Severity: {severity}</div>
                <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(59,130,246,0.05)", borderRadius: 6, fontSize: 11, color: "#1d4ed8" }}>
                  <Shield size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
                  This is a simulation summary, not a guarantee, accreditation, or assurance of real-world outcomes.
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "Feasibility Rate", value: `${results.feasibilityRate}/100`, sub: "Plans remained feasible", color: "#b45309" },
                  { label: "Service Threshold Survival", value: `${results.survivalRate}/100`, sub: "All critical thresholds met", color: "#b45309" },
                  { label: "Sustainability Impact", value: `${results.sustainabilityImpact}d`, sub: "Avg DMS change vs. baseline", color: "#dc2626" },
                ].map((m, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: m.color, letterSpacing: "-0.04em", marginBottom: 2 }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Bar visualization */}
              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "20px" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Scenario Outcome Distribution</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Plan survived (all thresholds met)", count: 68, color: "#22c55e" },
                    { label: "Plan feasible but threshold breached", count: 18, color: "#f59e0b" },
                    { label: "Plan infeasible — no recovery", count: 14, color: "#ef4444" },
                  ].map((b, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: 500 }}>{b.label}</span>
                        <span style={{ fontWeight: 700, color: b.color }}>{b.count}%</span>
                      </div>
                      <div style={{ height: 8, background: "var(--bg-secondary)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${b.count}%`, background: b.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Findings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)", padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Recurring Failure Conditions</div>
                  {results.recurringFailures.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, fontSize: 12, marginBottom: 6 }}>
                      <AlertTriangle size={12} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginTop: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Vulnerable Locations</div>
                  {results.vulnerableLocations.map((l, i) => (
                    <div key={i} style={{ fontSize: 12, padding: "3px 0" }}>• {l}</div>
                  ))}
                </div>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(34,197,94,0.2)", padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Suggested Contingency</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>{results.contingency}</div>
                  <div style={{ marginTop: 12, fontSize: 11, color: "var(--fg-subtle)" }}>Contingency actions requiring vehicle re-positioning need separate planning and approval.</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
