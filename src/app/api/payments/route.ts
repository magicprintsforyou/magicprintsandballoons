import { NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';
import { CATEGORIZED_PRODUCTS } from '@/constants/products';
import { quoteDeliveryFee, shippingFee, cartHasPrints } from '@/constants/fulfillment';
import { generateOrderNumber } from '@/lib/orders';

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
async function computeServerTotal(
  items: IncomingItem[],
  promoCode?: string,
  fulfillmentMethod?: string,
  zip?: string
): Promise<{ subtotal: number; discount: number; fulfillmentFee: number; total: number; feeNote?: string }> {
  let subtotal = 0;
  const categories: string[] = [];
  for (const item of items) {
    const product = findProduct(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }
    if (product.category) categories.push(String(product.category));
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

  // Fulfillment fee — computed server-side, never trusted from the client.
  const method = fulfillmentMethod || 'pickup';
  let fulfillmentFee = 0;
  let feeNote: string | undefined;
  if (method === 'delivery') {
    const quote = await quoteDeliveryFee(zip || '');
    if (!quote.estimated && quote.miles !== null) {
      fulfillmentFee = quote.fee;
    } else {
      fulfillmentFee = 0;
      feeNote = `Delivery fee could not be auto-calculated for ZIP "${zip || ''}" — confirm with customer before fulfilling.`;
    }
  } else if (method === 'shipping') {
    fulfillmentFee = shippingFee(cartHasPrints(categories));
    if (cartHasPrints(categories)) {
      feeNote = 'Shipping base $25 for print products — large prints may need an adjusted shipping quote.';
    }
  }

  const total = Math.max(0, Math.round((subtotal - discount + fulfillmentFee) * 100) / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    fulfillmentFee,
    total,
    feeNote,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
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
      loyalty,
      idempotencyKey: clientKey,
    } = body as {
      sourceId?: string;
      items?: IncomingItem[];
      customer?: {
        name?: string; email?: string; phone?: string; eventDate?: string;
        deliveryMethod?: string; shippingAddress?: string; notes?: string;
        address?: { street?: string; city?: string; state?: string; zip?: string };
      };
      promoCode?: string;
      loyalty?: { pointsPerDollar?: number; balanceBefore?: number };
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

    // ---- Validate fulfillment + address ----
    const fulfillmentMethod = String(customer?.deliveryMethod || 'pickup');
    const addr = customer?.address || {};
    const needsAddress = fulfillmentMethod === 'delivery' || fulfillmentMethod === 'shipping';
    if (needsAddress) {
      const street = String(addr.street || '').trim();
      const city = String(addr.city || '').trim();
      const state = String(addr.state || '').trim();
      const zip = String(addr.zip || '').trim();
      if (street.length < 3 || city.length < 2 || state.length < 2 || zip.length < 3) {
        return NextResponse.json({ error: 'Please enter a complete delivery/shipping address.' }, { status: 400 });
      }
    }

    // ---- Recompute total server-side (items + discount + fulfillment fee) ----
    let totals: { subtotal: number; discount: number; fulfillmentFee: number; total: number; feeNote?: string };
    try {
      totals = await computeServerTotal(items, promoCode, fulfillmentMethod, String(addr.zip || '').trim());
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || 'Invalid cart items.' }, { status: 400 });
    }
    const total = totals.total;
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

    const orderNumber = generateOrderNumber();
    const referenceId = orderNumber;

    // ---- Loyalty points for the receipt email (client awards them post-payment;
    //      here we project the same numbers so the email shows the new balance) ----
    const loyaltyPpd = Math.max(0, Number(loyalty?.pointsPerDollar) || 1);
    const loyaltyEarned = Math.floor(Math.max(0, total) * loyaltyPpd);
    const loyaltyBalanceAfter = Math.max(0, Math.floor(Number(loyalty?.balanceBefore) || 0)) + loyaltyEarned;
    const loyaltyHtml = loyaltyEarned > 0 ? `
              <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; font-size: 13px; text-align: center;">
                <p style="margin: 0; font-size: 15px; font-weight: bold; color: #92400e;">You earned ${loyaltyEarned} loyalty points!</p>
                <p style="margin: 6px 0 0; color: #92400e;">Your new balance: <strong>${loyaltyBalanceAfter} points</strong><br>
                <span style="font-size: 12px;">Redeem them for rewards at magicprintsandballoons.vercel.app/rewards</span></p>
              </div>` : '';
    const addressLine = needsAddress
      ? `${String(addr.street).trim()}, ${String(addr.city).trim()}, ${String(addr.state).trim()} ${String(addr.zip).trim()}`
      : 'Store Pickup / Arlington DFW';
    const noteParts = [
      `Order: ${orderNumber}`,
      `Customer: ${name}`,
      `Phone: ${phone}`,
      customer?.eventDate ? `Event date: ${customer.eventDate}` : null,
      `Fulfillment: ${fulfillmentMethod}`,
      `Address: ${addressLine}`,
      totals.feeNote ? `Fee note: ${totals.feeNote}` : null,
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
    const orderItemsHtml = items.map((i) => {
      const p = findProduct(i.productId);
      const unit = (() => {
        if (i.variantSize && Array.isArray(p?.variants)) {
          const v = p.variants.find((vv: any) => String(vv.size).toLowerCase() === String(i.variantSize).toLowerCase());
          return Number(v?.price) || 0;
        }
        return Number(p?.price) || 0;
      })();
      const lineTotal = (unit + (i.isRushOrder ? RUSH_SURCHARGE : 0)) * Math.max(1, Math.min(99, Math.floor(Number(i.quantity) || 1)));
      return `<tr style="font-size: 13px;">
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">${p?.name || i.productId}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-size: 11px; color: #4b5563;">
          Size: ${i.variantSize || 'Default'}<br>Material: ${i.material || 'N/A'}<br>Rush: ${i.isRushOrder ? 'Yes' : 'No'}
        </td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${i.quantity}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${lineTotal.toFixed(2)}</td>
      </tr>`;
    }).join('');

    const totalsHtml = `
      <p><strong>Subtotal:</strong> $${totals.subtotal.toFixed(2)}</p>
      ${totals.discount > 0 ? `<p style="color: #10b981;"><strong>Discount:</strong> -$${totals.discount.toFixed(2)}</p>` : ''}
      <p><strong>Fulfillment (${fulfillmentMethod}):</strong> $${totals.fulfillmentFee.toFixed(2)}</p>
      <p style="font-size: 18px; font-weight: bold; color: #cc004e; margin-top: 10px;">Total charged: $${total.toFixed(2)}</p>`;

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
          deliveryMethod: fulfillmentMethod,
          shippingAddress: addressLine,
          promoCode: promoCode || 'None',
          notes: (customer?.notes || '') + `\n\nOrder: ${orderNumber} | Square Payment ID: ${payment.id} | Amount charged: $${total.toFixed(2)} (subtotal $${totals.subtotal.toFixed(2)}, discount $${totals.discount.toFixed(2)}, fulfillment $${totals.fulfillmentFee.toFixed(2)})`,
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

    // ---- Send order receipt email to the CUSTOMER (best-effort) ----
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && resendKey !== 're_dummy_key') {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'magicprintsandballoons <noreply@magicprintsforyou.com>',
          to: email,
          subject: `Your order ${orderNumber} is confirmed`,
          html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #d90082, #41137e); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #fff; font-size: 22px; letter-spacing: 2px;">MAGIC PRINTS & BALLOONS</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,.8); font-size: 13px;">Thank you for your order!</p>
            </div>
            <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
              <p style="font-size: 14px;">Hi ${name},</p>
              <p style="font-size: 14px;">Your payment of <strong>$${total.toFixed(2)}</strong> was received. Here is your receipt:</p>
              <div style="background: #fdf2f8; border: 2px dashed #d90082; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Order number</p>
                <p style="margin: 4px 0 0; font-size: 26px; font-weight: 900; color: #d90082; letter-spacing: 2px;">${orderNumber}</p>
                <p style="margin: 8px 0 0; font-size: 12px; color: #888;">Save this number to track your order at magicprintsandballoons.vercel.app/track-order</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin: 10px 0 20px;">
                <thead><tr style="background: #f3f4f6; font-size: 12px; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #e5e7eb;">Item</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb;">Details</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">Qty</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Total</th>
                </tr></thead>
                <tbody>${orderItemsHtml}</tbody>
              </table>
              <div style="text-align: right; font-size: 14px; line-height: 1.7;">${totalsHtml}</div>
              ${loyaltyHtml}
              <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 13px;">
                <p><strong>Fulfillment:</strong> ${fulfillmentMethod}</p>
                <p><strong>Address:</strong> ${addressLine}</p>
                ${customer?.eventDate ? `<p><strong>Event date:</strong> ${customer.eventDate}</p>` : ''}
                ${payment.receiptUrl ? `<p><a href="${payment.receiptUrl}" style="color: #d90082;">View Square receipt</a></p>` : ''}
              </div>
              <p style="font-size: 12px; color: #888; margin-top: 24px;">Questions? Reply to this email or message us on WhatsApp with your order number.<br>Pickup: Arlington, TX · info@magicprintsforyou.com</p>
            </div>
          </div>`,
        });
      }
    } catch (e) {
      console.error('Receipt email failed (best-effort):', e);
    }

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      amountCharged: total,
      orderNumber,
      subtotal: totals.subtotal,
      discount: totals.discount,
      fulfillmentFee: totals.fulfillmentFee,
      feeNote: totals.feeNote || null,
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
