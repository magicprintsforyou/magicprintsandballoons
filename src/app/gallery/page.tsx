"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Weddings", "Quinceañeras", "Birthdays", "Corporate"] as const;
type Category = (typeof CATEGORIES)[number];

type GalleryItem = {
  id: number;
  category: Exclude<Category, "All">;
  title: string;
  // TODO (owner): replace placeholder with real event photo URL, e.g. "/images/gallery/quince-1.jpg"
  image: string | null;
};

// Placeholder structure — the owner adds real event photos here.
const ITEMS: GalleryItem[] = [
  { id: 1, category: "Weddings", title: "Wedding backdrop setup", image: null },
  { id: 2, category: "Weddings", title: "Wedding seating chart", image: null },
  { id: 3, category: "Quinceañeras", title: "Quinceañera photo board", image: null },
  { id: 4, category: "Quinceañeras", title: "Quinceañera floor wrap", image: null },
  { id: 5, category: "Birthdays", title: "Birthday cutouts", image: null },
  { id: 6, category: "Birthdays", title: "Birthday backdrop", image: null },
  { id: 7, category: "Corporate", title: "Corporate step & repeat", image: null },
  { id: 8, category: "Corporate", title: "Corporate signage", image: null },
];

export default function GalleryPage() {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? ITEMS : ITEMS.filter((i) => i.category === active);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Hero */}
      <section className="relative bg-[#0A0212] px-6 py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d90082]/30 via-transparent to-[#41137e]/40" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffcc00]">
            Our Work
          </p>
          <h1 className="magic-headline mt-4 text-4xl! sm:text-5xl! md:text-6xl!">
            Real Events
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            Backdrops, cutouts, floor wraps, and signs we have created for real
            celebrations across Dallas–Fort Worth.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-6 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                  active === cat
                    ? "bg-gradient-to-r from-[#ff2a70] to-[#d90082] text-white shadow-lg"
                    : "bg-white text-[#41137e] border border-purple-200 hover:border-[#d90082]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#41137e]/10 to-[#d90082]/10 shadow-md"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <Camera className="h-10 w-10 text-[#41137e]/30" />
                    <p className="font-bold text-[#41137e]/60">{item.title}</p>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                      Photo coming soon
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12">
                  <p className="text-sm font-black uppercase tracking-widest text-[#ffcc00]">
                    {item.category}
                  </p>
                  <p className="font-bold text-white">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-gray-500">
              No photos in this category yet — check back soon.
            </p>
          )}

          <div className="mt-14 text-center">
            <p className="text-lg text-gray-600">
              Planning an event? Let&apos;s make yours the next one in this gallery.
            </p>
            <Link
              href="/quote"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a70] to-[#d90082] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105"
            >
              Get a Quote
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
