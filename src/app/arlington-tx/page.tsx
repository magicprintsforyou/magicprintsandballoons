import React from "react";
import Link from "next/link";
import { MapPin, Truck, Package, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Event Printing in Arlington, TX | Magic Prints For You",
  description:
    "Arlington's local shop for custom photo boards, life-size cutouts, seating charts, floor wraps & welcome signs. Pickup in Arlington, local delivery available. Photo boards from $120.",
};

const PRICE_LIST = [
  { item: "Standard Photo Board", range: "5x4 ft $120 – 8x20 ft $950" },
  { item: "Custom Seating Chart", range: "5x4 ft $120 – 7x8 ft $160" },
  { item: "Custom Life-Size Cutout", range: "2 ft $40 – 6 ft $95" },
  { item: "Custom Vinyl Floor Wrap", range: "8x8 ft $250 – 20x20 ft $1,700" },
  { item: "Luxury Welcome Sign", range: '24x36 in. $120 – 36x48 in. $210' },
];

export default function ArlingtonPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      <section className="relative bg-[#0A0212] px-6 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#41137e]/40 via-transparent to-[#d90082]/30" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-[#ffcc00]">
            <MapPin className="h-4 w-4" /> Our Home Base
          </p>
          <h1 className="magic-headline mt-6 text-4xl! sm:text-5xl! md:text-6xl!">
            Custom Event Printing in Arlington, TX
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            We print right here in Arlington — photo boards, life-size cutouts,
            seating charts, floor wraps, and welcome signs for quinceañeras,
            weddings, birthdays, and graduations. Skip the shipping wait: pick
            up your order locally.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a70] to-[#d90082] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105"
            >
              Get a Quote <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-[#41137e]">
              Printed in Arlington, picked up in Arlington
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Big event coming up at a venue in Arlington, Grand Prairie,
              Mansfield, or anywhere in the Mid-Cities? We make museum-quality
              photo boards and backdrops, custom coroplast cutouts with stands,
              elegant seating charts, and non-slip vinyl floor wraps — all
              produced locally.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              Because we are local, you can pick up your order in Arlington and
              avoid shipping delays entirely. Need it delivered and set up at
              your venue? Local delivery and professional installation are
              available for an additional cost.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Free local pickup in Arlington, TX",
                "Local delivery & venue installation available",
                "Quinceañera, wedding, birthday & graduation specialists",
                "Rush production for tight event dates",
              ].map((li, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </span>
                  <span className="font-semibold text-gray-700">{li}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[32px] border border-purple-100 bg-white p-8 shadow-[0_18px_50px_rgba(65,19,126,0.08)]">
            <h3 className="text-xl font-black text-[#41137e]">
              Popular products &amp; starting prices
            </h3>
            <ul className="mt-6 divide-y divide-purple-50">
              {PRICE_LIST.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-4">
                  <span className="font-bold text-gray-800">{p.item}</span>
                  <span className="text-sm font-semibold text-[#d90082]">{p.range}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              Final pricing depends on size and quantity.{" "}
              <Link href="/quote" className="font-bold text-[#d90082] underline underline-offset-4">
                Request your custom quote
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F6FF] px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3">
          <div className="rounded-[24px] bg-white p-7 shadow-sm">
            <Package className="mx-auto h-8 w-8 text-[#d90082]" />
            <p className="mt-3 font-black text-[#41137e]">Local Pickup</p>
            <p className="mt-2 text-sm text-gray-600">Pick up in Arlington — no shipping cost, no waiting.</p>
          </div>
          <div className="rounded-[24px] bg-white p-7 shadow-sm">
            <Truck className="mx-auto h-8 w-8 text-[#d90082]" />
            <p className="mt-3 font-black text-[#41137e]">Local Delivery</p>
            <p className="mt-2 text-sm text-gray-600">Delivery to your Arlington-area venue, installation available.</p>
          </div>
          <div className="rounded-[24px] bg-white p-7 shadow-sm">
            <MapPin className="mx-auto h-8 w-8 text-[#d90082]" />
            <p className="mt-3 font-black text-[#41137e]">Nationwide Shipping</p>
            <p className="mt-2 text-sm text-gray-600">Shipping anywhere in the U.S. for out-of-town events.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
