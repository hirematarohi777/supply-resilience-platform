"use client";

import { useState } from "react";
import { DEPENDENCY_NODES, DMS } from "@/lib/demoData";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";

const EDGES = [
  { from: "fuel", to: "generator" },
  { from: "batteries", to: "sensors" },
  { from: "generator", to: "comms" },
  { from: "generator", to: "cold-storage" },
  { from: "sensors", to: "reporting" },
  { from: "comms", to: "reporting" },
  { from: "cold-storage", to: "operations" },
  { from: "reporting", to: "operations" },
];

// Layout positions
const POSITIONS: Record<string, { x: number; y: number }> = {
  fuel: { x: 80, y: 160 },
  batteries: { x: 80, y: 280 },
  generator: { x: 220, y: 120 },
  sensors: { x: 220, y: 280 },
  comms: { x: 360, y: 80 },
  "cold-storage": { x: 360, y: 200 },
  reporting: { x: 360, y: 310 },
  operations: { x: 500, y: 200 },
};

const NODE_STATUS: Record<string, "ok"|"warn"|"critical"> = {
  fuel: "warn",
  batteries: "ok",
  generator: "ok",
  sensors: "ok",
  comms: "ok",
  "cold-storage": "ok",
  reporting: "warn",
  operations: "warn",
};

const STATUS_COLORS = { ok: "#22c55e", warn: "#f59e0b", critical: "#ef4444" };
const STATUS_BG = { ok: "rgba(34,197,94,0.12)", warn: "rgba(245,158,11,0.12)", critical: "rgba(239,68,68,0.12)" };
const NODE_TYPES: Record<string, string> = { resource: "Resource", capability: "Capability" };

export default function DependenciesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedNode = selected ? DEPENDENCY_NODES.find(n => n.id === selected) : null;

  return (
    <div style={{ padding: "32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Mission Dependency Graph</h1>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Supply-to-capability dependencies and cascade-risk analysis</p>
        </div>
        <div style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.06)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Estimated DMS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#b45309", letterSpacing: "-0.04em" }}>{DMS} days</div>
          <div style={{ fontSize: 10, color: "#b45309", marginTop: 2 }}>Until first threshold breach</div>
        </div>
      </div>

      {/* DMS definition */}
      <div style={{ marginBottom: 20, padding: "12px 16px", background: "var(--bg-secondary)", borderRadius: 8, fontSize: 12, color: "var(--fg-muted)", display: "flex", gap: 8 }}>
        <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Days of Mission Sustainability (DMS)</strong> — Prototype definition: the estimated time until the first configured critical capability crosses its failure threshold, based on current inventory estimates and demand forecasts. This is not a guarantee of real-world readiness and applies only within the modeled forecast horizon.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Graph */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            Click a node to inspect its dependencies and impact
          </div>
          <svg width="100%" viewBox="0 0 600 380" style={{ overflow: "visible" }}>
            <defs>
              <pattern id="depgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
              </pattern>
              <marker id="darrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#C8C3BB" />
              </marker>
            </defs>
            <rect width="600" height="380" fill="url(#depgrid)" rx="10" />

            {/* Edges */}
            {EDGES.map((e, i) => {
              const a = POSITIONS[e.from], b = POSITIONS[e.to];
              const isRelated = selected && (selected === e.from || selected === e.to);
              return (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isRelated ? "#0A0A0A" : "#C8C3BB"}
                  strokeWidth={isRelated ? 2 : 1.5}
                  markerEnd="url(#darrow)"
                  style={{ transition: "all 0.2s" }}
                />
              );
            })}

            {/* Nodes */}
            {DEPENDENCY_NODES.map(node => {
              const pos = POSITIONS[node.id];
              const status = NODE_STATUS[node.id] || "ok";
              const col = STATUS_COLORS[status];
              const isSelected = selected === node.id;
              return (
                <g key={node.id} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : node.id)}>
                  {isSelected && <circle cx={pos.x} cy={pos.y} r={34} fill={col} opacity={0.08} />}
                  <circle cx={pos.x} cy={pos.y} r={24}
                    fill={isSelected ? col : "white"}
                    stroke={col} strokeWidth={2}
                    style={{ transition: "all 0.2s", filter: isSelected ? `drop-shadow(0 4px 12px ${col}55)` : "none" }}
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={isSelected ? "white" : "#6B6B6B"}
                    style={{ userSelect: "none" }}
                  >{node.label.split(" ").map((w, i) => (
                    <tspan key={i} x={pos.x} dy={i === 0 ? (node.label.includes(" ") ? -4 : 0) : 11}>{w}</tspan>
                  ))}</text>
                  {/* Type indicator */}
                  <text x={pos.x} y={pos.y + 32} textAnchor="middle" fontSize={8} fill={col} fontWeight={600} style={{ userSelect: "none" }}>
                    {NODE_TYPES[node.type] || node.type}
                  </text>
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "var(--fg-muted)" }}>
            {Object.entries(STATUS_COLORS).map(([k, v]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v }} />
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </span>
            ))}
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 1, border: "1.5px solid #9B9B9B" }} /> Resource
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid #9B9B9B" }} /> Capability
            </span>
          </div>
        </div>

        {/* Inspector panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selectedNode ? (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Node Inspector</div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", marginBottom: 4 }}>{selectedNode.label}</div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase",
                background: STATUS_BG[NODE_STATUS[selectedNode.id] || "ok"],
                color: STATUS_COLORS[NODE_STATUS[selectedNode.id] || "ok"]
              }}>{NODE_STATUS[selectedNode.id] || "ok"}</span>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4 }}>Current Estimate</div>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>{(selectedNode as any).currentEst} {(selectedNode as any).unit}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4 }}>Failure Threshold</div>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#ef4444" }}>{selectedNode.threshold} {(selectedNode as any).unit}</div>
                </div>
                {(selectedNode as any).dependencies && (
                  <div style={{ padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 8 }}>Required Resources</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(selectedNode as any).dependencies.map((dep: string) => {
                        const depNode = DEPENDENCY_NODES.find(n => n.id === dep);
                        const status = NODE_STATUS[dep] || "ok";
                        return (
                          <div key={dep} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[status], flexShrink: 0 }} />
                            <span>{depNode?.label ?? dep}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {(selectedNode as any).locationId && (
                  <div style={{ padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4 }}>Source Location</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{(selectedNode as any).locationId}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 20, textAlign: "center", color: "var(--fg-muted)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>↖</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Select a node</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Click any node in the graph to inspect its dependencies and operational impact</div>
            </div>
          )}

          {/* DMS breakdown */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>DMS Breakdown</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { cap: "Generator Power", days: 18.4, status: "warn" },
                { cap: "Cold Storage", days: 22.1, status: "ok" },
                { cap: "Communications", days: 20.3, status: "ok" },
                { cap: "Inv. Reporting", days: 18.4, status: "warn" },
                { cap: "Site Operations", days: 18.4, status: "warn" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[c.status as "ok"|"warn"|"critical"], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{c.cap}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLORS[c.status as "ok"|"warn"|"critical"] }}>{c.days}d</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--fg-subtle)", lineHeight: 1.6 }}>
              DMS = minimum across critical capabilities. Driven by fuel forecast at Ridge Site.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
