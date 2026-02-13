import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { pin, publicCode } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

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

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'PIN non valido' },
        { status: 401 }
      );
    }

    if (data.length > 1) {
      return NextResponse.json(
        { error: 'PIN duplicato - contatta assistenza' },
        { status: 400 }
      );
    }

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
