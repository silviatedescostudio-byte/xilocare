export default function ClientPage({ params }: { params: { public_code: string } }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-serif">Dati del Cliente: {params.public_code}</h1>
      <p className="mt-4 text-stone-600">Qui appariranno i dettagli del pavimento dopo lo sblocco.</p>
    </div>
  );
}
