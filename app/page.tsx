"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, ChevronDown, Menu, X, Shield, Brain, GitBranch,
  BarChart3, Layers, CheckCircle2, Zap, Users, Globe, Lock,
  TrendingUp, AlertTriangle, Clock, Activity, Database, Server,
  ChevronRight, Play, Star, Building2, FileText, Award, Target
} from "lucide-react";

// ──────────────────────────────────────────
// NAVBAR
// ──────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(247,246,242,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        padding: scrolled ? "12px 0" : "20px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "var(--fg)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Activity size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: "var(--fg)" }}>
              MST <span style={{ fontWeight: 300, color: "var(--fg-muted)" }}>Platform</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Pricing", "Security", "Docs"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                style={{ fontSize: 14, color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
              >{item}</a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/app" style={{
              fontSize: 14, fontWeight: 500, color: "var(--fg-muted)", textDecoration: "none",
              padding: "8px 16px", transition: "color 0.2s"
            }}>Sign in</Link>
            <Link href="/app" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
              Start free trial <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            marginTop: 16, padding: "16px 0", borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 4
          }}>
            {["Features", "How it works", "Pricing", "Security", "Docs"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 15, color: "var(--fg-muted)", textDecoration: "none", padding: "10px 0", display: "block" }}
              >{item}</a>
            ))}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/app" className="btn-outline" style={{ justifyContent: "center" }}>Sign in</Link>
              <Link href="/app" className="btn-primary" style={{ justifyContent: "center" }}>Start free trial</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ──────────────────────────────────────────
