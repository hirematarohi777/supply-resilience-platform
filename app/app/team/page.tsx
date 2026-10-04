"use client";

import { useState } from "react";
import { TEAM_MEMBERS, TeamMember } from "@/lib/demoData";
import {
  Users, UserPlus, Shield, CheckCircle2, AlertTriangle,
  Building2, Key, Lock, Mail, Trash2, X, ToggleLeft, ToggleRight
} from "lucide-react";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [separationOfDuties, setSeparationOfDuties] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Planner");
  const [activeOrg, setActiveOrg] = useState("Northstar Remote Operations (Primary)");

  const roleDefinitions = [
    { role: "Owner", desc: "Full organization ownership, billing governance, and workspace deletion.", badge: "badge-green" },
    { role: "Administrator", desc: "Manages memberships, API integrations, and network configurations.", badge: "badge-blue" },
    { role: "Planner", desc: "Reviews inventory twin, creates replenishment plans, and runs scenario stress-tests.", badge: "badge-amber" },
    { role: "Approver", desc: "Authorizes, rejects, or requests modifications to candidate supply plans.", badge: "badge-red" },
    { role: "Auditor", desc: "Read-only access to cryptographically signed decisions, exports, and audit trail.", badge: "badge-gray" },
    { role: "Viewer", desc: "Read-only visibility into operational dashboards and inventory twin.", badge: "badge-gray" },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      name: inviteName || inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      department: "Tactical Operations",
      mfaEnabled: false,
      status: "invited",
      lastActive: "Never"
    };
    setMembers(prev => [...prev, newMember]);
    setShowInviteModal(false);
    setInviteName("");
    setInviteEmail("");
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Team & Access Control</h1>
            <span style={{ fontSize: 11, background: "rgba(59,130,246,0.1)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              RBAC & Multi-Tenancy
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Manage organization members, role-based operational permissions, and Human-in-the-Loop decision governance.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            background: "var(--fg)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}
        >
          <UserPlus size={14} /> Invite Colleague
        </button>
      </div>

      {/* Tenant / Organization Card */}
      <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{activeOrg}</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>Tenant ID: ten_northstar_0921 · Isolated PostgreSQL partition & encrypted object store</div>
          </div>
        </div>
        <select
          value={activeOrg}
          onChange={e => setActiveOrg(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12.5, outline: "none", background: "var(--bg)" }}
        >
          <option value="Northstar Remote Operations (Primary)">Northstar Remote Operations (Primary)</option>
          <option value="Mountain Sector Outpost (Isolated Sandbox)">Mountain Sector Outpost (Isolated Sandbox)</option>
        </select>
      </div>

      {/* Separation of Duties Policy Toggle */}
      <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: 18, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700 }}>
              <Shield size={16} color={separationOfDuties ? "#15803d" : "#b45309"} />
              Separation-of-Duties Policy
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }}>
              &ldquo;Plan authors cannot approve their own candidate plans.&rdquo; When active, planners who submit a plan cannot authorize it.
            </div>
          </div>
          <button
            onClick={() => setSeparationOfDuties(!separationOfDuties)}
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: separationOfDuties ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: separationOfDuties ? "#15803d" : "#dc2626",
              border: `1px solid ${separationOfDuties ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`
            }}
          >
            {separationOfDuties ? "Enforced (Strict)" : "Disabled (Permissive)"}
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700 }}>
          Assigned Workspace Members ({members.length})
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--fg-muted)" }}>
              <th style={{ padding: "10px 16px" }}>Member</th>
              <th style={{ padding: "10px 16px" }}>Department</th>
              <th style={{ padding: "10px 16px" }}>Assigned Role</th>
              <th style={{ padding: "10px 16px" }}>Security (MFA)</th>
              <th style={{ padding: "10px 16px" }}>Last Activity</th>
              <th style={{ padding: "10px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600 }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>{member.email}</div>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--fg-muted)" }}>{member.department}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                    background: member.role === "Owner" ? "rgba(34,197,94,0.1)" : member.role === "Approver" ? "rgba(239,68,68,0.1)" : member.role === "Planner" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                    color: member.role === "Owner" ? "#15803d" : member.role === "Approver" ? "#dc2626" : member.role === "Planner" ? "#b45309" : "#1d4ed8"
                  }}>
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {member.mfaEnabled ? (
                    <span style={{ fontSize: 11, color: "#15803d", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={12} /> Hardware / TOTP
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>Password only</span>
                  )}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--fg-muted)" }}>{member.lastActive}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  {member.role !== "Owner" && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-subtle)" }}
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permissions Matrix */}
      <div style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Role-Based Access Definitions (RBAC)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {roleDefinitions.map(r => (
            <div key={r.role} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>{r.role}</div>
              <p style={{ fontSize: 11.5, color: "var(--fg-muted)", margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "white", borderRadius: 12, width: 440, padding: 24, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleInvite}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>Full Name</label>
                <input
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Lt. Marcus Reed"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>Work Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="m.reed@northstar-ops.example"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 4, textTransform: "uppercase" }}>Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as TeamMember["role"])}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, outline: "none" }}
                >
                  <option value="Planner">Planner (Drafts replenishment plans)</option>
                  <option value="Approver">Approver (Authorizes movement plans)</option>
                  <option value="Administrator">Administrator (Configures integrations & sites)</option>
                  <option value="Auditor">Auditor (Compliance review)</option>
                  <option value="Viewer">Viewer (Read-only access)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "white", fontSize: 12.5, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: 6, background: "var(--fg)", color: "white", border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
