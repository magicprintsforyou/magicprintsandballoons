"use client";

import React from "react";
import Link from "next/link";
import { Star, Quote, ExternalLink, MessageCircleHeart } from "lucide-react";

// TODO (owner): replace with your real Google Business review link
const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Magic+Prints+For+You+Arlington+TX";

type Review = {
  name: string;
  event: string;
  rating: number;
  text: string;
  placeholder: boolean;
};

// Placeholder reviews — the owner replaces these with real customer reviews.
// Kept structurally realistic so the layout is final; content is marked sample.
const SAMPLE_REVIEWS: Review[] = [
  {
    name: "Sample Review",
    event: "Quinceañera",
    rating: 5,
    text: "This is a sample review. Replace it with a real customer testimonial once reviews start coming in from Google.",
    placeholder: true,
  },
  {
    name: "Sample Review",
    event: "Wedding",
    rating: 5,
    text: "This is a sample review. Replace it with a real customer testimonial once reviews start coming in from Google.",
    placeholder: true,
  },
  {
    name: "Sample Review",
    event: "Birthday Party",
    rating: 5,
    text: "This is a sample review. Replace it with a real customer testimonial once reviews start coming in from Google.",
    placeholder: true,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i <= rating ? "fill-[#ffcc00] text-[#ffcc00]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#d90082]">
            Customer Reviews
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#41137e] sm:text-5xl">
            Loved by Hosts Across DFW
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Stars rating={5} />
            <span className="text-sm font-bold text-gray-500">
              Real reviews from Google — yours could be next
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SAMPLE_REVIEWS.map((review, i) => (
            <article
              key={i}
              className="relative flex flex-col rounded-[28px] border border-purple-100 bg-[#FDF9FF] p-8 shadow-[0_18px_50px_rgba(65,19,126,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(65,19,126,0.12)]"
            >
              {review.placeholder && (
                <span className="absolute right-5 top-5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                  Sample
                </span>
              )}
              <Quote className="h-8 w-8 text-[#d90082]/30" />
              <div className="mt-4">
                <Stars rating={review.rating} />
              </div>
              <p className="mt-4 flex-1 text-base leading-relaxed text-gray-600">
                {review.text}
              </p>
              <div className="mt-6 border-t border-purple-100 pt-5">
                <p className="font-black text-[#41137e]">{review.name}</p>
                <p className="text-sm font-semibold text-gray-400">
                  {review.event}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Had a great experience with us? We would love to hear about it.
          </p>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2a70] to-[#d90082] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircleHeart className="h-5 w-5" />
            Leave a Review on Google
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-4">
            <Link
              href="/quote"
              className="text-sm font-bold text-[#d90082] underline underline-offset-4 hover:text-[#41137e]"
            >
              Or start your own order here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
