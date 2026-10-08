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
