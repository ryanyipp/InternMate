// pages/Recommended.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";
import { getThemeColors } from "../utils/theme";
import { getInternship } from "../api/index";
import { CartesianGrid, Area, AreaChart } from "recharts";


import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckBadgeIcon,
  BellAlertIcon,
  FireIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const STATUS_COLOR_MAP = {
  Accepted: "#10B981",   // green
  Rejected: "#EF4444",   // red
  Pending:  "#F59E0B",   // orange
  "Follow Up": "#3B82F6",// blue
  Withdrawn: "#6B7280",  // grey
  Unknown: "#9CA3AF",
};
const normalizeStatus = (s) => {
  const raw = (s || "Unknown").trim();
  const lower = raw.toLowerCase();

  if (lower === "follow up" || lower === "follow-up" || lower === "followup") return "Follow Up";
  if (lower === "withdrawn" || lower === "withdraw") return "Withdrawn";
  if (lower === "accepted" || lower === "offer" || lower === "offered") return "Accepted";
  if (lower === "rejected" || lower === "reject") return "Rejected";
  if (lower === "pending") return "Pending";

  // fallback: Title Case unknown statuses
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export default function Recommended({ isDark, toggleDarkMode }) {
  const colors = getThemeColors(isDark);

  const [apps, setApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // fetch real internships (same approach as MainTable: getInternship() then filter by currentUser.id):contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoadingApps(true);
        const { data } = await getInternship();

        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));
        const currentUserID = currentUser?.id;

        const filtered = (data || []).filter(
          (intern) => String(intern.user) === String(currentUserID)
        );

        setApps(filtered);
      } catch (e) {
        setApps([]);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, []);

  const metrics = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const safeDate = (d) => {
      const x = new Date(d);
      return isNaN(x.getTime()) ? null : x;
    };

    // you can decide whether to include archived or not.
    // MainTable filters archived via activeTab logic:contentReference[oaicite:6]{index=6}.
    // For insights, default to NON-archived (current applications).
    const current = apps.filter((a) => !a.archived);

    const total = current.length;

    const isSameMonth = (d, ref) =>
      d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

    const thisMonth = current.filter((a) => {
      const d = safeDate(a.applicationDate);
      return d ? isSameMonth(d, today) : false;
    }).length;

    const daysBackCount = (days) => {
      const from = new Date(startOfToday);
      from.setDate(from.getDate() - (days - 1));
      const count = current.filter((a) => {
        const d = safeDate(a.applicationDate);
        return d ? d >= from && d <= today : false;
      }).length;
      return count;
    };

    const last7 = daysBackCount(7);
    const last30 = daysBackCount(30);

    const avg7 = total === 0 ? 0 : last7 / 7;
    const avg30 = total === 0 ? 0 : last30 / 30;

    const accepted = current.filter((a) => (a.status || "").toLowerCase() === "accepted").length;
    const followUp = current.filter((a) => (a.status || "").toLowerCase() === "follow up").length;

    // Status breakdown (group by status)
    const statusMap = new Map();
    for (const a of current) {
      const k = normalizeStatus(a.status);
      statusMap.set(k, (statusMap.get(k) || 0) + 1);
    }
    const statusBreakdown = Array.from(statusMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((x, y) => y.value - x.value);

    // Streaks based on unique application days
    const uniqueDays = Array.from(
      new Set(
        current
          .map((a) => safeDate(a.applicationDate))
          .filter(Boolean)
          .map((d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
      )
    )
      .map((s) => {
        const [y, m, dd] = s.split("-").map(Number);
        return new Date(y, m, dd);
      })
      .sort((a, b) => a - b);

    const dayDiff = (a, b) => Math.round((b - a) / (1000 * 60 * 60 * 24));

    let currentStreak = 0;
    if (uniqueDays.length > 0) {
      const last = uniqueDays[uniqueDays.length - 1];
      const gapToToday = dayDiff(last, startOfToday);
      if (gapToToday === 0) {
        currentStreak = 1;
        for (let i = uniqueDays.length - 2; i >= 0; i--) {
          const gap = dayDiff(uniqueDays[i], uniqueDays[i + 1]);
          if (gap === 1) currentStreak++;
          else break;
        }
      } else {
        currentStreak = 0;
      }
    }

    let bestStreak = 0;
    let run = 0;
    for (let i = 0; i < uniqueDays.length; i++) {
      if (i === 0) run = 1;
      else {
        const gap = dayDiff(uniqueDays[i - 1], uniqueDays[i]);
        run = gap === 1 ? run + 1 : 1;
      }
      bestStreak = Math.max(bestStreak, run);
    }

    // Longest gap between application days (also consider gap from last application to today)
    let longestGap = 0;
    for (let i = 1; i < uniqueDays.length; i++) {
      longestGap = Math.max(longestGap, dayDiff(uniqueDays[i - 1], uniqueDays[i]) - 1);
    }
    if (uniqueDays.length > 0) {
      longestGap = Math.max(longestGap, dayDiff(uniqueDays[uniqueDays.length - 1], startOfToday));
    }

    // Monthly trend (last 6 months including this month)
    const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
    const monthLabel = (d) =>
      d.toLocaleString("en-US", { month: "short" });

    const monthCounts = new Map();
    for (const a of current) {
      const d = safeDate(a.applicationDate);
      if (!d) continue;
      const k = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      monthCounts.set(k, (monthCounts.get(k) || 0) + 1);
    }

    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const k = monthKey(d);
      trend.push({ date: monthLabel(d), count: monthCounts.get(k) || 0 });
    }

    return {
      total,
      thisMonth,
      avg7,
      avg30,
      accepted,
      followUp,
      statusBreakdown,
      trend,
      currentStreak,
      bestStreak,
      longestGap,
    };
  }, [apps]);

  const cardStyle = {
    background: colors.card,
    borderColor: colors.border,
    color: colors.foreground,
  };

  return (
    <>
      <Navbar isDark={isDark} toggleDarkMode={toggleDarkMode} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen flex justify-center px-4 sm:px-8 py-10"
        style={{ background: colors.background, color: colors.foreground }}
      >
        {/* ~80% center width */}
        <div className="w-full max-w-[1400px]">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold mb-1" style={{ color: colors.primary }}>
              Application Insights
            </h2>
            <p className="text-base" style={{ color: colors.mutedForeground }}>
              A quick snapshot of your application progress.
            </p>
          </div>

          {/* TOP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
            {/* Status Breakdown */}
            <div
              className="lg:col-span-5 rounded-2xl border p-5"
              style={cardStyle}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg" style={{ color: colors.cardForeground }}>
                  Status Breakdown
                </h4>
                <span className="text-sm" style={{ color: colors.mutedForeground }}>
                  {loadingApps ? "Loading..." : `${metrics.total} total`}
                </span>
              </div>

              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.statusBreakdown.length ? metrics.statusBreakdown : [{ name: "No data", value: 1 }]}
                      dataKey="value"
                      innerRadius={80}
                      outerRadius={105}
                      paddingAngle={2}
                    >
                      {(metrics.statusBreakdown.length ? metrics.statusBreakdown : [{ name: "Unknown", value: 1 }]).map(
                        (entry, i) => (
                          <Cell
                            key={`${entry.name}-${i}`}
                            fill={STATUS_COLOR_MAP[entry.name] || STATUS_COLOR_MAP.Unknown}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<ThemedTooltip colors={colors} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center mt-2">
                <p className="text-sm font-medium" style={{ color: colors.foreground }}>
                  {metrics.statusBreakdown[0]
                    ? `${metrics.statusBreakdown[0].value} ${metrics.statusBreakdown[0].name}`
                    : "No applications yet"}
                </p>
              </div>
            </div>

            {/* Stat tiles (smaller + tighter like your reference) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatTile
                label="Total Apps"
                value={metrics.total}
                Icon={ClipboardDocumentCheckIcon}
                colors={colors}
              />
              <StatTile
                label="Apps This Month"
                value={metrics.thisMonth}
                Icon={CalendarDaysIcon}
                colors={colors}
              />
              <StatTile
                label="Avg / Day (7d)"
                value={metrics.avg7.toFixed(1)}
                Icon={ClockIcon}
                colors={colors}
              />
              <StatTile
                label="Avg / Day (30d)"
                value={metrics.avg30.toFixed(1)}
                Icon={ClockIcon}
                colors={colors}
              />
              <StatTile
                label="Follow Ups"
                value={metrics.followUp}
                sublabel="Status: Follow Up"
                Icon={BellAlertIcon}
                colors={colors}
              />
              <StatTile
                label="Accepted"
                value={metrics.accepted}
                sublabel="Offers / Accepted"
                Icon={CheckBadgeIcon}
                colors={colors}
              />
            </div>
          </div>

          {/* STREAKS (next to each other) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <WideStat
              label="Current Streak"
              value={`${metrics.currentStreak} day${metrics.currentStreak === 1 ? "" : "s"}`}
              Icon={FireIcon}
              colors={colors}
            />
            <WideStat
              label="Best Streak"
              value={`${metrics.bestStreak} day${metrics.bestStreak === 1 ? "" : "s"}`}
              Icon={TrophyIcon}
              colors={colors}
            />
            <WideStat
              label="Longest Gap"
              value={`${metrics.longestGap} day${metrics.longestGap === 1 ? "" : "s"}`}
              sublabel="Longest gap without applying"
              Icon={ClockIcon}
              colors={colors}
            />
          </div>

          {/* TREND */}
          <div className="rounded-2xl border p-5" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg" style={{ color: colors.cardForeground }}>
                Application Trends
              </h4>
              <span className="text-sm" style={{ color: colors.mutedForeground }}>
                Last 6 months
              </span>
            </div>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    stroke={colors.border}
                    strokeOpacity={0.35}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke={colors.mutedForeground}
                    tick={{ fill: colors.mutedForeground, fontSize: 12 }}
                    axisLine={{ stroke: colors.border, strokeOpacity: 0.6 }}
                    tickLine={{ stroke: colors.border, strokeOpacity: 0.6 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke={colors.mutedForeground}
                    tick={{ fill: colors.mutedForeground, fontSize: 12 }}
                    axisLine={{ stroke: colors.border, strokeOpacity: 0.6 }}
                    tickLine={{ stroke: colors.border, strokeOpacity: 0.6 }}
                    width={30}
                  />

                  <Tooltip content={<ThemedTooltip colors={colors} />} />

                  {/* soft fill so a flat line still looks “designed” */}
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.primary} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={colors.primary}
                    strokeWidth={3}
                    fill="url(#trendFill)"
                    dot={{ r: 4, stroke: colors.primary, strokeWidth: 2, fill: colors.card }}
                    activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2, fill: colors.card }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* keep the rest of your Recommended page below this (jobs, filters, etc) */}
        </div>
      </motion.div>
    </>
  );
}

