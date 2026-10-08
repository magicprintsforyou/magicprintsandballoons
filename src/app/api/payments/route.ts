import { NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';
import { CATEGORIZED_PRODUCTS } from '@/constants/products';

// Pricing rules — MUST match the client (src/context/ProductContext.tsx)
const RUSH_SURCHARGE = 40;
const PROMO_DISCOUNT_RATE = 0.05; // 5% for any promo code longer than 2 chars

type IncomingItem = {
  productId: string;
  variantSize?: string | null;
  material?: string | null;
  isRushOrder?: boolean;
  quantity: number;
};

function findProduct(productId: string) {
  for (const key of Object.keys(CATEGORIZED_PRODUCTS)) {
    const cat = (CATEGORIZED_PRODUCTS as any)[key];
    const found = cat?.items?.find((p: any) => p.id === productId);
    if (found) return found;
  }
  return null;
}

/** Recompute the order total from the catalog — never trust the client amount. */
function computeServerTotal(items: IncomingItem[], promoCode?: string): number {
  let subtotal = 0;
  for (const item of items) {
    const product = findProduct(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }
    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));

    let unitPrice = 0;
    if (item.variantSize && Array.isArray(product.variants)) {
      const variant = product.variants.find(
        (v: any) => String(v.size).toLowerCase() === String(item.variantSize).toLowerCase()
      );
      if (!variant) {
        throw new Error(`Unknown variant "${item.variantSize}" for product ${product.id}`);
      }
      unitPrice = Number(variant.price) || 0;
    } else {
      unitPrice = Number(product.price) || 0;
    }
    if (unitPrice <= 0) {
      throw new Error(`Product ${product.id} has no valid price`);
    }
    if (item.isRushOrder) unitPrice += RUSH_SURCHARGE;
    subtotal += unitPrice * qty;
  }

  let discount = 0;
  if (promoCode && promoCode.trim().length > 2) {
    discount = subtotal * PROMO_DISCOUNT_RATE;
  }
  return Math.max(0, Math.round((subtotal - discount) * 100) / 100);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const environment = (process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();

    if (!accessToken || accessToken.startsWith('REPLACE_')) {
      return NextResponse.json(
        { error: 'Payments are not configured yet. (SQUARE_ACCESS_TOKEN missing)' },
        { status: 503 }
      );
    }
    if (!locationId || locationId.startsWith('REPLACE_')) {
      return NextResponse.json(
        { error: 'Payments are not configured yet. (SQUARE_LOCATION_ID missing)' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const {
      sourceId, // one-time token from Square Web Payments SDK
      items,
      customer,
      promoCode,
      idempotencyKey: clientKey,
    } = body as {
      sourceId?: string;
      items?: IncomingItem[];
      customer?: { name?: string; email?: string; phone?: string; eventDate?: string; deliveryMethod?: string; shippingAddress?: string; notes?: string };
      promoCode?: string;
      idempotencyKey?: string;
    };

    // ---- Input validation ----
    if (!sourceId || typeof sourceId !== 'string' || sourceId.length < 4) {
      return NextResponse.json({ error: 'Missing payment token.' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'Cart is empty or invalid.' }, { status: 400 });
    }
    const name = String(customer?.name || '').trim();
    const email = String(customer?.email || '').trim();
    const phone = String(customer?.phone || '').trim();
    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (phone.length < 7 || phone.length > 30) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    // ---- Recompute total server-side ----
    let total: number;
    try {
      total = computeServerTotal(items, promoCode);
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || 'Invalid cart items.' }, { status: 400 });
    }
    if (total <= 0) {
      return NextResponse.json({ error: 'Order total must be greater than zero.' }, { status: 400 });
    }
    const amountCents = Math.round(total * 100);

    // ---- Charge via Square ----
    const client = new SquareClient({
      token: accessToken,
      environment: environment === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
    });

    const idempotencyKey =
      typeof clientKey === 'string' && clientKey.length >= 8 && clientKey.length <= 64
        ? clientKey
        : randomUUID();

    const referenceId = `mpb-${Date.now()}`;
    const noteParts = [
      `Customer: ${name}`,
      `Phone: ${phone}`,
      customer?.eventDate ? `Event date: ${customer.eventDate}` : null,
      customer?.deliveryMethod ? `Fulfillment: ${customer.deliveryMethod}` : null,
      customer?.shippingAddress ? `Address: ${customer.shippingAddress}` : null,
      customer?.notes ? `Notes: ${customer.notes}` : null,
    ].filter(Boolean);

    const paymentResponse = await client.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: { amount: BigInt(amountCents), currency: 'USD' },
      locationId,
      referenceId,
      note: noteParts.join(' | ').slice(0, 500),
      buyerEmailAddress: email,
    });

    const payment = paymentResponse.payment;
    if (!payment || (payment.status !== 'COMPLETED' && payment.status !== 'APPROVED')) {
      return NextResponse.json(
        { error: 'Payment was not completed. Please try again or use a different card.' },
        { status: 402 }
      );
    }

    // ---- Notify the owner via the existing order email flow ----
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
      await fetch(`${siteUrl}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          eventDate: customer?.eventDate || '',
          deliveryMethod: customer?.deliveryMethod || 'pickup',
          shippingAddress: customer?.shippingAddress || 'Store Pickup / Arlington DFW',
          promoCode: promoCode || 'None',
          notes: (customer?.notes || '') + `\n\nSquare Payment ID: ${payment.id} | Amount charged: $${total.toFixed(2)}`,
          cart: items.map((i) => {
            const p = findProduct(i.productId);
            return {
              product: { name: p?.name || i.productId },
              config: { variant: { size: i.variantSize || 'Default' }, material: i.material || 'N/A', isRushOrder: !!i.isRushOrder },
              quantity: i.quantity,
            };
          }),
          finalTotal: total,
          paymentId: payment.id,
        }),
      }).catch(() => { /* email is best-effort; payment already succeeded */ });
    } catch {
      // best-effort only
    }

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      amountCharged: total,
      receiptUrl: (payment as any)?.receiptUrl || null,
    });
  } catch (err: any) {
    // Map common Square errors to friendly messages
    const detail = err?.errors?.[0];
    const code = detail?.code || '';
    let message = 'Payment failed. Please try again.';
    if (code === 'CARD_DECLINED') message = 'Your card was declined. Please try a different card.';
    else if (code === 'INSUFFICIENT_FUNDS') message = 'Insufficient funds. Please try a different card.';
    else if (code === 'CVV_FAILURE') message = 'The CVV code is incorrect. Please check and try again.';
    else if (code === 'ADDRESS_VERIFICATION_FAILURE') message = 'Card address verification failed.';
    else if (code === 'INVALID_EXPIRATION') message = 'The card expiration date is invalid.';
    else if (detail?.detail) message = detail.detail;

    console.error('Square payment error:', code, detail?.detail || err?.message);
    return NextResponse.json({ error: message }, { status: 402 });
  }
}
