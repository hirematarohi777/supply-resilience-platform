"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle, CheckCircle2, Clock, TrendingDown, Activity,
  ArrowRight, RefreshCw, Shield, ChevronRight, Zap, Info,
  Package, GitBranch, ClipboardList, FlaskConical
} from "lucide-react";
import { LOCATIONS, INVENTORY_ITEMS, ALERTS, PLANS, DMS } from "@/lib/demoData";

function MetricCard({ label, value, sub, status, icon, href }: {
  label: string; value: string; sub: string; status?: "ok"|"warn"|"critical"; icon: React.ReactNode; href?: string;
}) {
  const colors = { ok: "#22c55e", warn: "#f59e0b", critical: "#ef4444" };
  const bgs = { ok: "rgba(34,197,94,0.08)", warn: "rgba(245,158,11,0.08)", critical: "rgba(239,68,68,0.08)" };
  const borders = { ok: "rgba(34,197,94,0.2)", warn: "rgba(245,158,11,0.2)", critical: "rgba(239,68,68,0.2)" };
  const col = status ? colors[status] : "var(--fg-muted)";
  const bg = status ? bgs[status] : "white";
  const border = status ? borders[status] : "var(--border)";

  return (
    <div style={{ background: "white", borderRadius: 16, border: `1px solid ${border}`, padding: "20px 24px", position: "relative", overflow: "hidden", transition: "all 0.2s" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: status ? col : "transparent", borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <div style={{ color: col }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: status ? col : "var(--fg)", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{sub}</div>
      {href && (
        <Link href={href} style={{ position: "absolute", bottom: 16, right: 16, fontSize: 11, color: "var(--fg-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
          Details <ChevronRight size={10} />
        </Link>
      )}
    </div>
  );
}

function AlertRow({ alert }: { alert: typeof ALERTS[0] }) {
  const colors = { critical: "#dc2626", high: "#b45309", medium: "#1d4ed8", low: "#15803d" };
  const bgs = { critical: "rgba(239,68,68,0.08)", high: "rgba(245,158,11,0.08)", medium: "rgba(59,130,246,0.08)", low: "rgba(34,197,94,0.08)" };
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors[alert.severity as keyof typeof colors], flexShrink: 0, marginTop: 6 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors[alert.severity as keyof typeof colors], background: bgs[alert.severity as keyof typeof bgs], padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{alert.severity}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{alert.type}</span>
          {alert.acknowledged && <span style={{ fontSize: 11, color: "var(--fg-subtle)" }}>· Acknowledged</span>}
        </div>
        <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{alert.entity} — {alert.message}</div>
      </div>
      <span style={{ fontSize: 11, color: "var(--fg-subtle)", whiteSpace: "nowrap" }}>{alert.time}</span>
    </div>
  );
}

// Schematic map SVG
function NetworkMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const positions: Record<string, { x: number; y: number }> = {
    depot: { x: 200, y: 200 },
    ridge: { x: 340, y: 80 },
    valley: { x: 340, y: 240 },
    lake: { x: 100, y: 300 },
    forest: { x: 80, y: 120 },
  };
  const routes = [
    { from: "depot", to: "ridge", open: true },
    { from: "depot", to: "valley", open: true },
    { from: "depot", to: "lake", open: false }, // Route B closed
    { from: "depot", to: "forest", open: true },
    { from: "ridge", to: "valley", open: true },
  ];
  const statusColors: Record<string, string> = { operational: "#22c55e", warning: "#f59e0b", alert: "#ef4444", stale: "#9b9b9b" };

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 20, height: 380 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Network Overview</span>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--fg-muted)", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 2, background: "#22c55e" }} /> Open route
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, borderTop: "2px dashed #ef4444", height: 0 }} /> Closed
          </span>
        </div>
      </div>
      <svg width="100%" viewBox="0 0 440 310" style={{ overflow: "visible" }}>
        <defs>
          <pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="440" height="310" fill="url(#mapgrid)" rx="8" />

        {/* Routes */}
        {routes.map((r, i) => {
          const a = positions[r.from], b = positions[r.to];
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={r.open ? "#C8C3BB" : "#ef4444"}
              strokeWidth={r.open ? 1.5 : 1.5}
              strokeDasharray={r.open ? "none" : "6,4"}
              opacity={0.7}
            />
          );
        })}

        {/* Nodes */}
        {LOCATIONS.map((loc) => {
          const pos = positions[loc.id];
          if (!pos) return null;
          const isDepot = loc.type === "depot";
          const col = statusColors[loc.status] || "#9b9b9b";
          const isHov = hovered === loc.id;
          return (
            <g key={loc.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(loc.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHov && <circle cx={pos.x} cy={pos.y} r={isDepot ? 28 : 22} fill={col} opacity={0.1} />}
              <circle cx={pos.x} cy={pos.y} r={isDepot ? 18 : 13}
                fill={isHov ? col : "white"}
                stroke={col} strokeWidth={2}
                style={{ transition: "all 0.2s" }}
              />
              {isDepot && (
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={isHov ? "white" : col}>HQ</text>
              )}
              <text x={pos.x} y={pos.y + (isDepot ? 30 : 26)} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--fg)">{loc.name}</text>
              <text x={pos.x} y={pos.y + (isDepot ? 42 : 37)} textAnchor="middle" fontSize={9} fill="var(--fg-muted)">{loc.lastReport}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        {Object.entries({ operational: "#22c55e", warning: "#f59e0b", alert: "#ef4444", stale: "#9b9b9b" }).map(([k, v]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--fg-muted)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v }} />
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const pendingApprovals = PLANS.filter(p => p.status === "pending-approval").length;
  const criticalAlerts = ALERTS.filter(a => !a.acknowledged && (a.severity === "critical" || a.severity === "high")).length;
  const staleLocations = LOCATIONS.filter(l => l.status === "stale").length;

  return (
    <div style={{ padding: "32px 32px", maxWidth: 1200 }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Overview</h1>
          <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Northstar Remote Operations — Demo · {time.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", color: "var(--fg-muted)" }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}>
            Demo · Synthetic data
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricCard
          label="Days of Continuity (DMS)" value={`${DMS}d`} sub="Estimated until first critical threshold"
          status="warn" icon={<Activity size={18} />} href="/app/dependencies"
        />
        <MetricCard
          label="Active Alerts" value={`${criticalAlerts}`} sub={`${ALERTS.filter(a => !a.acknowledged).length} unacknowledged`}
          status="critical" icon={<AlertTriangle size={18} />} href="/app/alerts"
        />
        <MetricCard
          label="Pending Approvals" value={`${pendingApprovals}`} sub="Plans awaiting authorized review"
          status={pendingApprovals > 0 ? "warn" : "ok"} icon={<CheckCircle2 size={18} />} href="/app/approvals"
        />
        <MetricCard
          label="Stale Reports" value={`${staleLocations}`} sub="Locations with reports > 6h old"
          status={staleLocations > 0 ? "warn" : "ok"} icon={<Clock size={18} />} href="/app/inventory"
        />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <NetworkMap />

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Active alerts */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 24px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Priority Alerts</span>
              <Link href="/app/alerts" style={{ fontSize: 12, color: "var(--fg-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>All alerts <ChevronRight size={11} /></Link>
            </div>
            <div>
              {ALERTS.filter(a => !a.acknowledged).map(a => <AlertRow key={a.id} alert={a} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Recent plans */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Recent Plans</span>
            <Link href="/app/approvals" style={{ fontSize: 12, color: "var(--fg-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>View all <ChevronRight size={11} /></Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PLANS.map(p => (
              <div key={p.id} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--fg-muted)" }}>{p.id}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase",
                    background: p.status === "pending-approval" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
                    color: p.status === "pending-approval" ? "#b45309" : "#15803d"
                  }}>{p.status === "pending-approval" ? "Pending" : "Approved"}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>{p.vehicle} · {p.created}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory freshness */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Data Freshness</span>
            <Link href="/app/inventory" style={{ fontSize: 12, color: "var(--fg-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>Inventory <ChevronRight size={11} /></Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LOCATIONS.map(loc => {
              const bar = Math.max(5, Math.min(100, 100 - (loc.reportAge / 480) * 100));
              const barColor = loc.status === "stale" ? "#9b9b9b" : loc.status === "alert" ? "#ef4444" : loc.status === "warning" ? "#f59e0b" : "#22c55e";
              return (
                <div key={loc.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 500 }}>{loc.name}</span>
                    <span style={{ color: "var(--fg-muted)" }}>{loc.confidence}% · {loc.lastReport}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${bar}%`, background: barColor, borderRadius: 2, transition: "width 1s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, padding: "10px 12px", background: "var(--bg)", borderRadius: 8, fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.6 }}>
            <Info size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Data quality reflects report age and source reliability. Stale estimates have expanded uncertainty ranges.
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { href: "/app/inventory", label: "Log inventory observation", icon: <Package size={14} />, desc: "Manual entry or CSV import" },
              { href: "/app/forecasts", label: "Run demand forecast", icon: <TrendingDown size={14} />, desc: "Select location and horizon" },
              { href: "/app/planning", label: "Build a plan", icon: <ClipboardList size={14} />, desc: "10-step guided workflow" },
              { href: "/app/scenarios", label: "Run scenario test", icon: <FlaskConical size={14} />, desc: "Disruption stress testing" },
              { href: "/app/approvals", label: "Review pending approvals", icon: <CheckCircle2 size={14} />, desc: `${pendingApprovals} awaiting decision` },
            ].map((a, i) => (
              <Link key={i} href={a.href} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                border: "1px solid var(--border)", background: "var(--bg)", textDecoration: "none",
                transition: "all 0.15s"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "white", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{a.desc}</div>
                </div>
                <ChevronRight size={12} color="var(--fg-subtle)" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
