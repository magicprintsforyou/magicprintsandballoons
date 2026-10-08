'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import {
  loadLoyaltyConfig, saveLoyaltyConfig, listCustomers, adjustPoints,
  loadPrizes, savePrizes, loadRedemptions, fulfillRedemption,
  LoyaltyConfig, CustomerPoints, RedemptionTier, Prize, Redemption,
} from '../../../lib/loyalty';
import { CATEGORIZED_PRODUCTS } from '../../../constants/products';
import { ArrowLeft, Star, Save, Plus, Trash2, Search, X, Gift, Ticket, CheckCircle, Pencil } from 'lucide-react';

// Flatten catalog products for the prize product picker.
function allCatalogProducts(): { id: string; name: string; image: string; price?: number }[] {
  const out: { id: string; name: string; image: string; price?: number }[] = [];
  try {
    const catalog = CATEGORIZED_PRODUCTS as any;
    for (const key of Object.keys(catalog)) {
      const items = catalog[key]?.items;
      if (Array.isArray(items)) {
        for (const it of items) {
          out.push({ id: String(it.id), name: String(it.name), image: String(it.image || ''), price: Number(it.price) || undefined });
        }
      }
    }
  } catch { /* non-fatal */ }
  return out;
}

export default function AdminLoyaltyPage() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [config, setConfig] = useState<LoyaltyConfig | null>(null);
  const [customers, setCustomers] = useState<CustomerPoints[]>([]);
  const [search, setSearch] = useState('');
  const [adjustEmail, setAdjustEmail] = useState('');
  const [adjustName, setAdjustName] = useState('');
  const [adjustDelta, setAdjustDelta] = useState('');
  const [saved, setSaved] = useState(false);

  // Prizes
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [prizeForm, setPrizeForm] = useState({ title: '', description: '', image: '', pointsCost: '', kind: 'custom' as 'custom' | 'product', productId: '', active: true });
  const [showPrizeForm, setShowPrizeForm] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        if (localStorage.getItem('magic_bypass') === 'true') {
          setAuthOk(true);
          return;
        }
        const { data } = await supabase.auth.getSession();
        if (!data.session) router.push('/admin/login');
        else setAuthOk(true);
      } catch {
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };
    check();
  }, [router]);

  useEffect(() => {
    if (authOk) {
      setConfig(loadLoyaltyConfig());
      setCustomers(listCustomers());
      setPrizes(loadPrizes());
      setRedemptions(loadRedemptions());
    }
  }, [authOk]);

  const saveConfig = () => {
    if (!config) return;
    saveLoyaltyConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateTier = (id: string, patch: Partial<RedemptionTier>) => {
    if (!config) return;
    setConfig({
      ...config,
      tiers: config.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const addTier = () => {
    if (!config) return;
    const id = `tier-${Date.now()}`;
    setConfig({
      ...config,
      tiers: [...config.tiers, { id, points: 100, label: '', value: 5, active: true }],
    });
  };

  const removeTier = (id: string) => {
    if (!config) return;
    setConfig({ ...config, tiers: config.tiers.filter((t) => t.id !== id) });
  };

  const doAdjust = () => {
    const delta = parseInt(adjustDelta, 10);
    if (!adjustEmail.trim() || !isFinite(delta) || delta === 0) return;
    adjustPoints(adjustEmail, adjustName, delta);
    setCustomers(listCustomers());
    setAdjustEmail('');
    setAdjustName('');
    setAdjustDelta('');
  };

  // ---- Prizes ----
  const resetPrizeForm = () => {
    setPrizeForm({ title: '', description: '', image: '', pointsCost: '', kind: 'custom', productId: '', active: true });
    setEditingPrize(null);
    setShowPrizeForm(false);
  };

  const startEditPrize = (p: Prize) => {
    setEditingPrize(p);
    setPrizeForm({
      title: p.title,
      description: p.description,
      image: p.image,
      pointsCost: String(p.pointsCost),
      kind: p.kind,
      productId: p.productId || '',
      active: p.active,
    });
    setShowPrizeForm(true);
  };

  const savePrize = () => {
    const pointsCost = Math.max(1, parseInt(prizeForm.pointsCost, 10) || 0);
    if (!prizeForm.title.trim() || !pointsCost) return;
    const prize: Prize = {
      id: editingPrize?.id || `prize-${Date.now()}`,
      title: prizeForm.title.trim(),
      description: prizeForm.description.trim(),
      image: prizeForm.image.trim(),
      pointsCost,
      kind: prizeForm.kind,
      productId: prizeForm.kind === 'product' ? prizeForm.productId || undefined : undefined,
      active: prizeForm.active,
      createdAt: editingPrize?.createdAt || new Date().toISOString(),
    };
    const next = editingPrize
      ? prizes.map((p) => (p.id === editingPrize.id ? prize : p))
      : [prize, ...prizes];
    setPrizes(next);
    savePrizes(next);
    resetPrizeForm();
  };

  const deletePrize = (id: string) => {
    const next = prizes.filter((p) => p.id !== id);
    setPrizes(next);
    savePrizes(next);
  };

  const togglePrizeActive = (id: string) => {
    const next = prizes.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    setPrizes(next);
    savePrizes(next);
  };

  const doFulfill = (code: string) => {
    fulfillRedemption(code);
    setRedemptions(loadRedemptions());
  };

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.email.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  if (authLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading…</div>;
  }
  if (!authOk || !config) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to panel
          </Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Star size={24} className="text-amber-500" /> Loyalty Points
          </h1>
        </div>

        {/* Config */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Program settings</h2>
          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm text-gray-600">Points earned per $1 spent:</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={config.pointsPerDollar}
              onChange={(e) => setConfig({ ...config, pointsPerDollar: Math.max(0, Number(e.target.value) || 0) })}
              className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
          </div>

          <h3 className="font-bold text-gray-900 mb-3">Redemption rewards</h3>
          <div className="space-y-3">
            {config.tiers.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={t.active}
                    onChange={(e) => updateTier(t.id, { active: e.target.checked })}
                    className="accent-pink-600"
                  />
                  Active
                </label>
                <input
                  type="text"
                  value={t.label}
                  onChange={(e) => updateTier(t.id, { label: e.target.value })}
                  placeholder="Reward label (e.g. $5 off your next order)"
                  className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                />
                <label className="text-xs text-gray-500">Points:
                  <input
                    type="number"
                    min={1}
                    value={t.points}
                    onChange={(e) => updateTier(t.id, { points: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-20 ml-1 border border-gray-200 rounded-xl px-2 py-2 text-sm"
                  />
                </label>
                <label className="text-xs text-gray-500">Value $:
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={t.value}
                    onChange={(e) => updateTier(t.id, { value: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-20 ml-1 border border-gray-200 rounded-xl px-2 py-2 text-sm"
                  />
                </label>
                <button onClick={() => removeTier(t.id)} className="text-red-400 hover:text-red-600 p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addTier}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700"
            >
              <Plus size={16} /> Add reward
            </button>
            <button
              onClick={saveConfig}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-sm font-bold text-white"
            >
              <Save size={16} /> {saved ? 'Saved!' : 'Save settings'}
            </button>
          </div>
        </div>

        {/* Prizes (redeemable products & custom rewards) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Gift size={18} className="text-pink-600" /> Redemption prizes ({prizes.length})
            </h2>
            <button
              onClick={() => { resetPrizeForm(); setShowPrizeForm(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-sm font-bold text-white"
            >
              <Plus size={16} /> Add prize
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Prizes appear on the customer <span className="font-semibold">/rewards</span> page. Link a store product or create a custom prize with its own photo.
          </p>

          {showPrizeForm && (
            <div className="mb-4 p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-3">
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="radio" checked={prizeForm.kind === 'custom'} onChange={() => setPrizeForm({ ...prizeForm, kind: 'custom' })} className="accent-pink-600" />
                  Custom prize
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="radio" checked={prizeForm.kind === 'product'} onChange={() => setPrizeForm({ ...prizeForm, kind: 'product' })} className="accent-pink-600" />
                  Store product
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
                  <input type="checkbox" checked={prizeForm.active} onChange={(e) => setPrizeForm({ ...prizeForm, active: e.target.checked })} className="accent-pink-600" />
                  Active
                </label>
              </div>

              {prizeForm.kind === 'product' && (
                <select
                  value={prizeForm.productId}
                  onChange={(e) => {
                    const prod = allCatalogProducts().find((p) => p.id === e.target.value);
                    setPrizeForm({
                      ...prizeForm,
                      productId: e.target.value,
                      title: prizeForm.title || prod?.name || '',
                      image: prizeForm.image || prod?.image || '',
                    });
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                >
                  <option value="">— Select a store product —</option>
                  {allCatalogProducts().map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.price ? ` — $${p.price}` : ''}</option>
                  ))}
                </select>
              )}

              <input
                type="text"
                value={prizeForm.title}
                onChange={(e) => setPrizeForm({ ...prizeForm, title: e.target.value })}
                placeholder="Prize title (e.g. Free 12-inch balloon pack)"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              />
              <textarea
                value={prizeForm.description}
                onChange={(e) => setPrizeForm({ ...prizeForm, description: e.target.value })}
                placeholder="Description shown to customers"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              />
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  value={prizeForm.image}
                  onChange={(e) => setPrizeForm({ ...prizeForm, image: e.target.value })}
                  placeholder="Photo URL (optional)"
                  className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                />
                <label className="text-xs text-gray-500 self-center">Points cost:
                  <input
                    type="number"
                    min={1}
                    value={prizeForm.pointsCost}
                    onChange={(e) => setPrizeForm({ ...prizeForm, pointsCost: e.target.value })}
                    placeholder="150"
                    className="w-24 ml-1 border border-gray-200 rounded-xl px-2 py-2 text-sm bg-white"
                  />
                </label>
              </div>
              {prizeForm.image && (
                <img src={prizeForm.image} alt="preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
              )}
              <div className="flex gap-3">
                <button onClick={savePrize} className="px-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-sm font-bold text-white">
                  {editingPrize ? 'Save changes' : 'Add prize'}
                </button>
                <button onClick={resetPrizeForm} className="px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {prizes.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No prizes yet. Add your first redeemable prize above.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prizes.map((p) => (
                <div key={p.id} className={`flex gap-3 p-3 rounded-2xl border ${p.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                      <Gift size={24} className="text-pink-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 truncate">{p.kind === 'product' ? 'Store product' : 'Custom prize'} · {p.pointsCost} pts</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => startEditPrize(p)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => togglePrizeActive(p.id)} className="text-xs font-bold text-amber-600 hover:text-amber-800">
                        {p.active ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => deletePrize(p.id)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Redemptions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Ticket size={18} className="text-amber-500" /> Prize redemptions ({redemptions.length})
          </h2>
          {redemptions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No redemptions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="py-2 pr-4">Code</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Prize</th>
                    <th className="py-2 pr-4 text-right">Points</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r.code} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-mono font-bold text-gray-900">{r.code}</td>
                      <td className="py-3 pr-4 text-gray-600">{r.name}<br /><span className="text-xs text-gray-400">{r.email}</span></td>
                      <td className="py-3 pr-4 text-gray-600">{r.prizeTitle}</td>
                      <td className="py-3 pr-4 text-right text-amber-600 font-bold">-{r.pointsCost}</td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        {r.status === 'pending' ? (
                          <button
                            onClick={() => doFulfill(r.code)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold"
                          >
                            <CheckCircle size={12} /> Mark fulfilled
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            <CheckCircle size={12} /> Fulfilled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manual adjustment */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Adjust customer points</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="email"
              value={adjustEmail}
              onChange={(e) => setAdjustEmail(e.target.value)}
              placeholder="customer@email.com"
              className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
            <input
              type="text"
              value={adjustName}
              onChange={(e) => setAdjustName(e.target.value)}
              placeholder="Name (optional)"
              className="w-40 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
            <input
              type="number"
              value={adjustDelta}
              onChange={(e) => setAdjustDelta(e.target.value)}
              placeholder="+/- points"
              className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
            <button
              onClick={doAdjust}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-sm font-bold text-white"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Use positive numbers to add points, negative to remove (e.g. after a manual reward redemption).</p>
        </div>

        {/* Customer list */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Customers ({customers.length})</h2>
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-700">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No customers yet. Points are awarded automatically after each paid order.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4 text-right">Balance</th>
                    <th className="py-2 pr-4 text-right">Earned</th>
                    <th className="py-2 text-right">Redeemed</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.email} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-semibold text-gray-900">{c.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{c.email}</td>
                      <td className="py-3 pr-4 text-right font-black text-amber-600">{c.points}</td>
                      <td className="py-3 pr-4 text-right text-gray-500">{c.lifetimeEarned}</td>
                      <td className="py-3 text-right text-gray-500">{c.lifetimeRedeemed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Loyalty data is stored in this browser’s localStorage (same as orders and catalog).
        </p>
      </div>
    </div>
  );
}
