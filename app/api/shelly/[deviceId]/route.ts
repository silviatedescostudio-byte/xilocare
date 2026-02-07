import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * SHELLY API ROUTE (Dynamic Device ID) - DATI REALI DA VARIABILI D'AMBIENTE
 * NO FALLBACK NUMERICI - NO VALORI HARDCODATI
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const { deviceId } = await params;
  
  // Leggi configurazione da variabili d'ambiente (con fallback ai nomi italiani)
  const SERVER = process.env.SHELLY_SERVER_URI || process.env.URI_SERVER_SHELLY;
  const AUTH_KEY = process.env.SHELLY_AUTH_KEY;

  // Se manca configurazione, ritorna errore 500
  if (!SERVER || !AUTH_KEY) {
    return NextResponse.json({ 
      error: "Config mancante",
      missing: {
        server: !SERVER,
        authKey: !AUTH_KEY
      }
    }, { status: 500 });
  }

  try {
    // Chiama Shelly Cloud con cache busting
    const nocache = Date.now();
    const url = `${SERVER}/device/status?id=${deviceId}&auth_key=${AUTH_KEY}&_=${nocache}`;
    
    const res = await fetch(url, { 
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Pragma': 'no-cache', 
        'Cache-Control': 'no-cache, no-store, must-revalidate' 
      }
    });
    
    const json = await res.json();
    
    // Verifica risposta Shelly
    if (!json.isok || !json.data?.device_status) {
      return NextResponse.json({
        temperature: null,
        humidity: null,
        online: false,
        syncing: true,
        ts: Date.now(),
        error: "Dati sensore non disponibili"
      }, { status: 503 });
    }
    
    const s = json.data.device_status;

    // Mappa campi Gen2/Gen3
    const temperature = s['temperature:0']?.tC ?? s['temperatura:0']?.tC ?? null;
    const humidity = s['humidity:0']?.rh ?? s['umidità:0']?.rh ?? null;
    const online = s.cloud?.connected ?? false;
    
    // Se i campi non esistono, ritorna errore
    if (temperature === null || humidity === null) {
      return NextResponse.json({
        temperature: null,
        humidity: null,
        online: false,
        syncing: true,
        ts: Date.now(),
        error: "Dati sensore non disponibili"
      }, { status: 503 });
    }

    // Dati OK - ritorna valori reali
    return NextResponse.json({
      temperature: parseFloat(temperature.toFixed(1)),
      humidity: Math.round(humidity),
      online,
      syncing: false,
      ts: Date.now()
    });
    
  } catch {
    // Errore di rete
    return NextResponse.json({
      temperature: null,
      humidity: null,
      online: false,
      syncing: true,
      ts: Date.now(),
      error: "Dati sensore non disponibili"
    }, { status: 503 });
  }
}
