"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useProducts, useLanguage } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import EmailCapture from '@/components/EmailCapture';
import { ShoppingBag, Image as ImageIcon, PartyPopper, Wrench, Truck, MapPin, Package, CheckCircle } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const { catalog, addToCart } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const bestSellers = useMemo(() => {
    if (!catalog) return [];
    const items = Object.entries(catalog)
      .filter(([key]) => key !== "b2bSigns")
      .map(([_, cat], index, categories) => cat.items?.find(item => !categories.slice(0, index).some(([__, earlier]) => earlier.items?.some(other => other.id === item.id))))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
    return items.slice(0, 4);
  }, [catalog]);

  const categories = [
    {
      title: language === 'en' ? 'Balloons' : 'Globos',
      desc: language === 'en' ? 'Latex by brand, foil by theme, kits & helium' : 'Látex por marca, foil por tema, kits y helio',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800',
      href: '/products?cat=balloons',
      icon: <PartyPopper className="w-5 h-5" />,
    },
    {
      title: language === 'en' ? 'Custom Prints' : 'Impresiones',
      desc: language === 'en' ? 'Photo boards, cutouts, backdrops, floor wraps' : 'Photo boards, cutouts, backdrops, floor wraps',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
      href: '/products?cat=prints',
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      title: language === 'en' ? 'DIY Garland Kits' : 'Kits de Guirnaldas',
      desc: language === 'en' ? 'Everything you need, ships nationwide' : 'Todo lo que necesitas, envío nacional',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800',
      href: '/products?cat=balloons&sub=kits',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: language === 'en' ? 'Shop by Occasion' : 'Por Ocasión',
      desc: language === 'en' ? 'Birthdays, weddings, quinceañeras & more' : 'Cumpleaños, bodas, quinceañeras y más',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800',
      href: '/events',
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero — light, clean */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #fdf2f8 0%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#d90082] font-bold text-xs uppercase tracking-[0.25em] mb-4">
              {language === 'en' ? 'Arlington, Texas — Pickup & Delivery Available' : 'Arlington, Texas — Pickup y Delivery Disponible'}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
              {t?.hero?.title || 'CUSTOM PRINTS &'}{' '}
              <span className="text-[#d90082]">{t?.hero?.title_highlight || 'PREMIUM BALLOONS'}</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg">
              {t?.hero?.subtitle || 'Photo boards, cutouts, backdrops, floor wraps — plus SemperTex & TufTex balloons, DIY garland kits and helium balloons.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-[#d90082] text-white rounded-full font-bold text-base text-center hover:bg-[#b0006b] transition-colors shadow-lg shadow-pink-200"
              >
                {language === 'en' ? 'Shop Now' : 'Comprar Ahora'}
              </Link>
              <Link
                href="/quote"
                className="px-8 py-4 bg-white text-[#d90082] border-2 border-[#d90082] rounded-full font-bold text-base text-center hover:bg-[#fdf2f8] transition-colors"
              >
                {language === 'en' ? 'Get a Custom Quote' : 'Cotización Personalizada'}
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000"
                alt={language === 'en' ? 'Party balloons and custom prints' : 'Globos e impresiones personalizadas'}
                className="w-full h-[320px] md:h-[420px] object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
              <Truck className="w-8 h-8 text-[#d90082]" />
              <div>
                <p className="font-bold text-slate-900 text-sm">{language === 'en' ? 'Ships Nationwide' : 'Envío Nacional'}</p>
                <p className="text-slate-500 text-xs">{language === 'en' ? 'Pickup in Arlington' : 'Pickup en Arlington'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fulfillment bar — slim, simple */}
      <section className="bg-white border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#d90082]" /> {language === 'en' ? 'Free pickup in Arlington' : 'Pickup gratis en Arlington'}</span>
          <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#d90082]" /> {language === 'en' ? 'Local delivery (DFW)' : 'Delivery local (DFW)'}</span>
          <span className="flex items-center gap-2"><Package className="w-4 h-4 text-[#d90082]" /> {language === 'en' ? 'Nationwide shipping' : 'Envío a todo el país'}</span>
        </div>
      </section>

      {/* Who We Are / How We Work */}
      <section className="py-16 md:py-20 px-6" style={{ background: '#fdf2f8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#d90082] font-bold text-xs uppercase tracking-[0.25em] mb-4">
              {language === 'en' ? 'Who We Are' : 'Quiénes Somos'}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-5">
              {language === 'en' ? 'Your local print & balloon shop' : 'Tu tienda local de impresiones y globos'}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
              {language === 'en'
                ? 'We are a local business in Arlington, Texas. We create custom prints — photo boards, life-size cutouts, backdrops, floor wraps and seating charts — and we carry premium balloons: SemperTex and TufTex latex, foil balloons for every occasion, DIY garland kits and helium. We serve the whole DFW area and ship our products nationwide.'
                : 'Somos un negocio local en Arlington, Texas. Hacemos impresiones personalizadas — photo boards, cutouts de tamaño real, backdrops, floor wraps y seating charts — y tenemos globos premium: látex SemperTex y TufTex, globos de foil para toda ocasión, kits de guirnaldas y helio. Atendemos todo el área de DFW y enviamos nuestros productos a todo el país.'}
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                num: '1',
                title: language === 'en' ? 'Choose or ask' : 'Elige o pregunta',
                desc: language === 'en'
                  ? 'Shop a product from our catalog, or request a custom decoration quote with your inspiration photos.'
                  : 'Compra un producto de nuestro catálogo, o pide una cotización de decoración con tus fotos de inspiración.',
              },
              {
                num: '2',
                title: language === 'en' ? 'Send your photos' : 'Envía tus fotos',
                desc: language === 'en'
                  ? 'Upload your pictures or design for prints — or just pick your balloon colors.'
                  : 'Sube tus fotos o diseño para las impresiones — o solo elige tus colores de globos.',
              },
              {
                num: '3',
                title: language === 'en' ? 'We make it' : 'Lo hacemos',
                desc: language === 'en'
                  ? 'We print, cut and prepare everything with care, usually in 2–5 business days.'
                  : 'Imprimimos, cortamos y preparamos todo con cuidado, normalmente en 2–5 días hábiles.',
              },
              {
                num: '4',
                title: language === 'en' ? 'Get it your way' : 'Recíbelo como quieras',
                desc: language === 'en'
                  ? 'Free pickup in Arlington, local delivery across DFW, or shipping nationwide.'
                  : 'Pickup gratis en Arlington, delivery local en DFW, o envío a todo el país.',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#d90082] text-white font-extrabold text-xl flex items-center justify-center mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 md:py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {language === 'en' ? 'Shop by Category' : 'Compra por Categoría'}
            </h2>
            <p className="text-slate-500">
              {language === 'en' ? 'Find exactly what you need for your celebration' : 'Encuentra justo lo que necesitas para tu celebración'}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="group bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#d90082]">{cat.icon}</span>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">{cat.title}</h3>
                  </div>
                  <p className="text-slate-500 text-xs md:text-sm">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 px-6" style={{ background: '#fdf2f8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {language === 'en' ? 'Best Sellers' : 'Los Más Vendidos'}
              </h2>
              <p className="text-slate-500">
                {language === 'en' ? 'Our most loved products' : 'Nuestros productos favoritos'}
              </p>
            </div>
            <Link href="/products" className="hidden sm:inline-block text-[#d90082] font-bold text-sm hover:underline">
              {language === 'en' ? 'View all →' : 'Ver todo →'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="mt-10 text-center sm:hidden">
            <Link href="/products" className="inline-block px-8 py-3 bg-[#d90082] text-white rounded-full font-bold hover:bg-[#b0006b] transition-colors">
              {language === 'en' ? 'View All Products' : 'Ver Todos'}
            </Link>
          </div>
        </div>
      </section>

      {/* Email Capture */}
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
