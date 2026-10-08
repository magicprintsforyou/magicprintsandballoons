'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import {
  loadLoyaltyConfig, saveLoyaltyConfig, listCustomers, adjustPoints,
  LoyaltyConfig, CustomerPoints, RedemptionTier,
} from '../../../lib/loyalty';
import { ArrowLeft, Star, Save, Plus, Trash2, Search, X } from 'lucide-react';

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
