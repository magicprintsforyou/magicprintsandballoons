"use client";
import React, { useMemo, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Layers, Layout, Sparkles, Package,
  Search, ArrowLeft, Image as ImageIcon, Briefcase,
  PartyPopper, Shapes, Wind, Wrench, ChevronRight,
  Type, Star, Cake, Baby, Gem, Snowflake
} from 'lucide-react';
import { useProducts, Product } from '../../context/ProductContext';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';

/* ------------------------------------------------------------------ */
/* Navigation tree: Groups -> Subcategories -> (Brands/Themes) -> Products */
/* ------------------------------------------------------------------ */

type LeafNode = {
  title: string;
  description?: string;
  catalogKeys?: string[];                       // merge all items from these catalog keys
  filter?: { catalogKey: string; itemCategory: string }; // filter items of one key by product.category
};

type BranchNode = {
  title: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
  children: Record<string, NavNode>;
};

type NavNode = BranchNode | LeafNode;

const isBranch = (n: NavNode): n is BranchNode => 'children' in n;

const FOIL_IMG = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800";
const LATEX_IMG = "https://images.pexels.com/photos/3905855/pexels-photo-3905855.jpeg?auto=compress&cs=tinysrgb&w=800";
const HELIUM_IMG = "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?q=80&w=800";

const NAV_TREE: Record<string, NavNode> = {
  balloons: {
    title: "Balloons",
    description: "Shop like the pros: latex by brand, foil by theme, DIY kits, helium, accessories & special balloons.",
    image: LATEX_IMG,
    icon: <PartyPopper className="w-8 h-8 md:w-12 md:h-12" />,
    children: {
      latex: {
        title: "Latex Balloons",
        description: "Professional latex balloons — pick your brand, size and color.",
        image: LATEX_IMG,
        icon: <PartyPopper className="w-8 h-8 md:w-12 md:h-12" />,
        children: {
          sempertex: {
            title: "SemperTex",
            description: "World-famous Fashion line latex. Pick a size, choose your color.",
            filter: { catalogKey: "latexBalloons", itemCategory: "SemperTex" },
          },
          tuftex: {
            title: "TufTex",
            description: "Made in the USA. Strong, vibrant colors decorators love.",
            filter: { catalogKey: "latexBalloons", itemCategory: "TufTex" },
          },
        },
      },
      foil: {
        title: "Foil Balloons",
        description: "Shiny, long-lasting foil balloons organized by theme.",
        image: FOIL_IMG,
        icon: <Sparkles className="w-8 h-8 md:w-12 md:h-12" />,
        children: {
          numbers: { title: "Number Foils", description: "Jumbo numbers 0–9 for ages and anniversaries.", filter: { catalogKey: "foilBalloons", itemCategory: "Numbers" } },
          letters: { title: "Letter Foils", description: "Letters A–Z to spell names and messages.", filter: { catalogKey: "foilBalloons", itemCategory: "Letters" } },
          shapes: { title: "Shapes", description: "Stars, hearts and round foil balloons.", filter: { catalogKey: "foilBalloons", itemCategory: "Shapes" } },
          birthday: { title: "Birthday", description: "Happy Birthday foil balloons.", filter: { catalogKey: "foilBalloons", itemCategory: "Birthday" } },
          "baby-shower": { title: "Baby Shower", description: "Baby shower & gender reveal foils.", filter: { catalogKey: "foilBalloons", itemCategory: "Baby Shower" } },
          wedding: { title: "Wedding", description: "Wedding & anniversary foil balloons.", filter: { catalogKey: "foilBalloons", itemCategory: "Wedding" } },
          holiday: { title: "Holiday", description: "Seasonal holiday foil balloons.", filter: { catalogKey: "foilBalloons", itemCategory: "Holiday" } },
        },
      },
      kits: {
        title: "DIY Garland Kits",
        description: "Everything you need to build a stunning garland at home. Ships nationwide.",
        catalogKeys: ["balloonKits"],
      },
      helium: {
        title: "Helium Balloons",
        description: "Fresh helium balloons, inflated in-store. Pickup in Arlington only.",
        image: HELIUM_IMG,
        icon: <Wind className="w-8 h-8 md:w-12 md:h-12" />,
        children: {
          individual: { title: "Individual Balloons", description: "Single helium-filled balloons, ready for pickup.", filter: { catalogKey: "heliumBalloons", itemCategory: "Individual" } },
          bunches: { title: "Balloon Bunches", description: "Hand-tied bouquets with ribbon and weight.", filter: { catalogKey: "heliumBalloons", itemCategory: "Bunches" } },
        },
      },
      accessories: {
        title: "Balloon Accessories",
        description: "Pumps, ribbon, weights and stands — display like a pro.",
        catalogKeys: ["balloonAccessories"],
      },
      special: {
        title: "Special Balloons",
        description: "Modeling, bubble & personalized balloons for extra wow.",
        image: "https://images.pexels.com/photos/30669732/pexels-photo-30669732.jpeg?auto=compress&cs=tinysrgb&w=800",
        icon: <Sparkles className="w-8 h-8 md:w-12 md:h-12" />,
        catalogKeys: ["specialBalloons"],
      },
    },
  },
  prints: {
    title: "Custom Prints",
    description: "Photo boards, cutouts, backdrops, floor wraps and more — made to order.",
    image: "/images/photo-board-9856.jpg",
    icon: <ImageIcon className="w-8 h-8 md:w-12 md:h-12" />,
    children: {
      "photo-boards": { title: "Photo Boards", description: "Premium photo boards & panels in 10 sizes.", catalogKeys: ["photoBoards"] },
      "cut-outs": { title: "Cut Outs", description: "Life-size foam board props & cut-outs.", catalogKeys: ["props"] },
      "floor-wraps": { title: "Floor Wraps", description: "Luxury removable vinyl floor wraps.", catalogKeys: ["floorWraps"] },
      packages: { title: "Event Packages", description: "Signature event packages, curated for you.", catalogKeys: ["themedKits"] },
      essentials: { title: "Essentials & Banners", description: "Banner stands and event essentials.", catalogKeys: ["essentials"] },
    },
  },
};

