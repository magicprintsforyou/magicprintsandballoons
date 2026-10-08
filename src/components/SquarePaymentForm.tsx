"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CreditCard, Lock, Loader2, AlertCircle } from 'lucide-react';

// Square Web Payments SDK types (loaded from https://web.squarecdn.com/v1/square.js)
declare global {
  interface Window {
    Square?: any;
  }
}

type Props = {
  amount: number; // dollars, e.g. 160.00
  applicationId: string;
  locationId: string;
  onPaymentStart?: () => void;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (message: string) => void;
  language?: 'en' | 'es';
  disabled?: boolean;
};

export default function SquarePaymentForm({
  amount,
  applicationId,
  locationId,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  language = 'en',
  disabled = false,
}: Props) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [cardAttached, setCardAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const t = {
    pay: language === 'en' ? 'Pay' : 'Pagar',
    secure: language === 'en' ? 'Secure payment powered by Square' : 'Pago seguro con Square',
    cardDetails: language === 'en' ? 'Card Details' : 'Datos de la Tarjeta',
    loadError: language === 'en'
      ? 'Could not load the payment form. Please refresh and try again.'
      : 'No se pudo cargar el formulario de pago. Recarga e intenta de nuevo.',
    tokenError: language === 'en'
      ? 'Card could not be verified. Please check your card details.'
      : 'No se pudo verificar la tarjeta. Revisa los datos.',
  };

  // Load the Square Web Payments SDK script once
  useEffect(() => {
    if (window.Square) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setSdkError(t.loadError);
    document.head.appendChild(script);
    return () => {
      // keep the script for other mounts; do not remove
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize Square payments + attach card form
  useEffect(() => {
    if (!sdkReady || !applicationId || !locationId || !cardContainerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const payments = window.Square.payments(applicationId, locationId);
        paymentsRef.current = payments;
        const card = await payments.card();
        if (cancelled) return;
        await card.attach(cardContainerRef.current);
        if (cancelled) return;
        cardRef.current = card;
        setCardAttached(true);
      } catch (err: any) {
        if (!cancelled) setSdkError(err?.message || t.loadError);
      }
    })();

    return () => {
      cancelled = true;
      try { cardRef.current?.destroy?.(); } catch { /* noop */ }
      cardRef.current = null;
      setCardAttached(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkReady, applicationId, locationId]);

  const handlePay = useCallback(async () => {
    if (!cardRef.current || processing || disabled) return;
    setProcessing(true);
    onPaymentStart?.();
    try {
      const result = await cardRef.current.tokenize();
      if (result.errors && result.errors.length > 0) {
        const msg = result.errors.map((e: any) => e.message).join(' ');
        throw new Error(msg || t.tokenError);
      }
      onPaymentSuccess(result.token as string);
    } catch (err: any) {
      onPaymentError(err?.message || t.tokenError);
    } finally {
      setProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processing, disabled]);

  if (sdkError) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
        <AlertCircle size={18} className="shrink-0 mt-0.5" />
        <span>{sdkError}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <CreditCard size={16} className="text-[#d90082]" />
        {t.cardDetails}
      </div>

      {/* Square attaches its PCI-compliant iframe here */}
      <div
        ref={cardContainerRef}
        className="min-h-[120px] rounded-xl border border-slate-200 bg-white p-3"
      />

      {!cardAttached && !sdkError && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          {language === 'en' ? 'Loading secure card form…' : 'Cargando formulario seguro…'}
        </div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={!cardAttached || processing || disabled}
        className="w-full py-4 bg-[#d90082] hover:bg-[#b8006e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {language === 'en' ? 'Processing…' : 'Procesando…'}
          </>
        ) : (
          <>
            <Lock size={14} />
            {t.pay} ${amount.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
        <Lock size={10} /> {t.secure}
      </p>
    </div>
  );
}
