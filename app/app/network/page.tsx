"use client";

import { useState } from "react";
import { LOCATIONS, ROUTES, INVENTORY_ITEMS, VEHICLES } from "@/lib/demoData";
import {
  Network, MapPin, Plus, Filter, Table as TableIcon, Map as MapIcon,
  Clock, ShieldAlert, CheckCircle2, AlertTriangle, Truck, Compass,
  X, Info, ArrowRight, CornerDownRight, Activity
} from "lucide-react";

export default function NetworkPage() {
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>("ridge");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sites, setSites] = useState(LOCATIONS);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteType, setNewSiteType] = useState<"depot" | "forward">("forward");

  const filteredSites = sites.filter(s =>
    statusFilter === "all" || s.status === statusFilter
  );

  const selectedLocation = sites.find(s => s.id === selectedLocationId);
  const selectedInventory = INVENTORY_ITEMS.filter(i => i.locationId === selectedLocationId);
  const selectedVehicles = VEHICLES.filter(v =>
    v.location.toLowerCase().includes(selectedLocation?.name.toLowerCase() || "") ||
    (selectedLocationId === "depot" && v.location === "depot")
  );
  const connectedRoutes = ROUTES.filter(r =>
    r.fromId === selectedLocationId || r.toId === selectedLocationId
  );

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;
    const newId = newSiteName.toLowerCase().replace(/\s+/g, "-");
    const createdSite = {
      id: newId,
      name: newSiteName,
      type: newSiteType,
      status: "operational",
      lat: 48.0 + Math.random() * 0.5,
      lng: 16.0 + Math.random() * 0.8,
      lastReport: "Just now",
      reportAge: 1,
      confidence: 99
    };
    setSites(prev => [...prev, createdSite]);
    setSelectedLocationId(newId);
    setShowAddModal(false);
    setNewSiteName("");
  };

  const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
    operational: { bg: "rgba(34,197,94,0.1)", color: "#15803d", label: "Operational" },
    warning: { bg: "rgba(245,158,11,0.1)", color: "#b45309", label: "Aging / Warning" },
    stale: { bg: "rgba(107,114,128,0.1)", color: "#4b5563", label: "Stale Telemetry" },
    alert: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", label: "Shortage Alert" },
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1300 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Network & Locations</h1>
            <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Fictional Operational Grid
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Depots, forward sustainability nodes, route access corridors, and transport availability.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", background: "white", borderRadius: 8, border: "1px solid var(--border)", padding: 2 }}>
            <button
              onClick={() => setViewMode("map")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6,
                background: viewMode === "map" ? "var(--fg)" : "transparent",
                color: viewMode === "map" ? "white" : "var(--fg-muted)",
                border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}
            >
              <MapIcon size={13} /> Schematic Map
            </button>
            <button
              onClick={() => setViewMode("table")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6,
                background: viewMode === "table" ? "var(--fg)" : "transparent",
                color: viewMode === "table" ? "white" : "var(--fg-muted)",
                border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}
            >
              <TableIcon size={13} /> Table View
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
              background: "var(--fg)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}
          >
            <Plus size={14} /> Add Fictional Site
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-muted)" }}>
          <Filter size={13} /> Filter Status:
        </div>
        {["all", "operational", "stale", "warning", "alert"].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
              textTransform: "capitalize", cursor: "pointer",
              border: statusFilter === st ? "1px solid var(--fg)" : "1px solid var(--border)",
              background: statusFilter === st ? "var(--fg)" : "white",
              color: statusFilter === st ? "white" : "var(--fg-muted)"
            }}
          >
            {st}
          </button>
        ))}
        <span style={{ fontSize: 11, color: "var(--fg-subtle)", marginLeft: "auto" }}>
          Showing {filteredSites.length} of {sites.length} sites
        </span>
      </div>

      {/* Main Grid: Visual Map / Table + Detail Drawer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        {/* Left Side: Map or Table */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20, minHeight: 520 }}>
          {viewMode === "map" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Tactical Grid Coordinates (Synthetic Demo)</span>
                <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--fg-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 14, height: 2, background: "#22c55e" }} /> Passable Route
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 14, height: 2, background: "#f59e0b" }} /> Degraded Pass
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 14, borderTop: "2px dashed #ef4444", height: 0 }} /> Route Closed
                  </span>
                </div>
              </div>

              <div style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: 12, position: "relative" }}>
                <svg width="100%" height="420" viewBox="0 0 650 420" style={{ overflow: "visible" }}>
                  <defs>
                    <pattern id="netgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="650" height="420" fill="url(#netgrid)" rx="8" />

                  {/* Route lines */}
                  {ROUTES.map((route) => {
                    const fromPos: Record<string, [number, number]> = {
                      depot: [120, 210],
                      ridge: [320, 90],
                      valley: [480, 240],
                      lake: [280, 340],
                      forest: [160, 80],
                    };
                    const p1 = fromPos[route.fromId] || [100, 100];
                    const p2 = fromPos[route.toId] || [200, 200];
                    const color = route.status === "open" ? "#22c55e" : route.status === "degraded" ? "#f59e0b" : "#ef4444";
                    const isSelected = selectedLocationId === route.fromId || selectedLocationId === route.toId;

                    return (
                      <g key={route.id}>
                        <line
                          x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                          stroke={color}
                          strokeWidth={isSelected ? 3 : 1.8}
                          strokeDasharray={route.status === "closed" ? "5 4" : "none"}
                          opacity={isSelected ? 1 : 0.6}
                        />
                        {/* Route label midpoint */}
                        <circle cx={(p1[0] + p2[0]) / 2} cy={(p1[1] + p2[1]) / 2} r="10" fill="white" stroke={color} strokeWidth="1.5" />
                        <text
                          x={(p1[0] + p2[0]) / 2} y={(p1[1] + p2[1]) / 2 + 3}
                          textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--fg)"
                        >
                          {route.id.replace("R-", "")}
                        </text>
                      </g>
                    );
                  })}

                  {/* Location Nodes */}
                  {sites.map((site) => {
                    const coords: Record<string, [number, number]> = {
                      depot: [120, 210],
                      ridge: [320, 90],
                      valley: [480, 240],
                      lake: [280, 340],
                      forest: [160, 80],
                    };
                    const [cx, cy] = coords[site.id] || [250 + Math.random() * 200, 150 + Math.random() * 150];
                    const isSelected = selectedLocationId === site.id;
                    const st = statusStyles[site.status] || statusStyles.operational;

                    return (
                      <g
                        key={site.id}
                        onClick={() => setSelectedLocationId(site.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {isSelected && (
                          <circle cx={cx} cy={cy} r="26" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
                        )}
                        <circle cx={cx} cy={cy} r={site.type === "depot" ? 18 : 14} fill="white" stroke={st.color} strokeWidth="3" />
                        <circle cx={cx} cy={cy} r={site.type === "depot" ? 7 : 5} fill={st.color} />
                        <text
                          x={cx} y={cy - (site.type === "depot" ? 24 : 20)}
                          textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)"
                        >
                          {site.name}
                        </text>
                        <text
                          x={cx} y={cy + (site.type === "depot" ? 30 : 26)}
                          textAnchor="middle" fontSize="9.5" fill="var(--fg-muted)"
                        >
                          {site.type === "depot" ? "Master Depot" : `${site.confidence}% conf`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Corridor Summary */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Active Transit Corridors ({ROUTES.length})
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {ROUTES.map(r => (
                    <div key={r.id} style={{
                      padding: "8px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{r.name}</div>
                        <div style={{ fontSize: 10.5, color: "var(--fg-muted)" }}>{r.distanceKm} km · {r.travelTimeHours}h · {r.terrain}</div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase",
                        background: r.status === "open" ? "rgba(34,197,94,0.1)" : r.status === "degraded" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                        color: r.status === "open" ? "#15803d" : r.status === "degraded" ? "#b45309" : "#dc2626"
                      }}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Table Alternative */
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Locations Master Directory</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left", color: "var(--fg-muted)" }}>
                    <th style={{ padding: "8px 12px" }}>Site Name</th>
                    <th style={{ padding: "8px 12px" }}>Classification</th>
                    <th style={{ padding: "8px 12px" }}>Operating Status</th>
                    <th style={{ padding: "8px 12px" }}>Telemetry Freshness</th>
                    <th style={{ padding: "8px 12px" }}>Confidence</th>
                    <th style={{ padding: "8px 12px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSites.map(s => {
                    const st = statusStyles[s.status] || statusStyles.operational;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedLocationId(s.id)}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: selectedLocationId === s.id ? "rgba(59,130,246,0.05)" : "transparent",
                          cursor: "pointer"
                        }}
                      >
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{s.type}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "var(--fg-muted)" }}>{s.lastReport} ({s.reportAge}m age)</td>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.confidence}%</td>
                        <td style={{ padding: "10px 12px" }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedLocationId(s.id); }}
                            style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border)", background: "white", cursor: "pointer" }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Location Detail Drawer */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20 }}>
          {selectedLocation ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={16} color="var(--fg)" />
                    <h2 style={{ fontSize: 16, fontWeight: 800 }}>{selectedLocation.name}</h2>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 2 }}>
                    ID: {selectedLocation.id} · Type: <span style={{ textTransform: "capitalize" }}>{selectedLocation.type}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                  background: (statusStyles[selectedLocation.status] || statusStyles.operational).bg,
                  color: (statusStyles[selectedLocation.status] || statusStyles.operational).color
                }}>
                  {selectedLocation.status.toUpperCase()}
                </span>
              </div>

              {/* Coordinates & Reporting */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <div style={{ padding: 10, background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--fg-subtle)", textTransform: "uppercase", fontWeight: 700 }}>Telemetry Freshness</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedLocation.reportAge > 180 ? "#b45309" : "var(--fg)" }}>
                    {selectedLocation.lastReport}
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--fg-muted)" }}>{selectedLocation.reportAge} mins elapsed</div>
                </div>
                <div style={{ padding: 10, background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--fg-subtle)", textTransform: "uppercase", fontWeight: 700 }}>Data Quality Score</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedLocation.confidence < 75 ? "#b45309" : "#15803d" }}>
                    {selectedLocation.confidence}%
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--fg-muted)" }}>Belief-state calibrated</div>
                </div>
              </div>

              {/* Stationed / Assigned Vehicles */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Stationed Transport Assets
                </div>
                {selectedVehicles.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedVehicles.map(v => (
                      <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg)", borderRadius: 6, fontSize: 11.5 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                          <Truck size={12} /> {v.name}
                        </span>
                        <span style={{ fontSize: 10, color: v.status === "available" ? "#15803d" : "#dc2626", fontWeight: 700 }}>
                          {v.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: "var(--fg-subtle)", fontStyle: "italic" }}>No fleet vehicles currently positioned here.</div>
                )}
              </div>

              {/* Local Inventory Twin Breakdown */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Monitored Resource Stores
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                  {selectedInventory.map(item => (
                    <div key={item.id} style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600 }}>{item.item}</span>
                        <span style={{ fontWeight: 700, color: item.status === "critical" ? "#dc2626" : "var(--fg)" }}>
                          {item.estimated} {item.unit}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--fg-muted)", display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <span>Confirmed: {item.confirmed} {item.unit}</span>
                        <span>Range: [{item.estimatedLow}–{item.estimatedHigh}]</span>
                      </div>
                    </div>
                  ))}
                  {selectedInventory.length === 0 && (
                    <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>No stock configured at this location.</div>
                  )}
                </div>
              </div>

              {/* Connected Corridors */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Direct Supply Corridors
                </div>
                {connectedRoutes.map(cr => (
                  <div key={cr.id} style={{ padding: "6px 8px", background: "var(--bg)", borderRadius: 6, marginBottom: 4, fontSize: 11 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                      <span>{cr.name}</span>
                      <span style={{ color: cr.status === "open" ? "#15803d" : cr.status === "degraded" ? "#b45309" : "#dc2626" }}>
                        {cr.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--fg-muted)" }}>Access: {cr.accessWindow}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--fg-muted)" }}>
              <Compass size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>Select a site on the grid</div>
              <div style={{ fontSize: 11.5, marginTop: 4 }}>Click any node or row to inspect telemetry and routes</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Fictional Site Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "white", borderRadius: 12, width: 440, padding: 24, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Add Fictional Network Node</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSite}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 6 }}>
                  SITE NAME (FICTIONAL / NON-SENSITIVE)
                </label>
                <input
                  value={newSiteName}
                  onChange={e => setNewSiteName(e.target.value)}
                  placeholder="e.g. Glacier Outpost, Meadow Hub"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 6 }}>
                  FACILITY TYPE
                </label>
                <select
                  value={newSiteType}
                  onChange={e => setNewSiteType(e.target.value as "depot" | "forward")}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
                >
                  <option value="forward">Forward Operational Site</option>
                  <option value="depot">Supply Depot / Distribution Hub</option>
                </select>
              </div>

              <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 6, marginBottom: 16, fontSize: 11, color: "#1d4ed8" }}>
                <Info size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                Synthetic coordinates will be deterministically assigned. No real-world operational locations are stored.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: 6, background: "var(--fg)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
