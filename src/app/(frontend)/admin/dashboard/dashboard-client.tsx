"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar, Activity, ArrowLeft, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VisitorLog {
  id: string | number;
  timestamp: string;
}

interface DashboardClientProps {
  initialData: VisitorLog[];
}

const CHART_HEIGHT = 350;
const CHART_PADDING = { top: 40, right: 30, bottom: 40, left: 50 };

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [timeframe, setTimeframe] = useState<7 | 30 | 90>(30);
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
    index: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(800);

  // Adjust chart width dynamically on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Compute date list and match counts based on timeframe
  const chartData = useMemo(() => {
    const dataPoints = [];
    const countsByDate: Record<string, number> = {};

    // Group logs by local date string YYYY-MM-DD
    initialData.forEach((log) => {
      const date = new Date(log.timestamp);
      const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;
      countsByDate[localDateStr] = (countsByDate[localDateStr] || 0) + 1;
    });

    // Generate consecutive dates up to today
    const today = new Date();
    for (let i = timeframe - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(d.getDate()).padStart(2, "0")}`;

      // Format human-readable date for labels (e.g. "Jul 23")
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dataPoints.push({
        dateStr,
        label,
        count: countsByDate[dateStr] || 0,
      });
    }

    return dataPoints;
  }, [initialData, timeframe]);

  // General KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(today.getDate()).padStart(2, "0")}`;

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(yesterday.getDate()).padStart(2, "0")}`;

    // Total unique logs
    const totalAllTime = initialData.length;

    // Filter counts
    let todayCount = 0;
    let yesterdayCount = 0;
    let thisWeekCount = 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    initialData.forEach((log) => {
      const date = new Date(log.timestamp);
      const logStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;

      if (logStr === todayStr) todayCount++;
      if (logStr === yesterdayStr) yesterdayCount++;
      if (date >= sevenDaysAgo) thisWeekCount++;
    });

    const diff = todayCount - yesterdayCount;
    const percentageChange =
      yesterdayCount > 0
        ? `${diff >= 0 ? "+" : ""}${Math.round((diff / yesterdayCount) * 100)}%`
        : null;

    return {
      totalAllTime,
      todayCount,
      thisWeekCount,
      percentageChange,
      yesterdayCount,
    };
  }, [initialData]);

  // Compute SVG plotting path details
  const maxCount = useMemo(() => {
    const counts = chartData.map((d) => d.count);
    const max = Math.max(...counts, 0);
    return max === 0 ? 5 : Math.ceil(max * 1.1); // add 10% breathing room
  }, [chartData]);

  const points = useMemo(() => {
    const w = chartWidth - CHART_PADDING.left - CHART_PADDING.right;
    const h = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
    const stepX = chartData.length > 1 ? w / (chartData.length - 1) : w;

    return chartData.map((d, index) => {
      const x = CHART_PADDING.left + index * stepX;
      const y = CHART_HEIGHT - CHART_PADDING.bottom - (d.count / maxCount) * h;
      return { x, y, count: d.count, label: d.label, index };
    });
  }, [chartData, chartWidth, maxCount]);

  // Construct SVG Path strings
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const start = `M ${points[0].x} ${CHART_HEIGHT - CHART_PADDING.bottom}`;
    const line = points.reduce((path, p) => `${path} L ${p.x} ${p.y}`, start);
    return `${line} L ${points[points.length - 1].x} ${CHART_HEIGHT - CHART_PADDING.bottom} Z`;
  }, [points]);

  // Handle SVG mouse movement to update tooltip position
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;

    // Find closest point by X coordinate
    let closestPoint = points[0];
    let minDistance = Math.abs(closestPoint?.x - mouseX);

    for (let i = 1; i < points.length; i++) {
      const dist = Math.abs(points[i].x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestPoint = points[i];
      }
    }

    if (closestPoint) {
      setHoveredPoint({
        date: chartData[closestPoint.index].label,
        count: closestPoint.count,
        x: closestPoint.x,
        y: closestPoint.y,
        index: closestPoint.index,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="font-ui bg-background min-h-screen w-full px-6 py-8 text-zinc-100 md:px-12 md:py-12">
      {/* Top Header */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Link
              href="/admin"
              className="hover:text-brand-crimson hover:border-brand-crimson/30 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 transition-all duration-300"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
              Admin Console
            </span>
          </div>
          <h1 className="font-display bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
            Visitor Statistics
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Auto-tracking enabled</span>
          <span className="relative flex h-2 w-2">
            <span className="bg-brand-crimson absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
            <span className="bg-brand-crimson relative inline-flex h-2 w-2 rounded-full"></span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Card 1: Total */}
        <div className="border-zinc-850 relative overflow-hidden rounded-2xl border bg-zinc-950/40 p-6 backdrop-blur-md">
          <div className="bg-brand-crimson/5 absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full blur-3xl" />
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Total Unique Visitors
            </span>
            <div className="bg-brand-crimson/10 text-brand-crimson flex size-8 items-center justify-center rounded-lg">
              <Users className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {kpis.totalAllTime.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500">all-time</span>
          </div>
        </div>

        {/* Card 2: Today */}
        <div className="border-zinc-850 relative overflow-hidden rounded-2xl border bg-zinc-950/40 p-6 backdrop-blur-md">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Unique Visitors Today
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {kpis.todayCount.toLocaleString()}
            </span>
            {kpis.percentageChange && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  kpis.todayCount >= kpis.yesterdayCount
                    ? "border border-emerald-900/30 bg-emerald-950/50 text-emerald-400"
                    : "border border-rose-900/30 bg-rose-950/50 text-rose-400"
                }`}
              >
                {kpis.percentageChange} vs yesterday
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Last 7 Days */}
        <div className="border-zinc-850 relative overflow-hidden rounded-2xl border bg-zinc-950/40 p-6 backdrop-blur-md">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Weekly Visitors (7d)
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {kpis.thisWeekCount.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500">active</span>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="border-zinc-850 rounded-2xl border bg-zinc-950/20 p-6 backdrop-blur-md">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="text-brand-crimson size-4" />
            <h2 className="text-sm font-semibold tracking-wider text-zinc-200 uppercase">
              Visitor Trends
            </h2>
          </div>

          {/* Timeframe Selection */}
          <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-1">
            {([7, 30, 90] as const).map((days) => (
              <button
                key={days}
                onClick={() => setTimeframe(days)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                  timeframe === days
                    ? "bg-brand-crimson text-white shadow-[0_0_12px_rgba(220,20,60,0.4)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>

        {/* SVG Render Container */}
        <div ref={containerRef} className="relative w-full overflow-hidden select-none">
          <svg
            width={chartWidth}
            height={CHART_HEIGHT}
            className="overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Gradient for area fill */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-crimson)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--brand-crimson)" stopOpacity="0.00" />
              </linearGradient>
              {/* Grid line pattern */}
              <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.05" />
                <stop offset="10%" stopColor="#3f3f46" stopOpacity="0.15" />
                <stop offset="90%" stopColor="#3f3f46" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3f3f46" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const h = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
              const y = CHART_PADDING.top + ratio * h;
              const value = Math.round(maxCount * (1 - ratio));
              return (
                <g key={index} className="opacity-60">
                  <line
                    x1={CHART_PADDING.left}
                    y1={y}
                    x2={chartWidth - CHART_PADDING.right}
                    y2={y}
                    stroke="url(#gridGradient)"
                    strokeWidth={1}
                    strokeDasharray="4,6"
                  />
                  <text
                    x={CHART_PADDING.left - 12}
                    y={y + 4}
                    fill="#71717a"
                    fontSize={10}
                    textAnchor="end"
                    className="font-medium"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* X-axis date labels */}
            {points.map((p, idx) => {
              // Only draw some labels on 30 and 90 view to avoid clutter
              const showLabel =
                timeframe === 7 ||
                (timeframe === 30 && idx % 4 === 0) ||
                (timeframe === 90 && idx % 12 === 0) ||
                idx === points.length - 1;

              if (!showLabel) return null;

              return (
                <text
                  key={idx}
                  x={p.x}
                  y={CHART_HEIGHT - CHART_PADDING.bottom + 20}
                  fill="#71717a"
                  fontSize={9}
                  textAnchor="middle"
                  className="font-medium"
                >
                  {p.label}
                </text>
              );
            })}

            {/* The Area Fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#areaGradient)"
                className="transition-all duration-300"
              />
            )}

            {/* The Line Stroke */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="var(--brand-crimson)"
                strokeWidth={2.5}
                filter="url(#glow)"
                className="transition-all duration-300"
              />
            )}

            {/* Interactive Grid Line on Hover */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1={CHART_PADDING.top}
                x2={hoveredPoint.x}
                y2={CHART_HEIGHT - CHART_PADDING.bottom}
                stroke="#4b5563"
                strokeWidth={1}
                strokeDasharray="2,4"
              />
            )}

            {/* Interactive Dot on Hover */}
            {hoveredPoint && (
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={5.5}
                fill="var(--foreground)"
                stroke="var(--brand-crimson)"
                strokeWidth={3.5}
                className="shadow-[0_0_8px_color-mix(in_srgb,var(--brand-crimson)_80%,transparent)]"
              />
            )}
          </svg>

          {/* Interactive Tooltip Overlay */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  left: hoveredPoint.x - 65,
                  top: Math.max(hoveredPoint.y - 75, 10),
                }}
                className="pointer-events-none z-20 flex w-[130px] flex-col items-center rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 shadow-2xl backdrop-blur-md"
              >
                <span className="text-[9px] font-semibold text-zinc-500 uppercase">
                  {hoveredPoint.date}
                </span>
                <span className="text-base font-bold text-white">
                  {hoveredPoint.count}{" "}
                  <span className="text-[10px] font-medium text-zinc-400">visitors</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent Visitors Activity table */}
      <div className="border-zinc-850 mt-8 rounded-2xl border bg-zinc-950/20 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Recent Visitor Logs (Latest 10)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-zinc-850 border-b pb-2 text-zinc-500">
                <th className="py-2.5 font-semibold tracking-wider uppercase">Log ID</th>
                <th className="py-2.5 font-semibold tracking-wider uppercase">Time Checked In</th>
                <th className="py-2.5 text-right font-semibold tracking-wider uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {initialData.slice(0, 10).map((log) => {
                const date = new Date(log.timestamp);
                return (
                  <tr key={log.id} className="border-zinc-850 border-b hover:bg-zinc-900/10">
                    <td className="py-3 font-mono text-zinc-400">visitor_{log.id}</td>
                    <td className="py-3 text-zinc-300">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <span className="rounded-full border border-emerald-500/15 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium tracking-wider text-emerald-400 uppercase">
                        Success
                      </span>
                    </td>
                  </tr>
                );
              })}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center font-medium text-zinc-500">
                    No visitors recorded yet. Visit the home page to trigger logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
