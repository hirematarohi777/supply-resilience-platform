"use client";

import { useState } from "react";
import { LOCATIONS, INVENTORY_ITEMS, PLANS, AUDIT_EVENTS, DMS } from "@/lib/demoData";
import {
  FileText, Download, Printer, Shield, CheckCircle2,
  Calendar, Building2, Cpu, AlertTriangle, FileSpreadsheet, Lock
} from "lucide-react";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("inventory-freshness");
  const [includeClientNotes, setIncludeClientNotes] = useState(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  const reportTypes = [
    { id: "inventory-freshness", name: "Inventory Freshness & Uncertainty Audit", format: "CSV / PDF", records: INVENTORY_ITEMS.length, desc: "Belief-state stock levels, observation timestamps, reporting age, and confidence calibration." },
    { id: "forecast-depletion", name: "Demand Forecast & Depletion Report", format: "CSV / PDF", records: 2, desc: "Depletion projections, baseline models (Exponential Smoothing / Moving Average), and shortage horizons." },
    { id: "plan-comparison", name: "Candidate Supply Plan Comparison Dossier", format: "CSV / PDF", records: PLANS.length, desc: "Side-by-side trade-off matrix: feasibility, transit durations, cost metrics, and DMS impact." },
    { id: "robustness-report", name: "Scenario-Based Robustness Report", format: "CSV / PDF", records: 100, desc: "Monte Carlo stress-testing summary across 100 sampled disruption runs with failure modes." },
    { id: "approval-ledger", name: "Human Authorization & Audit Trail Log", format: "CSV / PDF", records: AUDIT_EVENTS.length, desc: "Tamper-evident record of approval actions, plan decisions, comments, and crypto signatures." },
  ];

  // Client-side CSV generation & download
  const handleDownloadCSV = (reportId: string) => {
    let csvContent = "";
    const timestamp = new Date().toISOString();
    const orgHeader = `# Organization: Northstar Remote Operations (Demo)\n# Generated: ${timestamp}\n# Model Version: MST-v1.4-classical\n# Synthetic Data Label: TRUE\n# Disclaimer: Demonstrative decision-support data\n\n`;

    if (reportId === "inventory-freshness") {
      csvContent = orgHeader + "Item,Location,Confirmed_Quantity,Unit,Report_Age_Min,Confidence_Score,Estimated_Quantity,Range_Low,Range_High,Source,Status\n" +
        INVENTORY_ITEMS.map(i =>
          `"${i.item}","${i.locationId}",${i.confirmed},"${i.unit}",${i.reportAge},${i.confidence},${i.estimated},${i.estimatedLow},${i.estimatedHigh},"${i.source}","${i.status}"`
        ).join("\n");
    } else if (reportId === "approval-ledger") {
      csvContent = orgHeader + "Event_ID,Timestamp,Actor,Organization,Action,Resource,Status,Hash_Signature\n" +
        AUDIT_EVENTS.map(a =>
          `"${a.id}","${a.timestamp}","${a.actor}","${a.organization}","${a.action}","${a.resource}","${a.status}","${a.hashSignature}"`
        ).join("\n");
    } else {
      csvContent = orgHeader + "Plan_ID,Name,Status,Vehicle,Feasible,Robustness_Rate,Runtime_Sec,Objective\n" +
        PLANS.map(p =>
          `"${p.id}","${p.name}","${p.status}","${p.vehicle}",${p.feasible},${p.robustnessRate},${p.runtime},"${p.objective}"`
        ).join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MST_${reportId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Operational Reports & Exports</h1>
            <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Audit-Ready Documentation
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Generate and export reproducible CSV datasets and print-friendly dossiers with cryptographic metadata stamps.
          </p>
        </div>

        <button
          onClick={() => setPrintPreviewOpen(!printPreviewOpen)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            border: "1px solid var(--border)", background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}
        >
          <Printer size={14} /> Print-Friendly Layout
        </button>
      </div>

      {/* Security & Confidentiality Disclosure */}
      <div style={{ padding: "14px 18px", background: "white", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Shield size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--fg)" }}>
            <strong>Cryptographic Export Boundary:</strong> Server-generated exports strictly exclude end-to-end encrypted private notes.
            If client-side decrypted collaboration content is appended, decryption occurs entirely inside your authorized browser runtime.
          </div>
        </div>
      </div>

      {/* Reports Catalog Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20 }}>
        {/* Catalog List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reportTypes.map((rep) => {
            const isSelected = selectedReport === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep.id)}
                style={{
                  background: "white", borderRadius: 10, padding: 18, border: "1px solid var(--border)",
                  cursor: "pointer", transition: "all 0.15s",
                  borderLeft: isSelected ? "4px solid var(--fg)" : "1px solid var(--border)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{rep.name}</div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "var(--bg-secondary)", color: "var(--fg-muted)" }}>
                    {rep.format}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--fg-muted)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                  {rep.desc}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--fg-subtle)" }}>
                  <span>Records: {rep.records} rows</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownloadCSV(rep.id); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6,
                      background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg)",
                      fontSize: 11.5, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    <Download size={12} /> Download CSV
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Report Metadata Preview */}
        <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
            Export Dossier Metadata Stamp
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
            <div>
              <div style={{ color: "var(--fg-muted)", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>Tenant / Organization</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>Northstar Remote Operations — Demo</div>
            </div>

            <div>
              <div style={{ color: "var(--fg-muted)", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>Generation Timestamp</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>Today, {new Date().toLocaleTimeString()} UTC</div>
            </div>

            <div>
              <div style={{ color: "var(--fg-muted)", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>Model & Solver Versions</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>MST Predictive Engine v1.4 · Classical MILP Solver</div>
            </div>

            <div>
              <div style={{ color: "var(--fg-muted)", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>Planning Horizon</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>5 Days Forward (DMS Target: 18.4 Days)</div>
            </div>

            <div>
              <div style={{ color: "var(--fg-muted)", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>Synthetic Data Classification</div>
              <div style={{ fontWeight: 600, color: "#1d4ed8", marginTop: 2 }}>SYNTHETIC / DEMONSTRATIVE ONLY</div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 6 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={includeClientNotes}
                  onChange={e => setIncludeClientNotes(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>
                  Include client-side decrypted commander notes (Requires master browser passphrase confirmation)
                </span>
              </label>
            </div>

            <button
              onClick={() => handleDownloadCSV(selectedReport)}
              style={{
                width: "100%", padding: "10px", borderRadius: 8, background: "var(--fg)", color: "white",
                border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10
              }}
            >
              <Download size={14} /> Export Selected Dataset (.csv)
            </button>
          </div>
        </div>
      </div>

      {/* Print Preview Layout Modal */}
      {printPreviewOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "white", borderRadius: 12, width: 750, maxHeight: "90vh", overflowY: "auto", padding: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--fg)", paddingBottom: 14, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>MISSION-SUSTAINABILITY TWIN (MST)</h2>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>Official Decision-Support Executive Summary</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "var(--fg-muted)" }}>
                <div>Org: Northstar Remote Operations (Demo)</div>
                <div>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: 20, fontSize: 12.5, lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, marginBottom: 6, textTransform: "uppercase", fontSize: 11, color: "var(--fg-muted)" }}>Executive Status Snapshot</div>
              <div>• <strong>Current Days of Operational Continuity (DMS):</strong> {DMS} Days</div>
              <div>• <strong>Critical Shortage Alert:</strong> Lake Site Generator Fuel projected to breach 100L reserve threshold in 3–5 days.</div>
              <div>• <strong>Recommended Action:</strong> Authorize Plan P-041 (Truck Alpha sortie via Route A).</div>
              <div>• <strong>Corridor Constraint:</strong> Canyon corridor Route B remains blocked; detour via high pass confirmed.</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, textTransform: "uppercase", fontSize: 11, color: "var(--fg-muted)" }}>Monitored Site Stock Overview</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: 4 }}>Item</th>
                    <th style={{ padding: 4 }}>Location</th>
                    <th style={{ padding: 4 }}>Confirmed</th>
                    <th style={{ padding: 4 }}>Estimated</th>
                    <th style={{ padding: 4 }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {INVENTORY_ITEMS.slice(0, 6).map(i => (
                    <tr key={i.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: 4 }}>{i.item}</td>
                      <td style={{ padding: 4 }}>{i.locationId}</td>
                      <td style={{ padding: 4 }}>{i.confirmed} {i.unit}</td>
                      <td style={{ padding: 4 }}>{i.estimated} {i.unit}</td>
                      <td style={{ padding: 4 }}>{i.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: "10px 14px", background: "var(--bg)", borderRadius: 6, fontSize: 11, color: "var(--fg-muted)", marginBottom: 20 }}>
              Synthetic demonstration dataset. Prepared for authorized decision-maker review under Human-in-the-Loop policy.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setPrintPreviewOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "white", fontSize: 12.5, cursor: "pointer" }}
              >
                Close Preview
              </button>
              <button
                onClick={() => { window.print(); }}
                style={{ padding: "8px 18px", borderRadius: 6, background: "var(--fg)", color: "white", border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Printer size={13} /> Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
