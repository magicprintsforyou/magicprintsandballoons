'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PackageSearch, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/ProductContext';
import { findOrder, OrderRecord, ORDER_STATUSES } from '@/lib/orders';
import { getCustomerPoints, affordableTiers, loadLoyaltyConfig, CustomerPoints } from '@/lib/loyalty';
import { Star } from 'lucide-react';

export default function TrackOrderPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<OrderRecord | null | 'notfound'>(null);
  const [loyalty, setLoyalty] = useState<CustomerPoints | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = findOrder(orderNumber, email);
    setResult(found || 'notfound');
    setLoyalty(found ? getCustomerPoints(email) : null);
  };

  const statusLabel = (s: string) => {
    const entry = ORDER_STATUSES.find((x) => x.value === s);
    if (!entry) return s;
    return language === 'en' ? entry.en : entry.es;
  };

  const statusColor = (s: string) => {
    if (s === 'completed') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (s === 'processing') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    if (s === 'cancelled') return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0212] text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#d90082]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl mx-auto w-full relative z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
          <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Atrás'}
        </button>

        <div className="bg-black/40 rounded-[2.5rem] p-8 md:p-10 border border-white/10 backdrop-blur-md shadow-2xl">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#ffcc00] flex items-center gap-3">
            <PackageSearch /> {language === 'en' ? 'Track My Order' : 'Rastrear mi Orden'}
          </h1>
          <p className="text-white/50 text-sm mb-8">
            {language === 'en'
              ? 'Enter your order number (e.g. MPB-20261008-A3F9) and the email you used at checkout.'
              : 'Escribe tu número de orden (ej. MPB-20261008-A3F9) y el correo que usaste al pagar.'}
          </p>

          <form onSubmit={handleLookup} className="space-y-4">
            <input
              required
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="MPB-20261008-XXXX"
              className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white uppercase tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#d90082]/50"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50"
            />
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#41137e] text-white rounded-full font-black text-sm tracking-widest uppercase hover:scale-[1.02] transition-all"
            >
              {language === 'en' ? 'Look Up Order' : 'Buscar Orden'}
            </button>
          </form>

          {result === 'notfound' && (
            <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {language === 'en'
                ? 'We couldn’t find that order. Check the order number and email and try again.'
                : 'No encontramos esa orden. Revisa el número y el correo e intenta de nuevo.'}
            </div>
          )}

          {result && result !== 'notfound' && (
            <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono font-black text-[#ffcc00] text-lg">{result.orderNumber}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(result.status)}`}>
                  {statusLabel(result.status)}
                </span>
              </div>
              <p className="text-xs text-white/40">
                {new Date(result.createdAt).toLocaleString()} · {result.items.reduce((n, i) => n + i.quantity, 0)}{' '}
                {language === 'en' ? 'items' : 'artículos'} · {language === 'en' ? 'Total' : 'Total'}: ${result.total.toFixed(2)}
              </p>
              <ul className="space-y-1 text-sm text-white/70">
                {result.items.map((it, idx) => (
                  <li key={idx}>
                    {it.quantity}× {it.productName}
                    {it.variantSize && <span className="text-white/40"> ({it.variantSize})</span>}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/40 capitalize">
                {language === 'en' ? 'Fulfillment' : 'Entrega'}: {result.fulfillmentMethod}
                {result.address && ` — ${result.address.street}, ${result.address.city}, ${result.address.state} ${result.address.zip}`}
              </p>
              <p className="text-xs text-white/40">
                {language === 'en'
                  ? 'Questions about your order? Message us on WhatsApp and include your order number.'
                  : '¿Preguntas sobre tu orden? Escríbenos por WhatsApp incluyendo tu número de orden.'}
              </p>
            </div>
          )}

          {loyalty && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#d90082]/20 to-[#41137e]/20 border border-[#d90082]/30">
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="text-[#ffcc00]" />
                <h3 className="font-black uppercase tracking-wide text-sm text-[#ffcc00]">
                  {language === 'en' ? 'Loyalty Points' : 'Puntos de Lealtad'}
                </h3>
              </div>
              <p className="text-3xl font-black text-white">{loyalty.points} <span className="text-sm font-normal text-white/50">{language === 'en' ? 'points' : 'puntos'}</span></p>
              <p className="text-xs text-white/40 mt-1">
                {language === 'en'
                  ? `You earn ${loadLoyaltyConfig().pointsPerDollar} point(s) per $1 spent.`
                  : `Ganas ${loadLoyaltyConfig().pointsPerDollar} punto(s) por cada $1.`}
              </p>
              {affordableTiers(loyalty.points).length > 0 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-bold text-white/70 uppercase">{language === 'en' ? 'Rewards you can claim:' : 'Recompensas disponibles:'}</p>
                  {affordableTiers(loyalty.points).map((t) => (
                    <div key={t.id} className="flex justify-between text-sm bg-white/5 rounded-xl px-3 py-2">
                      <span className="text-white/80">{t.label}</span>
                      <span className="text-[#ffcc00] font-bold">{t.points} pts</span>
                    </div>
                  ))}
                  <p className="text-xs text-white/40 italic">
                    {language === 'en'
                      ? 'Mention your reward at checkout or on WhatsApp to redeem.'
                      : 'Menciona tu recompensa al pagar o por WhatsApp para canjearla.'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-white/40 mt-2 italic">
                  {language === 'en' ? 'Keep shopping to unlock rewards!' : '¡Sigue comprando para desbloquear recompensas!'}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white underline">
            {language === 'en' ? 'Back to home' : 'Volver al inicio'}
          </Link>
        </div>
      </div>
    </div>
  );
}
