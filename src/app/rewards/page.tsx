'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Gift, CheckCircle, Ticket } from 'lucide-react';
import { useLanguage } from '@/context/ProductContext';
import {
  getCustomerPoints, loadPrizes, redeemPrize, CustomerPoints, Prize,
} from '@/lib/loyalty';
import { CATEGORIZED_PRODUCTS } from '@/constants/products';

// Find a catalog product by id across all categories (for product-linked prizes).
function findCatalogProduct(productId?: string) {
  if (!productId) return null;
  for (const key of Object.keys(CATEGORIZED_PRODUCTS) as (keyof typeof CATEGORIZED_PRODUCTS)[]) {
    const found = CATEGORIZED_PRODUCTS[key].items.find((i: any) => i.id === productId);
    if (found) return found;
  }
  return null;
}

export default function RewardsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [customer, setCustomer] = useState<CustomerPoints | null | 'notfound'>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [redeemed, setRedeemed] = useState<{ code: string; title: string } | null>(null);
  const [error, setError] = useState('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRedeemed(null);
    const rec = getCustomerPoints(email);
    setCustomer(rec || 'notfound');
    if (rec) setPrizes(loadPrizes().filter((p) => p.active));
  };

  const handleRedeem = (prizeId: string) => {
    if (!customer || customer === 'notfound') return;
    setError('');
    const res = redeemPrize(customer.email, customer.name, prizeId);
    if ('error' in res) {
      setError(res.error);
      return;
    }
    setRedeemed({ code: res.redemption.code, title: res.redemption.prizeTitle });
    setCustomer(res.record);
  };

  const t = useMemo(() => ({
    title: language === 'en' ? 'Rewards' : 'Recompensas',
    sub: language === 'en'
      ? 'Turn your loyalty points into free products and prizes. Enter the email you used at checkout to see your balance.'
      : 'Convierte tus puntos en productos y premios gratis. Escribe el correo que usaste al pagar para ver tu balance.',
    emailPh: language === 'en' ? 'you@email.com' : 'tu@correo.com',
    check: language === 'en' ? 'Check my points' : 'Ver mis puntos',
    noAccount: language === 'en'
      ? 'No points found for this email yet. Points are added automatically after each paid order.'
      : 'Aún no hay puntos para este correo. Los puntos se agregan automáticamente con cada compra.',
    balance: language === 'en' ? 'points available' : 'puntos disponibles',
    redeem: language === 'en' ? 'Redeem' : 'Canjear',
    needMore: language === 'en' ? 'more needed' : 'más para canjear',
    success: language === 'en' ? 'Reward redeemed!' : '¡Premio canjeado!',
    successDetail: language === 'en'
      ? 'Show this code at pickup or mention it when we contact you:'
      : 'Muestra este código al recoger o menciónalo cuando te contactemos:',
    back: language === 'en' ? 'Back' : 'Atrás',
    empty: language === 'en'
      ? 'No rewards available right now — check back soon!'
      : 'No hay recompensas disponibles por ahora — ¡vuelve pronto!',
    pts: language === 'en' ? 'pts' : 'pts',
  }), [language]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0212] text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#d90082]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
          <ArrowLeft size={16} /> {t.back}
        </button>

        <div className="bg-black/40 rounded-[2.5rem] p-8 md:p-10 border border-white/10 backdrop-blur-md shadow-2xl">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#ffcc00] flex items-center gap-3">
            <Gift /> {t.title}
          </h1>
          <p className="text-white/50 text-sm mb-8">{t.sub}</p>

          <form onSubmit={handleLookup} className="flex gap-3 mb-8">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPh}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#d90082]/50"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#d90082] hover:bg-[#b0006c] font-bold text-sm whitespace-nowrap"
            >
              {t.check}
            </button>
          </form>

          {customer === 'notfound' && (
            <p className="text-amber-300/90 text-sm bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4">{t.noAccount}</p>
          )}

          {redeemed && (
            <div className="mb-8 bg-green-500/10 border border-green-500/30 rounded-2xl px-6 py-5 text-center">
              <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
              <p className="font-black text-green-300 text-lg">{t.success}</p>
              <p className="text-white/60 text-sm mt-1">{redeemed.title}</p>
              <p className="text-white/50 text-xs mt-3">{t.successDetail}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-black tracking-[0.2em] text-[#ffcc00] bg-black/40 px-6 py-2 rounded-xl border border-[#ffcc00]/30">
                <Ticket size={20} /> {redeemed.code}
              </p>
            </div>
          )}

          {error && (
            <p className="mb-6 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-3">{error}</p>
          )}

          {customer && customer !== 'notfound' && (
            <>
              <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-[#d90082]/20 to-[#41137e]/20 border border-[#d90082]/30 rounded-2xl px-6 py-4">
                <Star className="text-[#ffcc00]" size={28} fill="currentColor" />
                <div>
                  <p className="text-3xl font-black text-white">{customer.points} <span className="text-sm font-bold text-white/50">{t.balance}</span></p>
                  <p className="text-xs text-white/40">{customer.name}</p>
                </div>
              </div>

              {prizes.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-6">{t.empty}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prizes.map((prize) => {
                    const catalogProduct = prize.kind === 'product' ? findCatalogProduct(prize.productId) : null;
                    const img = prize.image || catalogProduct?.image || '';
                    const canAfford = customer.points >= prize.pointsCost;
                    return (
                      <div key={prize.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                        {img ? (
                          <img src={img} alt={prize.title} className="w-full h-40 object-cover" />
                        ) : (
                          <div className="w-full h-40 bg-gradient-to-br from-[#d90082]/30 to-[#41137e]/30 flex items-center justify-center">
                            <Gift size={40} className="text-white/30" />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-black text-white leading-tight">{prize.title}</h3>
                            <span className="shrink-0 text-xs font-black bg-[#ffcc00]/15 text-[#ffcc00] border border-[#ffcc00]/30 rounded-full px-3 py-1">
                              {prize.pointsCost} {t.pts}
                            </span>
                          </div>
                          {prize.description && (
                            <p className="text-white/50 text-xs mb-4 flex-1">{prize.description}</p>
                          )}
                          <button
                            onClick={() => handleRedeem(prize.id)}
                            disabled={!canAfford}
                            className={`mt-auto w-full py-3 rounded-2xl font-bold text-sm ${
                              canAfford
                                ? 'bg-[#d90082] hover:bg-[#b0006c] text-white'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? t.redeem : `${prize.pointsCost - customer.points} ${t.needMore}`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <Link href="/track-order" className="underline hover:text-white/60">
            {language === 'en' ? 'Track an order' : 'Rastrear una orden'}
          </Link>
        </p>
      </div>
    </div>
  );
}
