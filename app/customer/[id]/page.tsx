import { CustomerDetailView } from "@/components/customer/customer-detail-view"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface CustomerPageProps {
  params: Promise<{ id: string }>
}

// Customer database with Shelly device IDs
const customersDatabase: Record<string, {
  id: string
  name: string
  address: string
  woodSpecies: string
  installationDate: string
  shellyDeviceId: string
  documents: {
    cpr: boolean
    schedaTecnica: boolean
    garanzia: boolean
  }
}> = {
  "bianchi": {
    id: "bianchi",
    name: "Residenza Bianchi",
    address: "Via Roma 123, Milano",
    woodSpecies: "Rovere Europeo",
    installationDate: "2024-01-15",
    shellyDeviceId: "e4b3232f9708", // Real Shelly H&T device
    documents: { cpr: true, schedaTecnica: true, garanzia: true }
  },
  "1": {
    id: "1",
    name: "Mario Rossi",
    address: "Via Roma 123, Milano",
    woodSpecies: "Rovere Europeo",
    installationDate: "2024-03-15",
    shellyDeviceId: "demo-device-001",
    documents: { cpr: true, schedaTecnica: true, garanzia: true }
  },
  "2": {
    id: "2",
    name: "Laura Bianchi",
    address: "Corso Italia 45, Roma",
    woodSpecies: "Noce Americano",
    installationDate: "2024-06-20",
    shellyDeviceId: "demo-device-002",
    documents: { cpr: true, schedaTecnica: false, garanzia: true }
  },
  "3": {
    id: "3",
    name: "Giuseppe Verdi",
    address: "Piazza Duomo 8, Firenze",
    woodSpecies: "Ciliegio",
    installationDate: "2024-01-10",
    shellyDeviceId: "demo-device-003",
    documents: { cpr: false, schedaTecnica: false, garanzia: true }
  },
  "4": {
    id: "4",
    name: "Anna Neri",
    address: "Via Garibaldi 67, Torino",
    woodSpecies: "Frassino",
    installationDate: "2024-09-05",
    shellyDeviceId: "demo-device-004",
    documents: { cpr: true, schedaTecnica: true, garanzia: true }
  },
  "5": {
    id: "5",
    name: "Francesco Costa",
    address: "Via Mazzini 12, Bologna",
    woodSpecies: "Hickory",
    installationDate: "2024-04-22",
    shellyDeviceId: "demo-device-005",
    documents: { cpr: true, schedaTecnica: true, garanzia: false }
  },
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params
  
  // Get customer data from database
  const customerData = customersDatabase[id] || {
    id,
    name: "Cliente " + id,
    address: "Indirizzo non disponibile",
    woodSpecies: "Non specificato",
    installationDate: new Date().toISOString().split("T")[0],
    shellyDeviceId: "demo-device-" + id,
    documents: { cpr: false, schedaTecnica: false, garanzia: false }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-warm-light">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <MobileSidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="p-4 md:p-6 lg:p-8">
            <CustomerDetailView customer={customerData} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
