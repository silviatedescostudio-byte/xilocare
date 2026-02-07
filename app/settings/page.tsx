"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Wifi, 
  Server, 
  Key, 
  Save, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  
  // Configurazione Shelly (stato locale - API Key gestita server-side)
  const [shellyConfig, setShellyConfig] = useState({
    apiKey: "", // API Key viene gestita SOLO lato server tramite env var SHELLY_AUTH_KEY
    serverPrefix: "shelly-103-eu", // Default EU server
    deviceId: "e4b3232f9708" // Default device
  })

  const serverOptions = [
    { value: "shelly-103-eu", label: "Europa (shelly-103-eu.shelly.cloud)" },
    { value: "shelly-104-us", label: "USA (shelly-104-us.shelly.cloud)" },
    { value: "shelly-105-ap", label: "Asia Pacific (shelly-105-ap.shelly.cloud)" },
  ]

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch(`/api/shelly/${shellyConfig.deviceId}`)
      const data = await response.json()
      
      if (data.isSimulated) {
        setTestResult("error")
      } else {
        setTestResult("success")
      }
    } catch {
      setTestResult("error")
    } finally {
      setIsTesting(false)
    }
  }

  const handleSaveConfig = () => {
    // In produzione, questo salverebbe le configurazioni
    // Per ora mostra solo un feedback visivo
    alert("Configurazione salvata. Nota: Per applicare la API Key, aggiungila come variabile d'ambiente SHELLY_AUTH_KEY nel pannello Vercel.")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-wood-dark">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

        <div className="lg:pl-64">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-cream">Impostazioni</h1>
              <p className="text-cream/60 mt-1">Configura le integrazioni hardware e le preferenze di sistema</p>
            </div>

            {/* Configurazione Shelly API */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <Wifi className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-cream">Integrazione Shelly Cloud</CardTitle>
                      <CardDescription className="text-cream/60">Configura la connessione ai sensori Shelly H&T</CardDescription>
                    </div>
                  </div>
                  {testResult === "success" && (
                    <Badge className="bg-cpr-green/20 text-cpr-green border-cpr-green/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connesso
                    </Badge>
                  )}
                  {testResult === "error" && (
                    <Badge className="bg-cpr-red/20 text-cpr-red border-cpr-red/30">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Errore
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Key */}
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-cream flex items-center gap-2">
                    <Key className="h-4 w-4 text-gold" />
                    Shelly API Key
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        value={shellyConfig.apiKey}
                        onChange={(e) => setShellyConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="Inserisci la tua Shelly Cloud API Key"
                        className="bg-wood-dark border-gold/30 text-cream pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-cream/50">
                    Ottieni la API Key dal tuo account Shelly Cloud: control.shelly.cloud → User Settings → Authorization cloud key
                  </p>
                </div>

                {/* Server Prefix */}
                <div className="space-y-2">
                  <Label htmlFor="serverPrefix" className="text-cream flex items-center gap-2">
                    <Server className="h-4 w-4 text-gold" />
                    Server Prefix
                  </Label>
                  <select
                    id="serverPrefix"
                    value={shellyConfig.serverPrefix}
                    onChange={(e) => setShellyConfig(prev => ({ ...prev, serverPrefix: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md bg-wood-dark border border-gold/30 text-cream"
                  >
                    {serverOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-cream/50">
                    Seleziona il server in base alla regione del tuo account Shelly Cloud
                  </p>
                </div>

                {/* Device ID (Default) */}
                <div className="space-y-2">
                  <Label htmlFor="deviceId" className="text-cream flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gold" />
                    Device ID Default
                  </Label>
                  <Input
                    id="deviceId"
                    type="text"
                    value={shellyConfig.deviceId}
                    onChange={(e) => setShellyConfig(prev => ({ ...prev, deviceId: e.target.value }))}
                    placeholder="e4b3232f9708"
                    className="bg-wood-dark border-gold/30 text-cream font-mono"
                  />
                  <p className="text-xs text-cream/50">
                    ID del dispositivo Shelly H&T di riferimento (visibile nell'app Shelly)
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gold/20">
                  <Button 
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    variant="outline"
                    className="bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                  >
                    {isTesting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wifi className="h-4 w-4 mr-2" />
                    )}
                    Testa Connessione
                  </Button>
                  <Button 
                    onClick={handleSaveConfig}
                    className="bg-gold hover:bg-gold/90 text-wood-dark"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salva Configurazione
                  </Button>
                </div>

                {/* Connection Status Info */}
                <div className="p-4 rounded-lg bg-wood-dark/50 border border-gold/10">
                  <p className="text-sm text-cream/70 mb-2">
                    <strong className="text-gold">Stato attuale:</strong>
                  </p>
                  <ul className="text-xs text-cream/60 space-y-1">
                    <li>• Server: https://{shellyConfig.serverPrefix}.shelly.cloud</li>
                    <li>• Device ID: {shellyConfig.deviceId}</li>
                    <li>• API Key: {shellyConfig.apiKey ? "Configurata" : "Non configurata (dati simulati)"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-gold/10 border-gold/30">
              <CardContent className="p-4">
                <h3 className="font-bold text-cream mb-2">Nota Importante</h3>
                <p className="text-sm text-cream/70">
                  Per utilizzare dati reali dai sensori Shelly, devi configurare la variabile d'ambiente 
                  <code className="mx-1 px-1 py-0.5 bg-wood-dark rounded text-gold text-xs">SHELLY_AUTH_KEY</code> 
                  nel pannello Vercel del tuo progetto. Senza questa configurazione, il sistema mostrera dati simulati.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
