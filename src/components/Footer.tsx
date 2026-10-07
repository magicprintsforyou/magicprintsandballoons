"use client";

import Link from 'next/link';
import { useLanguage } from "../context/ProductContext";

export default function ClientFooter() {
    const { language } = useLanguage();
    return (
        <footer className="bg-white border-t border-pink-100 pt-14 pb-8 text-slate-600">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <p className="text-2xl font-extrabold tracking-tight text-[#d90082] mb-4">
                        magicprints<span className="text-slate-900">&</span>balloons
                    </p>
                    <p className="text-sm leading-relaxed text-slate-500">
                        {language === 'en'
                            ? 'Custom prints and premium balloons for every celebration. Pickup in Arlington, local delivery, and nationwide shipping.'
                            : 'Impresiones personalizadas y globos premium para cada celebración. Pickup en Arlington, delivery local y envío nacional.'}
                    </p>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">
                        {language === 'en' ? 'Shop' : 'Comprar'}
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li><Link href="/products" className="hover:text-[#d90082] transition-colors">{language === 'en' ? 'Balloons' : 'Globos'}</Link></li>
                        <li><Link href="/products" className="hover:text-[#d90082] transition-colors">{language === 'en' ? 'Custom Prints' : 'Impresiones'}</Link></li>
                        <li><Link href="/products" className="hover:text-[#d90082] transition-colors">{language === 'en' ? 'DIY Garland Kits' : 'Kits de Guirnaldas'}</Link></li>
                        <li><Link href="/events" className="hover:text-[#d90082] transition-colors">{language === 'en' ? 'Shop by Occasion' : 'Por Ocasión'}</Link></li>
                        <li><Link href="/quote" className="hover:text-[#d90082] transition-colors">{language === 'en' ? 'Custom Quote' : 'Cotización'}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">
                        {language === 'en' ? 'Contact' : 'Contacto'}
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <a href="mailto:info@magicprintsforyou.com" className="hover:text-[#d90082] transition-colors">
                                info@magicprintsforyou.com
                            </a>
                        </li>
                        <li>
                            <a href="https://wa.link/suimbi" target="_blank" rel="noopener noreferrer" className="hover:text-[#d90082] transition-colors">
                                WhatsApp
                            </a>
                        </li>
                        <li className="text-slate-500">
                            {language === 'en' ? 'Mon – Sat: 9:00 AM – 6:00 PM' : 'Lun – Sáb: 9:00 AM – 6:00 PM'}
                        </li>
                        <li className="text-slate-500">Arlington, Texas</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-pink-100 flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-slate-400 text-xs">© 2026 magicprintsandballoons</p>
                <p className="text-slate-400 text-xs">
                    {language === 'en' ? 'Made with care in Arlington, TX' : 'Hecho con cariño en Arlington, TX'}
                </p>
            </div>
        </footer>
    );
}
