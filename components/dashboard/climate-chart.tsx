"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceArea } from "recharts"

const climateData = [
  { month: "Gen", humidity: 45, temperature: 20 },
  { month: "Feb", humidity: 48, temperature: 21 },
  { month: "Mar", humidity: 52, temperature: 22 },
  { month: "Apr", humidity: 55, temperature: 23 },
  { month: "Mag", humidity: 58, temperature: 24 },
  { month: "Giu", humidity: 62, temperature: 26 },
  { month: "Lug", humidity: 65, temperature: 28 },
  { month: "Ago", humidity: 63, temperature: 27 },
  { month: "Set", humidity: 58, temperature: 25 },
  { month: "Ott", humidity: 52, temperature: 23 },
  { month: "Nov", humidity: 48, temperature: 21 },
  { month: "Dic", humidity: 45, temperature: 20 },
]

// Optimal ranges for wood flooring
const OPTIMAL_HUMIDITY_MIN = 45
const OPTIMAL_HUMIDITY_MAX = 60
const OPTIMAL_TEMP_MIN = 18
const OPTIMAL_TEMP_MAX = 24

export function ClimateChart() {
  return (
    <div className="bg-wood-medium p-5 rounded-xl border border-gold/20 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm text-cream font-bold tracking-tight mb-1">
            Trend Climatico Globale
          </h3>
          <p className="text-xs text-cream/60 font-medium">
            Media di tutti i siti monitorati
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 bg-cpr-yellow rounded-full" />
            <span className="text-[11px] text-cream/70 font-semibold">Umidita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 bg-gold rounded-full" />
            <span className="text-[11px] text-cream/70 font-semibold">Temp</span>
          </div>
        </div>
      </div>

      {/* Optimal range legend */}
      <div className="flex items-center gap-2 mb-4 p-2.5 bg-cpr-green-bg rounded-lg border border-cpr-green/30">
        <div className="w-3 h-3 bg-cpr-green rounded" />
        <span className="text-xs text-cpr-green font-bold">
          Range Sicuro: {OPTIMAL_HUMIDITY_MIN}-{OPTIMAL_HUMIDITY_MAX}% | {OPTIMAL_TEMP_MIN}-{OPTIMAL_TEMP_MAX}°C
        </span>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={climateData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            {/* Optimal humidity range shading */}
            <ReferenceArea
              y1={OPTIMAL_HUMIDITY_MIN}
              y2={OPTIMAL_HUMIDITY_MAX}
              fill="#22c55e"
              fillOpacity={0.15}
              stroke="#22c55e"
              strokeOpacity={0.3}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#a09a90", fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(201, 169, 98, 0.2)" }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: "#a09a90", fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false}
              width={35}
              domain={[15, 70]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2d2420",
                border: "1px solid rgba(201, 169, 98, 0.3)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                fontSize: "12px",
                padding: "10px 14px",
                color: "#f5f0e8"
              }}
              labelStyle={{ color: "#f5f0e8", fontWeight: 600, marginBottom: "6px" }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#eab308"
              strokeWidth={2.5}
              dot={{ fill: "#eab308", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#eab308", strokeWidth: 2, stroke: "#2d2420" }}
              name="Umidita (%)"
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#c9a962"
              strokeWidth={2.5}
              dot={{ fill: "#c9a962", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#c9a962", strokeWidth: 2, stroke: "#2d2420" }}
              name="Temperatura (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
