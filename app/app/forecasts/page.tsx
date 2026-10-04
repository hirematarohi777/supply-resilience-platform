"use client";

import { useState } from "react";
import { FORECAST_DATA, LOCATIONS } from "@/lib/demoData";
import { AlertTriangle, Info, TrendingDown, RefreshCw, ChevronDown } from "lucide-react";

const SERIES_KEY_MAP: Record<string, string> = {
  "ridge-fuel": "ridge-fuel",
  "lake-fuel": "lake-fuel",
};

export default function ForecastsPage() {
  const [selected, setSelected] = useState("ridge-fuel");
  const [horizon, setHorizon] = useState(7);

  const data = FORECAST_DATA[selected as keyof typeof FORECAST_DATA];
  if (!data) return null;

  const series = data.series.slice(0, data.series.findIndex(d => d.day === horizon - data.series[0].day));
  const allSeries = data.series;

  // Chart dims
  const maxV = 750, minV = 0;
  const svgW = 640, svgH = 220;
  const padL = 40, padR = 16, padT = 16, padB = 32;
  const cW = svgW - padL - padR, cH = svgH - padT - padB;
  const toY = (v: number) => padT + cH - ((v - minV) / (maxV - minV)) * cH;
  const toX = (i: number) => padL + (i / (allSeries.length - 1)) * cW;

  const actualPts = allSeries.filter(d => d.actual !== undefined).map((d, _, arr) => `${toX(allSeries.indexOf(d))},${toY(d.actual!)}`).join(" ");
  const forecastPts = allSeries.filter(d => d.forecast !== undefined).map(d => `${toX(allSeries.indexOf(d))},${toY(d.forecast!)}`).join(" ");

  const areaCoords = allSeries.filter(d => d.low !== undefined && d.high !== undefined);
  const areaPath = areaCoords.map(d => `${toX(allSeries.indexOf(d))},${toY(d.high!)}`).join(" L ") +
    " L " + [...areaCoords].reverse().map(d => `${toX(allSeries.indexOf(d))},${toY(d.low!)}`).join(" L ");

  const todayIdx = allSeries.findIndex(d => d.day === 0);
  const depleteIdx = allSeries.findIndex(d => (d.forecast ?? Infinity) < 50);

  return (
    <div style={{ padding: "32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Demand Forecasts</h1>
          <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Predictive consumption and depletion estimates · Model: {data.method}</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", color: "var(--fg-muted)" }}>
          <RefreshCw size={13} /> Recalculate
        </button>
      </div>

      {/* Selectors */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Item & Location</label>
          <select value={selected} onChange={e => setSelected(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, outline: "none" }}>
            <option value="ridge-fuel">Ridge Site — Generator Fuel</option>
            <option value="lake-fuel">Lake Site — Generator Fuel</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Forecast Horizon</label>
          <select value={horizon} onChange={e => setHorizon(Number(e.target.value))}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 13, outline: "none" }}>
            {[3, 5, 7, 10, 14].map(h => <option key={h} value={h}>{h} days</option>)}
          </select>
        </div>
      </div>

      {/* Metric row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Estimated Depletion", value: `Day +${data.depleteDay}`, sub: "Earliest estimate", color: data.shortageRisk > 0.8 ? "#dc2626" : "#b45309" },
          { label: "Shortage Risk", value: `${Math.round(data.shortageRisk * 100)}%`, sub: "Uncalibrated estimate", color: data.shortageRisk > 0.8 ? "#dc2626" : "#b45309" },
          { label: "Forecast Method", value: "Baseline", sub: data.method, color: "var(--fg)" },
          { label: "Last Computed", value: "8m ago", sub: "Auto-refresh enabled", color: "var(--fg)" },
        ].map((m, i) => (
          <div key={i} style={{ background: "white", borderRadius: 10, border: "1px solid var(--border)", padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: m.color, marginBottom: 2 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{data.item} — {data.location}</div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>Historical consumption & forecast with uncertainty interval · {data.unit}</div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--fg-muted)", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 20, height: 2.5, background: "#0A0A0A", borderRadius: 1 }} /> Confirmed
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 20, height: 0, borderTop: "2px dashed #3b82f6" }} /> Forecast
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 20, height: 10, background: "rgba(59,130,246,0.12)", borderRadius: 2 }} /> Interval
            </span>
          </div>
        </div>
        <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
          {/* Grid */}
          {[100, 200, 300, 400, 500, 600, 700].map(v => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={svgW - padR} y2={toY(v)} stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
              <text x={padL - 4} y={toY(v) + 3} textAnchor="end" fontSize={9} fill="#9B9B9B">{v}</text>
            </g>
          ))}
          {/* Today separator */}
          {todayIdx >= 0 && (
            <line x1={toX(todayIdx)} y1={padT} x2={toX(todayIdx)} y2={svgH - padB} stroke="#0A0A0A" strokeWidth={1} strokeDasharray="4,3" opacity={0.3} />
          )}
          {/* Depletion warning */}
          {depleteIdx > todayIdx && (
            <line x1={toX(depleteIdx)} y1={padT} x2={toX(depleteIdx)} y2={svgH - padB} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6} />
          )}
          {/* Uncertainty band */}
          {areaCoords.length > 1 && <polygon points={areaPath} fill="rgba(59,130,246,0.08)" />}
          {/* Forecast line */}
          {forecastPts && <polyline points={forecastPts} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5,3" />}
          {/* Actual line */}
          {actualPts && <polyline points={actualPts} fill="none" stroke="#0A0A0A" strokeWidth={2.5} />}
          {/* Today dot */}
          {todayIdx >= 0 && allSeries[todayIdx].actual !== undefined && (
            <circle cx={toX(todayIdx)} cy={toY(allSeries[todayIdx].actual!)} r={5} fill="#0A0A0A" />
          )}
          {/* X axis labels */}
          {allSeries.map((d, i) => (
            i % 2 === 0 ? <text key={i} x={toX(i)} y={svgH - 4} textAnchor="middle" fontSize={9} fill="#9B9B9B">D{d.day >= 0 ? `+${d.day}` : d.day}</text> : null
          ))}
          {/* "Today" label */}
          {todayIdx >= 0 && <text x={toX(todayIdx)} y={padT - 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0A0A0A">Today</text>}
          {/* Depletion label */}
          {depleteIdx > 0 && <text x={toX(depleteIdx)} y={padT - 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">Risk</text>}
        </svg>
      </div>

      {/* Notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "14px 16px", background: "rgba(59,130,246,0.06)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "#1d4ed8", lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Model Information</div>
          Method: {data.method}<br/>
          Uncertainty range derived from historical residuals (simulation assumption).<br/>
          Insufficient data will be shown explicitly rather than fabricated.
        </div>
        <div style={{ padding: "14px 16px", background: "rgba(245,158,11,0.06)", borderRadius: 10, border: "1px solid rgba(245,158,11,0.15)", fontSize: 12, color: "#b45309", lineHeight: 1.7 }}>
          <AlertTriangle size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
          <strong>Uncalibrated estimates.</strong> Shortage risk % is a heuristic score, not a statistically calibrated probability. Report age for this location is &gt;7h — uncertainty ranges are expanded. Treat forecast with increased caution.
        </div>
      </div>
    </div>
  );
}
