"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import { useLanguage, useProducts } from '../context/ProductContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { cart, removeFromCart, cartTotal } = useProducts();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin secret access: 3 clicks within 2 seconds
  useEffect(() => {
    if (logoClicks === 3) {
      router.push('/admin');
      setLogoClicks(0);
    }
    const timer = setTimeout(() => setLogoClicks(0), 2000);
    return () => clearTimeout(timer);
  }, [logoClicks, router]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      setLogoClicks(prev => prev + 1);
    }
  };

  const isHome = pathname === '/';
  const showBackground = scrolled || !isHome || mobileMenuOpen;

  const navLinks = [
    { label: t?.nav?.home || 'HOME', href: '/' },
    { label: t?.nav?.eventShop || 'SHOP BY EVENT', href: '/events' },
    { label: t?.nav?.productShop || 'SHOP BY PRODUCT', href: '/products' },
    { label: t?.nav?.corporate || 'CORPORATE', href: '/corporate' },
    { label: t?.nav?.history || 'OUR STORY', href: '/our-story' },
    { label: t?.nav?.blog || 'BLOG', href: '/blog' },
    { label: t?.nav?.quote || 'CUSTOM QUOTE', href: '/quote' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[110]">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#41137e] text-white text-[9px] md:text-[11px] font-black tracking-[0.2em] text-center py-2.5 px-4 shadow-md uppercase">
        {t?.announcement || "Custom printing in DFW | Pickup in 3-4 business days | Local delivery | UPS shipping | Fast Print available"}
      </div>
      <nav className={`transition-all duration-500 ${showBackground ? 'py-2 glass-effect shadow-xl border-b border-purple-50' : 'py-4 bg-transparent'
        }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center gap-4">
          {/* Logo Container */}
          <Link
            href="/"
            className="flex-shrink-0 cursor-pointer group"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleLogoClick(e);
            }}
          >
            <div className={`transition-all duration-500 flex items-center justify-center ${showBackground ? 'w-24 md:w-32 h-10 md:h-12' : 'w-32 md:w-44 h-16 md:h-20'
              }`}>
              <Logo className="scale-[0.6] md:scale-[0.8]" light={!showBackground} />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(nav => (
              <Link
                key={nav.href}
                href={nav.href}
                className={`text-[10px] font-black tracking-[0.2em] transition-all relative py-2 ${pathname === nav.href
                  ? 'text-[#d90082]'
                  : showBackground ? 'text-[#41137e] hover:text-[#d90082]' : 'text-white hover:text-[#ffcc00]'
                  }`}
              >
                {nav.label}
              </Link>
            ))}
          </div>

          {/* Icons, Language Toggle and Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* WhatsApp Button */}
            <a
              href="https://wa.link/suimbi"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex items-center gap-2 text-[10px] font-black tracking-[0.1em] px-3 py-1.5 rounded-full transition-all border ${
                showBackground 
                  ? 'border-green-600 text-green-700 hover:bg-green-600 hover:text-white' 
                  : 'border-white/50 text-white hover:bg-white hover:text-green-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className={`text-[10px] font-black tracking-[0.1em] px-3 py-1.5 rounded-full transition-all border ${
                showBackground 
                  ? 'border-[#41137e] text-[#41137e] hover:bg-[#41137e] hover:text-white' 
                  : 'border-white/50 text-white hover:bg-white hover:text-[#41137e]'
              }`}
            >
              {language === 'en' ? 'EN' : 'ES'}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className={`flex relative w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center transition-all ${showBackground ? 'bg-[#41137e] text-white shadow-lg' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'
                } hover:scale-110`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#cc004e] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white animate-pulse">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all ${showBackground ? 'bg-[#41137e] text-white shadow-lg' : 'bg-white/10 text-white border border-white/20'
                }`}
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold">×</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-purple-50 animate-in slide-in-from-top duration-300 shadow-2xl">
          <div className="flex flex-col p-8 space-y-6">
            {navLinks.map(nav => (
              <Link
                key={nav.href}
                href={nav.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left text-xs font-black tracking-[0.3em] py-4 border-b border-slate-50 ${pathname === nav.href ? 'text-[#d90082]' : 'text-[#41137e]'
                  }`}
              >
                {nav.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>

      {/* Cart Drawer Backdrop */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-end animate-in fade-in duration-300">
          {/* Drawer content */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-slate-800">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#d90082]/10 flex items-center justify-center text-[#d90082]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#41137e]">
                  {language === 'en' ? 'Your Quote Cart' : 'Tu Carrito de Cotización'}
                </h3>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Scrollable list */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 italic">
                    {language === 'en' ? 'Your cart is empty' : 'Tu carrito está vacío'}
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-6">
                    <img src={item.product.image} className="w-20 h-20 rounded-xl object-cover border border-slate-100" alt={item.product.name} />
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-700 leading-tight mb-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">
                        Size: {item.config?.variant?.size || 'Default'} | Mat: {item.config?.material}
                        {(item.config as any)?.artworkName && (
                          <div className="text-[10px] text-slate-500 mt-1 italic truncate max-w-[200px]">
                            File: {(item.config as any).artworkName}
                          </div>
                        )}
                      </p>
                      {item.config?.isRushOrder && (
                        <span className="inline-block mt-1 text-[8px] bg-red-100 text-red-600 font-bold uppercase px-2 py-0.5 rounded">
                          Rush Order
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400 font-medium">
                          Qty: {item.quantity}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-[#00bff3]">${(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-lg font-black uppercase tracking-tight text-[#41137e]">
                <span>Total Estimado:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  router.push('/checkout');
                }}
                className={`w-full py-4 text-center rounded-full font-black text-xs tracking-widest uppercase transition-all shadow-lg ${
                  cart.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#d90082] text-white hover:bg-[#ff2a70] hover:scale-[1.02]'
                }`}
              >
                {language === 'en' ? 'Proceed to Quote' : 'Proceder a Cotización'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
