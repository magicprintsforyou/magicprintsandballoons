"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { translations, Language } from '../constants/translations';
import { CATEGORIZED_PRODUCTS } from '../constants/products';
import { boardVariant, catalogCover, isLegacyCategoryCover } from '../lib/catalogPresentation';

export type ProductVariant = {
  size: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  category: string; // The category key, e.g., 'photoBoards'
  image: string;
  description: string;
  themes?: string[];
  variants?: ProductVariant[];
  materials?: string[];
  rush_price?: number;
  price?: number;
  includes?: string[];
};

export type CartItem = {
  id: string;
  product: Product;
  config: {
    variant?: ProductVariant;
    material: string;
    isRushOrder: boolean;
    fileUploaded?: boolean;
  };
  quantity: number;
  price: number;
};

export type CategoryData = {
  title: string;
  description: string;
  image?: string;
  items: Product[];
};

export type CategorizedProducts = {
  [key: string]: CategoryData;
};

export type SiteContent = typeof translations.en;

type AppContextType = {
  // Catalog
  catalog: CategorizedProducts;
  addProduct: (categoryId: string, product: Product) => Promise<void>;
  updateProduct: (categoryId: string, product: Product) => Promise<{ ok: boolean; error?: string; warning?: string }>;
  deleteProduct: (categoryId: string, productId: string) => Promise<void>;
  addCategory: (categoryId: string, categoryData: CategoryData) => Promise<void>;
  updateCategory: (categoryId: string, categoryData: CategoryData) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  isLoading: boolean;

  // Language & Content
  t: SiteContent;
  language: Language;
  setLanguage: (lang: Language) => void;
  updateContentValue: (section: string, key: string, en: string, es: string) => Promise<void>;
  uploadImage: (file: File, bucket?: string) => Promise<string>;
  isContentConfigured: boolean;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, config: any) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
};

const AppContext = createContext<AppContextType | undefined>(undefined);


const LOCAL_STORAGE_KEY = 'magic_prints_custom_catalog_v2';

const loadLocalCatalog = (defaultCatalog: CategorizedProducts): CategorizedProducts => {
  if (typeof window === 'undefined') return defaultCatalog;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved catalog with defaults
      const merged = JSON.parse(JSON.stringify(defaultCatalog));
      Object.keys(parsed).forEach(catId => {
        if (!merged[catId]) {
          merged[catId] = parsed[catId];
        } else {
          // Add non-duplicate products
          parsed[catId].items?.forEach((savedItem: any) => {
            const exists = merged[catId].items.some((i: any) => i.id === savedItem.id);
            if (!exists) {
              merged[catId].items.unshift(savedItem);
            } else {
              const idx = merged[catId].items.findIndex((i: any) => i.id === savedItem.id);
              const variants = savedItem.variants?.map((v: ProductVariant) => boardVariant(savedItem.id, v));
              const migrated = savedItem.variants?.some((v: ProductVariant) => boardVariant(savedItem.id, v).size !== v.size);
              merged[catId].items[idx] = { ...savedItem, image: catalogCover(savedItem.id, savedItem.image), variants, ...(migrated ? { price: variants?.[0]?.price } : {}) };
            }
          });
        }
      });
      return merged;
    }
  } catch (err) {
    console.warn("Failed to load local saved catalog:", err);
  }
  return defaultCatalog;
};

