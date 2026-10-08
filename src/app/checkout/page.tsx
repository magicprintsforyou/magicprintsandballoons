"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, User, Mail, Phone, Calendar, MapPin, Truck, Clock, Tag, Sparkles, Paperclip, X, ArrowLeft } from 'lucide-react';
import { useLanguage, useProducts } from '@/context/ProductContext';
import SquarePaymentForm from '@/components/SquarePaymentForm';
import {
  FULFILLMENT_NEEDS_ADDRESS, DELIVERY_PER_MILE, SHIPPING_FLAT_BALLOONS, SHIPPING_FLAT_PRINTS,
  FulfillmentMethod, FeeQuote, quoteDeliveryFee, shippingFee, cartHasPrints,
} from '@/constants/fulfillment';
import { generateOrderNumber, addOrder, loadOrders, OrderRecord, OrderItem } from '@/lib/orders';
import { awardPoints, getCustomerPoints, loadLoyaltyConfig } from '@/lib/loyalty';

const SQUARE_APP_ID = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
const SQUARE_CONFIGURED = Boolean(SQUARE_APP_ID && SQUARE_LOCATION_ID && !SQUARE_APP_ID.startsWith('REPLACE_'));

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { cart, cartTotal, clearCart } = useProducts();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentId, setPaymentId] = useState('');
  const idempotencyKeyRef = useRef<string>('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  // Split address fields (required for delivery / shipping)
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  const needsAddress = FULFILLMENT_NEEDS_ADDRESS.includes(deliveryMethod as FulfillmentMethod);

  // Event date only required if cart has print products (not just balloons)
  const PRINT_CATEGORIES = ['photoBoards', 'props', 'floorWraps', 'themedKits', 'essentials', 'Photo', 'Signage', 'Backdrop', 'Floor', 'Props', 'Flags', 'Signature', 'Essentials'];
  const hasPrintProducts = useMemo(() => {
    return cart.some(item => PRINT_CATEGORIES.includes(item.product.category));
  }, [cart]);

  // Delivery fee: $1.50/mile from Arlington TX 76011, quoted from customer ZIP.
  const [deliveryQuote, setDeliveryQuote] = useState<FeeQuote | null>(null);
  const [quotingDelivery, setQuotingDelivery] = useState(false);

  useEffect(() => {
    if (deliveryMethod !== 'delivery') {
      setDeliveryQuote(null);
      return;
    }
    const cleanZip = zip.trim();
    if (!/^\d{5}$/.test(cleanZip)) {
      setDeliveryQuote(null);
      return;
    }
    setQuotingDelivery(true);
    const t = setTimeout(async () => {
      const q = await quoteDeliveryFee(cleanZip);
      setDeliveryQuote(q);
      setQuotingDelivery(false);
    }, 600); // debounce while typing
    return () => clearTimeout(t);
  }, [deliveryMethod, zip]);

  const fulfillmentFee = useMemo(() => {
    if (deliveryMethod === 'delivery') return deliveryQuote && !deliveryQuote.estimated ? deliveryQuote.fee : 0;
    if (deliveryMethod === 'shipping') return shippingFee(hasPrintProducts);
    return 0;
  }, [deliveryMethod, deliveryQuote, hasPrintProducts]);

  const deliveryFeePending =
    deliveryMethod === 'delivery' && (!deliveryQuote || deliveryQuote.estimated || quotingDelivery);

  // Promo Code validation
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const combined = [...selectedFiles, ...files].slice(0, 10);
      setSelectedFiles(combined);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const applyPromo = () => {
    if (promoCode.trim().length > 2) {
      setPromoApplied(true);
    } else {
      alert(language === 'en' ? 'Please enter a valid code' : 'Por favor introduce un código válido');
    }
  };

  const finalDiscount = useMemo(() => {
    return promoApplied ? (cartTotal * 0.05) : 0;
  }, [promoApplied, cartTotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, Math.round((cartTotal - finalDiscount + fulfillmentFee) * 100) / 100);
  }, [cartTotal, finalDiscount, fulfillmentFee]);

  /** Build the OrderRecord for localStorage (after payment or legacy order). */
  const buildOrderRecord = (num: string, payId: string | null, feeNote?: string): OrderRecord => {
    const items: OrderItem[] = cart.map((item) => {
      const unit = item.price;
      return {
        productId: item.product.id,
        productName: item.product.name,
        variantSize: item.config?.variant?.size || null,
        material: item.config?.material || null,
        isRushOrder: !!item.config?.isRushOrder,
        quantity: item.quantity,
        unitPrice: Math.round(unit * 100) / 100,
        lineTotal: Math.round(unit * item.quantity * 100) / 100,
      };
    });
    return {
      orderNumber: num,
      createdAt: new Date().toISOString(),
      status: 'new',
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        eventDate: eventDate || undefined,
        notes: notes.trim() || undefined,
      },
      fulfillmentMethod: deliveryMethod,
      fulfillmentNote: feeNote,
      address: needsAddress ? { street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim() } : null,
      items,
      subtotal: Math.round(cartTotal * 100) / 100,
      discount: Math.round(finalDiscount * 100) / 100,
      fulfillmentFee,
      total: finalTotal,
      paymentId: payId,
      paymentMethod: payId ? 'square' : 'pending',
    };
  };

  const saveOrderLocally = (num: string, payId: string | null, feeNote?: string) => {
    try {
      addOrder(buildOrderRecord(num, payId, feeNote));
    } catch {
      // non-fatal
    }
  };

  // Redirect to catalog if cart is empty and not in success state
  useEffect(() => {
    if (cart.length === 0 && !success) {
      router.push('/products');
    }
  }, [cart, success, router]);

  // Step 1: validate the form, then reveal the in-page Square card form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    if (!SQUARE_CONFIGURED) {
      // Fallback: legacy flow (order email, payment link later)
      void submitLegacyOrder();
      return;
    }
    // Generate one idempotency key per checkout attempt
    idempotencyKeyRef.current = `mpb-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setShowPayment(true);
    setTimeout(() => {
      document.getElementById('square-payment-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const buildPaymentPayload = (sourceId: string) => ({
    sourceId,
    idempotencyKey: idempotencyKeyRef.current,
    promoCode: promoApplied ? promoCode : undefined,
    loyalty: (() => {
      try {
        const cfg = loadLoyaltyConfig();
        const rec = getCustomerPoints(email);
        return { pointsPerDollar: cfg.pointsPerDollar, balanceBefore: rec?.points || 0 };
      } catch {
        return { pointsPerDollar: 1, balanceBefore: 0 };
      }
    })(),
    customer: {
      name,
      email,
      phone,
      eventDate,
      deliveryMethod,
      shippingAddress: needsAddress ? `${street.trim()}, ${city.trim()}, ${state.trim()} ${zip.trim()}` : 'Store Pickup / Arlington DFW',
      address: needsAddress ? { street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim() } : undefined,
      notes: notes + (selectedFiles.length > 0 ? `\n\nArchivos de Arte / Artwork Files: ${selectedFiles.map(f => f.name).join(', ')}` : ''),
    },
    items: cart.map((item) => ({
      productId: item.product.id,
      variantSize: item.config?.variant?.size || null,
      material: item.config?.material || null,
      isRushOrder: !!item.config?.isRushOrder,
      quantity: item.quantity,
    })),
  });

  // Step 2: Square token received → charge server-side
  const processSquarePayment = async (token: string) => {
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPaymentPayload(token)),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || 'Payment failed. Please try again.');
      }
      const num = result.orderNumber || generateOrderNumber(loadOrders().map(o => o.orderNumber));
      setOrderNumber(num);
      setPaidAmount(result.amountCharged || finalTotal);
      setPaymentId(result.paymentId || '');
      saveOrderLocally(num, result.paymentId || null, result.feeNote || undefined);
      try {
        awardPoints(email, name, result.amountCharged || finalTotal);
        setEarnedPoints(Math.floor(result.amountCharged || finalTotal));
      } catch { /* non-fatal */ }
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setPaymentError(err?.message || (language === 'en' ? 'Payment failed. Please try again.' : 'El pago falló. Intenta de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Legacy fallback when Square is not configured: order email + payment link later
  const submitLegacyOrder = async () => {
    setIsSubmitting(true);
    try {
      const fileUrls: string[] = [];
      const fileNames = selectedFiles.map(f => f.name).join(', ');
      const num = generateOrderNumber(loadOrders().map(o => o.orderNumber));

      const payload = {
        name,
        email,
        phone,
        eventDate,
        deliveryMethod,
        shippingAddress: needsAddress ? `${street.trim()}, ${city.trim()}, ${state.trim()} ${zip.trim()}` : 'Store Pickup / Arlington DFW',
        promoCode: promoApplied ? promoCode : 'None',
        notes: notes + (fileNames ? `\n\nArchivos de Arte / Artwork Files: ${fileNames}` : '') + `\n\nOrder: ${num}`,
        cart,
        cartTotal,
        discountApplied: finalDiscount,
        fulfillmentFee,
        finalTotal,
        needs: cart.map(item => item.product.name),
        fileUrls,
      };

      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.details || result?.error || 'Failed to send order');
      }

      setOrderNumber(num);
      saveOrderLocally(num, null);
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(language === 'en' 
        ? `Error: ${err.message || 'There was an error sending your order. Please try again.'}` 
        : `Error: ${err.message || 'Hubo un error al enviar tu orden. Por favor intenta de nuevo.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0A0212] text-white pt-32 pb-24 px-6 justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#d90082]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-2xl text-center relative z-10 p-10 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl backdrop-blur-md">
          <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 text-green-400">
            <Sparkles size={40} className="animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-none text-[#ffcc00]">
            {language === 'en' ? (paymentId ? 'Payment Received!' : 'Order Submitted!') : (paymentId ? '¡Pago Recibido!' : '¡Orden Recibida!')}
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed mb-6">
            {paymentId
              ? (language === 'en'
                  ? `Thank you! Your payment of $${paidAmount.toFixed(2)} was received. We'll start working on your order and contact you about your event date and pickup/delivery details.`
                  : `¡Gracias! Recibimos tu pago de $${paidAmount.toFixed(2)}. Empezaremos a trabajar en tu orden y te contactaremos sobre la fecha del evento y los detalles de pickup/delivery.`)
              : (language === 'en'
                ? 'Thank you for choosing Magic Prints. We will confirm item availability and send your custom payment link within less than 24 hours via email or WhatsApp.'
                : 'Gracias por elegir Magic Prints. Confirmaremos la disponibilidad de tus productos e instalación, y te enviaremos tu enlace de pago personalizado en menos de 24 horas por correo o WhatsApp.')}
          </p>
          {orderNumber && (
            <div className="mb-8 inline-block px-8 py-4 rounded-2xl bg-[#ffcc00]/10 border-2 border-dashed border-[#ffcc00]/40">
              <p className="text-xs uppercase tracking-widest text-[#ffcc00]/70 mb-1">
                {language === 'en' ? 'Your order number' : 'Tu número de orden'}
              </p>
              <p className="text-3xl font-black tracking-wider text-[#ffcc00]">{orderNumber}</p>
              <p className="text-xs text-gray-400 mt-2">
                {language === 'en'
                  ? 'Save this number to track your order status.'
                  : 'Guarda este número para ver el estado de tu orden.'}
              </p>
              {earnedPoints > 0 && (
                <p className="text-sm text-green-300 font-bold mt-3">
                  {language === 'en'
                    ? `You earned ${earnedPoints} loyalty points!`
                    : `¡Ganaste ${earnedPoints} puntos de lealtad!`}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/')}
              className="px-12 py-5 bg-[#d90082] text-white rounded-full font-black text-sm tracking-widest uppercase hover:bg-[#ff2a70] transition-all shadow-lg"
            >
              {language === 'en' ? 'Back to Home' : 'Volver al Inicio'}
            </button>
            <button
              onClick={() => router.push('/track-order')}
              className="px-12 py-5 bg-white/10 border border-white/20 text-white rounded-full font-black text-sm tracking-widest uppercase hover:bg-white/20 transition-all"
            >
              {language === 'en' ? 'Track My Order' : 'Rastrear mi Orden'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0212] text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#d90082]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Checkout Form */}
        <div className="bg-black/40 rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden backdrop-blur-md shadow-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8 text-[#ffcc00] border-b border-white/10 pb-4">
            {language === 'en' ? 'Checkout & Booking' : 'Información del Cliente'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact Details */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/80 flex items-center gap-2"><User size={14}/> {language === 'en' ? 'Full Name' : 'Nombre Completo'}</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder="Ej. Yndira P." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Mail size={14}/> {language === 'en' ? 'Email Address' : 'Correo Electrónico'}</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder="hello@empresa.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Phone size={14}/> {language === 'en' ? 'WhatsApp / Phone' : 'Teléfono (WhatsApp)'}</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Calendar size={14}/> {language === 'en' ? 'Event Date' : 'Fecha del Evento'}{hasPrintProducts ? '' : (language === 'en' ? ' (optional)' : ' (opcional)')}</label>
                <input required={hasPrintProducts} type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Truck size={14}/> {language === 'en' ? 'Fulfillment Method' : 'Método de Entrega'}</label>
                <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all cursor-pointer">
                  <option value="pickup">{language === 'en' ? 'Store Pickup (Arlington DFW) — Free' : 'Pickup en Tienda (Arlington DFW) — Gratis'}</option>
                  <option value="delivery">{language === 'en' ? `Local Delivery — $1.50/mile (calculated by ZIP)` : `Delivery Local — $1.50/milla (calculado por ZIP)`}</option>
                  <option value="shipping">{language === 'en' ? `UPS Shipping (nationwide) — $${shippingFee(hasPrintProducts).toFixed(2)} flat` : `Envío UPS (nacional) — $${shippingFee(hasPrintProducts).toFixed(2)} fijo`}</option>
                  <option value="express">{language === 'en' ? 'Fast Print (24-48h setup)' : 'Fast Print Exprés (24-48h)'}</option>
                </select>
              </div>
            </div>

            {/* Delivery mileage quote */}
            {deliveryMethod === 'delivery' && (
              <div className="p-4 bg-[#00bff3]/10 border border-[#00bff3]/20 rounded-2xl text-sm text-[#00bff3] leading-relaxed">
                {quotingDelivery && (language === 'en' ? 'Calculating delivery fee…' : 'Calculando costo de delivery…')}
                {!quotingDelivery && deliveryQuote && !deliveryQuote.estimated && (
                  language === 'en'
                    ? `Delivery: ${deliveryQuote.miles} mi × $1.50 = $${deliveryQuote.fee.toFixed(2)} (from Arlington, TX 76011)`
                    : `Delivery: ${deliveryQuote.miles} mi × $1.50 = $${deliveryQuote.fee.toFixed(2)} (desde Arlington, TX 76011)`
                )}
                {!quotingDelivery && (!deliveryQuote || deliveryQuote.estimated) && (
                  language === 'en'
                    ? 'Enter your ZIP code below and we’ll calculate the delivery fee ($1.50/mile from Arlington, TX).'
                    : 'Escribe tu ZIP abajo y calcularemos el delivery ($1.50/milla desde Arlington, TX).'
                )}
              </div>
            )}

            {/* Pickup info (no address needed) */}
            {!needsAddress && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-sm text-green-300 leading-relaxed">
                {language === 'en'
                  ? 'Pickup is free at our Arlington, TX store. We will contact you when your order is ready.'
                  : 'El pickup es gratis en nuestra tienda en Arlington, TX. Te contactaremos cuando tu orden esté lista.'}
              </div>
            )}

            {/* Split address fields — required for delivery / shipping */}
            {needsAddress && (
              <div className="space-y-4 animate-in slide-in-from-top duration-300 p-5 rounded-2xl bg-white/5 border border-white/10">
                <label className="text-sm font-bold text-white/80 flex items-center gap-2"><MapPin size={14}/> {language === 'en' ? 'Delivery / Shipping Address' : 'Dirección de Entrega / Envío'}</label>
                <div className="space-y-2">
                  <input required type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder={language === 'en' ? 'Street address' : 'Calle y número'} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder={language === 'en' ? 'City' : 'Ciudad'} />
                  <input required type="text" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all uppercase" placeholder={language === 'en' ? 'State' : 'Estado'} />
                </div>
                <div className="w-1/2">
                  <input required type="text" value={zip} onChange={(e) => setZip(e.target.value)} maxLength={10} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder="ZIP" />
                </div>
              </div>
            )}

            {/* Promo Code Validation */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Tag size={14}/> {language === 'en' ? 'Vendor or Planner Code' : 'Código de Vendedor o Planner (Opcional - 5%)'}</label>
              <div className="flex gap-4">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={promoApplied} className="flex-grow bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder="Ej. PLANNER5" />
                <button type="button" onClick={applyPromo} disabled={promoApplied} className="px-6 bg-[#d90082]/10 border border-[#d90082]/20 hover:bg-[#d90082]/20 text-[#d90082] rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                  {promoApplied ? (language === 'en' ? 'Applied!' : '¡Aplicado!') : (language === 'en' ? 'Validate' : 'Validar')}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Clock size={14}/> {language === 'en' ? 'Special Instructions / Notes' : 'Instrucciones Especiales / Notas'}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d90082]/50 focus:bg-[#0f172a] transition-all" placeholder="Opcional - Detalles sobre el acceso al venue o solicitudes específicas." />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || showPayment}
              className="w-full py-5 bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#41137e] text-white rounded-full font-black text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(217,0,130,0.3)] mt-8 disabled:opacity-60"
            >
              {isSubmitting
                ? (language === 'en' ? 'Processing...' : 'Procesando...')
                : showPayment
                  ? (language === 'en' ? 'Complete Payment Below' : 'Completa el Pago Abajo')
                  : (SQUARE_CONFIGURED
                      ? (language === 'en' ? 'Continue to Payment' : 'Continuar al Pago')
                      : (language === 'en' ? 'Confirm Order & Request Link' : 'Confirmar Orden y Solicitar Pago'))}
            </button>

            {/* In-page Square payment section */}
            {showPayment && SQUARE_CONFIGURED && (
              <div id="square-payment-section" className="mt-8 p-6 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black uppercase tracking-wide text-sm">
                    {language === 'en' ? 'Payment' : 'Pago'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ArrowLeft size={12} /> {language === 'en' ? 'Edit details' : 'Editar datos'}
                  </button>
                </div>
                {paymentError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {paymentError}
                  </div>
                )}
                <SquarePaymentForm
                  amount={finalTotal}
                  applicationId={SQUARE_APP_ID}
                  locationId={SQUARE_LOCATION_ID}
                  language={language}
                  disabled={isSubmitting}
                  onPaymentSuccess={processSquarePayment}
                  onPaymentError={(msg) => setPaymentError(msg)}
                />
              </div>
            )}

          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md shadow-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8 text-[#ffcc00] border-b border-white/10 pb-4 flex items-center gap-3">
            <ShoppingBag className="text-[#ffcc00]" /> {language === 'en' ? 'Order Summary' : 'Resumen de Orden'}
          </h2>

          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <img src={item.product.image} className="w-16 h-16 rounded-2xl object-cover border border-white/5" alt={item.product.name} />
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{item.product.name}</h4>
                    <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-semibold">
                      Size: {item.config?.variant?.size || 'Default'} | Mat: {item.config?.material}
                    </p>
                    {(item.config as any)?.artworkName && (
                      <p className="text-[10px] text-white/50 mt-1 italic truncate max-w-[250px]">
                        File: {(item.config as any).artworkName}
                      </p>
                    )}
                    {(item.config as any)?.customText && (
                      <p className="text-[10px] text-white/50 mt-1 italic truncate max-w-[250px]">
                        Text: "{(item.config as any).customText}"
                      </p>
                    )}
                    {item.config?.isRushOrder && (
                      <span className="inline-block mt-2 text-[8px] bg-red-950 text-red-400 font-bold uppercase px-2 py-0.5 rounded border border-red-800/30">
                        Rush Order (+24-48h)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/40 block mb-1">Qty: {item.quantity}</span>
                  <span className="font-black text-[#00bff3] text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}

            <div className="space-y-3 pt-6 text-sm">
              <div className="flex justify-between items-center text-gray-400">
                <span>{language === 'en' ? 'Subtotal:' : 'Subtotal:'}</span>
                <span className="font-bold text-white">${cartTotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between items-center text-green-400 font-bold">
                  <span>{language === 'en' ? 'Referred Discount (5%):' : 'Descuento de Referido (5%):'}</span>
                  <span>-${finalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-gray-400">
                <span>{language === 'en' ? `Fulfillment (${deliveryMethod === 'pickup' ? 'Pickup' : deliveryMethod === 'delivery' ? 'Local Delivery' : deliveryMethod === 'shipping' ? 'Shipping' : 'Fast Print'}):` : `Entrega (${deliveryMethod === 'pickup' ? 'Pickup' : deliveryMethod === 'delivery' ? 'Delivery Local' : deliveryMethod === 'shipping' ? 'Envío' : 'Fast Print'}):`}</span>
                <span className="font-bold text-white">
                  {deliveryMethod === 'delivery' && deliveryQuote && !deliveryQuote.estimated
                    ? `$${fulfillmentFee.toFixed(2)} (${deliveryQuote.miles} mi)`
                    : deliveryMethod === 'delivery'
                      ? (language === 'en' ? 'Enter ZIP' : 'Escribe tu ZIP')
                      : fulfillmentFee === 0
                        ? (language === 'en' ? 'Free' : 'Gratis')
                        : `$${fulfillmentFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryFeePending && (
                <p className="text-xs text-amber-300/90 italic">
                  {language === 'en'
                    ? 'Note: the delivery fee will be confirmed before we process your order — we’ll contact you if the ZIP can’t be located.'
                    : 'Nota: el costo de delivery se confirmará antes de procesar tu orden — te contactaremos si no podemos ubicar el ZIP.'}
                </p>
              )}
              <div className="flex justify-between items-center pt-6 text-xl font-black uppercase text-[#d90082] border-t border-white/10">
                <span>Total Estimado / Estimated Total:</span>
                <span className="text-2xl">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-[#ffcc00]/10 border border-[#ffcc00]/20 rounded-2xl text-xs text-[#ffcc00] leading-relaxed italic mt-8">
              {language === 'en'
                ? "✨ Note: We will verify logistics, event scheduling, and shipping. A secure payment link will follow once verified."
                : "✨ Nota: Verificaremos disponibilidad, logística de envío y fecha del evento. El enlace de pago seguro se enviará una vez verificado."}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
