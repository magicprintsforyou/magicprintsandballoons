// Order management: types, order-number generation, and localStorage persistence.
// Orders are stored per-browser in localStorage under ORDERS_KEY.
// (Same local-first pattern as the rest of the admin: catalog edits live in localStorage.)

export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export type OrderAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  variantSize?: string | null;
  material?: string | null;
  isRushOrder?: boolean;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderRecord = {
  orderNumber: string;      // e.g. MPB-20261008-A3F9
  createdAt: string;        // ISO string
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    eventDate?: string;
    notes?: string;
  };
  fulfillmentMethod: string; // pickup | delivery | shipping | express
  fulfillmentNote?: string; // e.g. "ZIP lookup failed — confirm delivery fee"
  address?: OrderAddress | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  fulfillmentFee: number;
  total: number;
  paymentId?: string | null;
  paymentMethod: 'square' | 'pending';
};

export const ORDERS_KEY = 'magicprintsandballoons_orders';

/** Generate a unique order number: MPB-YYYYMMDD-XXXX (random suffix, collision-safe). */
export function generateOrderNumber(existing: string[] = []): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let n = '';
  do {
    n = `MPB-${ymd}-` + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (existing.includes(n));
  return n;
}

export function loadOrders(): OrderRecord[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(ORDERS_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // storage full or unavailable — non-fatal
  }
}

export function addOrder(order: OrderRecord): OrderRecord[] {
  const orders = loadOrders();
  const next = [order, ...orders];
  saveOrders(next);
  return next;
}

export function updateOrderStatus(orderNumber: string, status: OrderStatus): OrderRecord[] {
  const orders = loadOrders();
  const next = orders.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o));
  saveOrders(next);
  return next;
}

export function findOrder(orderNumber: string, email?: string): OrderRecord | null {
  const orders = loadOrders();
  const needle = (orderNumber || '').trim().toUpperCase();
  const found = orders.find((o) => o.orderNumber.toUpperCase() === needle);
  if (!found) return null;
  if (email && found.customer.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
    return null;
  }
  return found;
}

export const ORDER_STATUSES: { value: OrderStatus; en: string; es: string }[] = [
  { value: 'new', en: 'New', es: 'Nueva' },
  { value: 'processing', en: 'Processing', es: 'En proceso' },
  { value: 'completed', en: 'Completed', es: 'Completada' },
  { value: 'cancelled', en: 'Cancelled', es: 'Cancelada' },
];
