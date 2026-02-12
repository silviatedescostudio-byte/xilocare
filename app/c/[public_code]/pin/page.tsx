'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PinPage({ params }: { params: { public_code: string } }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const publicCode = String(params.public_code || '').trim();

    try {
      // 🚀 CHIAMATA AL PONTE SICURO (API)
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pin: pin.trim(),
          publicCode: publicCode 
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        // Se l'API ci dà errore, lo mostriamo
        setError(result.error || 'PIN non valido');
        return;
      }

      // ✅ SE OK: Il server ha già impostato il Cookie. 
      // Salviamo comunque qualcosa nel localStorage per compatibilità se serve alla dashboard
      localStorage.setItem('customerSession', JSON.stringify({ public_code: publicCode }));

      // Andiamo alla pagina del cliente
      router.push(`/customer/${publicCode}`);
      
    } catch (err: any) {
      console.error('ERRORE INVIO ->', err);
      setError('Errore di connessione. Riprova.');
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
