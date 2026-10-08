// Loyalty points system (v1, local-first).
// Points are stored per customer email in localStorage.
// Admin config (points per dollar, redemption tiers) also lives in localStorage
// so the owner can change it from /admin/loyalty without a deploy.

export type RedemptionTier = {
  id: string;
  points: number;      // points required
  label: string;       // e.g. "$5 off your next order"
  value: number;       // dollar value of the reward
  active: boolean;
};

export type LoyaltyConfig = {
  pointsPerDollar: number;   // e.g. 1 = 1 point per $1 spent
  tiers: RedemptionTier[];
};

export type CustomerPoints = {
  email: string;
  name: string;
  points: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  updatedAt: string;
};

export const LOYALTY_KEY = 'magicprintsandballoons_loyalty';
export const LOYALTY_CONFIG_KEY = 'magicprintsandballoons_loyalty_config';

export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  pointsPerDollar: 1,
  tiers: [
    { id: 'tier-5', points: 100, label: '$5 off your next order', value: 5, active: true },
    { id: 'tier-10', points: 200, label: '$10 off your next order', value: 10, active: true },
    { id: 'tier-25', points: 500, label: '$25 off your next order', value: 25, active: true },
  ],
};

export function loadLoyaltyConfig(): LoyaltyConfig {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOYALTY_CONFIG_KEY) : null;
    if (!raw) return DEFAULT_LOYALTY_CONFIG;
    const parsed = JSON.parse(raw);
    if (typeof parsed.pointsPerDollar !== 'number' || !Array.isArray(parsed.tiers)) {
      return DEFAULT_LOYALTY_CONFIG;
    }
    return parsed as LoyaltyConfig;
  } catch {
    return DEFAULT_LOYALTY_CONFIG;
  }
}

export function saveLoyaltyConfig(config: LoyaltyConfig): void {
  try {
    localStorage.setItem(LOYALTY_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // non-fatal
  }
}

function readAll(): Record<string, CustomerPoints> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOYALTY_KEY) : null;
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, CustomerPoints>): void {
  try {
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(all));
  } catch {
    // non-fatal
  }
}

const keyOf = (email: string) => email.trim().toLowerCase();

export function getCustomerPoints(email: string): CustomerPoints | null {
  const all = readAll();
  return all[keyOf(email)] || null;
}

export function listCustomers(): CustomerPoints[] {
  return Object.values(readAll()).sort((a, b) => b.points - a.points);
}

/** Award points for a purchase. Returns the updated record. */
export function awardPoints(email: string, name: string, dollarsSpent: number): CustomerPoints {
  const config = loadLoyaltyConfig();
  const earned = Math.floor(Math.max(0, dollarsSpent) * config.pointsPerDollar);
  const all = readAll();
  const k = keyOf(email);
  const existing = all[k];
  const updated: CustomerPoints = {
    email: email.trim(),
    name: name.trim() || existing?.name || email.trim(),
    points: (existing?.points || 0) + earned,
    lifetimeEarned: (existing?.lifetimeEarned || 0) + earned,
    lifetimeRedeemed: existing?.lifetimeRedeemed || 0,
    updatedAt: new Date().toISOString(),
  };
  all[k] = updated;
  writeAll(all);
  return updated;
}

/** Manually adjust a customer's points (admin). delta can be negative. */
export function adjustPoints(email: string, name: string, delta: number): CustomerPoints {
  const all = readAll();
  const k = keyOf(email);
  const existing = all[k];
  const updated: CustomerPoints = {
    email: email.trim(),
    name: name.trim() || existing?.name || email.trim(),
    points: Math.max(0, (existing?.points || 0) + delta),
    lifetimeEarned: (existing?.lifetimeEarned || 0) + Math.max(0, delta),
    lifetimeRedeemed: (existing?.lifetimeRedeemed || 0) + Math.max(0, -delta),
    updatedAt: new Date().toISOString(),
  };
  all[k] = updated;
  writeAll(all);
  return updated;
}

