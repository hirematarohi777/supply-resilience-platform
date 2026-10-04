"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/demoData";
import {
  BarChart2, CheckCircle2, AlertTriangle, ShieldCheck, Clock,
  ArrowRight, Sparkles, Scale, Info, Sliders, ChevronRight
} from "lucide-react";

export default function PlanComparisonPage() {
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>(["P-041", "P-042", "P-040"]);
  const [weightingMode, setWeightingMode] = useState<"robustness" | "speed" | "balanced">("robustness");

  // Extended candidate plans for rich comparison
  const candidatePlans = [
    {
      id: "P-041",
      name: "Emergency Lake Resupply",
      status: "Recommended Candidate",
      objective: "Immediate fuel stockout prevention at Lake Site",
      feasibility: "Feasible (Hard constraints met)",
      criticalShortagesPrevented: 1, // Lake fuel
      continuityImpactDays: "+4.2 Days DMS",
      deliveryWindowCompliance: "94%",
      travelTimeHours: 2.5,
      estimatedCost: "$1,850",
      scenarioSurvivalRate: 72,
      solveRuntimeSec: 2.3,
      dataAssumptions: "Lake telemetry fresh (60m). Route A used (Route B closed).",
      robustnessRank: 2,
      speedRank: 2,
      balancedRank: 1,
    },
    {
      id: "P-042",
      name: "Valley Resupply — Standard",
      status: "Candidate B",
      objective: "Scheduled replenishment for Valley Site fuel and water",
      feasibility: "Feasible (Hard constraints met)",
      criticalShortagesPrevented: 0, // Normal threshold
      continuityImpactDays: "+2.8 Days DMS",
      deliveryWindowCompliance: "99%",
      travelTimeHours: 0.9,
      estimatedCost: "$920",
      scenarioSurvivalRate: 81,
      solveRuntimeSec: 3.1,
      dataAssumptions: "Valley telemetry aging (2h). State highway nominal.",
      robustnessRank: 1,
      speedRank: 1,
      balancedRank: 2,
    },
    {
      id: "P-040",
      name: "Ridge Resupply (Historical)",
      status: "Previously Approved (Baseline)",
      objective: "Batteries & fuel resupply via Mountain Pass",
      feasibility: "Feasible",
      criticalShortagesPrevented: 1, // Battery threshold
      continuityImpactDays: "+5.1 Days DMS",
      deliveryWindowCompliance: "88%",
      travelTimeHours: 1.8,
      estimatedCost: "$1,450",
      scenarioSurvivalRate: 84,
      solveRuntimeSec: 1.8,
      dataAssumptions: "Ridge data stale (7h). Mountain pass daylight window applied.",
      robustnessRank: 1,
      speedRank: 3,
      balancedRank: 1,
    }
  ];

  return (
    <div style={{ padding: "32px", maxWidth: 1250 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Plan Comparison</h1>
            <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Multi-Objective Trade-Off Matrix
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Evaluate candidate movement plans side by side across feasibility, continuity impact, and disruption resilience.
          </p>
        </div>

        {/* Priority Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", padding: "4px 8px", borderRadius: 8, border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase" }}>Ranking Bias:</span>
          {(["robustness", "balanced", "speed"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setWeightingMode(mode)}
              style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 600, border: "none", cursor: "pointer",
                background: weightingMode === mode ? "var(--fg)" : "transparent",
                color: weightingMode === mode ? "white" : "var(--fg-muted)",
                textTransform: "capitalize"
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Recommendation Banner */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={18} color="#15803d" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Explainable Decision Recommendation: Plan P-041</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(34,197,94,0.1)", color: "#15803d", padding: "2px 8px", borderRadius: 4 }}>
                HIGHEST CONTINUITY IMPACT
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0 }}>
              <strong>Primary Driver:</strong> Lake Site fuel is projected to deplete within 3–5 days (Day +3). Plan P-041 routes Truck Alpha via Route A to avert cold-storage failure.
              Although Plan P-042 offers lower cost, failing to resupply Lake Site triggers critical operational stoppage.
            </p>
            <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 11.5 }}>
              <span style={{ color: "var(--fg)" }}><strong>Uncertainty Note:</strong> Lake report is fresh (60m ago), confirming high confidence in depletion timeline.</span>
              <span style={{ color: "var(--fg-muted)" }}><strong>Trade-off:</strong> +1.6h additional transit time vs lowest-cost route.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 24 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "14px 18px", textAlign: "left", width: "24%", color: "var(--fg-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Evaluation Dimension
              </th>
              {candidatePlans.map(plan => (
                <th key={plan.id} style={{ padding: "14px 18px", textAlign: "left", width: "25%" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--fg)" }}>{plan.name}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)", fontWeight: 500, marginTop: 2 }}>{plan.id} · {plan.status}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Constraint Feasibility</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#15803d", fontWeight: 600, fontSize: 12 }}>
                    <CheckCircle2 size={13} /> {p.feasibility}
                  </span>
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Critical Shortages Averted</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px", fontWeight: 700 }}>
                  {p.criticalShortagesPrevented > 0 ? (
                    <span style={{ color: "#15803d" }}>{p.criticalShortagesPrevented} Stock-out Prevented</span>
                  ) : (
                    <span style={{ color: "var(--fg-muted)" }}>Routine Top-up</span>
                  )}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Estimated Continuity (DMS)</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px", fontWeight: 800, color: "var(--fg)" }}>
                  {p.continuityImpactDays}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Scenario Survival Rate</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.scenarioSurvivalRate}%`, background: p.scenarioSurvivalRate > 80 ? "#22c55e" : "#f59e0b" }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 12 }}>{p.scenarioSurvivalRate}%</span>
                    <span style={{ fontSize: 10, color: "var(--fg-subtle)" }}>/ 100 runs</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Delivery Window Compliance</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px", fontWeight: 600 }}>
                  {p.deliveryWindowCompliance}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Total Travel Duration</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px" }}>
                  {p.travelTimeHours} hours
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Estimated Logistics Cost</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px", fontWeight: 600 }}>
                  {p.estimatedCost}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Solver Execution Duration</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "12px 18px", color: "var(--fg-muted)" }}>
                  {p.solveRuntimeSec}s (MILP Classical)
                </td>
              ))}
            </tr>

            <tr>
              <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--fg-muted)" }}>Actions</td>
              {candidatePlans.map(p => (
                <td key={p.id} style={{ padding: "14px 18px" }}>
                  <Link
                    href="/app/approvals"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px",
                      borderRadius: 6, fontSize: 11.5, fontWeight: 700, textDecoration: "none",
                      background: p.id === "P-041" ? "var(--fg)" : "white",
                      color: p.id === "P-041" ? "white" : "var(--fg)",
                      border: p.id === "P-041" ? "none" : "1px solid var(--border)"
                    }}
                  >
                    Select Plan <ChevronRight size={13} />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Disruption & Robustness Notice */}
      <div style={{ padding: "12px 16px", background: "rgba(59,130,246,0.05)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "#1d4ed8", display: "flex", alignItems: "center", gap: 8 }}>
        <ShieldCheck size={14} />
        <span>
          <strong>Simulation Certificate Notice:</strong> Comparative scenario survival figures are derived from Monte Carlo disruption tests across 100 iterations.
          These results represent decision-support simulations, not an unconditional guarantee of field outcomes.
        </span>
      </div>
    </div>
  );
}
