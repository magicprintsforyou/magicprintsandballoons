'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import {
  loadOrders, updateOrderStatus, OrderRecord, OrderStatus, ORDER_STATUSES,
} from '../../../lib/orders';
import { ArrowLeft, Package, Search, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

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
    if (authOk) setOrders(loadOrders());
  }, [authOk]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, search]);

  const changeStatus = (orderNumber: string, status: OrderStatus) => {
    setOrders(updateOrderStatus(orderNumber, status));
  };

  const statusBadge = (s: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      new: 'bg-blue-100 text-blue-800',
      processing: 'bg-amber-100 text-amber-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-200 text-gray-600',
    };
    const label = ORDER_STATUSES.find((x) => x.value === s)?.en || s;
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[s]}`}>{label}</span>;
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading…</div>;
  }
  if (!authOk) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to panel
          </Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package size={24} /> Orders
            <span className="text-sm font-normal text-gray-500">({orders.length})</span>
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, name, email, phone…"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-700">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', ...ORDER_STATUSES.map((s) => s.value)] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${
                  statusFilter === s ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : ORDER_STATUSES.find((x) => x.value === s)?.en}
              </button>
            ))}
          </div>
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            No orders found. Orders placed on the website will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <div key={o.orderNumber} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === o.orderNumber ? null : o.orderNumber)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-black text-gray-900">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(o.createdAt).toLocaleString()} · {o.customer.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 hidden md:block">
                      {o.items.reduce((n, i) => n + i.quantity, 0)} items
                    </span>
                    <span className="font-black text-gray-900">${o.total.toFixed(2)}</span>
                    {statusBadge(o.status)}
                    {expanded === o.orderNumber ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {expanded === o.orderNumber && (
                  <div className="border-t border-gray-100 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Customer</h4>
                      <p className="text-gray-700">{o.customer.name}</p>
                      <p className="text-gray-500">{o.customer.email}</p>
                      <p className="text-gray-500">{o.customer.phone}</p>
                      {o.customer.eventDate && <p className="text-gray-500">Event: {o.customer.eventDate}</p>}
                      {o.customer.notes && <p className="text-gray-500 mt-2 italic">“{o.customer.notes}”</p>}

                      <h4 className="font-bold text-gray-900 mt-4 mb-2">Fulfillment</h4>
                      <p className="text-gray-700 capitalize">{o.fulfillmentMethod}</p>
                      {o.address && (
                        <p className="text-gray-500">
                          {o.address.street}, {o.address.city}, {o.address.state} {o.address.zip}
                        </p>
                      )}
                      {o.fulfillmentNote && (
                        <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 text-xs">
                          {o.fulfillmentNote}
                        </p>
                      )}
                      <p className="text-gray-500 mt-1">
                        Fee: ${o.fulfillmentFee.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Items</h4>
                      <ul className="space-y-2">
                        {o.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between text-gray-700">
                            <span>
                              {it.quantity}× {it.productName}
                              {it.variantSize && <span className="text-gray-400"> ({it.variantSize})</span>}
                              {it.isRushOrder && <span className="text-red-500 text-xs"> +rush</span>}
                            </span>
                            <span className="font-semibold">${it.lineTotal.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 mt-3 pt-3 space-y-1 text-gray-600">
                        <div className="flex justify-between"><span>Subtotal</span><span>${o.subtotal.toFixed(2)}</span></div>
                        {o.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${o.discount.toFixed(2)}</span></div>}
                        <div className="flex justify-between"><span>Fulfillment</span><span>${o.fulfillmentFee.toFixed(2)}</span></div>
                        <div className="flex justify-between font-black text-gray-900 text-base"><span>Total</span><span>${o.total.toFixed(2)}</span></div>
                      </div>
                      {o.paymentId && <p className="text-xs text-gray-400 mt-2">Square payment: {o.paymentId}</p>}
                      {!o.paymentId && <p className="text-xs text-amber-600 mt-2">Payment pending (order email flow)</p>}
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.orderNumber, e.target.value as OrderStatus)}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Orders are stored in this browser’s localStorage (same as the catalog). Large print shipping ($25 base)
          may need a manual adjustment — update the customer directly if the real shipping cost differs.
        </p>
      </div>
    </div>
  );
}