/** Redeem a tier: subtract points, return the reward value + updated record. */
export function redeemTier(email: string, tierId: string): { value: number; record: CustomerPoints } | { error: string } {
  const config = loadLoyaltyConfig();
  const tier = config.tiers.find((t) => t.id === tierId && t.active);
  if (!tier) return { error: 'Reward not available.' };
  const all = readAll();
  const k = keyOf(email);
  const existing = all[k];
  if (!existing || existing.points < tier.points) return { error: 'Not enough points.' };
  const updated: CustomerPoints = {
    ...existing,
    points: existing.points - tier.points,
    lifetimeRedeemed: existing.lifetimeRedeemed + tier.points,
    updatedAt: new Date().toISOString(),
  };
  all[k] = updated;
  writeAll(all);
  return { value: tier.value, record: updated };
}

/** Rewards the customer can currently afford. */
export function affordableTiers(points: number): RedemptionTier[] {
  const config = loadLoyaltyConfig();
  return config.tiers.filter((t) => t.active && t.points <= points).sort((a, b) => a.points - b.points);
}

// ---------------------------------------------------------------------------
// Prizes (redeemable products & custom rewards, managed in /admin/loyalty)
// ---------------------------------------------------------------------------

export type Prize = {
  id: string;
  title: string;
  description: string;
  image: string;          // photo URL (or empty for placeholder)
  pointsCost: number;
  kind: 'custom' | 'product';
  productId?: string;     // when kind === 'product', links to a catalog product
  active: boolean;
  createdAt: string;
};

export type Redemption = {
  code: string;           // e.g. RDM-4F8K2Q
  email: string;
  name: string;
  prizeId: string;
  prizeTitle: string;
  pointsCost: number;
  createdAt: string;
  status: 'pending' | 'fulfilled';
};

export const LOYALTY_PRIZES_KEY = 'magicprintsandballoons_loyalty_prizes';
export const LOYALTY_REDEMPTIONS_KEY = 'magicprintsandballoons_loyalty_redemptions';

export function loadPrizes(): Prize[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOYALTY_PRIZES_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Prize[] : [];
  } catch {
    return [];
  }
}

export function savePrizes(prizes: Prize[]): void {
  try {
    localStorage.setItem(LOYALTY_PRIZES_KEY, JSON.stringify(prizes));
  } catch {
    // non-fatal
  }
}

export function loadRedemptions(): Redemption[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOYALTY_REDEMPTIONS_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Redemption[] : [];
  } catch {
    return [];
  }
}

function saveRedemptions(redemptions: Redemption[]): void {
  try {
    localStorage.setItem(LOYALTY_REDEMPTIONS_KEY, JSON.stringify(redemptions));
  } catch {
    // non-fatal
  }
}

function redemptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RDM-${s}`;
}

/** Redeem a prize: subtract points and create a redemption record with a code. */
export function redeemPrize(email: string, name: string, prizeId: string): { redemption: Redemption; record: CustomerPoints } | { error: string } {
  const prize = loadPrizes().find((p) => p.id === prizeId && p.active);
  if (!prize) return { error: 'Reward not available.' };
  const all = readAll();
  const k = keyOf(email);
  const existing = all[k];
  if (!existing || existing.points < prize.pointsCost) return { error: 'Not enough points.' };
  const updated: CustomerPoints = {
    ...existing,
    points: existing.points - prize.pointsCost,
    lifetimeRedeemed: existing.lifetimeRedeemed + prize.pointsCost,
    updatedAt: new Date().toISOString(),
  };
  all[k] = updated;
  writeAll(all);
  const redemption: Redemption = {
    code: redemptionCode(),
    email: email.trim(),
    name: name.trim() || existing.name,
    prizeId: prize.id,
    prizeTitle: prize.title,
    pointsCost: prize.pointsCost,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  const redemptions = loadRedemptions();
  redemptions.unshift(redemption);
  saveRedemptions(redemptions);
  return { redemption, record: updated };
}

/** Mark a redemption as fulfilled (admin). */
export function fulfillRedemption(code: string): void {
  const redemptions = loadRedemptions().map((r) =>
    r.code === code ? { ...r, status: 'fulfilled' as const } : r
  );
  saveRedemptions(redemptions);
}

/** Prizes the customer can currently afford. */
export function affordablePrizes(points: number): Prize[] {
  return loadPrizes()
    .filter((p) => p.active && p.pointsCost <= points)
    .sort((a, b) => a.pointsCost - b.pointsCost);
}
