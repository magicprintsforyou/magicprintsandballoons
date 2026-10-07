"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Layers, Layout, Sparkles, Zap, Package, 
  Search, ArrowLeft, Image as ImageIcon, Briefcase
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';

const ProductsPage = () => {
  const { catalog, addToCart } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Extract themes ONLY if we are in the 'backdrops' category
  const backdropThemes = useMemo(() => {
    if (!catalog.backdrops) return [];
    const themes = new Set<string>();
    catalog.backdrops.items.forEach(item => {
      item.themes?.forEach(t => themes.add(t));
    });
    return Array.from(themes).sort();
  }, [catalog]);

  const getIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case "photoBoards": return <Layout className="w-8 h-8 md:w-12 md:h-12" />;
      case "props": return <Box className="w-8 h-8 md:w-12 md:h-12" />;
      case "floorWraps": return <Layers className="w-8 h-8 md:w-12 md:h-12" />;
      case "backdrops": return <ImageIcon className="w-8 h-8 md:w-12 md:h-12" />;
      case "themedKits": return <Sparkles className="w-8 h-8 md:w-12 md:h-12" />;
      case "b2bSigns": return <Briefcase className="w-8 h-8 md:w-12 md:h-12" />;
      default: return <Package className="w-8 h-8 md:w-12 md:h-12" />;
    }
  };

  const filteredItems = useMemo(() => {
    if (!activeCategory || !catalog[activeCategory]) return [];
    let items = catalog[activeCategory].items;
    
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.themes?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Only apply theme filtering if we are in backdrops and a theme is active
    // (tolerant matching: case/whitespace-insensitive, partial names allowed)
    if (activeCategory === 'backdrops' && activeTheme) {
      const norm = (s: string) => s.toLowerCase().trim();
      const key = norm(activeTheme);
      items = items.filter(item =>
        item.themes?.some((t: string) => {
          const pt = norm(String(t));
          return pt === key || pt.includes(key) || key.includes(pt);
        })
      );
    }

    return items;
  }, [catalog, activeCategory, searchQuery, activeTheme]);

  // MAIN CATEGORY VIEW
  if (!activeCategory) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black tracking-tight text-[#41137e] mb-6 leading-[1.1]"
            >
              {<>Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d90082] to-[#7e22ce]">Dynamic Catalog</span></>}
            </motion.h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              'Select a category below to discover premium museum-grade event essentials tailored for your next unforgettable moment.'
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(catalog).map(([key, cat], idx) => {
              const hasImage = !!cat.image;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setActiveCategory(key);
                    setSearchQuery("");
                    setActiveTheme(null);
                  }}
                  className={`group relative rounded-[40px] p-8 cursor-pointer overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center h-[350px] justify-center ${
                    hasImage ? 'border-none' : 'bg-white border border-slate-100 shadow-slate-200/50 hover:shadow-purple-900/10'
                  }`}
                >
                  {/* Background Handling */}
                  {hasImage ? (
                    <>
                      <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                      <div className="absolute inset-0 bg-[#d90082]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 relative z-10 shadow-sm group-hover:scale-110 ${
                    hasImage 
                    ? 'bg-black/30 backdrop-blur-md text-white border border-white/20 group-hover:bg-[#d90082] group-hover:border-transparent' 
                    : 'bg-[#41137e]/5 text-[#41137e] group-hover:bg-[#41137e] group-hover:text-white'
                  }`}>
                    {getIcon(key)}
                  </div>

                  {/* Text Content */}
                  <h3 className={`text-2xl font-black mb-4 tracking-tight transition-colors relative z-10 ${
                    hasImage ? 'text-white' : 'text-slate-800 group-hover:text-[#41137e]'
                  }`}>
                    {cat.title}
                  </h3>
                  <p className={`leading-relaxed font-medium relative z-10 line-clamp-3 ${
                    hasImage ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {cat.description}
                  </p>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <div className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
                      hasImage ? 'bg-white text-[#41137e]' : 'bg-[#d90082] text-white'
                    }`}>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // SPECIFIC CATEGORY GRID VIEW
  const categoryData = catalog[activeCategory];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-[#41137e] font-bold mb-8 hover:text-[#d90082] transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md border border-slate-100 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          'Back to Categories'
        </button>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/50 text-[#41137e] text-[10px] font-black tracking-widest uppercase mb-6 shadow-sm border border-purple-200"
          >
            {getIcon(activeCategory)}
            {activeCategory}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-[#41137e] mb-4 leading-[1.1]"
          >
            {categoryData?.title}
          </motion.h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            {categoryData?.description}
          </p>
        </header>

        {/* Global Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#d90082] transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white border border-slate-200 focus:border-[#41137e] outline-none transition-all shadow-sm text-slate-700 font-medium"
            />
          </div>
        </div>

        {/* Specific Tag Filtering (ONLY for Backdrops) */}
        {activeCategory === 'backdrops' && (
          <div className="mb-12 flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTheme(null)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                !activeTheme 
                ? 'bg-[#d90082] text-white shadow-lg shadow-pink-500/30' 
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              'All Themes'
            </button>
            {backdropThemes.map(theme => (
              <button 
                key={theme}
                onClick={() => setActiveTheme(theme)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTheme === theme 
                  ? 'bg-[#41137e] text-white shadow-lg shadow-purple-900/20' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {filteredItems.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={(p) => addToCart(p, {
                      variant: p.variants?.[0],
                      material: p.materials?.[0] || 'Foamboard',
                      isRushOrder: false,
                    })}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <div className="inline-flex w-20 h-20 rounded-full bg-slate-50 items-center justify-center mb-6">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No items found</h3>
            <p className="text-slate-500">
              "Try adjusting your search or filters to find what you're looking for."
            </p>
          </div>
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
};

export default ProductsPage;
