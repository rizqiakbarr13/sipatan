"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AXIS_TICK = { fill: "currentColor", fontSize: 11 };
const GRID_STROKE = "currentColor";

const STATUS_BAR_COLOR: Record<string, string> = {
  DITERIMA: "#a1a1aa",
  DIVERIFIKASI: "#f59e0b",
  DITINDAKLANJUTI: "#f59e0b",
  DITERIMA_SAH: "#059669",
  DITOLAK: "#ef4444",
  SELESAI: "#2563eb",
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function StatusBarChart({
  data,
}: {
  data: { key: string; label: string; value: number }[];
}) {
  return (
    <div className="h-64 text-zinc-500 dark:text-zinc-400">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} strokeOpacity={0.15} horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} width={110} />
          <Tooltip cursor={{ fill: "currentColor", opacity: 0.06 }} content={<ChartTooltip />} />
          <Bar dataKey="value" name="Jumlah" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((d) => (
              <Cell key={d.key} fill={STATUS_BAR_COLOR[d.key] ?? "#059669"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendAreaChart({
  data,
  color = "#059669",
  name = "Jumlah",
}: {
  data: { label: string; value: number }[];
  color?: string;
  name?: string;
}) {
  const gradientId = `trend-gradient-${name.replace(/\s+/g, "-")}`;
  return (
    <div className="h-64 text-zinc-500 dark:text-zinc-400">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} strokeOpacity={0.15} vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} width={28} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            name={name}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={data.length <= 20 ? { r: 2.5, fill: color, strokeWidth: 0 } : false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLineChart({
  data,
  color = "#0891b2",
  name = "Jumlah",
}: {
  data: { label: string; value: number }[];
  color?: string;
  name?: string;
}) {
  return (
    <div className="h-64 text-zinc-500 dark:text-zinc-400">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} strokeOpacity={0.15} vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} width={28} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            name={name}
            stroke={color}
            strokeWidth={2.5}
            dot={data.length <= 20 ? { r: 2.5, fill: color, strokeWidth: 0 } : false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PublikasiBarChart({
  data,
}: {
  data: { label: string; dokumen: number; pengumuman: number }[];
}) {
  return (
    <div className="h-64 text-zinc-500 dark:text-zinc-400">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} strokeOpacity={0.15} vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} width={28} />
          <Tooltip cursor={{ fill: "currentColor", opacity: 0.06 }} content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="dokumen" name="Dokumen" fill="#7c3aed" radius={[3, 3, 0, 0]} barSize={10} />
          <Bar dataKey="pengumuman" name="Pengumuman" fill="#db2777" radius={[3, 3, 0, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
