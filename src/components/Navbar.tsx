"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import { useLanguage, useProducts } from '../context/ProductContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { cart, removeFromCart, cartTotal } = useProducts();

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

  const navLinks = [
    { label: language === 'en' ? 'Home' : 'Inicio', href: '/' },
    { label: language === 'en' ? 'Balloons' : 'Globos', href: '/products' },
    { label: language === 'en' ? 'Custom Prints' : 'Impresiones', href: '/products' },
    { label: language === 'en' ? 'Occasions' : 'Ocasiones', href: '/events' },
    { label: language === 'en' ? 'Packages' : 'Paquetes', href: '/packages' },
    { label: language === 'en' ? 'Rewards' : 'Recompensas', href: '/rewards' },
    { label: language === 'en' ? 'Quote' : 'Cotización', href: '/quote' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[110]">
      {/* Announcement Bar */}
      <div className="bg-[#d90082] text-white text-[10px] md:text-[11px] font-bold tracking-wider text-center py-2 px-4 uppercase">
        {language === 'en'
          ? 'Free pickup in Arlington · Local delivery · Nationwide shipping'
          : 'Pickup gratis en Arlington · Delivery local · Envío nacional'}
      </div>
      <nav className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLogoClick(e);
              }}
            >
              <div className="w-28 md:w-36 h-10 md:h-12 flex items-center justify-center">
                <Logo className="scale-[0.6] md:scale-[0.8]" />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map(nav => (
                <Link
                  key={nav.href + nav.label}
                  href={nav.href}
                  className={`text-[13px] font-bold transition-colors ${pathname === nav.href
                    ? 'text-[#d90082]'
                    : 'text-slate-700 hover:text-[#d90082]'
                    }`}
                >
                  {nav.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.link/suimbi"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="text-xs font-bold px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:border-[#d90082] hover:text-[#d90082] transition-all"
              >
                {language === 'en' ? 'EN | ES' : 'ES | EN'}
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 rounded-full bg-[#d90082] text-white flex items-center justify-center hover:bg-[#b0006b] transition-colors shadow-md"
                aria-label="Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center"
                aria-label="Menu"
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
          <div className="lg:hidden bg-white border-t border-pink-100 shadow-lg">
            <div className="flex flex-col px-6 py-4">
              {navLinks.map(nav => (
                <Link
                  key={nav.href + nav.label}
                  href={nav.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-bold py-3 border-b border-pink-50 ${pathname === nav.href ? 'text-[#d90082]' : 'text-slate-700'
                    }`}
                >
                  {nav.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'en' ? 'Your Cart' : 'Tu Carrito'}
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-5">
              {cart.length === 0 ? (
                <p className="text-center text-slate-400 py-16">
                  {language === 'en' ? 'Your cart is empty' : 'Tu carrito está vacío'}
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-5">
                    <img src={item.product.image} className="w-16 h-16 rounded-lg object-cover border border-slate-100" alt={item.product.name} />
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-400">
                        {item.config?.variant?.size || 'Default'} · Qty: {item.quantity}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-[#d90082]">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 font-bold hover:underline"
                        >
                          {language === 'en' ? 'Remove' : 'Quitar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between font-bold text-slate-900 mb-4">
                <span>{language === 'en' ? 'Total:' : 'Total:'}</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  router.push('/checkout');
                }}
                className={`w-full py-3.5 text-center rounded-full font-bold text-sm uppercase tracking-wide transition-all ${cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#d90082] text-white hover:bg-[#b0006b]'
                  }`}
              >
                {language === 'en' ? 'Checkout' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
