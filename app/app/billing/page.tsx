"use client";

import { useState } from "react";
import { BILLING_SUMMARY } from "@/lib/demoData";
import {
  CreditCard, Check, AlertCircle, ArrowUpRight, ShieldCheck,
  CheckCircle2, Download, Building2, Sliders, ExternalLink, X
} from "lucide-react";

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"starter" | "growth" | "enterprise">("growth");
  const [sandboxActionStatus, setSandboxActionStatus] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$290",
      period: "per month",
      desc: "For small remote forward teams operating single-depot clusters.",
      features: [
        "Up to 3 Forward Sites",
        "2 Fleet Transport Vehicles",
        "Belief-State Inventory Twin",
        "Baseline Demand Forecasting",
        "100 Disruption Scenario Runs / mo",
        "Community Support",
      ],
      current: false,
    },
    {
      id: "growth",
      name: "Growth",
      price: "$890",
      period: "per month",
      desc: "Comprehensive decision-support twin with multi-node disruption stress-testing.",
      features: [
        "Up to 10 Forward Sites",
        "8 Fleet Transport Vehicles",
        "1,000 Disruption Scenario Runs / mo",
        "Human Approval Workflows",
        "LoRa Telemetry Bridge & Buffer Sync",
        "ERP / SAP Supply Connector",
        "Audit Trail & CSV / PDF Exports",
      ],
      current: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Defense",
      price: "Custom",
      period: "annual contract",
      desc: "Tailored deployment for sovereign command headquarters and air-gapped infrastructure.",
      features: [
        "Unlimited Network Sites & Fleet",
        "Custom Scenario Models & Terrain Feeds",
        "Air-Gapped On-Premises Deployment",
        "Dedicated Hardware LoRa Gateways",
        "SAML / Active Directory SSO",
        "24/7 SLA Mission Critical Support",
      ],
      current: false,
    },
  ];

  const handleSimulateUpgrade = (tierName: string) => {
    setSandboxActionStatus(`Test Checkout simulated for ${tierName}. Sandbox order recorded (No real payment collected).`);
    setShowUpgradeModal(false);
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Billing & Entitlements</h1>
            <span style={{ fontSize: 11, background: "rgba(245,158,11,0.1)", color: "#b45309", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Payment Provider Sandbox Mode
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Review operational quotas, subscription entitlements, and invoice receipts.
          </p>
        </div>

        <button
          onClick={() => setShowUpgradeModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            background: "var(--fg)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}
        >
          <CreditCard size={14} /> Change Tier / Plan
        </button>
      </div>

      {sandboxActionStatus && (
        <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, fontSize: 12.5, color: "#15803d", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>✓ {sandboxActionStatus}</span>
          <button onClick={() => setSandboxActionStatus(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#15803d", fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Current Subscription Card */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 24, marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{BILLING_SUMMARY.currentTier}</span>
              <span style={{ fontSize: 11, background: "rgba(34,197,94,0.1)", color: "#15803d", fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                ACTIVE (ANNUAL)
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>
              Renewal Date: {BILLING_SUMMARY.nextBillingDate} · Configured Product Assumptions (Fictional pricing)
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{BILLING_SUMMARY.pricePerMonth}</div>
            <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{BILLING_SUMMARY.billingCycle}</div>
          </div>
        </div>

        {/* Quota Usage Meters */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 14 }}>
            Resource Entitlements & Metered Utilization
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {Object.entries(BILLING_SUMMARY.quotas).map(([k, q]) => {
              const pct = Math.round((q.used / q.total) * 100);
              return (
                <div key={k} style={{ padding: 12, background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>
                    <span>{q.label}</span>
                    <span style={{ fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                    {q.used} <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-muted)" }}>/ {q.total} {q.unit || ""}</span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? "#b45309" : "var(--fg)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tier Comparison Grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Available Tier Packages</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {plans.map(p => (
            <div
              key={p.id}
              style={{
                background: "white", borderRadius: 12, padding: 24,
                border: p.current ? "2px solid var(--fg)" : "1px solid var(--border)",
                display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</span>
                {p.current && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "var(--fg)", color: "white" }}>
                    CURRENT
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{p.price}</span>
                <span style={{ fontSize: 12, color: "var(--fg-muted)", marginLeft: 4 }}>{p.period}</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--fg-muted)", margin: "0 0 16px 0", minHeight: 36, lineHeight: 1.5 }}>
                {p.desc}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", flex: 1, display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <Check size={13} color="#15803d" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={p.current}
                onClick={() => handleSimulateUpgrade(p.name)}
                style={{
                  width: "100%", padding: "9px 0", borderRadius: 6, fontSize: 12.5, fontWeight: 700,
                  cursor: p.current ? "default" : "pointer",
                  background: p.current ? "var(--bg-secondary)" : "var(--fg)",
                  color: p.current ? "var(--fg-muted)" : "white",
                  border: "none"
                }}
              >
                {p.current ? "Subscribed Tier" : `Switch to ${p.name} (Test)`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700 }}>
          Invoice & Payment Records (Sandbox Test Receipts)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--fg-muted)" }}>
              <th style={{ padding: "10px 16px" }}>Invoice Reference</th>
              <th style={{ padding: "10px 16px" }}>Billing Date</th>
              <th style={{ padding: "10px 16px" }}>Amount</th>
              <th style={{ padding: "10px 16px" }}>Payment Status</th>
              <th style={{ padding: "10px 16px", textAlign: "right" }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {BILLING_SUMMARY.invoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{inv.id}</td>
                <td style={{ padding: "12px 16px", color: "var(--fg-muted)" }}>{inv.date}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{inv.amount}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#15803d", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 4 }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button
                    onClick={() => alert(`Downloading simulated receipt for ${inv.id}`)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg)", fontSize: 11.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    <Download size={12} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "white", borderRadius: 12, width: 440, padding: 24, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Simulated Subscription Checkout</h3>
              <button onClick={() => setShowUpgradeModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--fg-muted)", marginBottom: 16 }}>
              This environment runs in strict <strong>Sandbox Mode</strong>. No payment card will be charged.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 6, textTransform: "uppercase" }}>Select Plan</label>
              <select
                value={selectedTier}
                onChange={e => setSelectedTier(e.target.value as any)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
              >
                <option value="starter">Starter Plan ($290/mo)</option>
                <option value="growth">Growth Plan ($890/mo - Current)</option>
                <option value="enterprise">Enterprise Defense (Custom SLA)</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setShowUpgradeModal(false)}
                style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "white", fontSize: 12.5, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSimulateUpgrade(selectedTier.toUpperCase())}
                style={{ padding: "8px 18px", borderRadius: 6, background: "var(--fg)", color: "white", border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                Confirm Test Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