function StatTile({ label, value, sublabel, Icon, colors }) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-2"
      style={{ background: colors.card, borderColor: colors.border }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: colors.accent, border: `1px solid ${colors.border}` }}
        >
          <Icon className="h-5 w-5" style={{ color: colors.primary }} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium" style={{ color: colors.mutedForeground }}>
            {label}
          </p>
          <p className="text-3xl font-extrabold" style={{ color: colors.cardForeground }}>
            {value}
          </p>
        </div>
      </div>
      {sublabel ? (
        <p className="text-sm" style={{ color: colors.mutedForeground }}>
          {sublabel}
        </p>
      ) : null}
    </div>
  );
}

function WideStat({ label, value, sublabel, Icon, colors }) {
  return (
    <div
      className="rounded-2xl border p-4 flex items-center gap-4"
      style={{ background: colors.card, borderColor: colors.border }}
    >
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center"
        style={{ background: colors.accent, border: `1px solid ${colors.border}` }}
      >
        <Icon className="h-5 w-5" style={{ color: colors.primary }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: colors.mutedForeground }}>
          {label}
        </p>
        <p className="text-3xl font-extrabold leading-tight" style={{ color: colors.cardForeground }}>
          {value}
        </p>
        {sublabel ? (
          <p className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
            {sublabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
function ThemedTooltip({ active, payload, label, colors }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: "10px 12px",
        color: colors.foreground,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
    >
      {label ? (
        <div style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 6 }}>
          {label}
        </div>
      ) : null}

      {payload.map((p, idx) => (
        <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: p.color || STATUS_COLOR_MAP[p.name] || colors.primary,
              display: "inline-block",
            }}
          />
          <span style={{ color: colors.foreground, fontSize: 13, fontWeight: 600 }}>
            {p.name}: {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
