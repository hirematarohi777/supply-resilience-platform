"use client";

import { useState } from "react";
import { AUDIT_EVENTS, AuditEvent } from "@/lib/demoData";
import {
  ShieldCheck, Lock, Unlock, Key, Eye, EyeOff, FileText,
  AlertTriangle, CheckCircle2, Shield, Fingerprint, Database,
  Terminal, Search, Filter, RefreshCw
} from "lucide-react";

export default function SecurityAuditPage() {
  const [activeTab, setActiveTab] = useState<"audit" | "e2ee" | "threat-model">("audit");
  const [filterAction, setFilterAction] = useState("all");

  // Client-side E2EE Interactive Demonstration State
  const [plaintextNote, setPlaintextNote] = useState("Commander Note: Priority given to Lake fuel convoy. Route B closed due to terrain hazard.");
  const [clientPassphrase, setClientPassphrase] = useState("bravo-sector-key-99");
  const [encryptedCiphertext, setEncryptedCiphertext] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Filtered Audit logs
  const filteredEvents = AUDIT_EVENTS.filter(e =>
    filterAction === "all" || e.action.toLowerCase().includes(filterAction)
  );

  // Client-Side Web Crypto API demonstration (Real AES-GCM encryption in browser memory)
  const handleClientEncrypt = async () => {
    setIsEncrypting(true);
    try {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(clientPassphrase.padEnd(32, "0").slice(0, 32)),
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const ciphertextBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        enc.encode(plaintextNote)
      );

      // Package iv + ciphertext as Base64 payload
      const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(ciphertextBuffer), iv.length);
      const base64 = btoa(String.fromCharCode(...combined));

      setEncryptedCiphertext(base64);
      setDecryptedText(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleClientDecrypt = async () => {
    if (!encryptedCiphertext) return;
    try {
      const enc = new TextEncoder();
      const dec = new TextDecoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(clientPassphrase.padEnd(32, "0").slice(0, 32)),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const raw = Uint8Array.from(atob(encryptedCiphertext), c => c.charCodeAt(0));
      const iv = raw.slice(0, 12);
      const ciphertext = raw.slice(12);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        ciphertext
      );

      setDecryptedText(dec.decode(decryptedBuffer));
    } catch (err) {
      setDecryptedText("Decryption Failed: Invalid Passphrase or Corrupted Ciphertext");
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Security & Audit Governance</h1>
            <span style={{ fontSize: 11, background: "rgba(34,197,94,0.1)", color: "#15803d", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Honest Cryptographic Architecture
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Clear delineation between server-processed operational analytics and client-side end-to-end encrypted collaboration.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", background: "white", padding: 3, borderRadius: 8, border: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveTab("audit")}
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
              background: activeTab === "audit" ? "var(--fg)" : "transparent",
              color: activeTab === "audit" ? "white" : "var(--fg-muted)"
            }}
          >
            Audit Trail
          </button>
          <button
            onClick={() => setActiveTab("e2ee")}
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
              background: activeTab === "e2ee" ? "var(--fg)" : "transparent",
              color: activeTab === "e2ee" ? "white" : "var(--fg-muted)"
            }}
          >
            Honest E2EE Lab
          </button>
          <button
            onClick={() => setActiveTab("threat-model")}
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
              background: activeTab === "threat-model" ? "var(--fg)" : "transparent",
              color: activeTab === "threat-model" ? "white" : "var(--fg-muted)"
            }}
          >
            Threat Model
          </button>
        </div>
      </div>

      {/* Dual Protection Model Explainer Banner */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-muted)" }}>
          Two Distinct Protection Boundaries
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8, borderLeft: "3px solid #2563eb" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>
              A. Operational Analytics Data
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)", lineHeight: 1.6 }}>
              <strong>Scope:</strong> Inventory quantities, consumption records, transport routes, and solver runs.<br />
              <strong>Control:</strong> TLS 1.3 in transit, AES-256 at rest. Processed by authorized backend workers to generate demand forecasts and optimize routes.<br />
              <em>&ldquo;Authorized backend services read operational data to generate logistics plans.&rdquo;</em>
            </div>
          </div>
          <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8, borderLeft: "3px solid #15803d" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d", marginBottom: 4 }}>
              B. E2EE Confidential Collaboration
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)", lineHeight: 1.6 }}>
              <strong>Scope:</strong> Private mission annotations, commander tactical rationale, confidential attachments.<br />
              <strong>Control:</strong> Encrypted on client browser using AES-GCM WebCrypto before transmission. The backend server stores only ciphertext and possesses no decryption keys.<br />
              <em>Metadata (timestamp, user ID, ciphertext size) remains visible to transport.</em>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Tamper-Evident Operational Audit Ledger</span>
              <span style={{ fontSize: 11, color: "var(--fg-muted)", marginLeft: 8 }}>Cryptographically chained event signatures</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>Filter:</span>
              {["all", "plan", "telemetry", "role", "auth"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterAction(f)}
                  style={{
                    padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                    background: filterAction === f ? "var(--fg)" : "var(--bg-secondary)",
                    color: filterAction === f ? "white" : "var(--fg-muted)",
                    textTransform: "capitalize"
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--fg-muted)" }}>
                <th style={{ padding: "10px 14px" }}>Timestamp (UTC)</th>
                <th style={{ padding: "10px 14px" }}>Action</th>
                <th style={{ padding: "10px 14px" }}>Actor Identity</th>
                <th style={{ padding: "10px 14px" }}>Affected Entity</th>
                <th style={{ padding: "10px 14px" }}>Status</th>
                <th style={{ padding: "10px 14px" }}>Cryptographic Signature</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(evt => (
                <tr key={evt.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 14px", color: "var(--fg-muted)" }}>{evt.timestamp}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700 }}>{evt.action}</td>
                  <td style={{ padding: "12px 14px" }}>{evt.actor}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div>{evt.resource}</div>
                    <div style={{ fontSize: 10.5, color: "var(--fg-subtle)", marginTop: 2 }}>{evt.details}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                      background: evt.status === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: evt.status === "success" ? "#15803d" : "#dc2626"
                    }}>
                      {evt.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "var(--fg-muted)" }}>
                    {evt.hashSignature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: HONEST E2EE LAB */}
      {activeTab === "e2ee" && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
            Interactive Client-Side WebCrypto Demonstration
          </div>
          <p style={{ fontSize: 12.5, color: "var(--fg-muted)", marginBottom: 20 }}>
            Test genuine browser-side encryption. The plain text never leaves your device memory; only ciphertext is sent to the server.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                1. Local Plaintext Note (In Client Browser Memory)
              </label>
              <textarea
                value={plaintextNote}
                onChange={e => setPlaintextNote(e.target.value)}
                style={{ width: "100%", height: 100, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12.5, outline: "none", resize: "none" }}
              />
              <div style={{ marginTop: 10 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  Client Passphrase / Device Key
                </label>
                <input
                  type="password"
                  value={clientPassphrase}
                  onChange={e => setClientPassphrase(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12.5, outline: "none" }}
                />
              </div>
              <button
                onClick={handleClientEncrypt}
                disabled={isEncrypting}
                style={{
                  marginTop: 12, padding: "8px 18px", borderRadius: 6, background: "var(--fg)", color: "white",
                  border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6
                }}
              >
                <Lock size={13} /> Encrypt with AES-GCM (WebCrypto)
              </button>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                2. Server Ciphertext Storage (What the Backend Sees)
              </label>
              <div style={{
                height: 100, padding: "10px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)",
                fontFamily: "monospace", fontSize: 11, color: encryptedCiphertext ? "#1d4ed8" : "var(--fg-subtle)", overflowY: "auto", wordBreak: "break-all"
              }}>
                {encryptedCiphertext || "No ciphertext generated yet. Click 'Encrypt' to test."}
              </div>

              {encryptedCiphertext && (
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={handleClientDecrypt}
                    style={{
                      padding: "8px 18px", borderRadius: 6, background: "#15803d", color: "white",
                      border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6
                    }}
                  >
                    <Unlock size={13} /> Decrypt on Authorized Client
                  </button>
                  {decryptedText && (
                    <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(34,197,94,0.1)", borderRadius: 6, fontSize: 12, color: "#15803d", fontWeight: 600 }}>
                      Decrypted: &ldquo;{decryptedText}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THREAT MODEL */}
      {activeTab === "threat-model" && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Security Threat Model & Mitigations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { threat: "Cross-Tenant Data Leakage", mit: "Mandatory row-level tenant filtering on active organization ID. Negative automated test suite verifies isolation." },
              { threat: "Unauthorized Supply Plan Dispatch", mit: "Human-in-the-Loop approval gate with separation-of-duties policy. Plan authors cannot self-approve." },
              { threat: "LoRa Sensor Telemetry Replay / Spoofing", mit: "Idempotent ingestion using monotonic message counters, unique LoRa packet IDs, and gateway timestamp verification." },
              { threat: "Stale Telemetry Misleading Route Planner", mit: "Belief-state inventory twin tracks report age and widens uncertainty ranges as data gets older." },
            ].map(tm => (
              <div key={tm.threat} style={{ padding: 14, background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{tm.threat}</div>
                <div style={{ fontSize: 11.5, color: "var(--fg-muted)", lineHeight: 1.5 }}>{tm.mit}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
