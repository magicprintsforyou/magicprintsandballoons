import React, { useState, useRef } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdd = () => {
    if (!onAddToCart) return;
    onAddToCart(product);
    setJustAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustAdded(false), 1800);
  };

  const price = product.price || product.variants?.[0]?.price || 0;

  return (
    <div className="group bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <button
        type="button"
        aria-label={`View ${product.name}`}
        className="relative w-full aspect-square bg-[#fdf2f8] overflow-hidden cursor-pointer"
        onClick={() => onViewDetails && onViewDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.fulfillment === 'pickup' && (
            <span className="px-2.5 py-1 bg-amber-500 text-[10px] font-bold rounded-full text-white uppercase tracking-wide">
              Pickup Only
            </span>
          )}
          {product.fulfillment === 'ships' && (
            <span className="px-2.5 py-1 bg-emerald-500 text-[10px] font-bold rounded-full text-white uppercase tracking-wide">
              Ships
            </span>
          )}
        </div>
      </button>

      <div className="p-4">
        <h3
          className="font-bold text-slate-900 text-sm leading-snug mb-1 cursor-pointer hover:text-[#d90082] transition-colors line-clamp-2 min-h-[2.6em]"
          onClick={() => onViewDetails && onViewDetails(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">From</span>
            <span className="text-xl font-extrabold text-slate-900">${price.toFixed(0)}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!onAddToCart}
            className={`px-4 py-2.5 text-white rounded-full font-bold text-xs transition-all active:scale-95 ${
              justAdded
                ? 'bg-emerald-600'
                : 'bg-[#d90082] hover:bg-[#b0006b]'
            } ${!onAddToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {justAdded ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