const SUB_ICONS: Record<string, React.ReactNode> = {
  kits: <Package className="w-8 h-8 md:w-12 md:h-12" />,
  accessories: <Wrench className="w-8 h-8 md:w-12 md:h-12" />,
  "photo-boards": <Layout className="w-8 h-8 md:w-12 md:h-12" />,
  "cut-outs": <Box className="w-8 h-8 md:w-12 md:h-12" />,
  "floor-wraps": <Layers className="w-8 h-8 md:w-12 md:h-12" />,
  packages: <Sparkles className="w-8 h-8 md:w-12 md:h-12" />,
  essentials: <Briefcase className="w-8 h-8 md:w-12 md:h-12" />,
  numbers: <Type className="w-8 h-8 md:w-12 md:h-12" />,
  letters: <Type className="w-8 h-8 md:w-12 md:h-12" />,
  shapes: <Shapes className="w-8 h-8 md:w-12 md:h-12" />,
  birthday: <Cake className="w-8 h-8 md:w-12 md:h-12" />,
  "baby-shower": <Baby className="w-8 h-8 md:w-12 md:h-12" />,
  wedding: <Gem className="w-8 h-8 md:w-12 md:h-12" />,
  holiday: <Snowflake className="w-8 h-8 md:w-12 md:h-12" />,
  individual: <PartyPopper className="w-8 h-8 md:w-12 md:h-12" />,
  bunches: <PartyPopper className="w-8 h-8 md:w-12 md:h-12" />,
  special: <Sparkles className="w-8 h-8 md:w-12 md:h-12" />,
  sempertex: <Star className="w-8 h-8 md:w-12 md:h-12" />,
  tuftex: <Star className="w-8 h-8 md:w-12 md:h-12" />,
};

/* ------------------------------------------------------------------ */

