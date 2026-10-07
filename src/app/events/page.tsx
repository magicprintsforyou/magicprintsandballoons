"use client";
import React, { useState } from 'react';
import { Calendar, Sparkles, ChevronRight, Gift, PartyPopper, Heart, Award, MapPin, Briefcase, Clock, ArrowLeft } from 'lucide-react';
import { useLanguage, useProducts } from '@/context/ProductContext';
import ProductModal from '@/components/ProductModal';

export default function EventsPage() {
  const { language } = useLanguage();
  const { catalog, addToCart } = useProducts();

  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const occasions = [
    { id: "birthdays", title: language === 'en' ? "Birthdays (Kids & Adults)" : "Cumpleaños (Niños y Adultos)", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600", count: "4 themes available", icon: <PartyPopper className="text-white" size={20} /> },
    { id: "babyshowers", title: language === 'en' ? "Baby Showers" : "Baby Showers", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600", count: "2 themes available", icon: <Heart className="text-white" size={20} /> },
    { id: "weddings", title: language === 'en' ? "Weddings" : "Bodas", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600", count: "1 theme available", icon: <Sparkles className="text-white" size={20} /> },
    { id: "graduations", title: language === 'en' ? "Graduations" : "Graduaciones", image: "/images/events/graduation.jpg", count: "1 theme available", icon: <Award className="text-white" size={20} /> },
    { id: "churches", title: language === 'en' ? "Churches & Assemblies" : "Iglesias y Asambleas", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600", count: "1 theme available", icon: <MapPin className="text-white" size={20} /> },
    { id: "corporate", title: language === 'en' ? "Corporate & Expos" : "Corporativos y Ferias", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=600", count: "2 themes available", icon: <Briefcase className="text-white" size={20} /> },
    { id: "life", title: language === 'en' ? "Celebrations of Life" : "Memoriales / Vida", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600", count: "1 theme available", icon: <Clock className="text-white" size={20} /> }
  ];

  const occasionThemes: Record<string, { key: string; nameEn: string; nameEs: string; descEn: string; descEs: string; image: string }[]> = {
    "birthdays": [
      { key: "barbie", nameEn: "Barbie Pink World", nameEs: "Mundo Rosa Barbie", descEn: "Glitz, glam, and bright pink layouts.", descEs: "Brillos, glamour y decorados color rosa brillante.", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600" },
      { key: "safari", nameEn: "Jungle Safari Adventure", nameEs: "Aventura Safari en la Selva", descEn: "Organic green tones and animal cutouts.", descEs: "Tonos verdes orgánicos y figuras de animales.", image: "/images/events/jungle-safari.jpg" },
      { key: "superhero", nameEn: "Superhero Power", nameEs: "Poder Superhero", descEn: "Comic banners and hero stands.", descEs: "Banners de cómics y soportes de héroes.", image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=600" },
      { key: "birthday", nameEn: "General Birthday Sparkle", nameEs: "Cumpleaños Clásico", descEn: "Banners and photo boards for all ages.", descEs: "Banners y photo boards para todas las edades.", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600" }
    ],
    "babyshowers": [
      { key: "baby shower", nameEn: "Teddy Bear & Cloud Dreams", nameEs: "Sueño de Ositos y Nubes", descEn: "Soft pastel wraps and custom boards.", descEs: "Wraps en colores pastel y boards personalizados.", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600" },
      { key: "kids party", nameEn: "Sweet Animals & Pastel Balloons", nameEs: "Animalitos Dulces y Globos", descEn: "Playful designs for baby welcomes.", descEs: "Diseños juguetones para dar la bienvenida al bebé.", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600" }
    ],
    "weddings": [
      { key: "wedding", nameEn: "Elegant White & Floral", nameEs: "Elegancia Blanca y Floral", descEn: "Lace arches, floral patterns, and golden lettering.", descEs: "Arcos de encaje, patrones florales y letras doradas.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600" }
    ],
    "graduations": [
      { key: "graduation", nameEn: "Gold & Black Achievements", nameEs: "Logros Oro y Negro", descEn: "Gowns, caps, diplomas, and victory walls.", descEs: "Togas, birretes, diplomas y muros de victoria.", image: "/images/events/graduation.jpg" }
    ],
    "churches": [
      { key: "wedding", nameEn: "Sacred & Classic Backdrops", nameEs: "Fondos Clásicos y Sagrados", descEn: "Custom prints for religious assemblies.", descEs: "Impresiones personalizadas para asambleas religiosas.", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600" }
    ],
    "corporate": [
      { key: "corporate", nameEn: "Polished Brand Exposure", nameEs: "Exposición de Marca Pulida", descEn: "Trade show backdrop banners and flags.", descEs: "Banners de fondo para ferias comerciales y banderas.", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=600" },
      { key: "expo", nameEn: "Trade Show Booth Prints", nameEs: "Impresión de Stand de Expos", descEn: "Roll-up stands, podium graphics, and signs.", descEs: "Banners roll-up, gráficos de podios y letreros.", image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=600" }
    ],
    "life": [
      { key: "party", nameEn: "Celebrations of Life", nameEs: "Celebración de Vida / Memorial", descEn: "Loving memory photo frames and backdrops.", descEs: "Marcos de fotos y backdrops para recuerdo amoroso.", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600" }
    ]
  };

  // Tolerant theme matching: ignores case/whitespace and matches partial
  // theme names (e.g. key "birthday" also matches product theme "kids birthday").
  const themeMatches = (productThemes: string[] | undefined, themeKey: string) => {
    if (!productThemes || !themeKey) return false;
    const norm = (s: string) => s.toLowerCase().trim();
    const key = norm(themeKey);
    return productThemes.some(t => {
      const pt = norm(String(t));
      return pt === key || pt.includes(key) || key.includes(pt);
    });
  };

  const themeProducts = React.useMemo(() => {
    if (!selectedTheme || !catalog) return [];
    const products: any[] = [];
    Object.values(catalog).forEach(cat => {
      cat.items.forEach(prod => {
        if (themeMatches(prod.themes, selectedTheme)) {
          products.push(prod);
        }
      });
    });
    return products;
  }, [selectedTheme, catalog]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0212] text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#d90082]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* VIEW 1: Occasions Grid */}
        {!selectedOccasion && (
          <>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d90082]/10 text-[#d90082] font-black text-xs tracking-widest uppercase mb-6 border border-[#d90082]/20">
                <Sparkles size={14} /> {language === 'en' ? 'Visual Shopping' : 'Compra Visual'}
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter italic leading-none">
                {language === 'en' ? 'Shop by Occasion' : 'Comprar por Ocasión'}
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-light italic leading-relaxed">
                {language === 'en' 
                  ? 'Select your event type below. We will customize backdrops, floor wraps, and decorations matching your exact theme.' 
                  : 'Selecciona tu tipo de evento a continuación. Personalizaremos backdrops, floor wraps y decoraciones combinadas con tu temática exacta.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {occasions.map((occ, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedOccasion(occ.id)}
                  className="group relative rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl border border-white/5 bg-black/20 hover:-translate-y-2 transition-all duration-500 hover:border-[#d90082]/30 cursor-pointer"
                >
                  <img src={occ.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={occ.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#cc004e] flex items-center justify-center shrink-0">
                        {occ.icon}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{occ.count}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-[#ffcc00] transition-colors">{occ.title}</h3>
                    
                    <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-[#d90082] uppercase group-hover:gap-3 transition-all">
                      {language === 'en' ? 'Select Occasion' : 'Seleccionar Ocasión'} <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIEW 2: Themes list inside Occasion */}
        {selectedOccasion && !selectedTheme && (
          <>
            <div className="mb-10">
              <button 
                onClick={() => setSelectedOccasion(null)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> {language === 'en' ? 'Back to Occasions' : 'Volver a Eventos'}
              </button>
            </div>

            <div className="text-center max-w-3xl mx-auto mb-20">
              <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic leading-none">
                {language === 'en' ? 'Select a Theme' : 'Elige una Temática'}
              </h1>
              <p className="text-gray-400 text-lg">
                {language === 'en' 
                  ? 'Coordinate all your prints with a designer matching theme.' 
                  : 'Coordina todas tus impresiones con un tema de diseño combinado.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(occasionThemes[selectedOccasion] || []).map((theme, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedTheme(theme.key)}
                  className="group relative rounded-[35px] overflow-hidden h-64 shadow-2xl border border-white/10 bg-black/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <img src={theme.image} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[1s]" alt={theme.nameEn} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                      {language === 'en' ? theme.nameEn : theme.nameEs}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium italic mb-4">
                      {language === 'en' ? theme.descEn : theme.descEs}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-[#d90082] uppercase">
                      {language === 'en' ? 'View Matching Products' : 'Ver Productos Relacionados'} <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIEW 3: Products of selected Theme */}
        {selectedOccasion && selectedTheme && (
          <>
            <div className="mb-10 flex items-center justify-between">
              <button 
                onClick={() => setSelectedTheme(null)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> {language === 'en' ? 'Back to Themes' : 'Volver a Temas'}
              </button>
              <span className="text-xs font-black tracking-widest uppercase text-[#d90082]">
                Theme: {selectedTheme}
              </span>
            </div>

            <div className="text-center max-w-3xl mx-auto mb-20">
              <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic leading-none">
                {language === 'en' ? 'Themed Products' : 'Productos Combinados'}
              </h1>
              <p className="text-gray-400 text-lg">
                {language === 'en' 
                  ? 'Configure and add these items to your quote list.' 
                  : 'Configura y agrega estos artículos a tu lista de cotización.'}
              </p>
            </div>

            {themeProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {themeProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="group bg-white/5 border border-white/10 rounded-[35px] overflow-hidden shadow-2xl flex flex-col justify-between"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s]" alt={product.name} />
                    </div>
                    <div className="p-8 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">{product.name}</h3>
                        <p className="text-gray-400 text-xs font-medium italic mb-6 line-clamp-3">{product.description}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-full py-4 bg-[#d90082] text-white rounded-full font-black text-xs tracking-widest uppercase hover:bg-[#ff2a70] hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        {language === 'en' ? 'Configure & Add' : 'Configurar y Agregar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/10">
                <p className="text-slate-400 italic">
                  {language === 'en' ? 'No customized products found for this theme.' : 'No se encontraron productos personalizados para esta temática.'}
                </p>
              </div>
            )}
          </>
        )}

      </div>

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
