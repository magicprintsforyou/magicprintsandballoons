"use client";

import React, { useState } from "react";
import { Mail, Gift, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "magic_prints_newsletter";

export default function EmailCapture() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push({ name: name.trim(), email: cleanEmail, date: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // localStorage unavailable — still show success
    }
    setDone(true);
  };

  return (
    <section className="bg-gradient-to-br from-[#41137e] via-[#5b1a9e] to-[#d90082] px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
          <Gift className="h-8 w-8 text-[#ffcc00]" />
        </div>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Get 10% Off Your First Order
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/80">
          Join our list for event inspiration, new products, and subscriber-only
          deals. Planning a quinceañera, wedding, or birthday? We&apos;ll send
          ideas your way.
        </p>

        {done ? (
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-[24px] bg-white/10 p-6 backdrop-blur">
            <CheckCircle2 className="h-8 w-8 shrink-0 text-green-300" />
            <p className="text-left font-bold text-white">
              You&apos;re in! Watch your inbox for your 10% off code.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                className="w-full rounded-full bg-white py-4 pl-12 pr-5 font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ffcc00]"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              required
              className="flex-1 rounded-full bg-white px-5 py-4 font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ffcc00]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#ffcc00] px-8 py-4 text-sm font-black uppercase tracking-widest text-[#41137e] shadow-lg transition-transform hover:scale-105"
            >
              Claim 10% Off
            </button>
          </form>
        )}
        {error && <p className="mt-3 font-bold text-red-200">{error}</p>}
        <p className="mt-4 text-xs text-white/60">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