// ANIMATED COUNTER
// ──────────────────────────────────────────
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ──────────────────────────────────────────
// ANIMATED DEPENDENCY GRAPH SVG
// ──────────────────────────────────────────
function DependencyGraphDemo() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const nodes = [
    { id: "fuel", label: "Fuel", x: 80, y: 180, color: "#f59e0b" },
    { id: "generator", label: "Generator", x: 240, y: 100, color: "#3b82f6" },
    { id: "vehicle", label: "Vehicles", x: 240, y: 260, color: "#3b82f6" },
    { id: "comms", label: "Comms", x: 400, y: 100, color: "#22c55e" },
    { id: "coldstorage", label: "Cold Store", x: 400, y: 180, color: "#22c55e" },
    { id: "transport", label: "Transport", x: 400, y: 260, color: "#22c55e" },
    { id: "ops", label: "Operations", x: 540, y: 180, color: "#8b5cf6" },
  ];
  const edges = [
    ["fuel", "generator"], ["fuel", "vehicle"],
    ["generator", "comms"], ["generator", "coldstorage"],
    ["vehicle", "transport"],
    ["comms", "ops"], ["coldstorage", "ops"], ["transport", "ops"],
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: 320, background: "white", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 12, left: 16, fontSize: 12, fontWeight: 600, color: "var(--fg-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Mission Dependency Graph
      </div>
      <svg width="100%" height="100%" viewBox="0 0 620 320">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
          </pattern>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#C8C3BB" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Edges */}
        {edges.map(([from, to], i) => {
          const a = nodes.find(n => n.id === from)!;
          const b = nodes.find(n => n.id === to)!;
          const isActive = activeNode === from || activeNode === to;
          return (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isActive ? "#0A0A0A" : "#C8C3BB"}
              strokeWidth={isActive ? 2 : 1.5}
              markerEnd="url(#arrow)"
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          return (
            <g key={node.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <circle cx={node.x} cy={node.y} r={isActive ? 28 : 24}
                fill={isActive ? node.color : "white"}
                stroke={isActive ? node.color : "var(--border)"}
                strokeWidth={2}
                style={{ transition: "all 0.25s ease", filter: isActive ? `drop-shadow(0 4px 12px ${node.color}44)` : "none" }}
              />
              {isActive && (
                <circle cx={node.x} cy={node.y} r={36}
                  fill="none" stroke={node.color} strokeWidth={1} opacity={0.3}
                  style={{ animation: "pulse 2s ease infinite" }}
                />
              )}
              <text x={node.x} y={node.y + 4}
                textAnchor="middle" fontSize={10} fontWeight={600}
                fill={isActive ? "white" : "#6B6B6B"}
                style={{ transition: "fill 0.25s", userSelect: "none" }}
              >{node.label}</text>
            </g>
          );
        })}
      </svg>

      {/* DMS badge */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>DMS: 18.4 days</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// FORECAST CHART DEMO
// ──────────────────────────────────────────
function ForecastChartDemo() {
  const data = [
    { day: "D-7", actual: 580, forecast: null, low: null, high: null },
    { day: "D-6", actual: 540, forecast: null, low: null, high: null },
    { day: "D-5", actual: 510, forecast: null, low: null, high: null },
    { day: "D-4", actual: 480, forecast: null, low: null, high: null },
    { day: "D-3", actual: 460, forecast: null, low: null, high: null },
    { day: "D-2", actual: 430, forecast: 430, low: 415, high: 445 },
    { day: "D-1", actual: 400, forecast: 398, low: 375, high: 421 },
    { day: "Today", actual: 370, forecast: 362, low: 330, high: 394 },
    { day: "D+1", actual: null, forecast: 328, low: 290, high: 366 },
    { day: "D+2", actual: null, forecast: 294, low: 248, high: 340 },
    { day: "D+3", actual: null, forecast: 256, low: 200, high: 312 },
    { day: "D+4", actual: null, forecast: 218, low: 152, high: 284 },
    { day: "D+5", actual: null, forecast: 180, low: 104, high: 256 },
  ];

  const maxVal = 620;
  const minVal = 80;
  const range = maxVal - minVal;
  const svgW = 560;
  const svgH = 200;
  const padLeft = 36;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 24;
  const chartW = svgW - padLeft - padRight;
  const chartH = svgH - padTop - padBottom;

  const xStep = chartW / (data.length - 1);
  const toY = (v: number) => padTop + chartH - ((v - minVal) / range) * chartH;
  const toX = (i: number) => padLeft + i * xStep;

  const actualPoints = data.filter(d => d.actual !== null).map((d, i) => `${toX(data.indexOf(d))},${toY(d.actual!)}`).join(" ");
  const forecastPoints = data.filter(d => d.forecast !== null).map((d, i) => `${toX(data.indexOf(d))},${toY(d.forecast!)}`).join(" ");

  const areaPath = data.filter(d => d.low !== null && d.high !== null)
    .map((d, i, arr) => {
      const idx = data.indexOf(d);
      return `${toX(idx)},${toY(d.high!)}`;
    }).join(" L ") + " " + data.filter(d => d.low !== null && d.high !== null).slice().reverse().map((d) => {
      const idx = data.indexOf(d);
      return `${toX(idx)},${toY(d.low!)}`;
    }).join(" L ");

  const depletion = data.findIndex(d => d.forecast !== null && d.forecast < 200);

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "20px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Generator Fuel — Ridge Site</div>
          <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>Predictive consumption forecast · 5-day horizon</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--fg-muted)", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 2, background: "#0A0A0A", borderRadius: 1 }} /> Confirmed
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 2, background: "#3b82f6", borderRadius: 1, borderTop: "2px dashed #3b82f6" }} /> Forecast
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 8, background: "rgba(59,130,246,0.15)", borderRadius: 2 }} /> Range
          </span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
        {/* Y axis labels */}
        {[100, 200, 300, 400, 500].map(v => (
          <text key={v} x={padLeft - 4} y={toY(v) + 3} textAnchor="end" fontSize={9} fill="#9B9B9B">{v}L</text>
        ))}
        {/* Grid lines */}
        {[100, 200, 300, 400, 500].map(v => (
          <line key={v} x1={padLeft} y1={toY(v)} x2={svgW - padRight} y2={toY(v)} stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
        ))}
        {/* Depletion warning */}
        {depletion > 0 && (
          <line x1={toX(depletion)} y1={padTop} x2={toX(depletion)} y2={svgH - padBottom}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6} />
        )}
        {/* Uncertainty band */}
        <polygon points={areaPath} fill="rgba(59,130,246,0.08)" />
        {/* Forecast line */}
        <polyline points={forecastPoints} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5,3" />
        {/* Actual line */}
        <polyline points={actualPoints} fill="none" stroke="#0A0A0A" strokeWidth={2.5} />
        {/* X labels */}
        {data.map((d, i) => (
          i % 2 === 0 ? (
            <text key={i} x={toX(i)} y={svgH - 2} textAnchor="middle" fontSize={9} fill="#9B9B9B">{d.day}</text>
          ) : null
        ))}
        {/* Today marker */}
        <circle cx={toX(7)} cy={toY(370)} r={5} fill="#0A0A0A" />
        <circle cx={toX(7)} cy={toY(370)} r={9} fill="none" stroke="#0A0A0A" strokeWidth={1.5} opacity={0.3} />
      </svg>
      <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(245,158,11,0.08)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
        <AlertTriangle size={13} color="#b45309" />
        <span style={{ fontSize: 12, color: "#b45309", fontWeight: 500 }}>Estimated depletion in ~5 days · Last confirmed: 2h ago · Data quality: 91%</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// FEATURE PILLAR (numbered)
