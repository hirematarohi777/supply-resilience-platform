"use client";

import { useState, useEffect } from "react";
import { TELEMETRY_DEVICES } from "@/lib/demoData";
import { Radio, Wifi, WifiOff, Battery, RefreshCw, Play, Pause, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function TelemetryPage() {
  const [simulating, setSimulating] = useState(false);
  const [synced, setSynced] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);

  const simulateSync = () => {
    setSimulating(true);
    setSynced(false);
    setLog([]);
    const steps = [
      [300, "Device LORA-RIDGE-01: Connectivity restored. Backhaul link established."],
      [800, "LORA-RIDGE-01: Dequeuing 14 buffered observations..."],
      [1400, "Transmitting observation MSG-0847 (Fuel: 520L @ 2026-10-04T01:12Z)"],
      [1800, "Transmitting observation MSG-0848 (Water: 840L @ 2026-10-04T01:13Z)"],
      [2200, "Transmitting observation MSG-0849 (Batteries: 24 units @ 2026-10-04T01:14Z)"],
      [2600, "Server acknowledged MSG-0847, MSG-0848, MSG-0849 (idempotent ingestion)"],
      [3000, "Transmitting remaining 11 buffered observations..."],
      [3600, "All 14 observations synchronized. Original timestamps preserved."],
      [4000, "Belief-State Twin updated for Ridge Site. Uncertainty ranges narrowed."],
      [4400, "Demand forecasts refreshed for Ridge Site — Generator Fuel, Water, Batteries."],
      [4800, "Sync complete. Device queue cleared. ✓"],
    ];
    steps.forEach(([delay, msg]) => {
      setTimeout(() => addLog(msg as string), delay as number);
    });
    setTimeout(() => { setSimulating(false); setSynced(true); }, 5200);
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Telemetry & Sync</h1>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Simulated LoRa/ESP32 field devices · Local buffering and delayed synchronization</p>
        </div>
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}>
          Demo Mode — Simulated Devices
        </div>
      </div>

      {/* Device grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {TELEMETRY_DEVICES.map(device => {
          const isOnline = device.status === "online" || (synced && device.id === "d1");
          return (
            <div key={device.id} style={{
              background: "white", borderRadius: 12, border: `1px solid ${isOnline ? "var(--border)" : "rgba(239,68,68,0.2)"}`,
              padding: "16px", transition: "all 0.3s"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: isOnline ? "#22c55e" : "#ef4444" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: isOnline ? "#15803d" : "#dc2626", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                {isOnline ? <Wifi size={14} color="#22c55e" /> : <WifiOff size={14} color="#ef4444" />}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, fontFamily: "monospace" }}>{device.name}</div>
              <div style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 10 }}>{device.location}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--fg-muted)" }}>Last contact</span>
                  <span style={{ fontWeight: 600 }}>{isOnline && synced && device.id === "d1" ? "Just now" : device.lastContact}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--fg-muted)" }}>Battery</span>
                  <span style={{ fontWeight: 600, color: device.battery < 50 ? "#b45309" : "var(--fg)" }}>{device.battery}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--fg-muted)" }}>Buffered</span>
                  <span style={{ fontWeight: 600, color: (synced && device.id === "d1" ? 0 : device.buffered) > 0 ? "#b45309" : "var(--fg)" }}>
                    {synced && device.id === "d1" ? 0 : device.buffered}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--fg-muted)" }}>Firmware</span>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 10 }}>{device.firmware}</span>
                </div>
              </div>
              {device.failed > 0 && (
                <div style={{ marginTop: 8, padding: "4px 8px", background: "rgba(239,68,68,0.08)", borderRadius: 4, fontSize: 10, color: "#dc2626", fontWeight: 600 }}>
                  {device.failed} failed sync attempts
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Simulator */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Control */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Connectivity Simulator — Ridge Site</div>
          <p style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.7, marginBottom: 16 }}>
            Demonstrates the delayed-synchronization workflow: device generates observations while offline, queues them locally, then synchronizes when connectivity is restored. Original observation timestamps are preserved.
          </p>

          <div style={{ marginBottom: 16, padding: "12px", background: "var(--bg)", borderRadius: 8, fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.7 }}>
            <strong>Sequence demonstrated:</strong><br/>
            1. Device LORA-RIDGE-01 is offline (7h gap)<br/>
            2. 14 observations buffered locally on device<br/>
            3. Connectivity restored → synchronized<br/>
            4. Twin updated with original timestamps<br/>
            5. Forecasts refreshed
          </div>

          <button onClick={simulateSync} disabled={simulating}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8,
              background: simulating ? "#6b7280" : "var(--fg)", color: "white", border: "none",
              fontSize: 13, cursor: simulating ? "not-allowed" : "pointer", fontWeight: 600
            }}>
            {simulating
              ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", animation: "spin 1s linear infinite" }} /> Synchronizing...</>
              : <><Play size={13} /> Simulate Connectivity Restored</>}
          </button>

          {synced && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(34,197,94,0.08)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)", display: "flex", gap: 8, fontSize: 12, color: "#15803d" }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Sync complete. 14 observations ingested. Twin updated. Uncertainty ranges for Ridge Site narrowed.</span>
            </div>
          )}

          <div style={{ marginTop: 12, fontSize: 11, color: "var(--fg-subtle)", lineHeight: 1.7 }}>
            <Info size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
            These are simulated ESP32/LoRa devices for demonstration. No real hardware integration exists in this prototype. Real hardware connectivity is a Phase 4 feature.
          </div>
        </div>

        {/* Log */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Sync Event Log</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, background: "#0A0A0A", borderRadius: 8, padding: 16, height: 320, overflowY: "auto", color: "#22c55e", display: "flex", flexDirection: "column", gap: 3 }}>
            {log.length === 0 ? (
              <span style={{ color: "rgba(34,197,94,0.4)" }}>$ Awaiting sync trigger...</span>
            ) : (
              log.map((line, i) => <div key={i} style={{ lineHeight: 1.5 }}>{line}</div>)
            )}
          </div>
        </div>
      </div>

      {/* Timestamp distinction */}
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          { title: "Observation Time", desc: "When the field sensor recorded the measurement. Preserved in original observation record.", badge: "Original" },
          { title: "Gateway Receipt Time", desc: "When the local LoRa gateway received the transmission from the device.", badge: "Transit" },
          { title: "Server Ingestion Time", desc: "When the backend system acknowledged and stored the observation.", badge: "Received" },
        ].map((t, i) => (
          <div key={i} style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "var(--bg-secondary)", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.badge}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.6 }}>{t.desc}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
