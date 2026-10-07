"use client";
import AIInspirationMockup from '@/components/AIInspirationMockup';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { INITIAL_CONFIG } from '@/constants';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Logo from '@/components/Logo';
import BespokeForm from '@/components/BespokeForm';
import Reviews from '@/components/Reviews';
import EmailCapture from '@/components/EmailCapture';
import { useLanguage } from '@/context/ProductContext';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Sparkles, ShoppingBag, Calendar, Truck, 
  MapPin, Clock, ArrowRight, Gift, PartyPopper, Briefcase, Heart, Award 
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const { catalog, addToCart } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHeroLogo, setShowHeroLogo] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowHeroLogo(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % (t?.hero?.backgroundImages?.length || 1));
    }, 4000);
    return () => clearInterval(slideTimer);
  }, [t?.hero?.backgroundImages]);

  const bestSellers = useMemo(() => {
    if (!catalog) return [];
    // Get the first item from a few categories to feature on the homepage
    const items = Object.entries(catalog)
      .filter(([key]) => key !== "b2bSigns")
      .map(([_, cat], index, categories) => cat.items?.find(item => !categories.slice(0, index).some(([__, earlier]) => earlier.items?.some(other => other.id === item.id))))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
    return items.slice(0, 3);
  }, [catalog]);

  // Process steps localized and improved
  const processSteps = [
    { num: '01', t: t?.process?.step1_title || 'Consulting', d: t?.process?.step1_desc || 'Phase 1 description', icon: '🛍️' },
    { num: '02', t: t?.process?.step2_title || 'Production', d: t?.process?.step2_desc || 'Phase 2 description', icon: '🎨' },
    { num: '03', t: t?.process?.step3_title || 'Creation', d: t?.process?.step3_desc || 'Phase 3 description', icon: '✨' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] -mt-8">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0A0212] overflow-hidden py-32">
        <div className="absolute inset-0">
          {(t?.hero?.backgroundImages || []).map((img : string, idx : number) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-40' : 'opacity-0'}`}>
              <img src={img} className="w-full h-full object-cover scale-105" alt={`Hero Slide ${idx}`} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0212] via-[#0A0212]/30 to-[#0A0212]"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mt-20">
          <div className={`inline-block mb-10 pointer-events-none transition-all duration-1000 ${showHeroLogo ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden mb-0'}`}>
            <div className={showHeroLogo ? 'animate-magic-float' : 'animate-magic-exit'}>
              <Logo className="w-48" customLogo={INITIAL_CONFIG.logo} />
            </div>
          </div>
          <div className={`mb-10 transition-all duration-1000 delay-300 ${!showHeroLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
            <p className="font-script text-[40px] md:text-[60px] text-[#ffcc00] -rotate-2 drop-shadow-[0_0_15px_rgba(255,204,0,0.6)] leading-none mb-4">{t?.hero?.welcome || 'Welcome'}</p>
          </div>
          <h1 className="text-5xl md:text-[100px] font-black text-white mb-8 tracking-tight leading-[0.8] uppercase italic drop-shadow-2xl">
            {t?.hero?.title || 'Magic'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#ffcc00] drop-shadow-[0_2px_10px_rgba(217,0,130,0.3)]">
              {t?.hero?.title_highlight || 'Prints'}
            </span>
          </h1>
          <p className="text-[#a0a0a0] text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light italic leading-relaxed">
            {t?.hero?.subtitle || 'Transforming ordinary spaces into museum-grade experiences.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-12">
            <Link href="/events" className="px-16 py-7 bg-gradient-to-r from-[#cc004e] to-[#d90082] text-white rounded-full font-black text-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(217,0,130,0.4)] text-center flex items-center justify-center gap-3">
              <Calendar className="w-6 h-6" /> {t?.nav?.eventShop || 'Shop by Event'}
            </Link>
            <Link href="/products" className="px-16 py-7 bg-white/10 text-white border border-white/20 rounded-full font-black text-2xl hover:scale-105 transition-all hover:bg-white hover:text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] text-center flex items-center justify-center gap-3 backdrop-blur-md">
              <ShoppingBag className="w-6 h-6" /> {t?.nav?.productShop || 'Shop by Product'}
            </Link>
          </div>
        </div>
      </section>

      {/* Two Primary Shopping Paths */}
      <section className="py-24 bg-[#0A0212] px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Card 1: Shop by Event */}
            <div className="group relative rounded-[40px] p-10 md:p-14 bg-gradient-to-br from-[#1a0b2e] to-[#0d0418] border border-purple-900/30 overflow-hidden shadow-2xl hover:shadow-[0_0_60px_rgba(217,0,130,0.15)] transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d90082]/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#d90082]/10 flex items-center justify-center mb-8 border border-[#d90082]/20">
                <Calendar className="text-[#d90082]" size={32} />
              </div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
                {t?.homePaths?.eventTitle || 'Shop by Event'}
              </h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 italic">
                {t?.homePaths?.eventDesc || 'Planning an event? Choose your occasion, theme, and coordinate matching items.'}
              </p>
              <Link href="/events" className="inline-flex items-center gap-3 text-[#d90082] font-black tracking-widest uppercase text-xs hover:gap-5 transition-all">
                {language === 'en' ? 'Shop by Event' : 'Comprar por Evento'} <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Shop by Product */}
            <div className="group relative rounded-[40px] p-10 md:p-14 bg-gradient-to-br from-[#0c1824] to-[#050b11] border border-cyan-950/30 overflow-hidden shadow-2xl hover:shadow-[0_0_60px_rgba(0,242,254,0.15)] transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2fe]/5 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#00f2fe]/10 flex items-center justify-center mb-8 border border-[#00f2fe]/20">
                <ShoppingBag className="text-[#00f2fe]" size={32} />
              </div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
                {t?.homePaths?.productTitle || 'Shop by Product'}
              </h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 italic">
                {t?.homePaths?.productDesc || 'Know exactly what you need? Browse flyers, shirts, cups, boxes, banners, and decals.'}
              </p>
              <Link href="/products" className="inline-flex items-center gap-3 text-[#00f2fe] font-black tracking-widest uppercase text-xs hover:gap-5 transition-all">
                {language === 'en' ? 'Shop by Product' : 'Comprar por Producto'} <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Events Grid */}
      <section className="py-24 bg-[#FDFDFD] px-6 relative z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-[#41137e] uppercase tracking-tighter mb-4">
              {language === 'en' ? 'Popular Occasions' : 'Eventos Populares'}
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
              {language === 'en' ? 'Shop products customized for your celebration' : 'Compra productos personalizados para tu celebración'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: language === 'en' ? "Children's Birthdays" : "Cumpleaños Infantiles", image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=600", icon: <Gift className="text-white" size={20} /> },
              { title: language === 'en' ? "Adult Birthdays" : "Cumpleaños de Adultos", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600", icon: <PartyPopper className="text-white" size={20} /> },
              { title: language === 'en' ? "Baby Showers" : "Baby Showers", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600", icon: <Heart className="text-white" size={20} /> },
              { title: language === 'en' ? "Weddings" : "Bodas", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600", icon: <Sparkles className="text-white" size={20} /> },
              { title: language === 'en' ? "Graduations" : "Graduaciones", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600", icon: <Award className="text-white" size={20} /> },
              { title: language === 'en' ? "Churches" : "Iglesias", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600", icon: <MapPin className="text-white" size={20} /> },
              { title: language === 'en' ? "Corporate & Schools" : "Corporativos y Escuelas", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=600", icon: <Briefcase className="text-white" size={20} /> },
              { title: language === 'en' ? "Celebrations of Life" : "Memoriales / Vida", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600", icon: <Clock className="text-white" size={20} /> }
            ].map((evt, i) => (
              <Link href="/events" key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <img src={evt.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={evt.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{evt.title}</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#cc004e] flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 transition-transform">
                    {evt.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fulfillment Options Section */}
      <section className="py-24 bg-[#F9F6FF] px-6 relative z-10 border-t border-b border-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-[#41137e] uppercase tracking-tighter mb-4">
              {language === 'en' ? 'Fulfillment Options' : 'Métodos de Entrega'}
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
              {language === 'en' ? 'How we get your magic prints to you' : 'Cómo hacemos llegar tus impresiones mágicas'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: language === 'en' ? 'Store Pickup' : 'Pickup en Tienda',
                desc: language === 'en' ? 'Free pickup in Arlington (DFW). Ready in 3-4 business days.' : 'Retiro gratis en Arlington (DFW). Listo en 3-4 días hábiles.',
                icon: <MapPin className="text-[#cc004e]" size={32} />
              },
              {
                title: language === 'en' ? 'Local Delivery' : 'Delivery Local',
                desc: language === 'en' ? 'Distance-based delivery directly to your venue (up to 15 miles).' : 'Delivery a domicilio calculado por millaje de distancia.',
                icon: <Truck className="text-[#d90082]" size={32} />
              },
              {
                title: language === 'en' ? 'UPS Shipping' : 'Envío UPS',
                desc: language === 'en' ? 'Nationwide shipping available for foldable and flexible printed items.' : 'Envío nacional vía UPS disponible para productos flexibles.',
                icon: <ShoppingBag className="text-[#7e22ce]" size={32} />
              },
              {
                title: language === 'en' ? 'Fast Print' : 'Fast Print Exprés',
                desc: language === 'en' ? 'Need it sooner? Same/next day production for eligible items (+$40).' : '¿Lo necesitas antes? Producción exprés en 24-48h (+$40 por producto).',
                icon: <Clock className="text-[#f9a826]" size={32} />
              }
            ].map((option, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold text-[#41137e] uppercase tracking-tight mb-2">{option.title}</h3>
                <p className="text-gray-500 text-sm font-medium italic leading-relaxed">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><AIInspirationMockup /></div>

      {/* Balloons Banner — festive promo section */}
      <section className="py-24 px-6 relative z-10 overflow-hidden" style={{ background: 'linear-gradient(135deg, #d90082 0%, #7e22ce 50%, #0ea5e9 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 8%, transparent 9%), radial-gradient(circle at 70% 60%, white 6%, transparent 7%), radial-gradient(circle at 40% 80%, white 10%, transparent 11%), radial-gradient(circle at 85% 20%, white 7%, transparent 8%)', backgroundSize: '220px 220px' }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#ffcc00] font-black uppercase tracking-[0.3em] text-xs mb-4">New at magicprintsandballoons</p>
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                Balloons<br />for every<br />party
              </h2>
              <p className="text-white/80 text-lg font-light italic leading-relaxed mb-8">
                Premium SemperTex &amp; TufTex latex, DIY garland kits that ship nationwide, and fresh helium balloons ready for pickup in Arlington.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="px-10 py-4 bg-white text-[#d90082] rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl">
                  Shop Balloons
                </Link>
                <Link href="/products" className="px-10 py-4 bg-white/15 text-white border border-white/30 rounded-full font-black text-lg hover:scale-105 transition-all backdrop-blur-md">
                  DIY Garland Kits
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600", label: "SemperTex Latex" },
                { img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600", label: "DIY Garland Kits" },
                { img: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=600", label: "Helium — Pickup Only" },
                { img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600", label: "TufTex Latex" }
              ].map((b, i) => (
                <div key={i} className="group relative rounded-3xl overflow-hidden aspect-square shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <img src={b.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={b.label} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-black text-sm uppercase tracking-tight">{b.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* The Magic Process */}
      <section className="py-32 bg-[#0A0212] px-6 rounded-t-[50px] md:rounded-t-[100px] rounded-b-[100px] relative overflow-hidden shadow-2xl z-20 border-t border-b border-white/5">
        <div className="absolute top-0 right-0 p-20 opacity-5 text-[200px] select-none pointer-events-none">✨</div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase drop-shadow-lg">
              {t?.process?.title || 'Our Process'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d90082] to-transparent mx-auto"></div>
          </div>
          
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="grid md:grid-cols-3 gap-16">
              {processSteps.map((step, idx) => (
                <div key={step.num} className="space-y-6 group relative">
                  <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center text-3xl group-hover:bg-[#d90082] transition-all duration-500 border border-white/10 shadow-xl group-hover:shadow-[0_0_40px_rgba(217,0,130,0.5)] relative z-10 group-hover:scale-110">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[#d90082] font-black text-xs tracking-[0.3em]">{step.num}</span>
                      <div className="h-[1px] flex-grow bg-white/5 md:hidden"></div>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#ffcc00] transition-colors">
                      {step.t}
                    </h3>
                    <p className="text-gray-400 italic leading-relaxed text-lg group-hover:text-gray-300 transition-colors">
                      {step.d}
                    </p>
                  </div>
                  {/* Step Number Background Overlay */}
                  <div className="absolute -top-10 -left-6 text-9xl font-black text-white/[0.03] select-none pointer-events-none group-hover:text-[#d90082]/[0.05] transition-colors">
                    {step.num}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-32 bg-[#FDFDFD] px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-black text-[#41137e] tracking-tighter leading-none mb-6">{INITIAL_CONFIG.bestSellers.title}</h2>
            <p className="text-gray-400 font-bold tracking-[0.4em] uppercase text-xs">{INITIAL_CONFIG.bestSellers.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {bestSellers.map(product => (
              <ProductCard
                key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onAddToCart={(prod) => addToCart(prod, {
                    variant: prod.variants?.[0],
                    material: prod.materials?.[0] || 'Foamboard',
                    isRushOrder: false,
                  })}
                />
            ))}
          </div>
          <div className="mt-24 text-center">
            <Link href="/products" className="inline-block px-16 py-7 bg-[#41137e] text-white rounded-full font-black text-xl hover:bg-[#d90082] transition-all shadow-[0_20px_50px_rgba(65,19,126,0.3)] hover:shadow-[0_20px_50px_rgba(217,0,130,0.4)]">{INITIAL_CONFIG.bestSellers.btnText}</Link>
          </div>
        </div>
      </section>

      {/* Materials & Substrates Teaser */}
      <section className="py-32 bg-[#F9F6FF] px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-100 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#d90082] font-black text-xs tracking-[0.3em] uppercase mb-4 block">{t?.products?.badge || 'Museum Grade'}</span>
              <h2 className="text-5xl md:text-7xl font-black text-[#41137e] tracking-tighter mb-8 leading-none uppercase italic">
                {t?.products?.title || 'Product'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d90082] to-[#7e22ce]">{t?.products?.title_highlight || 'Catalog'}</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium italic mb-10 leading-relaxed">
                "{t?.products?.subtitle || 'Explore our full range of professional event substrate.'}"
              </p>
              <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-black text-[#41137e] leading-tight uppercase">
                  Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d90082] to-[#7319c7]">Product Catalog</span>
                </h3>
                <p className="text-slate-500 text-lg font-medium">
                  Browse our complete range of premium event productions, from large-format photo boards to luxury floor wraps and curated themed kits.
                </p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-4 bg-[#41137e] text-white px-10 py-5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-[#d90082] transition-all duration-300 shadow-xl"
                >
                  Explore the Catalog
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[60px] overflow-hidden shadow-2xl bg-[#41137e] p-2 aspect-[4/5]">
                 <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop" className="w-full h-full object-cover rounded-[55px] opacity-80" alt="Material Lab" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -left-10 p-10 bg-white rounded-full shadow-2xl border border-purple-50 animate-soft-float">
                <div className="text-center">
                  <span className="block text-3xl font-black text-[#41137e]">100%</span>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Premium Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-[#41137e] text-center mb-24 tracking-tighter uppercase whitespace-pre-line">
            {t?.testimonials?.title || 'Client Love'}
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: t?.testimonials?.author1 || 'Client', role: t?.testimonials?.role1 || 'Reviewer', text: t?.testimonials?.text1 || 'Great service!' },
              { name: t?.testimonials?.author2 || 'Client', role: t?.testimonials?.role2 || 'Reviewer', text: t?.testimonials?.text2 || 'Amazing production!' },
              { name: t?.testimonials?.author3 || 'Client', role: t?.testimonials?.role3 || 'Reviewer', text: t?.testimonials?.text3 || 'Highly recommended!' }
            ].map((test, i) => (
              <div key={i} className="bg-white p-12 rounded-[50px] shadow-xl border border-slate-50 space-y-6 relative group hover:-translate-y-4 transition-all duration-500 hover:shadow-2xl">
                <div className="flex text-[#ffcc00] text-xl">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-gray-500 italic text-lg leading-relaxed">{test.text}</p>
                <div>
                  <h4 className="font-black text-[#41137e] uppercase text-sm tracking-wide">{test.name}</h4>
                  <p className="text-[#d90082] font-bold text-[10px] uppercase tracking-[0.3em]">{test.role}</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#41137e] rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✨</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Form Section */}
      <div id="bespoke" className="bg-[#0A0212] rounded-t-[100px] mt-10 p-4 border-t border-purple-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-spiral-float opacity-5 -z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen"></div>
        <BespokeForm />
      </div>

      {/* Reviews Section */}
      <Reviews />

      {/* Email Capture Section */}
      <EmailCapture />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, config) => {
            addToCart(product, config);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