// ──────────────────────────────────────────
function Pillar({ num, title, desc, icon }: { num: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div style={{ padding: "48px 0", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 32, alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "var(--fg-muted)", fontWeight: 500, letterSpacing: "0.04em" }}>{num}</span>
      <div>
        <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.7, maxWidth: 540 }}>{desc}</p>
      </div>
      <div style={{
        width: 72, height: 72, borderRadius: 16, border: "1px solid var(--border)",
        background: "white", display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0
      }}>{icon}</div>
    </div>
  );
}

// ──────────────────────────────────────────
// PRICING CARD
// ──────────────────────────────────────────
function PricingCard({ tier, price, desc, features, cta, highlighted }: {
  tier: string; price: string; desc: string; features: string[]; cta: string; highlighted?: boolean;
}) {
  return (
    <div style={{
      flex: 1, padding: "40px 32px",
      border: `1px solid ${highlighted ? "#0A0A0A" : "var(--border)"}`,
      borderRadius: 16, background: highlighted ? "#0A0A0A" : "white",
      display: "flex", flexDirection: "column", gap: 0,
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: highlighted ? "rgba(255,255,255,0.6)" : "var(--fg-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{tier}</div>
        <div style={{ fontSize: 14, color: highlighted ? "rgba(255,255,255,0.5)" : "var(--fg-subtle)", marginBottom: 20 }}>{desc}</div>
        <div style={{ borderTop: `1px solid ${highlighted ? "rgba(255,255,255,0.1)" : "var(--border)"}`, paddingTop: 20 }}>
          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", color: highlighted ? "white" : "var(--fg)" }}>{price}</span>
          {price !== "Custom" && <span style={{ fontSize: 14, color: highlighted ? "rgba(255,255,255,0.5)" : "var(--fg-muted)" }}> /month</span>}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 2, color: highlighted ? "rgba(255,255,255,0.7)" : "var(--fg-muted)" }} />
            <span style={{ fontSize: 14, color: highlighted ? "rgba(255,255,255,0.8)" : "var(--fg-muted)", lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
      <a href="/app" style={{
        padding: "14px 0", borderRadius: 100, textAlign: "center",
        background: highlighted ? "white" : "transparent",
        color: highlighted ? "#0A0A0A" : "var(--fg)",
        border: `1px solid ${highlighted ? "white" : "var(--border-strong)"}`,
        fontWeight: 600, fontSize: 14, textDecoration: "none",
        transition: "all 0.2s ease",
        display: "block",
      }}>{cta} →</a>
    </div>
  );
}

// ──────────────────────────────────────────
// FAQ ITEM
// ──────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{q}</span>
        <ChevronDown size={18} color="var(--fg-muted)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ paddingBottom: 20, fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, position: "relative", overflow: "hidden" }} className="grid-pattern">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ maxWidth: 800 }}>
            {/* Eyebrow */}
            <div className="animate-fade-in" style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
              padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)",
              background: "white", fontSize: 13, fontWeight: 500, color: "var(--fg-muted)"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              Predictive Logistics Decision Platform
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in delay-100" style={{
              fontSize: "clamp(52px, 7vw, 88px)",
              fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0,
              marginBottom: 28
            }}>
              The platform<br />to sustain<br />operations.
            </h1>

            {/* Sub */}
            <p className="animate-fade-in delay-200" style={{
              fontSize: 18, color: "var(--fg-muted)", lineHeight: 1.7, maxWidth: 520, marginBottom: 40
            }}>
              Uncertainty-aware inventory twin, predictive demand forecasting, mission dependency graphs, and human-in-the-loop approval — all in one platform.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in delay-300" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/app" className="btn-primary" style={{ fontSize: 15, padding: "14px 28px" }}>
                Explore demo workspace <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="btn-outline" style={{ fontSize: 15, padding: "14px 28px" }}>
                <Play size={14} /> Watch walkthrough
              </a>
            </div>

            {/* Note */}
            <p className="animate-fade-in delay-400" style={{ marginTop: 20, fontSize: 12, color: "var(--fg-subtle)" }}>
              No payment required · Synthetic demo data · Isolated workspace
            </p>
          </div>

          {/* Hero stats */}
          <div className="animate-fade-in delay-500" style={{
            marginTop: 72, display: "flex", gap: 0, borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)"
          }}>
            {[
              { num: 8, suffix: "", label: "Solution pillars" },
              { num: 5, suffix: " sites", label: "Synthetic network nodes" },
              { num: 100, suffix: " scenarios", label: "Disruption stress tests" },
              { num: 18, suffix: ".4 days", label: "Demo DMS estimate" },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: "32px 24px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none"
              }}>
                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 6 }}>
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "48px 0", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <ForecastChartDemo />
            <DependencyGraphDemo />
          </div>
        </div>
      </section>

      {/* ── FEATURES / PILLARS ── */}
      <section id="features" className="section" style={{ background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              Eight pillars
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", maxWidth: 600, lineHeight: 1.1 }}>
              Not just a dashboard. A decision-support architecture.
            </h2>
          </div>

          <Pillar num="01" title="Uncertainty-Aware Logistics Twin"
            desc="Every inventory observation carries a value, timestamp, and confidence range. As data ages, uncertainty grows. As fresh reports arrive, estimates narrow. The twin never silently replaces a confirmed observation with a model estimate."
            icon={<Database size={28} color="var(--fg-muted)" />} />
          <Pillar num="02" title="Predictive Demand & Consumption Engine"
            desc="Forecast consumption and depletion using historical records, unit context, weather signals, and recent trends. Identify potential shortages before physical stock-outs occur and trigger pre-positioning decisions."
            icon={<TrendingUp size={28} color="var(--fg-muted)" />} />
          <Pillar num="03" title="Mission-Sustainability Dependency Graph"
            desc="Model supply-to-capability dependencies: Fuel → Generator → Cold Storage availability. Calculate downstream consequences of shortages. Compute Days of Mission Sustainability — the estimated time until the first critical capability hits its failure threshold."
            icon={<GitBranch size={28} color="var(--fg-muted)" />} />
          <Pillar num="04" title="Dynamic Mission-Aware Routing"
            desc="Planning includes route accessibility, weather and terrain conditions, vehicle availability, urgency, and time windows. When conditions change, re-planning is triggered automatically. A feasible mission-aware movement plan, not just the shortest route."
            icon={<Globe size={28} color="var(--fg-muted)" />} />
          <Pillar num="05" title="Resilience & Robustness Certification"
            desc="Stress-test candidate plans against sampled disruptions: route loss, vehicle failure, demand spikes, weather deterioration, and delayed reports. Receive a Robustness Report with scenario-survival statistics, vulnerable locations, and contingency recommendations."
            icon={<Shield size={28} color="var(--fg-muted)" />} />
          <Pillar num="06" title="Adaptive Classical–Quantum Optimization"
            desc="A solver-selection layer chooses the appropriate backend. Classical heuristics handle urgent or simple cases. QUBO/QAOA hybrid methods can be benchmarked on selected combinatorial sub-problems — quantum is an optional backend, not a blanket claim."
            icon={<Zap size={28} color="var(--fg-muted)" />} />
          <Pillar num="07" title="Human-in-the-Loop Explainability"
            desc="AI recommends. Humans review, approve, modify, or reject. Every recommendation exposes primary drivers, supporting observations, uncertainties, trade-offs, and alternatives. Workflow: Recommend → Explain → Human decision → Execute or Re-plan."
            icon={<Users size={28} color="var(--fg-muted)" />} />
          <Pillar num="08" title="Resilient Field Data Layer"
            desc="Simulated ESP32/LoRa devices buffer observations locally when connectivity is unavailable. Data synchronizes when backhaul is restored — preserving original observation timestamps. The twin reasons under delayed and intermittent reporting conditions."
            icon={<Activity size={28} color="var(--fg-muted)" />} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", maxWidth: 600, lineHeight: 1.1 }}>
              End-to-end from field observation to approved plan.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0 }}>
            {[
              { step: "01", title: "Collect Observations", desc: "Field sensors, manual entries, and LoRa telemetry stream inventory data with timestamps and confidence levels." },
              { step: "02", title: "Update the Twin", desc: "The Belief-State Twin fuses observations with age-aware uncertainty — never replacing confirmed values." },
              { step: "03", title: "Forecast Demand", desc: "Baseline forecasting predicts depletion windows and shortage probabilities over configurable horizons." },
              { step: "04", title: "Map Dependencies", desc: "The mission graph propagates supply shortages through capability dependencies to compute DMS." },
              { step: "05", title: "Generate Plans", desc: "The planner produces candidate logistics plans respecting vehicle capacity, route windows, and priorities." },
              { step: "06", title: "Stress-Test", desc: "Scenario Lab runs 100+ disruption simulations against each plan, producing a Robustness Report." },
              { step: "07", title: "Human Decision", desc: "An authorized reviewer approves, modifies, or rejects. Explainable reasons are shown for every recommendation." },
              { step: "08", title: "Re-Plan Loop", desc: "Fresh observations update the twin, triggering re-planning. Audit events capture every decision for traceability." },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "32px 28px",
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                borderTop: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
                <p style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section id="security" className="section" style={{ background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Security</div>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 24 }}>
                Honest encryption. No inflated claims.
              </h2>
              <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.8, marginBottom: 32 }}>
                We use two distinct protection models. Operational analytics data is protected in transit via TLS and at rest via storage encryption — accessible only by authorized backend services for forecasting and planning.
              </p>
              <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.8, marginBottom: 32 }}>
                For confidential planning notes and discussion, optional client-side E2EE is clearly labeled and scoped. We do not claim end-to-end encryption for data the backend must process.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "TLS in transit + storage encryption at rest",
                  "Tenant-isolated queries, jobs, cache, and events",
                  "Server-side authorization on every protected endpoint",
                  "Role-based access: Owner, Admin, Planner, Approver, Viewer, Auditor",
                  "Append-only audit events with actor, action, and version",
                  "E2EE scope clearly labeled — no inflated claims",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={15} style={{ color: "#22c55e", flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontSize: 14, color: "var(--fg-muted)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {[
                { icon: <Lock size={20} />, title: "Transport Security", desc: "All data in transit protected with TLS. CORS and CSP configured restrictively." },
                { icon: <Shield size={20} />, title: "Tenant Isolation", desc: "Organization boundaries enforced at database, cache, storage, and job level. Automated negative tests verify cross-tenant denial." },
                { icon: <Users size={20} />, title: "Role Enforcement", desc: "Backend authorization on every endpoint. Hiding a button is not an authorization control." },
                { icon: <FileText size={20} />, title: "Audit Trail", desc: "Every decision event records actor, organization, action, affected resource, timestamp, and outcome." },
              ].map((card, i) => (
                <div key={i} style={{
                  padding: "20px 24px", borderRadius: 12, border: "1px solid var(--border)",
                  background: "var(--bg)", marginBottom: 12, display: "flex", gap: 16, alignItems: "flex-start"
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{card.title}</div>
                    <div style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6 }}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="section" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
              Start free. Scale when you need.
            </h2>
            <p style={{ fontSize: 16, color: "var(--fg-muted)", maxWidth: 480, margin: "0 auto" }}>
              Illustrative pricing — configurable to your organization's requirements.
            </p>
            <p style={{ fontSize: 12, color: "var(--fg-subtle)", marginTop: 8 }}>
              [Synthetic demonstration — not established company pricing]
            </p>
          </div>

          <div style={{ display: "flex", gap: 0, border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
            <PricingCard
              tier="Starter"
              price="$0"
              desc="For small teams exploring predictive logistics."
              features={[
                "Up to 5 locations",
                "Inventory twin with staleness tracking",
                "Baseline moving-average forecasts",
                "Simple dependency graph (up to 10 nodes)",
                "25 scenario runs/month",
                "3 team members",
                "Email support",
              ]}
              cta="Start free"
            />
            <PricingCard
              tier="Growth"
              price="$349"
              desc="For operational teams requiring approvals and integrations."
              features={[
                "Up to 25 locations",
                "Advanced uncertainty-aware estimation",
                "Extended forecast horizons",
                "Full dependency graph",
                "500 scenario runs/month",
                "Approval workflows with audit trail",
                "CSV/PDF report exports",
                "15 team members",
                "API access",
                "Priority support",
              ]}
              cta="Start 14-day trial"
              highlighted
            />
            <PricingCard
              tier="Enterprise"
              price="Custom"
              desc="For large-scale operations with custom requirements."
              features={[
                "Unlimited locations",
                "Custom seat count",
                "Telemetry device integrations",
                "SSO (where supported)",
                "Dedicated onboarding",
                "SLA arrangements",
                "Custom data retention",
                "On-premise options",
                "Custom contract terms",
              ]}
              cta="Contact sales"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.04em" }}>Common questions.</h2>
          </div>

          <FAQItem q="How does MST handle stale inventory reports?"
            a="The Belief-State Twin tracks the age of every observation. As a report ages, the estimated uncertainty range grows. When a fresh observation arrives, the range narrows. The confirmed value and its provenance are always preserved — the system never silently replaces a field observation with a model estimate." />
          <FAQItem q="Can the platform operate with intermittent connectivity?"
            a="Yes. The Telemetry & Sync module simulates a LoRa/ESP32 field device that buffers observations locally when backhaul is unavailable. Observations synchronize when connectivity is restored, preserving original observation timestamps and using message IDs to prevent duplicates." />
          <FAQItem q="What does the continuity metric (DMS) mean?"
            a="Days of Mission Sustainability is the estimated time until the first configured critical capability crosses its failure threshold, based on the current inventory estimate and forecast. If no threshold is crossed within the modeled horizon, the system displays 'No estimated failure within the modeled horizon.' It is not a guarantee of real-world readiness." />
          <FAQItem q="What is a scenario-based robustness report?"
            a="The Scenario Lab runs a configured number of disruption scenarios (e.g. route closure, vehicle unavailability, demand spike) against candidate plans using reproducible random seeds. The output — called a 'Robustness Report' — shows feasibility rate, service-threshold survival, vulnerable locations, and suggested contingencies. It is clearly labeled as a simulation summary, not a guarantee." />
          <FAQItem q="Is quantum computing required?"
            a="No. Quantum/hybrid optimization is an optional, selectable backend for specific combinatorial sub-problems. Classical solvers (OR-Tools or equivalent) handle all planning by default. The platform benchmarks quantum against classical baselines rather than assuming quantum superiority." />
          <FAQItem q="What requires human approval?"
            a="All candidate plans require explicit human approval before any execution is recorded. Material changes to routes, quantities, constraints, or assumptions create a new plan version and require fresh approval. The system supports Draft → Evaluated → Pending Approval → Approved/Rejected/Changes Requested states." />
          <FAQItem q="Which content is end-to-end encrypted?"
            a="E2EE is scoped to confidential collaboration: private planning notes, confidential discussion messages, and selected attachments. Operational analytics data (inventory, forecasts, plans) is protected in transit and at rest by TLS and storage encryption, but is readable by authorized backend services for forecasting. We do not claim E2EE for data the backend must process." />
          <FAQItem q="Can I start with synthetic data?"
            a="Yes. The 'Explore with sample data' onboarding shortcut loads a deterministic seed dataset: Northstar Remote Operations Demo with 5 fictional sites, 4 vehicles, 5 resource types, 30 days of consumption history, and pre-configured disruption scenarios. No payment required." />

          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ background: "var(--fg)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", color: "white", lineHeight: 1.0, marginBottom: 24 }}>
            Ready to make decisions<br />under uncertainty?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", marginBottom: 40, lineHeight: 1.7 }}>
            Open an isolated demo workspace. No payment required.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/app" style={{
              padding: "16px 32px", background: "white", color: "#0A0A0A", borderRadius: 100,
              fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.2s"
            }}>
              Explore demo workspace <ArrowRight size={16} />
            </Link>
            <a href="#pricing" style={{
              padding: "16px 32px", background: "transparent", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 100, fontWeight: 500, fontSize: 16, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              View pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0A0A0A", padding: "48px 0 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={14} color="white" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "white" }}>MST Platform</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 280 }}>
                Mission-Sustainability Twin: a predictive logistics decision-support architecture for forward supply chains.
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 16, lineHeight: 1.7 }}>
                All metrics shown are synthetic demonstrations. Not real operational, military, or organizational data.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Overview", "Inventory Twin", "Forecasts", "Dependency Graph", "Plan Builder", "Scenario Lab", "Approvals"] },
              { title: "Product", links: ["Features", "Pricing", "Security", "Changelog", "Roadmap", "API Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Privacy Policy", "Terms of Service", "Security Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              © 2026 MST Platform · Synthetic demonstration · Not operational military data
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              Built for brainstorming and evaluation purposes
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
