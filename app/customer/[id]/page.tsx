"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CustomerDetailView } from "@/components/customer/customer-detail-view";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

type ClientSession = {
  id: string;
  dealer_id: string;
  name: string;
  address?: string;
  installation_date?: string;
  public_code?: string;
  pin?: string; // non serve usarlo, ma può esserci
};

export default function CustomerPage() {
  const router = useRouter();
  const params = useParams();

  // id dalla URL: /customer/[id]
  const idFromUrl = useMemo(() => String(params.id ?? ""), [params]);

  const [session, setSession] = useState<ClientSession | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("customerSession");
      if (!raw) {
        // nessuna sessione -> rimando al PIN
        router.replace(`/c/${idFromUrl}/pin`);
        return;
      }

      const parsed = JSON.parse(raw) as ClientSession;
      setSession(parsed);

      // ✅ BLOCCO PRODOTTO:
      // la sessione deve corrispondere al cliente che stai aprendo
      // (match su public_code se presente, altrimenti su id)
      const sessionCode = (parsed.public_code ?? "").toLowerCase();
      const urlCode = (idFromUrl ?? "").toLowerCase();

      const match =
        (sessionCode && sessionCode === urlCode) ||
        (parsed.id && parsed.id === idFromUrl);

      if (!match) {
        // sessione di un altro cliente -> rimando al PIN
        router.replace(`/c/${idFromUrl}/pin`);
        return;
      }
    } catch {
      localStorage.removeItem("customerSession");
      router.replace(`/c/${idFromUrl}/pin`);
      return;
    } finally {
      setChecking(false);
    }
  }, [idFromUrl, router]);

  // mentre controlla, non mostra nulla (evita flash)
  if (checking) {
    return <div className="min-h-screen bg-warm-light" />;
  }

  // se per qualche motivo non c’è sessione
  if (!session) {
    return null;
  }

  // ✅ Qui usiamo i dati reali della sessione (arrivata dal PIN)
  // e mettiamo placeholder per ciò che ancora non hai collegato.
  const customerData = {
    id: idFromUrl,
    name: session.name ?? `Cliente ${idFromUrl}`,
    address: session.address ?? "Indirizzo non disponibile",
    woodSpecies: "Non specificato",
    installationDate:
      session.installation_date ?? new Date().toISOString().split("T")[0],
    shellyDeviceId: "pending",
    documents: { cpr: false, schedaTecnica: false, garanzia: false },
  };

  return (
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
  );
}
