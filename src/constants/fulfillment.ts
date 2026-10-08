// Fulfillment methods and rates for magicprintsandballoons.
//
// RATES (set by the owner 2026-10-08):
// - pickup:   free
// - delivery: $1.50 per mile from the store (Arlington, TX 76011), calculated
//             from the customer's ZIP via zippopotam.us → haversine distance.
// - shipping: flat $15 for balloons/accessories only; $25 base if the cart
//             contains ANY print products (large prints may need a manual
//             adjustment in /admin/orders — the owner can edit the order total).
// - express:  $0 (Fast Print 24-48h is a speed option, not a delivery fee;
//             rush surcharge already applies per item).
//
// Server (src/app/api/payments/route.ts) recomputes these independently —
// never trust the client-sent amount.

export type FulfillmentMethod = 'pickup' | 'delivery' | 'shipping' | 'express';

export const STORE_ZIP = '76011';
export const STORE_CITY = 'Arlington, TX';

export const DELIVERY_PER_MILE = 1.5;
export const SHIPPING_FLAT_BALLOONS = 15;
export const SHIPPING_FLAT_PRINTS = 25;

// Print product categories — if the cart has any of these, shipping = $25 base.
export const PRINT_CATEGORIES = [
  'photoBoards', 'props', 'floorWraps', 'themedKits', 'essentials',
  'Photo', 'Signage', 'Backdrop', 'Floor', 'Props', 'Flags', 'Signature', 'Essentials',
];

export const FULFILLMENT_NEEDS_ADDRESS: FulfillmentMethod[] = ['delivery', 'shipping'];

/** Haversine distance in miles between two lat/lng points. */
export function haversineMiles(
  lat1: number, lng1: number, lat2: number, lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Look up lat/lng for a US ZIP via the free zippopotam.us API. Returns null on failure. */
export async function zipToLatLng(zip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const clean = String(zip).trim().slice(0, 5);
    if (!/^\d{5}$/.test(clean)) return null;
    const res = await fetch(`https://api.zippopotam.us/us/${clean}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    const lat = Number(place.latitude);
    const lng = Number(place.longitude);
    if (!isFinite(lat) || !isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

export type FeeQuote = {
  fee: number;
  miles: number | null;   // null when ZIP lookup failed
  estimated: boolean;     // true when we could not compute exact mileage
};

/**
 * Compute the delivery fee for a customer ZIP.
 * Returns { fee, miles, estimated }. Rounds miles UP to whole miles, fee to cents.
 */
export async function quoteDeliveryFee(zip: string): Promise<FeeQuote> {
  const [store, dest] = await Promise.all([zipToLatLng(STORE_ZIP), zipToLatLng(zip)]);
  if (!store || !dest) {
    return { fee: 0, miles: null, estimated: true };
  }
  const miles = Math.ceil(haversineMiles(store.lat, store.lng, dest.lat, dest.lng));
  const fee = Math.round(miles * DELIVERY_PER_MILE * 100) / 100;
  return { fee, miles, estimated: false };
}

/** Does the cart contain any print products? (category keys from the catalog) */
export function cartHasPrints(categories: string[]): boolean {
  return categories.some((c) => PRINT_CATEGORIES.includes(c));
}

/** Flat shipping fee: $25 if any prints in cart, else $15 (balloons/accessories). */
export function shippingFee(hasPrints: boolean): number {
  return hasPrints ? SHIPPING_FLAT_PRINTS : SHIPPING_FLAT_BALLOONS;
}

/** Synchronous fee lookup for methods that don't need a ZIP (pickup/express/shipping). */
export function getFlatFee(method: string, hasPrints = false): number {
  const m = (method || 'pickup') as FulfillmentMethod;
  if (m === 'delivery') return 0; // delivery needs async ZIP quote — see quoteDeliveryFee
  if (m === 'shipping') return shippingFee(hasPrints);
  return 0; // pickup, express
}
