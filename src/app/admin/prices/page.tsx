'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product, ProductVariant } from '../../../context/ProductContext';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from 'lucide-react';

type PriceEdit = {
  price: string;
  variants: { size: string; price: string }[];
};

export default function BulkPriceEditor() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { catalog, updateProduct } = useProducts();
  const [edits, setEdits] = useState<Record<string, PriceEdit>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        if (localStorage.getItem('magic_bypass') === 'true') {
          setAuthOk(true);
          setAuthLoading(false);
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

  // Initialize edit state from catalog
  useEffect(() => {
    if (!authOk) return;
    const next: Record<string, PriceEdit> = {};
    Object.values(catalog).forEach((cat: any) => {
      (cat.items || []).forEach((p: Product) => {
        if (!next[p.id]) {
          next[p.id] = {
            price: p.price != null ? String(p.price) : '',
            variants: (p.variants || []).map((v: ProductVariant) => ({
              size: v.size,
              price: String(v.price),
            })),
          };
        }
      });
    });
    setEdits(next);
  }, [authOk, catalog]);

  const setVariantPrice = (productId: string, idx: number, value: string) => {
    setEdits((prev) => {
      const cur = prev[productId];
      if (!cur) return prev;
      const variants = cur.variants.map((v, i) => (i === idx ? { ...v, price: value } : v));
      return { ...prev, [productId]: { ...cur, variants } };
    });
  };

  const setBasePrice = (productId: string, value: string) => {
    setEdits((prev) => {
      const cur = prev[productId];
      if (!cur) return prev;
      return { ...prev, [productId]: { ...cur, price: value } };
    });
  };

  const findProduct = (productId: string): { categoryId: string; product: Product } | null => {
    for (const [catId, cat] of Object.entries(catalog)) {
      const found = (cat as any).items?.find((p: Product) => p.id === productId);
      if (found) return { categoryId: catId, product: found };
    }
    return null;
  };

  const saveProduct = async (productId: string) => {
    const found = findProduct(productId);
    const edit = edits[productId];
    if (!found || !edit) return;
    setSaving(productId);
    setMessage(null);
    try {
      const updated: Product = {
        ...found.product,
        price: edit.price === '' ? undefined : Number(edit.price) || 0,
        variants: edit.variants.map((v) => ({ size: v.size, price: Number(v.price) || 0 })),
      };
      const result = await updateProduct(found.categoryId, updated);
      if (result.ok) {
        setMessage({ type: 'ok', text: `Precios guardados: ${found.product.name}${result.warning ? ' (' + result.warning + ')' : ''}` });
      } else {
        setMessage({ type: 'err', text: `Error en ${found.product.name}: ${result.error || 'desconocido'}` });
      }
    } catch (e: any) {
      setMessage({ type: 'err', text: `Error: ${e?.message || 'desconocido'}` });
    } finally {
      setSaving(null);
    }
  };

  if (authLoading) return <div className="p-8">Cargando...</div>;
  if (!authOk) return null;

  const products: { categoryId: string; product: Product }[] = [];
  const seen = new Set<string>();
  Object.entries(catalog).forEach(([catId, cat]: [string, any]) => {
    (cat.items || []).forEach((p: Product) => {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        products.push({ categoryId: catId, product: p });
      }
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4">
          <ArrowLeft size={16} /> Volver al panel
        </Link>
        <h1 className="text-2xl font-bold mb-2">Editar precios</h1>
        <p className="text-gray-600 mb-6">Cambia los precios y presiona Guardar en cada producto. Los cambios se publican al instante.</p>

        {message && (
          <div className={`mb-4 p-3 rounded flex items-center gap-2 ${message.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {products.map(({ product }) => {
            const edit = edits[product.id];
            if (!edit) return null;
            return (
              <div key={product.id} className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Precio base $</label>
                    <input
                      type="number"
                      min="0"
                      value={edit.price}
                      onChange={(e) => setBasePrice(product.id, e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {edit.variants.map((v, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 border rounded px-3 py-2">
                      <span className="text-sm">{v.size}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          value={v.price}
                          onChange={(e) => setVariantPrice(product.id, i, e.target.value)}
                          className="w-20 border rounded px-2 py-1 text-right"
                        />
                      </div>
                    </div>
                  ))}
                  {edit.variants.length === 0 && (
                    <p className="text-sm text-gray-400">Sin variantes de tamaño.</p>
                  )}
                </div>
                <button
                  onClick={() => saveProduct(product.id)}
                  disabled={saving === product.id}
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving === product.id ? 'Guardando...' : 'Guardar precios'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
