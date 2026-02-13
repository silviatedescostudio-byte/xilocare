import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { pin, publicCode } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // USA .limit(2) invece di .single() per evitare errore
    const { data, error } = await supabase
      .from('clients')
      .select('id, public_code, name, pin')
      .eq('public_code', publicCode)
      .eq('pin', pin)
      .limit(2);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Errore database' },
        { status: 500 }
      );
    }

    // Nessun cliente trovato
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'PIN non valido' },
        { status: 401 }
      );
    }

    // PIN duplicato (non dovrebbe succedere)
    if (data.length > 1) {
      return NextResponse.json(
        { error: 'PIN duplicato - contatta assistenza' },
        { status: 400 }
      );
    }

    // OK - 1 solo cliente trovato
    const client = data[0];

    return NextResponse.json({
      success: true,
      clientId: client.id,
      publicCode: client.public_code,
      name: client.name
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore server' },
      { status: 500 }
    );
  }
}
```

5. **Commit message:** `Add customer login API endpoint`
6. **Commit directly** to main branch
7. **Clicca "Commit new file"**

---

## ⏱️ **DOPO IL COMMIT:**

**Aspetta 1-2 minuti** che Vercel faccia il deploy automatico.

---

## 🧪 **POI TESTA:**

**Apri questo URL nel browser:**
```
https://xilocare.app/api/customer/login
