"use client";
import React, { useState } from 'react';

import Image from "next/image";
import { Building2, ChevronRight, Award, Zap, ShieldCheck, Gem, Layout, MousePointer2 } from "lucide-react";
import Link from "next/link";
import BespokeForm from "@/components/BespokeForm";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useProducts } from "@/context/ProductContext";
import { useLanguage } from "@/context/ProductContext";

export default function CorporatePage() {
  const { t } = useLanguage();
  const { catalog, addToCart } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const iconMap : Record<string, React.ReactNode> = {
    Layout: <Layout className="text-[#d90082]" />,
    Gem: <Gem className="text-[#f9a826]" />,
    Zap: <Zap className="text-[#00f2fe]" />,
    Award: <Award className="text-[#ffcc00]" />,
    ShieldCheck: <ShieldCheck className="text-[#41137e]" />
  };

  const services = (t?.corporate?.services || []).map((s: any) => ({
    ...s,
    icon: iconMap[s.icon] || <Layout className="text-[#d90082]" />
  }));

  const successStories = t?.corporate?.success_stories || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0212] text-white -mt-8">
      {/* Hero Corporate - Refined Dark Theme */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={t?.corporate?.hero_image || "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop"}
            className="w-full h-full object-cover opacity-20 scale-105"
            alt="Premium Corporate Event"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0212] via-[#0A0212]/90 to-[#0A0212]/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-40 pb-32">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 text-[#d90082] font-black text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 backdrop-blur-md">
            <Building2 size={16} /> {t?.corporate?.badge || 'Corporate Elite'}
          </div>

          <h1 className="text-6xl md:text-[110px] font-black mb-6 leading-none tracking-tighter uppercase italic">
            {t?.corporate?.title || 'Corporate'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#ffcc00] drop-shadow-[0_0_30px_rgba(217,0,130,0.3)]">
              {t?.corporate?.title_highlight || 'Productions'}
            </span>
          </h1>

          <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl font-light italic leading-relaxed">
            "{t?.corporate?.subtitle || 'Museum-grade signage for industry leaders.'}"
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="#enquire" className="group bg-[#cc004e] text-white px-10 py-5 rounded-full font-black tracking-widest uppercase text-sm hover:scale-105 hover:bg-[#ff2a70] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(204,0,78,0.4)]">
              {t?.corporate?.cta_primary || 'Enquire Now'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#corporate-catalog" className="bg-white/5 text-white border border-white/10 px-10 py-5 rounded-full font-black tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 backdrop-blur-md">
              {t?.corporate?.cta_secondary || 'Explore Catalog'} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Museum Quality Pillars */}
      <section className="py-32 bg-white text-black px-6 rounded-t-[100px] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] z-20 -mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-[#41137e] tracking-tighter uppercase mb-4">Elite Capabilities</h2>
            <div className="w-32 h-2 bg-[#d90082] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {services.map((service, i) => (
              <div key={i} className="group bg-[#F8F9FA] rounded-[50px] p-2 overflow-hidden border border-gray-100 shadow-xl hover:-translate-y-4 transition-all duration-700">
                <div className="relative h-64 rounded-[45px] overflow-hidden mb-8">
                  <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={service.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#41137e]/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
                    {service.icon}
                  </div>
                </div>
                <div className="px-8 pb-10">
                  <h3 className="text-3xl font-black text-[#41137e] uppercase mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-gray-500 italic leading-relaxed text-lg">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="py-32 bg-[#41137e] text-white px-6">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight">
                   {t?.corporate?.tech_specs_title || 'Technical'} <br />
                   <span className="text-[#ffcc00] italic">Precision.</span>
                 </h2>
              </div>
              <p className="text-xl text-white/60 font-light italic max-w-sm border-l-2 border-[#ffcc00] pl-8">
                "{t?.corporate?.tech_specs_subtitle || 'Ultra-high definition for every texture.'}"
              </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "DPI Resolution", value: "2400+", sub: "Ultra Definition" },
                { label: "Color Match", value: "ΔE < 1.0", sub: "X-Rite Certified" },
                { label: "Media Width", value: "10ft", sub: "Seamless Rolls" },
                { label: "Ink Quality", value: "Latex", sub: "Eco-Friendly / Odorless" }
              ].map((spec, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-md">
                   <div className="text-3xl md:text-4xl font-black text-[#ffcc00] mb-2 tracking-tighter">{spec.value}</div>
                   <div className="text-sm font-bold uppercase tracking-widest text-white mb-1">{spec.label}</div>
                   <div className="text-[10px] text-white/40 uppercase tracking-widest">{spec.sub}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Success Stories / Casos de Éxito */}
      <section className="py-32 bg-white text-black px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
             <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#41137e]/5 text-[#41137e] font-black text-xs tracking-[0.3em] uppercase mb-8 border border-[#41137e]/10">
                <Award size={16} /> {t?.corporate?.success_stories_title || 'Case Studies'}
             </div>
             <h2 className="text-6xl md:text-8xl font-black text-[#41137e] tracking-tighter uppercase leading-none mb-8">{t?.corporate?.success_stories_title || 'Success'}</h2>
             <p className="text-2xl text-gray-500 font-light italic max-w-2xl">
               {t?.corporate?.success_stories_subtitle || 'Delivering excellence under pressure.'}
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             {successStories.map((story: any, i: number) => (
               <div key={i} className="group relative rounded-[60px] overflow-hidden shadow-2xl aspect-[16/10]">
                  <img src={story.img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={story.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#41137e] via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-12 left-12 right-12">
                     <div className="text-[#ffcc00] text-xs font-black tracking-[0.3em] uppercase mb-4">{story.client}</div>
                     <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">{story.title}</h3>
                     <p className="text-white/70 italic text-lg leading-relaxed">{story.results}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium Alliance - Alternating Section */}
      <section className="py-40 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24 items-center">
          <div className="md:w-1/2 relative space-y-12">
            <h2 className="text-6xl md:text-8xl font-black text-[#41137e] tracking-tighter uppercase leading-[0.8]">
              Refined <br />
              <span className="text-[#d90082]">Partnerships.</span>
            </h2>
            <p className="text-2xl text-gray-500 font-light italic leading-relaxed border-l-4 border-[#ffcc00] pl-8">
              "{t?.corporate?.alliance_quote || 'Joining forces to build monuments.'}"
            </p>

            <div className="space-y-12 pt-8">
              {[
                { title: t?.corporate?.alliance1_title || 'Production', desc: t?.corporate?.alliance1_desc || 'Museum-quality standards.', icon: <ShieldCheck size={24} /> },
                { title: t?.corporate?.alliance2_title || 'Speed', desc: t?.corporate?.alliance2_desc || 'Rapid deployment for events.', icon: <Award size={24} /> }
              ].map((alliance, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="w-16 h-16 bg-[#41137e] text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    {alliance.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-[#41137e] mb-2 uppercase tracking-tight">{alliance.title}</h4>
                    <p className="text-lg text-gray-500 font-light leading-relaxed italic">{alliance.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="grid grid-cols-2 gap-6 scale-90 md:scale-100">
              <div className="space-y-6 pt-12">
                <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white rotate-2">
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" className="w-full aspect-[3/4] object-cover" alt="Detail 1" />
                </div>
                <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white -rotate-1">
                  <img src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop" className="w-full aspect-square object-cover" alt="Detail 2" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white -rotate-3">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="w-full aspect-square object-cover" alt="Detail 3" />
                </div>
                <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white rotate-1">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" className="w-full aspect-[3/4] object-cover" alt="Detail 4" />
                </div>
              </div>
            </div>
            {/* Decorative background flair */}
            <div className="absolute inset-0 bg-[#d90082]/10 blur-[150px] -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Corporate Products Catalog */}
      <section id="corporate-catalog" className="py-32 bg-[#F8F9FA] px-6 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-5xl md:text-7xl font-black text-[#41137e] tracking-tighter uppercase mb-4">
               Trade Show & Signs
             </h2>
             <p className="text-xl text-slate-500 font-light italic max-w-2xl mx-auto">
               Premium corporate display solutions for immersive brand activations.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalog?.b2bSigns?.items?.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
                onAddToCart={(p) => addToCart(p, {
                  variant: p.variants?.[0],
                  material: p.materials?.[0] || 'Foamboard',
                  isRushOrder: false,
                })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VIP Inquiries Wrapper */}
      <div id="enquire" className="bg-[#0A0212] py-32 px-4 border-t border-white/5 relative overflow-hidden rounded-t-[120px] scroll-mt-24">
        <div className="absolute inset-0 bg-spiral-float opacity-10 -z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen"></div>
        <div className="max-w-4xl mx-auto text-center mb-20 pt-10">
          <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-8">
            <MousePointer2 className="text-[#ffcc00] animate-bounce" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">{t?.corporate?.form_title || 'Partner With Us'}</h2>
          <p className="text-gray-400 mt-6 text-xl italic font-light">Tell us about your monumental project.</p>
        </div>
        <BespokeForm />
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={(product: any, config: any) => {
             addToCart(product, config);
             setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
