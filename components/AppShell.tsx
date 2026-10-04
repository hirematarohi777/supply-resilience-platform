"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Network, Package, TrendingUp, GitBranch,
  ClipboardList, FlaskConical, BarChart2, CheckSquare,
  Radio, Bell, FileText, Users, Plug, CreditCard, ShieldCheck,
  Settings, ChevronDown, Activity, LogOut, Menu, X,
  Building2, ChevronRight
} from "lucide-react";

const NAV = [
  {
    group: "Workspace",
    items: [
      { href: "/app", label: "Overview", icon: LayoutDashboard },
      { href: "/app/network", label: "Network & Locations", icon: Network },
      { href: "/app/inventory", label: "Inventory Twin", icon: Package },
      { href: "/app/forecasts", label: "Forecasts", icon: TrendingUp },
      { href: "/app/dependencies", label: "Dependency Graph", icon: GitBranch },
    ],
  },
  {
    group: "Planning",
    items: [
      { href: "/app/planning", label: "Plan Builder", icon: ClipboardList },
      { href: "/app/scenarios", label: "Scenario Lab", icon: FlaskConical },
      { href: "/app/comparison", label: "Plan Comparison", icon: BarChart2 },
      { href: "/app/approvals", label: "Approvals", icon: CheckSquare },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/app/telemetry", label: "Telemetry & Sync", icon: Radio },
      { href: "/app/alerts", label: "Alerts", icon: Bell },
      { href: "/app/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    group: "Administration",
    items: [
      { href: "/app/team", label: "Team & Roles", icon: Users },
      { href: "/app/integrations", label: "Integrations", icon: Plug },
      { href: "/app/billing", label: "Billing", icon: CreditCard },
      { href: "/app/security", label: "Security & Audit", icon: ShieldCheck },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={14} color="white" />
          </div>
          {sidebarOpen && (
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: "var(--fg)" }}>
              MST <span style={{ fontWeight: 400, color: "var(--fg-muted)" }}>Platform</span>
            </span>
          )}
        </Link>
      </div>

      {/* Org switcher */}
      {sidebarOpen && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
            borderRadius: 8, background: "var(--bg-secondary)", cursor: "pointer",
            border: "1px solid var(--border)"
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: "var(--fg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Building2 size={11} color="white" />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1, color: "var(--fg)" }}>Northstar Demo</span>
            <ChevronDown size={12} color="var(--fg-muted)" />
          </div>
          <div style={{ fontSize: 10.5, color: "var(--fg-subtle)", marginTop: 4, paddingLeft: 2 }}>
            Demo workspace · Synthetic data
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {NAV.map((section) => (
          <div key={section.group} style={{ marginBottom: 4 }}>
            {sidebarOpen && (
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.07em", padding: "8px 8px 4px" }}>
                {section.group}
              </div>
            )}
            {section.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`sidebar-item${active ? " active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  title={!sidebarOpen ? item.label : undefined}
                  style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {sidebarOpen && item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
          borderRadius: 8, cursor: "pointer", transition: "background 0.15s"
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "var(--fg)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            fontSize: 11, fontWeight: 700, color: "white"
          }}>AD</div>
          {sidebarOpen && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin Demo</div>
              <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>Owner</div>
            </div>
          )}
          {sidebarOpen && <LogOut size={13} color="var(--fg-muted)" />}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 56, flexShrink: 0,
        background: "white", borderRight: "1px solid var(--border)",
        transition: "width 0.3s ease", overflow: "hidden",
        display: "flex", flexDirection: "column",
        position: "relative"
      }}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)",
            width: 24, height: 24, borderRadius: "50%", background: "white",
            border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 10
          }}
          aria-label="Toggle sidebar"
        >
          <ChevronRight size={12} style={{ transform: sidebarOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{
          height: 52, borderBottom: "1px solid var(--border)", background: "white",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 12, flexShrink: 0
        }}>
          {/* Breadcrumb */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--fg-muted)" }}>
            <Activity size={13} />
            <span>MST</span>
            <ChevronRight size={12} />
            <span style={{ color: "var(--fg)", fontWeight: 500 }}>
              {NAV.flatMap(s => s.items).find(i => i.href === pathname)?.label ?? "Dashboard"}
            </span>
          </div>

          {/* Alerts badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
            borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
            cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#dc2626"
          }}>
            <Bell size={12} />
            3 alerts
          </div>

          {/* Demo badge */}
          <div style={{
            padding: "5px 10px", borderRadius: 6, background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, fontWeight: 600, color: "#1d4ed8"
          }}>
            Demo mode · Synthetic data
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
