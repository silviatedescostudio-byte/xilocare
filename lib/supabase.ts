import { createClient } from '@supabase/supabase-js';

// 1. DEFINIZIONE DEI TIPI (DATABASE SCHEMA)
// Questo serve a TypeScript per capire "cosa c'è dentro" le tabelle ed evitare errori
export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; role: string };
        Insert: { id?: string; email: string; role: string };
        Update: { id?: string; email?: string; role?: string };
      };
      dealers: {
        Row: { id: string; user_id: string; company_name: string; vat_number: string; subscription_status: string };
        Insert: { id?: string; user_id: string; company_name: string; vat_number: string; subscription_status: string };
        Update: { id?: string; user_id?: string; company_name?: string; vat_number?: string; subscription_status?: string };
      };
      clients: {
        Row: { id: string; dealer_id: string; pin_code: string; name: string; address: string; installation_date: string };
        Insert: { id?: string; dealer_id: string; pin_code: string; name: string; address: string; installation_date: string };
        Update: { id?: string; dealer_id?: string; pin_code?: string; name?: string; address?: string; installation_date?: string };
      };
      installations: {
        Row: { id: string; client_id: string; wood_type: string; surface_m2: number; warranty_end_date: string };
        Insert: { id?: string; client_id: string; wood_type: string; surface_m2: number; warranty_end_date: string };
        Update: { id?: string; client_id?: string; wood_type?: string; surface_m2?: number; warranty_end_date?: string };
      };
      maintenance_logs: {
        Row: { id: string; installation_id: string; maintenance_date: string; maintenance_type: string; notes: string | null };
        Insert: { id?: string; installation_id: string; maintenance_date: string; maintenance_type: string; notes?: string | null };
        Update: { id?: string; installation_id?: string; maintenance_date?: string; maintenance_type?: string; notes?: string | null };
      };
    };
  };
};

// 2. CONFIGURAZIONE CLIENT SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ATTENZIONE: Variabili Supabase mancanti in .env o Vercel!");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 3. HELPER FUNCTIONS (LETTURA DATI)
// Funzione per recuperare tutti i clienti di un determinato Dealer (rivenditore)
export async function getClientsByDealer(dealerId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('dealer_id', dealerId);

  if (error) {
    console.error("Errore nel recupero clienti:", error.message);
    return null;
  }
  return data;
}

// Funzione per recuperare un singolo cliente tramite il suo PIN (per la schermata di sblocco)
export async function getClientByPin(pin: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*, installations(*)') // Prende anche i dati dell'installazione collegata
    .eq('pin_code', pin)
    .single();

  if (error) {
    console.error("PIN non trovato o errore:", error.message);
    return null;
  }
  return data;
}
