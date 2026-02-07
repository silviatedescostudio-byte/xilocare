"use client"

import React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUploadArea } from "@/components/registration/file-upload-area"
import { Shield, Info } from "lucide-react"

const products = [
  { value: "oak-premium", label: "Rovere Premium Collection" },
  { value: "walnut-elite", label: "Noce Elite Series" },
  { value: "ash-natural", label: "Frassino Natural Line" },
  { value: "maple-classic", label: "Acero Classic Range" },
  { value: "teak-luxury", label: "Teak Luxury Edition" },
  { value: "cherry-heritage", label: "Ciliegio Heritage Collection" },
]

export function RegistrationForm() {
  const [email, setEmail] = useState("")
  const [product, setProduct] = useState("")
  const [sensorId, setSensorId] = useState("")
  // Documenti OBBLIGATORI per semaforo verde
  const [ceFile, setCeFile] = useState<File | null>(null) // Etichetta CE
  const [conformitaFile, setConformitaFile] = useState<File | null>(null) // Dichiarazione di Conformita
  const [dopFile, setDopFile] = useState<File | null>(null) // DoP
  const [schedaFile, setSchedaFile] = useState<File | null>(null) // Scheda Prodotto
  // Documento FACOLTATIVO (non influisce sul semaforo)
  const [rapportoPosaFile, setRapportoPosaFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ 
      email, 
      product, 
      sensorId, 
      // Documenti obbligatori
      ceFile, 
      conformitaFile, 
      dopFile, 
      schedaFile,
      // Documento facoltativo
      rapportoPosaFile 
    })
  }

  const isFormValid = email && product && sensorId
  
  // Calcolo stato semaforo documenti
  const documentiObbligatori = [ceFile, conformitaFile, dopFile, schedaFile]
  const documentiCaricati = documentiObbligatori.filter(Boolean).length
  const getSemaforoDocumenti = () => {
    if (documentiCaricati === 4) return "green" // Tutti i 4 obbligatori caricati
    if (documentiCaricati === 0) return "red" // Nessun documento
    return "yellow" // Solo alcuni caricati
  }
  const semaforoDocumenti = getSemaforoDocumenti()

  return (
    <div className="max-w-xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-2xl font-light text-charcoal tracking-wide mb-3">
          Nuova Installazione
        </h1>
        <p className="text-sm text-charcoal-light font-light">
          Compila il modulo per attivare la Garanzia Gold
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Form Fields Section */}
        <div className="space-y-8">
          {/* Customer Email */}
          <div className="space-y-3">
            <label htmlFor="email" className="text-[10px] text-charcoal-light tracking-[0.2em] uppercase">
              Email Cliente
            </label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@esempio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 bg-transparent border-0 border-b border-charcoal/10 rounded-none px-0 text-charcoal font-light focus:border-champagne focus:ring-0 placeholder:text-charcoal-light/50"
            />
          </div>

          {/* Product Selection */}
          <div className="space-y-3">
            <label htmlFor="product" className="text-[10px] text-charcoal-light tracking-[0.2em] uppercase">
              Selezione Prodotto
            </label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger 
                id="product" 
                className="h-14 bg-transparent border-0 border-b border-charcoal/10 rounded-none px-0 text-charcoal font-light focus:border-champagne focus:ring-0"
              >
                <SelectValue placeholder="Seleziona un prodotto" />
              </SelectTrigger>
              <SelectContent className="bg-bone border-charcoal/10">
                {products.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-sm font-light">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shelly Sensor ID */}
          <div className="space-y-3">
            <label htmlFor="sensorId" className="text-[10px] text-charcoal-light tracking-[0.2em] uppercase">
              ID Sensore Shelly
            </label>
            <Input
              id="sensorId"
              type="text"
              placeholder="es. SHELLY-HT-ABC123"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              className="h-14 bg-transparent border-0 border-b border-charcoal/10 rounded-none px-0 text-charcoal font-light focus:border-champagne focus:ring-0 placeholder:text-charcoal-light/50"
            />
            <p className="text-[10px] text-charcoal-light/60 font-light">
              Inserisci il numero di serie del sensore Shelly H&T
            </p>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] text-charcoal-light tracking-[0.2em] uppercase mb-1">
                Documenti Cantiere
              </h2>
              <p className="text-[10px] text-charcoal-light/60 font-light">
                Carica i documenti di certificazione (PDF, JPG, PNG)
              </p>
            </div>
            {/* Semaforo Documenti */}
            <div className="flex items-center gap-2">
              <div 
                className={`w-4 h-4 rounded-full ${
                  semaforoDocumenti === "green" ? "bg-emerald-500" :
                  semaforoDocumenti === "yellow" ? "bg-amber-500" :
                  "bg-red-500"
                }`} 
              />
              <span className="text-[10px] text-charcoal-light">
                {semaforoDocumenti === "green" ? "Completo" :
                 semaforoDocumenti === "yellow" ? `${documentiCaricati}/4 obbligatori` :
                 "Nessun documento"}
              </span>
            </div>
          </div>

          {/* Documenti OBBLIGATORI */}
          <div>
            <p className="text-[10px] text-charcoal font-semibold tracking-[0.1em] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Obbligatori (influiscono sul semaforo)
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUploadArea
                label="CE"
                description="Etichetta CE"
                file={ceFile}
                onFileChange={setCeFile}
              />
              <FileUploadArea
                label="Conformita"
                description="Dichiarazione di Conformita"
                file={conformitaFile}
                onFileChange={setConformitaFile}
              />
              <FileUploadArea
                label="DoP"
                description="Dichiarazione di Prestazione"
                file={dopFile}
                onFileChange={setDopFile}
              />
              <FileUploadArea
                label="Scheda"
                description="Scheda Prodotto"
                file={schedaFile}
                onFileChange={setSchedaFile}
              />
            </div>
          </div>

          {/* Documento FACOLTATIVO */}
          <div>
            <p className="text-[10px] text-charcoal-light tracking-[0.1em] uppercase mb-3 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Facoltativo (non influisce sul semaforo)
            </p>
            <div className="max-w-xs">
              <FileUploadArea
                label="Rapporto Posa"
                description="Rapporto di Posa (opzionale)"
                file={rapportoPosaFile}
                onFileChange={setRapportoPosaFile}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-14 flex items-center justify-center gap-3 bg-champagne text-charcoal text-sm font-light tracking-wide hover:bg-champagne-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Shield className="h-4 w-4" strokeWidth={1.25} />
            Attiva Garanzia Gold
          </button>
          <p className="text-center text-[10px] text-charcoal-light/60 font-light mt-6">
            Confermando, dichiari che le informazioni sono corrette e complete
          </p>
        </div>
      </form>
    </div>
  )
}
