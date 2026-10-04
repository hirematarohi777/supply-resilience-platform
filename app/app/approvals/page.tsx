"use client";

import { useState } from "react";
import { PLANS, ALERTS } from "@/lib/demoData";
import { CheckCircle2, XCircle, MessageSquare, Clock, ChevronRight, AlertTriangle, User, FileText, Shield } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  "pending-approval": { label: "Pending Approval", bg: "rgba(245,158,11,0.1)", color: "#b45309" },
  "approved": { label: "Approved", bg: "rgba(34,197,94,0.1)", color: "#15803d" },
  "rejected": { label: "Rejected", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
  "draft": { label: "Draft", bg: "rgba(107,107,107,0.08)", color: "#6b7280" },
};

export default function ApprovalsPage() {
  const [selected, setSelected] = useState<string | null>(PLANS[0].id);
  const [comment, setComment] = useState("");
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const selectedPlan = PLANS.find(p => p.id === selected);

  const handleDecision = (planId: string, decision: "approved"|"rejected") => {
    setDecisions(prev => ({ ...prev, [planId]: decision }));
  };

  const getStatus = (plan: typeof PLANS[0]): string => decisions[plan.id] ?? plan.status;

  return (
    <div style={{ padding: "32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Approvals</h1>
        <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Review, approve, reject, or request changes to candidate logistics plans</p>
      </div>

      {/* Workflow states */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "white", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
        {["Draft", "Evaluated", "Pending Approval", "Approved / Rejected"].map((s, i) => (
          <div key={s} style={{
            flex: 1, padding: "10px 16px", fontSize: 12, fontWeight: 600,
            background: s === "Pending Approval" ? "var(--fg)" : "white",
            color: s === "Pending Approval" ? "white" : "var(--fg-muted)",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
            display: "flex", alignItems: "center", gap: 6, justifyContent: "center"
          }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: s === "Pending Approval" ? "rgba(255,255,255,0.2)" : "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{i + 1}</span>
            {s}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* Plan list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Plans ({PLANS.length})</div>
          {PLANS.map(plan => {
            const status = getStatus(plan);
            const sm = STATUS_MAP[status] || STATUS_MAP.draft;
            return (
              <div key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${selected === plan.id ? "#0A0A0A" : "var(--border)"}`,
                  background: selected === plan.id ? "#0A0A0A" : "white",
                  transition: "all 0.15s"
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: selected === plan.id ? "rgba(255,255,255,0.6)" : "var(--fg-muted)" }}>{plan.id}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase",
                    background: selected === plan.id ? "rgba(255,255,255,0.15)" : sm.bg,
                    color: selected === plan.id ? "white" : sm.color
                  }}>{sm.label}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: selected === plan.id ? "white" : "var(--fg)", marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 11, color: selected === plan.id ? "rgba(255,255,255,0.5)" : "var(--fg-muted)" }}>{plan.vehicle} · {plan.created}</div>
              </div>
            );
          })}
        </div>

        {/* Plan detail */}
        {selectedPlan && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Status bar */}
            <div style={{
              padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)", background: "white",
              display: "flex", alignItems: "center", gap: 12
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", marginBottom: 2 }}>{selectedPlan.name}</div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>Created by {selectedPlan.createdBy} · {selectedPlan.created} · {selectedPlan.id}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase",
                ...STATUS_MAP[getStatus(selectedPlan)]
              }}>{STATUS_MAP[getStatus(selectedPlan)]?.label}</span>
            </div>

            {/* Plan metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { label: "Planning Horizon", value: selectedPlan.horizon },
                { label: "Robustness Rate", value: `${selectedPlan.robustnessRate}/100`, color: selectedPlan.robustnessRate > 80 ? "#15803d" : "#b45309" },
                { label: "Solver Status", value: selectedPlan.feasible ? "Feasible" : "Infeasible", color: selectedPlan.feasible ? "#15803d" : "#dc2626" },
                { label: "Solve Runtime", value: `${selectedPlan.runtime}s` },
              ].map((m, i) => (
                <div key={i} style={{ padding: "12px 14px", background: "white", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: (m as any).color || "var(--fg)", letterSpacing: "-0.02em" }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Explanation panel */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Explainability Panel</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Recommendation</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7 }}>{selectedPlan.objective}</p>
                </div>
                <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Primary Drivers</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7 }}>{selectedPlan.explanation}</p>
                </div>
                <div style={{ padding: "12px 14px", background: "rgba(245,158,11,0.06)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.15)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Uncertainty</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#b45309" }}>Some inventory estimates based on stale reports. Consumption modeled using baseline forecast. Confirm reporting assumptions before approval.</p>
                </div>
                <div style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Scenario Survival</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7 }}>Survived {selectedPlan.robustnessRate} of {selectedPlan.scenariosRun} tested scenarios. Critical failure condition: simultaneous route closure + vehicle unavailability.</p>
                </div>
              </div>
            </div>

            {/* Scenario note */}
            <div style={{ padding: "10px 14px", background: "rgba(59,130,246,0.05)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "#1d4ed8" }}>
              <Shield size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
              This is a simulation summary, not a guarantee, accreditation, or assurance of real-world outcomes.
            </div>

            {/* Decision panel */}
            {getStatus(selectedPlan) === "pending-approval" && (
              <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Record Decision</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--fg-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Comment / Reason</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Add approval comments, conditions, or rejection reasons..."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 13, resize: "vertical", minHeight: 80, outline: "none", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleDecision(selectedPlan.id, "approved")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, background: "#15803d", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                    <CheckCircle2 size={14} /> Approve Plan
                  </button>
                  <button onClick={() => handleDecision(selectedPlan.id, "rejected")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, background: "#dc2626", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                    <XCircle size={14} /> Reject
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", fontWeight: 500, color: "var(--fg-muted)" }}>
                    <MessageSquare size={14} /> Request Changes
                  </button>
                </div>
                <p style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 10 }}>
                  <User size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
                  Approval is recorded as Demo Admin (Owner). Material changes require a new plan version and fresh approval. Execution is simulated — no automatic dispatch occurs.
                </p>
              </div>
            )}

            {/* Decision result */}
            {(getStatus(selectedPlan) === "approved" || decisions[selectedPlan.id]) && decisions[selectedPlan.id] === "approved" && (
              <div style={{ padding: "14px 18px", background: "rgba(34,197,94,0.08)", borderRadius: 10, border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={18} color="#15803d" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#15803d" }}>Plan Approved</div>
                  <div style={{ fontSize: 12, color: "#15803d" }}>Recorded by Demo Admin (Owner) · Just now · Execution is simulated</div>
                </div>
              </div>
            )}
            {decisions[selectedPlan.id] === "rejected" && (
              <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.08)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
                <XCircle size={18} color="#dc2626" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#dc2626" }}>Plan Rejected</div>
                  <div style={{ fontSize: 12, color: "#dc2626" }}>Recorded by Demo Admin · Just now · Reason: {comment || "No reason provided"}</div>
                </div>
              </div>
            )}

            {/* Audit history */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Decision History</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { actor: "Planner A", action: "Created plan", time: selectedPlan.created, icon: <FileText size={13} />, color: "var(--fg-muted)" },
                  { actor: "System", action: "Scenario evaluation completed — 100 scenarios", time: "45m ago", icon: <Shield size={13} />, color: "#1d4ed8" },
                  { actor: "Planner A", action: "Submitted for approval", time: "30m ago", icon: <Clock size={13} />, color: "#b45309" },
                  ...(decisions[selectedPlan.id] ? [{ actor: "Demo Admin", action: `Plan ${decisions[selectedPlan.id]}`, time: "Just now", icon: decisions[selectedPlan.id] === "approved" ? <CheckCircle2 size={13} /> : <XCircle size={13} />, color: decisions[selectedPlan.id] === "approved" ? "#15803d" : "#dc2626" }] : []),
                ].map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--bg-secondary)" }}>
                    <div style={{ color: e.color, flexShrink: 0, marginTop: 2 }}>{e.icon}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: 12 }}>{e.actor}</span>
                      <span style={{ fontSize: 12, color: "var(--fg-muted)" }}> — {e.action}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--fg-subtle)", whiteSpace: "nowrap" }}>{e.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
