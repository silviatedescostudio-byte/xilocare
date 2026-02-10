'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClientByPin } from '@/lib/supabase';

export default function PinPage({ params }: { params: { public_code: string } }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Chiamata al database usando l'helper che abbiamo creato
    const clientData = await getClientByPin(pin);

    if (clientData) {
      // Se il PIN è corretto, lo mandiamo alla pagina del suo codice
      router.push(`/c/${params.public_code}`);
    } else {
      setError('PIN non valido. Riprova.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-stone-200">
        <h1 className="text-2xl font-serif text-stone-800 mb-6 text-center">
          Accesso Riservato Safe&Care
        </h1>
        <p className="text-stone-600 text-center mb-8 text-sm">
          Inserisci il PIN ricevuto dal tuo rivenditore per accedere ai dettagli del tuo pavimento.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Inserisci PIN"
            className="w-full p-3 border border-stone-300 rounded-lg text-center text-xl tracking-widest focus:ring-2 focus:ring-stone-400 outline-none"
            maxLength={10}
            required
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white p-3 rounded-lg font-medium hover:bg-stone-700 transition-colors disabled:bg-stone-400"
          >
            {loading ? 'Verifica in corso...' : 'Entra'}
          </button>
        </form>
      </div>
    </div>
  );
}
