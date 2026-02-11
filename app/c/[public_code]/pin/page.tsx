'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PinPage({ params }: { params: { public_code: string } }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanedPin = String(pin).trim();
    const publicCode = String(params.public_code || '').trim();

    try {
      // DEBUG: ci serve per capire cosa sta succedendo davvero in produzione
      console.log('LOGIN DEBUG -> public_code:', publicCode, 'pin:', cleanedPin);

      const { data, error: sbError } = await supabase
        .from('clients')
        .select('*')
        .eq('public_code', publicCode)
        .eq('pin', cleanedPin)
        .single();

      // ✅ Se c'è errore, MOSTRALO (non trasformarlo in "PIN non valido")
      if (sbError) {
        console.error('SUPABASE ERROR ->', sbError);
        setError(`Errore DB: ${sbError.message}`);
        return;
      }

      if (!data) {
        setError('PIN non valido per questo utente.');
        return;
      }

      localStorage.setItem('customerSession', JSON.stringify(data));

      // Manteniamo la tua struttura attuale
      router.push(`/c/${publicCode}/customer`);
    } catch (err: any) {
      console.error('UNEXPECTED ERROR ->', err);
      setError('Errore di connessione o errore inatteso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 font-sans text-black">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-stone-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-stone-900 mb-2">Safe & Care</h1>
          <p className="text-stone-500 text-sm italic">Proteggiamo la bellezza del tuo legno</p>
        </div>

        <h2 className="text-xl font-medium text-stone-800 mb-6 text-center">
          Accesso per: <span className="font-bold text-stone-900">{params.public_code}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="······"
            className="w-full p-4 border-2 border-stone-200 rounded-xl text-center text-3xl tracking-[0.5em] focus:border-stone-500 focus:ring-0 outline-none transition-all text-black"
            maxLength={10}
            required
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white p-4 rounded-xl font-bold text-lg hover:bg-stone-800 active:scale-[0.98] transition-all disabled:bg-stone-400 shadow-lg"
          >
            {loading ? 'Verifica in corso...' : 'Sblocca Accesso'}
          </button>
        </form>

        <p className="mt-8 text-center text-stone-400 text-xs">
          Richiedi il codice al tuo installatore autorizzato
        </p>
      </div>
    </div>
  );
}
