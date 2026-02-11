import { createClient } from '@supabase/supabase-js';

// 1. CONFIGURAZIONE CLIENT SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ATTENZIONE: Variabili Supabase mancanti!");
}

// Esportiamo il client generico
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. HELPER FUNCTIONS AGGIORNATE
// Recupera un cliente usando sia il public_code (es. mario) che il PIN
export async function getClientByPublicCodeAndPin(publicCode: string, pin: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*, installations(*)')
    .eq('public_code', publicCode)
    .eq('pin', pin)
    .single();

  if (error) {
    console.error("Errore nel recupero cliente:", error.message);
    return null;
  }
  return data;
}

// Recupera i dati del cliente solo tramite il suo codice pubblico
export async function getClientByPublicCode(publicCode: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*, installations(*)')
    .eq('public_code', publicCode)
    .single();

  if (error) {
    console.error("Cliente non trovato:", error.message);
    return null;
  }
  return data;
}
