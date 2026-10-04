"use client";

import { useState } from "react";
import { INTEGRATIONS_LIST } from "@/lib/demoData";
import {
  Plug, Radio, Database, CloudRain, Zap, Key, CheckCircle2,
  RefreshCw, Copy, Check, Shield, AlertTriangle, ExternalLink
} from "lucide-react";

export default function IntegrationsPage() {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const demoApiKey = "mst_live_sec_89df2014bca8429188a9e";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(demoApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTestWebhookStatus(null);
    setTimeout(() => {
      setTestingWebhook(false);
      setTestWebhookStatus("HTTP 200 OK — HMAC-SHA256 signature verified by endpoint");
    }, 1200);
  };

  const handleManualSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
    }, 1000);
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Integrations & Telemetry Connectors</h1>
            <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Field Data & Enterprise Systems
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Connect intermittent field sensors (LoRa/ESP32), ERP inventory ledgers, and terrain risk forecasting services.
          </p>
        </div>
      </div>

      {/* Connected Connectors Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {INTEGRATIONS_LIST.map((item) => {
          const isSyncing = syncingId === item.id;
          return (
            <div key={item.id} style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon === "Radio" && <Radio size={18} color="#2563eb" />}
                    {item.icon === "Database" && <Database size={18} color="#15803d" />}
                    {item.icon === "CloudRain" && <CloudRain size={18} color="#f59e0b" />}
                    {item.icon === "Zap" && <Zap size={18} color="#8b5cf6" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{item.type} · Last sync {item.lastSync}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(34,197,94,0.1)", color: "#15803d", textTransform: "uppercase" }}>
                  {item.status}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                {item.description}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  onClick={() => handleManualSync(item.id)}
                  disabled={isSyncing}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6,
                    border: "1px solid var(--border)", background: "white", fontSize: 11.5, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? "Syncing..." : "Sync Ingest"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer API & Webhooks Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* API Keys */}
        <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>
            <Key size={16} /> REST API Credentials
          </div>
          <p style={{ fontSize: 12, color: "var(--fg-muted)", marginBottom: 16 }}>
            Tenant-scoped Bearer token for programmatic telemetry injection and plan querying.
          </p>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Primary Organization Secret Key
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                readOnly
                value={demoApiKey}
                type="password"
                style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 12, fontFamily: "monospace" }}
              />
              <button
                onClick={handleCopyKey}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: 6,
                  border: "1px solid var(--border)", background: "white", fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}
              >
                {apiKeyCopied ? <Check size={13} color="#15803d" /> : <Copy size={13} />}
                {apiKeyCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div style={{ padding: "10px 12px", background: "rgba(59,130,246,0.05)", borderRadius: 6, fontSize: 11.5, color: "#1d4ed8" }}>
            <Shield size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
            API tokens are restricted strictly to tenant partition <code>ten_northstar_0921</code>. Cross-tenant access attempts are rejected and logged.
          </div>
        </div>

        {/* Webhooks Dispatcher */}
        <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>
            <Zap size={16} /> Outbound Operational Webhooks
          </div>
          <p style={{ fontSize: 12, color: "var(--fg-muted)", marginBottom: 16 }}>
            Real-time HTTP POST notifications dispatched on critical stock-out thresholds and plan approval events.
          </p>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Endpoint URL
            </label>
            <input
              readOnly
              value="https://ops.northstar-external.example/webhooks/mst-events"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", fontSize: 12, fontFamily: "monospace" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
            <button
              onClick={handleTestWebhook}
              disabled={testingWebhook}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 6,
                background: "var(--fg)", color: "white", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}
            >
              {testingWebhook ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
              {testingWebhook ? "Sending Payload..." : "Send Test Ping (HMAC-SHA256)"}
            </button>
            <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>Signature header: <code>X-MST-Signature</code></span>
          </div>

          {testWebhookStatus && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 6, fontSize: 11.5, color: "#15803d", fontWeight: 600 }}>
              ✓ {testWebhookStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Play({ size }: { size: number }) {
  return <span style={{ fontSize: size }}>▶</span>;
}