const ProductsPageInner = () => {
  const { catalog, addToCart } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cat = searchParams.get('cat');
  const sub = searchParams.get('sub');
  const subPath: string[] = sub ? sub.split('/').filter(Boolean) : [];

  const isLegacyKey = !!cat && !NAV_TREE[cat] && !!catalog[cat];

  // Resolve leaf items
  const getLeafItems = (leaf: LeafNode): Product[] => {
    if (leaf.catalogKeys) {
      return leaf.catalogKeys.flatMap(k => catalog[k]?.items ?? []);
    }
    if (leaf.filter) {
      return (catalog[leaf.filter.catalogKey]?.items ?? []).filter(
        i => i.category === leaf.filter!.itemCategory
      );
    }
    return [];
  };

  // Resolve an image for any node (explicit, catalog image, or first product image)
  const getNodeImage = (node: NavNode): string | undefined => {
    if (isBranch(node)) {
      if (node.image) return node.image;
      const firstChildKey = Object.keys(node.children)[0];
      if (firstChildKey) return getNodeImage(node.children[firstChildKey]);
      return undefined;
    }
    if (node.catalogKeys?.[0] && catalog[node.catalogKeys[0]]?.image) {
      return catalog[node.catalogKeys[0]].image;
    }
    const items = getLeafItems(node);
    return items[0]?.image;
  };

  const getNodeIcon = (key: string, node: NavNode) => {
    if (isBranch(node) && node.icon) return node.icon;
    return SUB_ICONS[key] ?? <Package className="w-8 h-8 md:w-12 md:h-12" />;
  };

  // Walk the tree to the current node
  const walkPath = (path: string[]): NavNode | null => {
    if (path.length === 0) return null;
    let node: NavNode | undefined = NAV_TREE[path[0]];
    for (let i = 1; i < path.length; i++) {
      if (!node || !isBranch(node)) return null;
      node = node.children[path[i]];
    }
    return node ?? null;
  };

  const rawNode: NavNode | null = isLegacyKey ? null : walkPath(cat ? [cat, ...subPath] : []);
  // Fall back to the group level if the sub-path doesn't resolve
  const currentNode: NavNode | null = rawNode ?? (cat && NAV_TREE[cat] ? NAV_TREE[cat] : null);
  const currentIsLeaf = currentNode !== null && !isBranch(currentNode);

  const navUrl = (path: string[]) => {
    if (path.length === 0) return '/products';
    const [group, ...rest] = path;
    return rest.length > 0 ? `/products?cat=${group}&sub=${rest.join('/')}` : `/products?cat=${group}`;
  };

  const go = (path: string[]) => {
    setSearchQuery("");
    router.push(navUrl(path));
  };

  // Breadcrumb trail
  const crumbs: { label: string; path: string[] }[] = [{ label: "Shop All", path: [] }];
  if (isLegacyKey && cat) {
    crumbs.push({ label: catalog[cat].title, path: [] });
  } else if (cat) {
    const path: string[] = [cat];
    const groupNode = NAV_TREE[cat];
    crumbs.push({ label: groupNode.title, path: [...path] });
    let node: NavNode = groupNode;
    for (const seg of subPath) {
      if (!isBranch(node)) break;
      const child = node.children[seg];
      if (!child) break;
      path.push(seg);
      crumbs.push({ label: child.title, path: [...path] });
      node = child;
    }
  }

  const leafItems: Product[] = useMemo(() => {
    if (isLegacyKey && cat) return catalog[cat]?.items ?? [];
    if (currentIsLeaf && currentNode) return getLeafItems(currentNode as LeafNode);
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, cat, sub, isLegacyKey, currentNode, currentIsLeaf]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return leafItems;
    const q = searchQuery.toLowerCase();
    return leafItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.themes?.some(t => t.toLowerCase().includes(q))
    );
  }, [leafItems, searchQuery]);

  const NavCard = ({ title, description, image, icon, onClick, idx }: {
    title: string; description?: string; image?: string; icon: React.ReactNode;
    onClick: () => void; idx: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(idx * 0.07, 0.4) }}
      onClick={onClick}
      className="group relative rounded-[32px] p-8 cursor-pointer overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center h-[300px] justify-center border-none"
    >
      {image ? (
        <>
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-[#d90082]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </>
      ) : (
        <div className="absolute inset-0 bg-white border border-slate-100" />
      )}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 relative z-10 shadow-sm group-hover:scale-110 ${
        image
          ? 'bg-black/30 backdrop-blur-md text-white border border-white/20 group-hover:bg-[#d90082] group-hover:border-transparent'
          : 'bg-[#41137e]/5 text-[#41137e] group-hover:bg-[#41137e] group-hover:text-white'
      }`}>
        {icon}
      </div>
      <h3 className={`text-2xl font-black mb-3 tracking-tight relative z-10 ${image ? 'text-white' : 'text-slate-800'}`}>
        {title}
      </h3>
      {description && (
        <p className={`leading-relaxed font-medium relative z-10 line-clamp-2 text-sm ${image ? 'text-white/80' : 'text-slate-500'}`}>
          {description}
        </p>
      )}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
        <div className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${image ? 'bg-white text-[#41137e]' : 'bg-[#d90082] text-white'}`}>
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </div>
      </div>
    </motion.div>
  );

  const Breadcrumb = () => (
    <nav className="flex items-center gap-1.5 flex-wrap mb-8 text-sm font-bold">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
          {i === crumbs.length - 1 ? (
            <span className="text-[#41137e]">{c.label}</span>
          ) : (
            <button onClick={() => go(c.path)} className="text-slate-400 hover:text-[#d90082] transition-colors">
              {c.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );

  /* ---------------- TOP LEVEL: two big groups ---------------- */
  if (!cat) {
    const groups = Object.entries(NAV_TREE);
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <header className="text-center mb-14">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black tracking-tight text-[#41137e] mb-6 leading-[1.1]"
            >
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d90082] to-[#7e22ce]">Category</span>
            </motion.h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Balloons organized like a pro balloon shop — plus custom prints made to order.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {groups.map(([key, node], idx) => (
              <NavCard
                key={key}
                idx={idx}
                title={isBranch(node) ? node.title : key}
                description={isBranch(node) ? node.description : undefined}
                image={getNodeImage(node)}
                icon={getNodeIcon(key, node)}
                onClick={() => go([key])}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- BRANCH LEVEL: subcategory cards ---------------- */
  if (currentNode && isBranch(currentNode)) {
    const children = Object.entries(currentNode.children);
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Breadcrumb />
          <header className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-[#41137e] mb-4 leading-[1.1]"
            >
              {currentNode.title}
            </motion.h1>
            {currentNode.description && (
              <p className="text-slate-500 text-lg font-medium max-w-2xl">{currentNode.description}</p>
            )}
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {children.map(([key, child], idx) => {
              const path = cat ? [cat, ...subPath, key] : [key];
              return (
                <NavCard
                  key={key}
                  idx={idx}
                  title={child.title}
                  description={isBranch(child) ? child.description : (child as LeafNode).description}
                  image={getNodeImage(child)}
                  icon={getNodeIcon(key, child)}
                  onClick={() => go(path)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- LEAF LEVEL: products ---------------- */
  const leafTitle = isLegacyKey && cat ? catalog[cat]?.title : (currentNode as LeafNode)?.title;
  const leafDesc = isLegacyKey && cat ? catalog[cat]?.description : (currentNode as LeafNode)?.description;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Breadcrumb />

        <header className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-[#41137e] mb-4 leading-[1.1]"
          >
            {leafTitle}
          </motion.h1>
          {leafDesc && <p className="text-slate-500 text-lg font-medium max-w-2xl">{leafDesc}</p>}
        </header>

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
                    onAddToCart={(p) => {
                      // Products needing custom text (e.g. personalized balloon) must go through the modal
                      if ((p as any).customTextLabel) { setSelectedProduct(p); return; }
                      addToCart(p, {
                        variant: p.variants?.[0],
                        material: p.materials?.[0] || 'Foamboard',
                        isRushOrder: false,
                      });
                    }}
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
            <p className="text-slate-500">Try adjusting your search to find what you&apos;re looking for.</p>
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

const ProductsPage = () => (
  <Suspense fallback={<div className="min-h-screen pt-24 pb-20 bg-slate-50" />}>
    <ProductsPageInner />
  </Suspense>
);

export default ProductsPage;
