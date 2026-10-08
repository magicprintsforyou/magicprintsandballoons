import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Clock, ShieldCheck, ChevronDown } from 'lucide-react';
import { Product, Variant } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { isDesignPreview } from '../lib/catalogPresentation';

const SIZE_REFERENCE_IMAGES: Record<string, string> = {
  '5x3': '/images/backdrop-5x3-size-reference.jpg',
  '6x4': '/images/backdrop-6x4-size-reference.jpg',
  '7x4': '/images/backdrop-7x4-size-reference.jpg',
  '8x4': '/images/backdrop-8x4-size-reference.jpg',
};

const SIZE_REFERENCE_PRODUCTS = new Set(['standard-photo-board', 'backdrop-panel']);

const getSizeReference = (size?: string) => {
  if (!size) return null;

  const explicitDimensions = size.match(
    /(\d+(?:\.\d+)?)\s*ft\s*(?:h|height)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*ft\s*(?:w|wide|width)?/i
  );

  const height = explicitDimensions?.[1]
    || size.match(/(\d+(?:\.\d+)?)\s*ft\s*(?:h|height)\b/i)?.[1];
  const width = explicitDimensions?.[2]
    || ({ '5': '3', '6': '4', '7': '4', '8': '4' } as Record<string, string>)[height || ''];
  const key = height && width ? `${Number(height)}x${Number(width)}` : '';

  return key && SIZE_REFERENCE_IMAGES[key]
    ? {
        src: SIZE_REFERENCE_IMAGES[key],
        label: `${Number(height)} ft × ${Number(width)} ft`,
      }
    : null;
};

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, configuration: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(product.variants && product.variants.length > 0 ? product.variants[0] : null);
  const [material, setMaterial] = useState<string>(product.materials?.[0] || 'Foamboard');
  const [isRushOrder, setIsRushOrder] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSizeReference, setShowSizeReference] = useState<boolean>(true);

  const sizeReference = SIZE_REFERENCE_PRODUCTS.has(product.id)
    ? getSizeReference(selectedVariant?.size)
    : null;
  const displayedImage = showSizeReference && sizeReference ? sizeReference.src : product.image;

  // Fallback base price if no variants exist
  const basePrice = selectedVariant?.price || product.price || 0;
  const rushSurcharge = 40;
  const rushLabel = (product as any).rush_label || ('Rush Order Delivery');
  const rushDesc = (product as any).rush_desc || ('Skip the line. Ships faster.');
  const totalPrice = basePrice + (isRushOrder ? rushSurcharge : 0);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div role="dialog" aria-modal="true" aria-label={product.name} className="fixed inset-0 z-[300] flex items-start md:items-center justify-center overflow-y-auto p-0 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0A0212]/80 backdrop-blur-sm"
        />

        {/* Modal Body */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-white rounded-none sm:rounded-[40px] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-full sm:min-h-0 sm:max-h-[calc(100vh-3rem)] md:max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            aria-label="Close product details"
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-[#d90082] hover:text-white transition-all border border-slate-200"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-slate-50 flex flex-col p-4 sm:p-8 shrink-0">
            <div className="relative flex h-[260px] w-full min-h-0 items-center justify-center sm:h-[300px] md:h-auto md:flex-1">
              <img
                src={displayedImage}
                alt={showSizeReference && sizeReference ? `${product.name}, illustrative ${sizeReference.label} size reference` : product.name}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-2 left-2">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[10px] font-black tracking-[0.2em] rounded-full text-[#41137e] uppercase shadow-sm">
                  {product.category}
                </span>
              </div>
              {product.themes && product.themes.length > 0 && (
                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2">
                  {product.themes.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-[#d90082]/90 backdrop-blur-md text-white text-[9px] font-black tracking-widest rounded-full uppercase shadow-lg">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {isDesignPreview(displayedImage) && (
              <p className="pt-3 text-center text-xs text-slate-500">
                'Design preview · Your artwork will be customized for your event.'
              </p>
            )}
            {sizeReference && (
              <div className="flex shrink-0 flex-col items-center gap-2 pt-3">
                <div className="flex max-w-full gap-2 rounded-full bg-white p-1.5 shadow-md">
                  <button
                    type="button"
                    aria-label="Show product photo"
                    aria-pressed={!showSizeReference}
                    onClick={() => setShowSizeReference(false)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
                      !showSizeReference ? 'bg-[#41137e] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    'Product photo'
                  </button>
                  <button
                    type="button"
                    aria-label={`Show illustrative size reference for ${sizeReference.label}`}
                    aria-pressed={showSizeReference}
                    onClick={() => setShowSizeReference(true)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
                      showSizeReference ? 'bg-[#41137e] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    'Size reference'
                  </button>
                </div>
                {showSizeReference && (
                  <p className="text-center text-[10px] font-semibold text-slate-500">
                    'Illustrative size reference · Height × width · '{sizeReference.label}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Configuration Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-visible md:overflow-y-auto no-scrollbar flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl md:text-5xl font-black text-[#41137e] tracking-tighter leading-none mb-4">{product.name}</h2>
              <p className="text-slate-500 font-medium italic text-lg">{product.description}</p>
            </div>

            <div className="space-y-8 flex-grow">
              
              {/* Size Specification */}
              {(product.variants && product.variants.length > 0) && (
                <div>
                  <label htmlFor={`product-size-${product.id}`} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{product.variantLabel || 'Select Size (Inches / Feet)'}</label>
                  <div className="relative">
                    <select 
                      id={`product-size-${product.id}`}
                      className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold outline-none focus:border-[#41137e] transition-colors cursor-pointer"
                      value={selectedVariant?.size}
                      onChange={(e) => {
                        const variant = product.variants?.find(v => v.size === e.target.value);
                        if (variant) {
                          setSelectedVariant(variant);
                          setShowSizeReference(true);
                        }
                      }}
                    >
                      {product.variants.map((v, i) => (
                        <option key={i} value={v.size}>{v.size}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </div>
              )}

              {/* Material Dropdown */}
              <div>
                <label htmlFor={`product-material-${product.id}`} className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Material Options</label>
                <div className="relative">
                  <select 
                    id={`product-material-${product.id}`}
                    className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold outline-none focus:border-[#41137e] transition-colors cursor-pointer"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    {product.materials && product.materials.length > 0 ? (
                      product.materials.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))
                    ) : (
                      <>
                        <option value="Foamboard">Premium Foamboard</option>
                        <option value="Coroplast">Coroplast (Weatherproof)</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* File Upload Mandatory */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Print Artwork (Required)</label>
                <label 
                  className={`w-full border-2 border-dashed rounded-2xl px-6 py-8 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    selectedFile 
                    ? 'border-[#00bff3] bg-[#00bff3]/5 text-[#00bff3]' 
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-[#d90082] hover:text-[#d90082]'
                  }`}
                >
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.ai,.psd,.jpg,.jpeg,.png,.eps"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={28} className="mb-3" />
                  <span className="font-bold truncate max-w-[200px]">
                    {selectedFile ? selectedFile.name : ('Upload Your File')}
                  </span>
                  <span className="text-xs font-medium opacity-70 mt-1">.PDF, .AI, .PSD, .JPG (High Res)</span>
                </label>
              </div>

              {/* Rush Order Toggle */}
              <div 
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isRushOrder ? 'border-[#ff2a70] bg-[#ff2a70]/5' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
                onClick={() => setIsRushOrder(!isRushOrder)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRushOrder ? 'bg-[#ff2a70] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isRushOrder ? 'text-[#ff2a70]' : 'text-slate-700'}`}>{rushLabel}</h4>
                    <p className="text-xs font-medium text-slate-400">{rushDesc}</p>
                  </div>
                </div>
                <div className={`font-black tracking-tight ${isRushOrder ? 'text-[#ff2a70]' : 'text-slate-400'}`}>
                  +${rushSurcharge.toFixed(2)}
                </div>
              </div>

            </div>

            {/* Price & Action */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1">Total Configuration</span>
                  <span className="text-5xl font-black text-[#00bff3] tracking-tighter">${totalPrice.toFixed(2)}</span>
               </div>
               <button 
                className={`flex-grow py-5 text-white rounded-full font-black text-sm tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                  selectedFile ? 'bg-[#d90082] hover:bg-[#ff2a70] hover:scale-105 active:scale-95' : 'bg-slate-300 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (selectedFile && onAddToCart) {
                    onAddToCart(product, { 
                      variant: selectedVariant, 
                      material, 
                      isRushOrder,
                      artworkName: selectedFile.name 
                    });
                    onClose();
                  }
                }}
              >
                {selectedFile ? ('Finalize Quote') : ('Upload File First')}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ProductModal;
