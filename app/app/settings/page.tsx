"use client";

import { useState } from "react";
import { ONBOARDING_CHECKLIST } from "@/lib/demoData";
import {
  Settings, CheckCircle2, RotateCcw, Sliders, Globe, Clock,
  Shield, AlertTriangle, Building2, Save, Sparkles, Check
} from "lucide-react";

export default function SettingsPage() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [timezone, setTimezone] = useState("UTC");
  const [dmsThresholdDays, setDmsThresholdDays] = useState(7);
  const [staleThresholdHours, setStaleThresholdHours] = useState(4);
  const [solverTimeoutSec, setSolverTimeoutSec] = useState(5);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [checklist, setChecklist] = useState(ONBOARDING_CHECKLIST);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDemo = () => {
    if (confirm("Reset demo workspace to deterministic seed state? All temporary edits will revert to baseline.")) {
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Workspace Settings</h1>
            <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Configuration & Onboarding
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Tune operational thresholds, localization units, and B2B onboarding setup for Northstar Remote Operations.
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            border: "1px solid var(--border)", background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#b45309"
          }}
        >
          <RotateCcw size={14} /> Reset Demo Workspace
        </button>
      </div>

      {savedSuccess && (
        <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, fontSize: 12.5, color: "#15803d", marginBottom: 20 }}>
          ✓ Operational settings updated and saved to organization profile.
        </div>
      )}

      {resetSuccess && (
        <div style={{ padding: "10px 14px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, fontSize: 12.5, color: "#1d4ed8", marginBottom: 20 }}>
          ✓ Demo workspace reset to baseline deterministic seed data (Northstar Remote Operations).
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 24 }}>
        {/* Left: Operational Thresholds & Preferences */}
        <div>
          <form onSubmit={handleSave}>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Operational Thresholds & Alerts</div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  Days of Mission Sustainability (DMS) Alert Trigger
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range" min="3" max="21" value={dmsThresholdDays}
                    onChange={e => setDmsThresholdDays(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 60 }}>{dmsThresholdDays} Days</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 4 }}>
                  Triggers high-priority shortage warning when estimated continuity falls below this value.
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  Stale Telemetry Report Threshold
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range" min="1" max="12" value={staleThresholdHours}
                    onChange={e => setStaleThresholdHours(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 60 }}>{staleThresholdHours} Hours</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 4 }}>
                  Marks forward node as stale and widens belief-state uncertainty boundaries.
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  Default Solver Execution Timeout
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range" min="1" max="15" value={solverTimeoutSec}
                    onChange={e => setSolverTimeoutSec(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 60 }}>{solverTimeoutSec} Seconds</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 4 }}>
                  Maximum computation window for classical MILP heuristics before returning best feasible candidate.
                </div>
              </div>
            </div>

            {/* Localization Settings */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Measurement & Localization</div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  Measurement Standard
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setUnits("metric")}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      border: units === "metric" ? "2px solid var(--fg)" : "1px solid var(--border)",
                      background: units === "metric" ? "var(--bg-secondary)" : "white"
                    }}
                  >
                    Metric (Liters, kg, km)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnits("imperial")}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      border: units === "imperial" ? "2px solid var(--fg)" : "1px solid var(--border)",
                      background: units === "imperial" ? "var(--bg-secondary)" : "white"
                    }}
                  >
                    Imperial (Gallons, lbs, mi)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  Operational Time Zone
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
                >
                  <option value="UTC">UTC (Universal Coordinated Time) — Default</option>
                  <option value="Asia/Kolkata">IST (UTC+05:30) — Indian Standard Time</option>
                  <option value="Europe/Vienna">CET (UTC+01:00) — Central European Time</option>
                  <option value="America/New_York">EST (UTC-05:00) — Eastern Standard Time</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px",
                borderRadius: 8, background: "var(--fg)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              <Save size={14} /> Save Preferences
            </button>
          </form>
        </div>

        {/* Right: B2B Onboarding Journey Checklist */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>B2B Setup Checklist</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 4 }}>
              8 / 9 Ready
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--fg-muted)", marginBottom: 16 }}>
            Recommended onboarding journey for enterprise forward logistics deployments.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {checklist.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: item.status === "completed" ? "rgba(34,197,94,0.1)" : item.status === "active" ? "rgba(59,130,246,0.1)" : "var(--bg-secondary)",
                  color: item.status === "completed" ? "#15803d" : item.status === "active" ? "#1d4ed8" : "var(--fg-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 2
                }}>
                  {item.status === "completed" ? <Check size={11} /> : item.id}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.status === "pending" ? "var(--fg-muted)" : "var(--fg)" }}>
                    {item.step}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
