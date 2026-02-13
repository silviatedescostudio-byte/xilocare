import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { pin, publicCode } = await request.json();
    
    // Puliamo i dati da eventuali spazi bianchi
    const cleanPin = String(pin).trim();
    const cleanCode = String(publicCode).trim().toLowerCase();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Cerchiamo il cliente usando .ilike per ignorare maiuscole/minuscole
    const { data, error } = await supabase
      .from('clients')
      .select('id, public_code, name, pin')
      .ilike('public_code', cleanCode)
      .eq('pin', cleanPin)
      .limit(1);

    if (error) {
      console.error('Errore DB:', error);
      return NextResponse.json({ error: 'Errore database' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      // Se non lo trova, facciamo un log per capire cosa ha cercato (lo vedrai nei log di Vercel)
      console.log(`Tentativo fallito per: ${cleanCode} con PIN ${cleanPin}`);
      return NextResponse.json({ error: 'PIN o Codice non riconosciuto' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      clientId: data[0].id,
      publicCode: data[0].public_code,
      name: data[0].name
    });
  } catch (error) {
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
