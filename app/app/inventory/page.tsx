"use client";

import { useState } from "react";
import { INVENTORY_ITEMS, LOCATIONS } from "@/lib/demoData";
import { Package, AlertTriangle, CheckCircle2, Clock, Plus, Upload, ChevronDown, Info, Filter } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    fresh: { label: "Fresh", cls: "badge-green" },
    warning: { label: "Aging", cls: "badge-amber" },
    stale: { label: "Stale", cls: "badge-gray" },
    critical: { label: "Critical", cls: "badge-red" },
  };
  const { label, cls } = map[status] || { label: status, cls: "badge-gray" };
  return <span className={cls} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? "#22c55e" : value >= 75 ? "#f59e0b" : "#9b9b9b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 56, height: 4, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: "var(--fg-muted)", fontWeight: 500 }}>{value}%</span>
    </div>
  );
}

export default function InventoryPage() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ["all", "fuel", "water", "batteries", "maintenance", "filters"];
  const locations = ["all", ...LOCATIONS.map(l => l.id)];
  const statuses = ["all", "fresh", "warning", "stale", "critical"];

  const filtered = INVENTORY_ITEMS.filter(i =>
    (filterCategory === "all" || i.category === filterCategory) &&
    (filterLocation === "all" || i.locationId === filterLocation) &&
    (filterStatus === "all" || i.status === filterStatus)
  );

  const getLocName = (id: string) => LOCATIONS.find(l => l.id === id)?.name ?? id;

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Inventory Twin</h1>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Uncertainty-aware inventory state · Confirmed observations and model estimates</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowAddForm(!showAddForm)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            <Upload size={13} /> Import CSV
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, background: "var(--fg)", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            <Plus size={13} /> Log observation
          </button>
        </div>
      </div>

      {/* Add observation panel */}
      {showAddForm && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Log New Observation</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
            {["Location", "Item", "Quantity", "Unit", "Source"].map(f => (
              <div key={f}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--fg-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f}</label>
                <input placeholder={f} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 13, outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowAddForm(false)} style={{ padding: "8px 16px", borderRadius: 8, background: "var(--fg)", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
              Submit observation
            </button>
            <button onClick={() => setShowAddForm(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 12 }}>
            <Info size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
            Observation will be timestamped on submission. Provenance and original timestamp are preserved. Model estimates will not replace this confirmed value.
          </p>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <Filter size={13} color="var(--fg-muted)" />
        {[
          { label: "Category", value: filterCategory, set: setFilterCategory, opts: categories },
          { label: "Location", value: filterLocation, set: setFilterLocation, opts: locations },
          { label: "Status", value: filterStatus, set: setFilterStatus, opts: statuses },
        ].map(f => (
          <select key={f.label}
            value={f.value} onChange={e => f.set(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "white", fontSize: 12, cursor: "pointer", outline: "none" }}
          >
            {f.opts.map(o => (
              <option key={o} value={o}>{o === "all" ? `All ${f.label}` : f.label === "Location" ? getLocName(o) : o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        ))}
        <span style={{ fontSize: 12, color: "var(--fg-muted)", marginLeft: 8 }}>{filtered.length} items</span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 8, fontSize: 11, color: "var(--fg-muted)", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#0A0A0A" }} />
          <span>Confirmed observation</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, border: "1.5px dashed #3b82f6", background: "rgba(59,130,246,0.1)" }} />
          <span>Model estimate (range)</span>
        </div>
        <span>· Provenance always preserved · Original timestamps retained</span>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
              {["Item", "Location", "Confirmed Qty", "Estimated Range", "Last Observed", "Report Age", "Source", "Data Quality", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} style={{
                borderBottom: "1px solid var(--border)",
                background: item.status === "stale" ? "rgba(155,155,155,0.03)" : item.status === "critical" ? "rgba(239,68,68,0.02)" : "white",
                transition: "background 0.15s"
              }}>
                <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: 13 }}>{item.item}</td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{getLocName(item.locationId)}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{item.confirmed.toLocaleString()} {item.unit}</span>
                  <div style={{ fontSize: 10, color: "var(--fg-subtle)", marginTop: 1 }}>Confirmed</div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 12, color: "#1d4ed8", fontFamily: "monospace" }}>
                    {item.estimatedLow}–{item.estimatedHigh} {item.unit}
                  </span>
                  <div style={{ fontSize: 10, color: "var(--fg-subtle)", marginTop: 1 }}>Model estimate</div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--fg-muted)" }}>{item.lastObserved}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 12, color: item.reportAge > 360 ? "#dc2626" : item.reportAge > 120 ? "#b45309" : "var(--fg-muted)" }}>
                    {item.reportAge < 60 ? `${item.reportAge}m` : `${Math.round(item.reportAge / 60)}h`}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--fg-muted)", textTransform: "capitalize" }}>{item.source}</td>
                <td style={{ padding: "12px 14px" }}><ConfidenceBar value={item.confidence} /></td>
                <td style={{ padding: "12px 14px" }}><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warning note */}
      <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(245,158,11,0.06)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.15)", fontSize: 12, color: "#b45309", display: "flex", gap: 8 }}>
        <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Ridge Site reports are 7h old.</strong> Uncertainty ranges have expanded. Fresh observations will narrow estimates. Forecasts for Ridge Site are based on extrapolation — treat with increased caution.
        </span>
      </div>
    </div>
  );
}