const saveLocalCatalog = (catalogToSave: CategorizedProducts) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(catalogToSave));
  } catch (err) {
    console.warn("Failed to save local catalog:", err);
  }
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('magic_prints_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('magic_prints_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = useCallback((product: Product, config: any) => {
    setCart(prev => {
      const itemId = `${product.id}-${config.variant?.size || 'default'}-${config.material}-${config.isRushOrder ? 'rush' : 'standard'}`;
      const existing = prev.find(item => item.id === itemId);
      
      const basePrice = config.variant?.price || product.price || 0;
      const rushSurcharge = config.isRushOrder ? 40 : 0;
      const unitPrice = basePrice + rushSurcharge;

      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      
      return [...prev, {
        id: itemId,
        product,
        config,
        quantity: 1,
        price: unitPrice
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);
  const [catalog, setCatalog] = useState<CategorizedProducts>(() => loadLocalCatalog(CATEGORIZED_PRODUCTS as any));
  const [siteContent, setSiteContent] = useState<SiteContent>(translations.en);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isContentConfigured, setIsContentConfigured] = useState(false);

  const fetchSiteContent = useCallback(async (currentLang: Language) => {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      
      // If error (table doesn't exist), we stick with local translations
      if (error) {
        setSiteContent(translations[currentLang] as any);
        setIsContentConfigured(false);
        return;
      }

      setIsContentConfigured(true);

      if (!data || data.length === 0) {
        // Table exists but is empty, keep local but allow editing
        setSiteContent(translations[currentLang] as any);
        return;
      }

      // Merge DB content into the translation structure
      const baseContent = JSON.parse(JSON.stringify(translations[currentLang] || translations.en));
      data.forEach((item: any) => {
        // Defensive: Ensure item has required fields
        if (!item || !item.section || !item.key) return;

        const value = currentLang === 'en' ? item.en_value : item.es_value;
        const section = item.section as keyof SiteContent;

        // Defensive: Check if section exists and is an object, and value is valid
        if (
          baseContent[section] && 
          typeof baseContent[section] === 'object' && 
          baseContent[section] !== null && 
          value !== null && 
          value !== undefined
        ) {
          // Defensive: Check if key exists in local translations
          const sectionRef = baseContent[section] as any;
          if (Object.prototype.hasOwnProperty.call(sectionRef, item.key)) {
            // If the original field is an array (like about.bio), we split the DB string by newlines
            if (Array.isArray(sectionRef[item.key])) {
              sectionRef[item.key] = typeof value === 'string' 
                ? value.split('\n').filter((p: string) => p.trim() !== '')
                : [];
            } else {
              sectionRef[item.key] = value;
            }
          }
        }
      });

      setSiteContent(baseContent);
    } catch (err) {
      console.warn("Site content table not ready, using local translations");
      setSiteContent(translations[currentLang] as any);
    }
  }, []);

  const fetchCatalog = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      if (catError) throw catError;

      const { data: prodData, error: prodError } = await supabase.from('products').select('*');
      if (prodError) throw prodError;

      // Always initialize with placeholder catalog to preserve aesthetics, 
      // then let database categories override or append to it
      const newCatalog: CategorizedProducts = JSON.parse(JSON.stringify(CATEGORIZED_PRODUCTS));
      catData.forEach((cat: any) => {
        if (!newCatalog[cat.id]) {
          newCatalog[cat.id] = {
            title: cat.title,
            description: cat.description,
            image: cat.image,
            items: []
          };
        } else {
          // Update properties from DB but preserve default items
          newCatalog[cat.id].title = cat.title || newCatalog[cat.id].title;
          newCatalog[cat.id].description = cat.description || newCatalog[cat.id].description;
          // Failsafe: only overwrite image if DB has a valid URL
          if (cat.image && cat.image.trim() !== "" && !isLegacyCategoryCover(cat.id, cat.image)) {
            newCatalog[cat.id].image = cat.image;
          }
        }
      });

      prodData.forEach((prod: any) => {
        if (newCatalog[prod.category_id]) {
          // Find if this product exists in the local mockup first
          const existingLocal = newCatalog[prod.category_id].items.find(i => i.id === prod.id);
          
          const formattedProd = {
            id: prod.id,
            category: prod.category_id,
            name: prod.name,
            description: prod.description,
            price: prod.id === 'standard-photo-board' && prod.variants?.some((v: ProductVariant) => boardVariant(prod.id, v).size !== v.size)
              ? boardVariant(prod.id, prod.variants[0]).price
              : prod.price ? parseFloat(prod.price) : undefined,
            // Failsafe: Use DB image if available, else keep local placeholder
            image: catalogCover(prod.id, (prod.image && prod.image.trim() !== "") ? prod.image : existingLocal?.image),
            themes: prod.themes || [],
            variants: (prod.variants || []).map((v: ProductVariant) => boardVariant(prod.id, v)),
            materials: prod.materials || [],
            rush_price: prod.rush_price ? parseFloat(prod.rush_price) : undefined,
            includes: prod.includes || []
          };
          
          const existingIdx = newCatalog[prod.category_id].items.findIndex(i => i.id === prod.id);
          if (existingIdx >= 0) {
            newCatalog[prod.category_id].items[existingIdx] = formattedProd;
          } else {
            newCatalog[prod.category_id].items.push(formattedProd);
          }
        }
      });

      setCatalog(newCatalog);
    } catch (err) {
      console.error("Failed to fetch catalog from Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
    fetchSiteContent(language);
  }, [fetchCatalog, fetchSiteContent, language]);

  const updateContentValue = async (section: string, key: string, en: string, es: string) => {
    try {
      // Clean up values (if they were arrays converted to strings with newlines)
      // The DB just stores the string, fetchSiteContent handles the split.
      const { error } = await supabase
        .from('site_content')
        .upsert({ section, key, en_value: en, es_value: es }, { onConflict: 'key' });

      if (error) throw error;
      await fetchSiteContent(language);
    } catch (err) {
      console.error("Failed to update site content:", err);
    }
  };

  const uploadImage = async (file: File, bucket: string = 'catalog'): Promise<string> => {
    try {
      console.log(`Starting upload process for: ${file.name} to bucket: ${bucket}`);
      
      let uploadPayload: Blob | File = file;
      let contentType = file.type;

      // Try compression for images
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await new Promise<Blob | null>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
              const img = new Image();
              img.src = e.target?.result as string;
              img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const maxDim = 1200;
                if (width > maxDim) { height *= maxDim / width; width = maxDim; }
                if (height > maxDim) { width *= maxDim / height; height = maxDim; }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(b => resolve(b), 'image/webp', 0.8);
              };
              img.onerror = () => resolve(null);
            };
            reader.onerror = () => resolve(null);
          });

          if (compressed) {
            uploadPayload = compressed;
            contentType = 'image/webp';
          }
        } catch (compressionErr) {
          console.warn("Compression failed, falling back to original file:", compressionErr);
        }
      }

      // Try Supabase Storage first
      try {
        const fileExt = contentType.split('/').pop() || 'file';
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = bucket === 'catalog' ? `uploads/${fileName}` : `requests/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, uploadPayload, { 
            contentType,
            cacheControl: '3600',
            upsert: false 
          });

        if (!uploadError) {
          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          if (data?.publicUrl) return data.publicUrl;
        } else {
          console.warn("Supabase Storage Error, activating Data URL fallback:", uploadError);
        }
      } catch (storageErr) {
        console.warn("Supabase Storage unavailable, activating Data URL fallback:", storageErr);
      }

      // Seamless Fallback: Convert File/Blob to Base64 Data URL
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(uploadPayload instanceof Blob ? uploadPayload : file);
      });

    } catch (err: any) {
      console.error("Critical Storage Error:", err);
      // Fallback to Data URL even on error
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const addProduct = async (categoryId: string, product: Product) => {
    // 1. Immediately update local React state & localStorage for 100% instant UI visibility
    setCatalog(prevCatalog => {
      const updated = JSON.parse(JSON.stringify(prevCatalog));
      if (!updated[categoryId]) {
        updated[categoryId] = {
          title: categoryId,
          description: '',
          items: []
        };
      }
      const existingIdx = updated[categoryId].items.findIndex((i: any) => i.id === product.id);
      if (existingIdx >= 0) {
        updated[categoryId].items[existingIdx] = product;
      } else {
        updated[categoryId].items.unshift(product); // Add at beginning so it shows first!
      }
      saveLocalCatalog(updated);
      return updated;
    });

    // 2. Best-effort sync to Supabase Cloud
    try {
      const { error } = await supabase.from('products').insert({
        id: product.id,
        category_id: categoryId,
        name: product.name,
        description: product.description,
        price: product.price || null,
        image: product.image,
        themes: product.themes || [],
        variants: product.variants || [],
        materials: product.materials || [],
        rush_price: product.rush_price || null,
        includes: product.includes || []
      });
      if (!error) {
        await fetchCatalog();
      }
    } catch (err) {
      console.warn("Supabase addProduct sync skipped, saved locally:", err);
    }
  };

  const updateProduct = async (categoryId: string, product: Product): Promise<{ ok: boolean; error?: string; warning?: string }> => {
    // Sanitize variants: clean objects with trimmed size and numeric price.
    // This guarantees adds/deletes/edits are all sent as the full new array.
    const cleanVariants = (product.variants || []).map(v => ({
      size: String(v.size || '').trim(),
      price: Number(v.price) || 0,
    }));

    const payload = {
      name: product.name,
      description: product.description,
      price: product.price || null,
      image: product.image,
      themes: product.themes || [],
      variants: cleanVariants,
      materials: product.materials || [],
      rush_price: product.rush_price || null
    };

    setCatalog(prevCatalog => {
      const updated = JSON.parse(JSON.stringify(prevCatalog));
      if (updated[categoryId]) {
        const idx = updated[categoryId].items.findIndex((i: any) => i.id === product.id);
        if (idx >= 0) {
          updated[categoryId].items[idx] = { ...product, variants: cleanVariants };
        }
      }
      saveLocalCatalog(updated);
      return updated;
    });

    try {
      // .select() after update: Supabase returns success even when 0 rows match,
      // so we verify the row was actually written instead of failing silently.
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select('id');
      if (error) {
        // Database unreachable, but local save already succeeded above.
        console.warn("Supabase unavailable, kept local only:", error.message);
        return { ok: true, warning: 'Saved on this device only (database offline).' };
      }
      if (!data || data.length === 0) {
        console.warn("Supabase: 0 rows updated, kept local only.");
        return { ok: true, warning: 'Saved on this device only (database offline).' };
      }
      await fetchCatalog();
      return { ok: true };
    } catch (err: any) {
      // Database unreachable, but local save already succeeded above.
      console.warn("Supabase updateProduct failed, kept local only:", err);
      return { ok: true, warning: 'Saved on this device only (database offline).' };
    }
  };

  const deleteProduct = async (categoryId: string, productId: string) => {
    setCatalog(prevCatalog => {
      const updated = JSON.parse(JSON.stringify(prevCatalog));
      if (updated[categoryId]) {
        updated[categoryId].items = updated[categoryId].items.filter((i: any) => i.id !== productId);
      }
      saveLocalCatalog(updated);
      return updated;
    });

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (!error) await fetchCatalog();
    } catch (err) {
      console.warn("Supabase deleteProduct sync skipped, deleted locally:", err);
    }
  };

  const addCategory = async (categoryId: string, categoryData: CategoryData) => {
    try {
      const { error } = await supabase.from('categories').insert({
        id: categoryId,
        title: categoryData.title,
        description: categoryData.description,
        image: categoryData.image
      });

      if (error) throw error;
      await fetchCatalog();
    } catch (err) {
      console.error("Failed to add category to Supabase:", err);
    }
  };

  const updateCategory = async (categoryId: string, categoryData: CategoryData) => {
    try {
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: categoryId,
          title: categoryData.title,
          description: categoryData.description,
          image: categoryData.image
        });

      if (error) throw error;
      await fetchCatalog();
    } catch (err) {
      console.error("Failed to update category in Supabase:", err);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    // Note: 'products' table has ON DELETE CASCADE on category_id
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      await fetchCatalog();
    } catch (err) {
      console.error("Failed to delete category from Supabase:", err);
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('magic_language', lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('magic_language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  return (
    <AppContext.Provider value={{ 
      catalog, 
      t: siteContent,
      language,
      setLanguage: handleSetLanguage,
      addProduct, 
      updateProduct,
      deleteProduct,
      addCategory, 
      updateCategory,
      deleteCategory,
      updateContentValue,
      uploadImage,
      isLoading,
      isContentConfigured,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Compatibility hook for existing components
export const useLanguage = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a ProductProvider');
  }
  return {
    t: context.t,
    language: context.language,
    setLanguage: context.setLanguage
  };
};
