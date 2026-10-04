"use client";

import { useState } from "react";
import { ALERTS } from "@/lib/demoData";
import { Bell, AlertTriangle, CheckCircle2, Info, Clock, ChevronRight } from "lucide-react";

const SEV_CONFIG: Record<string, { bg: string; color: string; border: string }> = {
  critical: { bg: "rgba(239,68,68,0.06)", color: "#dc2626", border: "rgba(239,68,68,0.2)" },
  high: { bg: "rgba(245,158,11,0.06)", color: "#b45309", border: "rgba(245,158,11,0.2)" },
  medium: { bg: "rgba(59,130,246,0.06)", color: "#1d4ed8", border: "rgba(59,130,246,0.2)" },
  low: { bg: "rgba(34,197,94,0.06)", color: "#15803d", border: "rgba(34,197,94,0.2)" },
};

export default function AlertsPage() {
  const [acknowledged, setAcknowledged] = useState<string[]>(
    ALERTS.filter(a => a.acknowledged).map(a => a.id)
  );

  const ack = (id: string) => setAcknowledged(prev => [...prev, id]);
  const unack = (id: string) => setAcknowledged(prev => prev.filter(x => x !== id));

  const unacknowledged = ALERTS.filter(a => !acknowledged.includes(a.id));
  const acknowledgedList = ALERTS.filter(a => acknowledged.includes(a.id));

  return (
    <div style={{ padding: "32px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Alerts</h1>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>{unacknowledged.length} active · {acknowledgedList.length} acknowledged</p>
        </div>
        <button onClick={() => setAcknowledged(ALERTS.map(a => a.id))}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
          Acknowledge all
        </button>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {(["critical", "high", "medium", "low"] as const).map(sev => {
          const count = unacknowledged.filter(a => a.severity === sev).length;
          const cfg = SEV_CONFIG[sev];
          return (
            <div key={sev} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${cfg.border}`, background: cfg.bg }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: cfg.color, letterSpacing: "-0.04em" }}>{count}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color, textTransform: "capitalize" }}>{sev}</div>
            </div>
          );
        })}
      </div>

      {/* Active alerts */}
      {unacknowledged.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Active Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {unacknowledged.map(alert => {
              const cfg = SEV_CONFIG[alert.severity];
              return (
                <div key={alert.id} style={{ background: "white", borderRadius: 12, border: `1px solid ${cfg.border}`, padding: "16px 18px", display: "flex", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertTriangle size={16} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: cfg.color, background: cfg.bg, padding: "2px 7px", borderRadius: 4 }}>{alert.severity}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{alert.type}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{alert.entity}</div>
                    <div style={{ fontSize: 12, color: "var(--fg-muted)", marginBottom: 8 }}>{alert.message}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-subtle)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} /> {alert.time}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    <button onClick={() => ack(alert.id)}
                      style={{ padding: "6px 12px", borderRadius: 6, background: "var(--fg)", color: "white", border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Acknowledge
                    </button>
                    <button style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "white", fontSize: 11, cursor: "pointer", color: "var(--fg-muted)" }}>
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Acknowledged */}
      {acknowledgedList.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Acknowledged</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {acknowledgedList.map(alert => (
              <div key={alert.id} style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, opacity: 0.7 }}>
                <CheckCircle2 size={14} color="#22c55e" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{alert.type}</span>
                  <span style={{ fontSize: 12, color: "var(--fg-muted)" }}> — {alert.entity}</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{alert.time}</span>
                <button onClick={() => unack(alert.id)} style={{ fontSize: 11, color: "var(--fg-subtle)", background: "none", border: "none", cursor: "pointer" }}>Undo</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
