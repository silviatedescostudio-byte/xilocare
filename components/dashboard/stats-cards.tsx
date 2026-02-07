import { MapPin, AlertCircle, Calendar, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Siti Monitorati",
    value: "24",
    subtitle: "+3 questo mese",
    icon: MapPin,
    trend: "positive",
  },
  {
    title: "Avvisi Attivi",
    value: "7",
    subtitle: "Opportunita di intervento",
    icon: AlertCircle,
    alert: true,
  },
  {
    title: "Manutenzioni",
    value: "12",
    subtitle: "Prossimi 30 giorni - opportunita",
    icon: Calendar,
    business: true,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Alert Card - Dominant */}
      {stats.filter(s => s.alert).map((stat) => (
        <div 
          key={stat.title} 
          className="md:col-span-1 p-6 rounded-xl border-2 border-cpr-red/50 bg-cpr-red-bg shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide uppercase text-cpr-red mb-3">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-black text-cpr-red">
                  {stat.value}
                </p>
                <span className="w-4 h-4 rounded-full bg-cpr-red animate-pulse shadow-lg shadow-cpr-red/50" />
              </div>
              <p className="text-sm font-semibold text-cream/80 mt-3">
                {stat.subtitle}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cpr-red/20 flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-cpr-red" strokeWidth={2} />
            </div>
          </div>
        </div>
      ))}

      {/* Other Stats - Clean but strong */}
      {stats.filter(s => !s.alert).map((stat) => (
        <div 
          key={stat.title} 
          className={cn(
            "p-5 rounded-xl border shadow-sm",
            stat.business 
              ? "bg-cpr-yellow-bg border-cpr-yellow/30" 
              : "bg-wood-medium border-gold/20"
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={cn(
                "text-xs font-bold tracking-wide uppercase mb-2",
                stat.business ? "text-cpr-yellow" : "text-cream/70"
              )}>
                {stat.title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className={cn(
                  "text-4xl font-black",
                  stat.business ? "text-cpr-yellow" : "text-cream"
                )}>
                  {stat.value}
                </p>
                {stat.trend === "positive" && (
                  <TrendingUp className="w-5 h-5 text-cpr-green" strokeWidth={2.5} />
                )}
              </div>
              <p className={cn(
                "text-sm font-medium mt-2",
                stat.business ? "text-cream/70" : "text-cream/60"
              )}>
                {stat.subtitle}
              </p>
            </div>
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              stat.business ? "bg-cpr-yellow/20" : "bg-gold/10"
            )}>
              <stat.icon className={cn(
                "h-5 w-5",
                stat.business ? "text-cpr-yellow" : "text-gold"
              )} strokeWidth={2} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
