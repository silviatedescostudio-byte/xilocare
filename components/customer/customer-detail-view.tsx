"use client"

import { useState } from "react"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  Thermometer, 
  Droplets, 
  Check, 
  AlertTriangle, 
  X,
  Share2,
  Copy,
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  ArrowLeft,
  Battery,
  Clock,
  Home,
  FileText
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ShellyData {
  temperature: number
  humidity: number
  batteryLevel: number
  lastUpdate: string
  isOnline: boolean
  isSimulated?: boolean
}

interface CustomerDetailData {
  id: string
  name: string
  address: string
  woodSpecies: string
  installationDate: string
  shellyDeviceId: string
  // NUOVA STRUTTURA DOCUMENTI secondo specifiche
  documents: {
    etichettaCE: boolean      // Obbligatorio
    conformita: boolean        // Obbligatorio (Dichiarazione di Conformita)
    dop: boolean               // Obbligatorio (DoP)
    schedaProdotto: boolean    // Obbligatorio
    rapportoPosa?: boolean     // FACOLTATIVO - NON influisce sul semaforo
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Thresholds
const THRESHOLDS = {
  temperature: { min: 15, max: 25, warningMin: 13, warningMax: 28 },
  humidity: { min: 45, max: 65, warningMin: 40, warningMax: 70 }
}

type Status = "optimal" | "warning" | "critical"

function calculateStatus(data: ShellyData): Status {
  const { temperature, humidity } = data
  
  if (
    temperature < THRESHOLDS.temperature.warningMin ||
    temperature > THRESHOLDS.temperature.warningMax ||
    humidity < THRESHOLDS.humidity.warningMin ||
    humidity > THRESHOLDS.humidity.warningMax
  ) {
    return "critical"
  }
  
  if (
    temperature < THRESHOLDS.temperature.min ||
    temperature > THRESHOLDS.temperature.max ||
    humidity < THRESHOLDS.humidity.min ||
    humidity > THRESHOLDS.humidity.max
  ) {
    return "warning"
  }
  
  return "optimal"
}

const statusConfig = {
  optimal: {
    title: "Pavimento protetto",
    subtitle: "Le condizioni ambientali sono ottimali",
    bgColor: "bg-emerald-500",
    borderColor: "border-emerald-600",
    glowColor: "shadow-[0_0_60px_rgba(16,185,129,0.4)]",
    label: "SICURO",
    labelBg: "bg-emerald-100",
    labelText: "text-emerald-800",
    cardBg: "bg-emerald-50",
    cardBorder: "border-emerald-200",
    Icon: Check,
  },
  warning: {
    title: "Ambiente da monitorare",
    subtitle: "Alcuni parametri richiedono attenzione",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-600",
    glowColor: "shadow-[0_0_60px_rgba(245,158,11,0.4)]",
    label: "ATTENZIONE",
    labelBg: "bg-amber-100",
    labelText: "text-amber-800",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-200",
    Icon: AlertTriangle,
  },
  critical: {
    title: "Intervento necessario",
    subtitle: "Contattare il cliente urgentemente",
    bgColor: "bg-red-600",
    borderColor: "border-red-700",
    glowColor: "shadow-[0_0_60px_rgba(220,38,38,0.4)]",
    label: "ALLARME",
    labelBg: "bg-red-100",
    labelText: "text-red-800",
    cardBg: "bg-red-50",
    cardBorder: "border-red-200",
    Icon: X,
  },
}

interface CustomerDetailViewProps {
  customer: CustomerDetailData
}

export function CustomerDetailView({ customer }: CustomerDetailViewProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  // Fetch Shelly data with auto-refresh every 30 seconds
  const { data: shellyData, isLoading, mutate } = useSWR<ShellyData>(
    `/api/shelly/${customer.shellyDeviceId}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  const status = shellyData ? calculateStatus(shellyData) : "optimal"
  const config = statusConfig[status]

  async function generateShareLink() {
    setIsGeneratingLink(true)
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          customerName: customer.name.split(" ").pop() || customer.name,
          shellyDeviceId: customer.shellyDeviceId
        })
      })
      
      if (!response.ok) throw new Error("Failed to generate link")
      
      const data = await response.json()
      setShareUrl(data.shareUrl)
      toast.success("Link generato con successo!")
    } catch (error) {
      toast.error("Errore nella generazione del link")
    } finally {
      setIsGeneratingLink(false)
    }
  }

  async function copyToClipboard() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copiato!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Impossibile copiare il link")
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dealer">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Torna alla lista
            </Button>
          </Link>
        </div>
        
        {/* Share Button */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-champagne hover:bg-champagne/90 text-charcoal">
              <Share2 className="h-4 w-4" />
              Condividi con Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Condividi con il Cliente</DialogTitle>
              <DialogDescription>
                Genera un link protetto che il cliente {customer.name} puo usare per visualizzare 
                solo lo stato del suo pavimento, senza accedere ai dati di altri clienti.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!shareUrl ? (
                <Button 
                  onClick={generateShareLink} 
                  disabled={isGeneratingLink}
                  className="w-full bg-champagne hover:bg-champagne/90 text-charcoal"
                >
                  {isGeneratingLink ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generazione...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Genera Link Protetto
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input 
                      value={shareUrl} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      className="bg-transparent flex-shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-charcoal-medium">
                    Il link scade automaticamente dopo 30 giorni. Il cliente potra vedere 
                    solo i dati del suo sensore Shelly.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-champagne/10 flex items-center justify-center">
                <Home className="h-7 w-7 text-champagne" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-charcoal">{customer.name}</h1>
                <p className="text-charcoal-medium">{customer.address}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-charcoal-light">
                  <span>Essenza: <strong className="text-charcoal">{customer.woodSpecies}</strong></span>
                  <span>Installato: <strong className="text-charcoal">{new Date(customer.installationDate).toLocaleDateString("it-IT")}</strong></span>
                </div>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {shellyData?.isOnline ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/5 border border-charcoal/10">
                  <WifiOff className="w-4 h-4 text-charcoal-light" />
                  <span className="text-xs font-semibold text-charcoal-light">Offline</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Status Section */}
      <Card className={cn(config.cardBg, config.cardBorder, "border-2")}>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-charcoal mb-1">
              Stato Pavimento di Casa {customer.name.split(" ").pop()}
            </h2>
            <p className="text-sm text-charcoal-medium">
              Sensore Shelly H&T Gen3 - ID: {customer.shellyDeviceId}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-32 h-32 rounded-full bg-charcoal/10 animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              {/* Large Semaphore */}
              <div
                className={cn(
                  "w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all",
                  config.bgColor,
                  config.borderColor,
                  config.glowColor
                )}
              >
                <config.Icon className="w-16 h-16 text-white" strokeWidth={3} />
              </div>

              {/* Status Label */}
              <div className={cn(
                "mt-5 px-6 py-2 rounded-full text-base font-bold tracking-widest",
                config.labelBg,
                config.labelText
              )}>
                {config.label}
              </div>

              {/* Status Message */}
              <h3 className="mt-4 text-xl font-bold text-charcoal">{config.title}</h3>
              <p className="text-charcoal-medium">{config.subtitle}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environmental Values */}
      {shellyData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal-medium uppercase">Temperatura</p>
                  <p className="text-3xl font-bold text-charcoal">{shellyData.temperature}°C</p>
                </div>
              </div>
              <div className={cn(
                "text-xs font-semibold px-2 py-1 rounded inline-block",
                shellyData.temperature >= THRESHOLDS.temperature.min && 
                shellyData.temperature <= THRESHOLDS.temperature.max 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-amber-100 text-amber-700"
              )}>
                Range ottimale: 15-25°C
              </div>
            </CardContent>
          </Card>

          {/* Humidity */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal-medium uppercase">Umidita</p>
                  <p className="text-3xl font-bold text-charcoal">{shellyData.humidity}%</p>
                </div>
              </div>
              <div className={cn(
                "text-xs font-semibold px-2 py-1 rounded inline-block",
                shellyData.humidity >= THRESHOLDS.humidity.min && 
                shellyData.humidity <= THRESHOLDS.humidity.max 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-amber-100 text-amber-700"
              )}>
                Range ottimale: 45-65%
              </div>
            </CardContent>
          </Card>

          {/* Battery & Last Update */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-charcoal/5 flex items-center justify-center">
                    <Battery className="h-5 w-5 text-charcoal-medium" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light">Batteria Sensore</p>
                    <p className="font-bold text-charcoal">{shellyData.batteryLevel}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-charcoal/5 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-charcoal-medium" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light">Ultimo Aggiornamento</p>
                    <p className="font-bold text-charcoal text-sm">
                      {new Date(shellyData.lastUpdate).toLocaleString("it-IT")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Refresh & Demo Notice */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => mutate()}
          className="gap-2 bg-transparent"
        >
          <RefreshCw className="h-4 w-4" />
          Aggiorna dati
        </Button>
        
        {shellyData?.isSimulated && (
          <p className="text-xs text-charcoal-light">
            Dati demo - Configura SHELLY_AUTH_KEY per dati reali
          </p>
        )}
      </div>

      {/* Documents Status - NUOVA STRUTTURA */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-champagne" />
              <h3 className="font-bold text-charcoal">Documenti Cantiere</h3>
            </div>
            {/* Semaforo documenti */}
            {(() => {
              const obbligatori = [
                customer.documents.etichettaCE,
                customer.documents.conformita,
                customer.documents.dop,
                customer.documents.schedaProdotto
              ]
              const caricati = obbligatori.filter(Boolean).length
              const semaphore = caricati === 4 ? "green" : caricati === 0 ? "red" : "yellow"
              return (
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    semaphore === "green" ? "bg-emerald-500" :
                    semaphore === "yellow" ? "bg-amber-500" : "bg-red-500"
                  )} />
                  <span className="text-xs text-charcoal-medium">
                    {caricati}/4 obbligatori
                  </span>
                </div>
              )
            })()}
          </div>
          
          {/* Documenti OBBLIGATORI */}
          <p className="text-[10px] text-charcoal-light tracking-wide uppercase mb-2">Obbligatori</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { key: "etichettaCE", label: "CE" },
              { key: "conformita", label: "Conformita" },
              { key: "dop", label: "DoP" },
              { key: "schedaProdotto", label: "Scheda" }
            ].map(doc => (
              <div 
                key={doc.key}
                className={cn(
                  "p-2 rounded-lg border text-center",
                  customer.documents[doc.key as keyof typeof customer.documents]
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                )}
              >
                {customer.documents[doc.key as keyof typeof customer.documents] ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                ) : (
                  <X className="h-4 w-4 text-red-600 mx-auto mb-1" />
                )}
                <p className={cn(
                  "text-[10px] font-semibold",
                  customer.documents[doc.key as keyof typeof customer.documents]
                    ? "text-emerald-700"
                    : "text-red-700"
                )}>
                  {doc.label}
                </p>
              </div>
            ))}
          </div>
          
          {/* Documento FACOLTATIVO */}
          <p className="text-[10px] text-charcoal-light tracking-wide uppercase mb-2">Facoltativo</p>
          <div className="max-w-[100px]">
            <div 
              className={cn(
                "p-2 rounded-lg border text-center",
                customer.documents.rapportoPosa
                  ? "bg-blue-50 border-blue-200"
                  : "bg-charcoal/5 border-charcoal/10"
              )}
            >
              {customer.documents.rapportoPosa ? (
                <CheckCircle className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              ) : (
                <X className="h-4 w-4 text-charcoal-light mx-auto mb-1" />
              )}
              <p className={cn(
                "text-[10px] font-semibold",
                customer.documents.rapportoPosa ? "text-blue-700" : "text-charcoal-light"
              )}>
                Posa
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
