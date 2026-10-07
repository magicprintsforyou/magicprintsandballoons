import React from "react";
import Link from "next/link";
import {
  Crown,
  Heart,
  Cake,
  Check,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Packages | Magic Prints For You",
  description:
    "Save with bundled event printing packages: quinceañera, wedding, and birthday packs with photo boards, cutouts, seating charts, floor wraps, and welcome signs. Delivery & installation available in DFW.",
};

type EventPackage = {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  gradient: string;
  includes: { item: string; detail: string }[];
  bestFor: string;
};

const PACKAGES: EventPackage[] = [
  {
    id: "quinceanera",
    name: "Quinceañera Essential",
    tagline: "Everything a quinceañera needs to shine.",
    icon: <Crown className="h-8 w-8" />,
    gradient: "from-[#d90082] to-[#ff2a70]",
    includes: [
      { item: "Custom Photo Board", detail: "Backdrop sizes from 5x4 ft ($120) up to 8x20 ft ($950)" },
      { item: "Life-Size Cutouts", detail: "2 ft ($40) to 6 ft ($95) on durable coroplast with stand" },
      { item: "Luxury Welcome Sign", detail: "Sizes from 24x36 in. ($120) to 36x48 in. ($210)" },
    ],
    bestFor: "Quinceañeras, Sweet 16s, and milestone birthdays",
  },
  {
    id: "wedding",
    name: "Wedding Complete",
    tagline: "A full printed look for your big day.",
    icon: <Heart className="h-8 w-8" />,
    gradient: "from-[#41137e] to-[#7437b8]",
    includes: [
      { item: "Custom Seating Chart", detail: "5x4 ft ($120) to 7x8 ft ($160) — foam board or coroplast" },
      { item: "Custom Photo Board", detail: "Backdrop sizes from 5x4 ft ($120) up to 8x20 ft ($950)" },
      { item: "Custom Vinyl Floor Wrap", detail: "8x8 ft ($250) to 20x20 ft ($1,700) — design included" },
      { item: "Luxury Welcome Sign", detail: "Sizes from 24x36 in. ($120) to 36x48 in. ($210)" },
    ],
    bestFor: "Weddings, receptions, and formal celebrations",
  },
  {
    id: "birthday",
    name: "Birthday Party Pack",
    tagline: "Big decorations for big birthdays.",
    icon: <Cake className="h-8 w-8" />,
    gradient: "from-[#f9a826] to-[#ff2a70]",
    includes: [
      { item: "Life-Size Cutouts", detail: "2 ft ($40) to 6 ft ($95) — perfect photo ops" },
      { item: "Custom Photo Board", detail: "Backdrop sizes from 5x4 ft ($120) up to 8x20 ft ($950)" },
      { item: "Backdrop Rigid Panel", detail: "6x4 ft ($100) to 8x4 ft ($180) — great for decals" },
    ],
    bestFor: "Kids' birthdays, graduations, and themed parties",
  },
];

export default function PackagesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Hero */}
      <section className="relative bg-[#0A0212] px-6 py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#41137e]/40 via-transparent to-[#d90082]/30" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffcc00]">
            Bundled &amp; Beautiful
          </p>
          <h1 className="magic-headline mt-4 text-4xl! sm:text-5xl! md:text-6xl!">
            Event Packages
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            One order, one design style, one delivery — and a better value than
            buying everything separately. Tell us your event date and we will
            build the perfect bundle for you.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl space-y-10">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.id}
              className="overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_18px_50px_rgba(65,19,126,0.08)]"
            >
              <div className={`bg-gradient-to-r ${pkg.gradient} px-8 py-8 sm:px-12`}>
                <div className="flex items-center gap-5 text-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                    {pkg.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                      {pkg.name}
                    </h2>
                    <p className="mt-1 text-white/90">{pkg.tagline}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-8 px-8 py-10 sm:px-12 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#41137e]">
                    What&apos;s included
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {pkg.includes.map((inc, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                          <Check className="h-4 w-4 text-green-600" />
                        </span>
                        <div>
                          <p className="font-bold text-gray-800">{inc.item}</p>
                          <p className="text-sm text-gray-500">{inc.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-[#41137e]">
                    <Truck className="h-4 w-4" />
                    Delivery &amp; installation available
                  </p>
                </div>
                <div className="flex flex-col justify-center rounded-[24px] bg-[#F9F6FF] p-8">
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d90082]">
                    Package pricing
                  </p>
                  <p className="mt-3 text-4xl font-black text-[#41137e]">
                    Custom Quote
                  </p>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    Every event is different — sizes, quantities, and your date
                    shape the final price. Bundles always cost less than ordering
                    each piece separately.
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    Best for: {pkg.bestFor}
                  </p>
                  <Link
                    href="/quote"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a70] to-[#d90082] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105"
                  >
                    Request Quote
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why bundle */}
      <section className="bg-[#F9F6FF] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles className="mx-auto h-10 w-10 text-[#d90082]" />
          <h2 className="mt-4 text-3xl font-black text-[#41137e]">
            Why order as a package?
          </h2>
          <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
            <div className="rounded-[24px] bg-white p-7 shadow-sm">
              <p className="text-lg font-black text-[#41137e]">One design style</p>
              <p className="mt-2 text-gray-600">
                Your board, cutouts, and signs all match — designed together, not
                pieced together.
              </p>
            </div>
            <div className="rounded-[24px] bg-white p-7 shadow-sm">
              <p className="text-lg font-black text-[#41137e]">One delivery</p>
              <p className="mt-2 text-gray-600">
                Everything arrives together. Add professional installation and we
                handle the setup at your venue.
              </p>
            </div>
            <div className="rounded-[24px] bg-white p-7 shadow-sm">
              <p className="text-lg font-black text-[#41137e]">Better value</p>
              <p className="mt-2 text-gray-600">
                Bundled orders are always priced below buying each item
                separately. Ask us for your custom quote.
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="mt-10 inline-block text-sm font-bold text-[#d90082] underline underline-offset-4 hover:text-[#41137e]"
          >
            Or browse individual products
          </Link>
        </div>
      </section>
    </div>
  );
}
