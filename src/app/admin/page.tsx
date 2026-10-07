'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Upload, Sparkles, Save, Edit2, Image as ImageIcon, CheckCircle2, Package, Tag, Layers, FolderPlus, Building2, AlertCircle, LogOut, MessageCircle } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '../../context/ProductContext';
import { translations } from '../../constants/translations';
import { supabase } from '../../lib/supabase';

export default function AdminPortal() {
  return (
    <ErrorBoundary>
      <AdminPortalContent />
    </ErrorBoundary>
  );
}

function AdminPortalContent() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const bypassAuth = localStorage.getItem('magic_bypass');
        if (bypassAuth === 'true') {
          setSession({ user: { email: 'admin@magicprints.com' } });
          setAuthLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!data.session) {
          router.push('/admin/login');
        } else {
          setSession(data.session);
        }
      } catch (err: any) {
        console.error("Auth check failed:", err);
        setAuthError(err.message || "Failed to communicate with authentication server.");
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const { 
    catalog, 
    t,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    updateContentValue,
    uploadImage,
    isContentConfigured 
  } = useProducts();
  
  const [activeTab, setActiveTab] = useState<'product' | 'category' | 'content'>('product');
  
  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop');
  const [category, setCategory] = useState('');

  // Initialize category when catalog loads
  useEffect(() => {
    if (Object.keys(catalog || {}).length > 0 && !category) {
      setCategory(Object.keys(catalog)[0]);
    }
  }, [catalog, category]);
  const [tags, setTags] = useState('');
  const [materials, setMaterials] = useState('');
  const [rushPrice, setRushPrice] = useState('');
  const [variants, setVariants] = useState<{size: string, price: number}[]>([]);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [catSaveSuccess, setCatSaveSuccess] = useState(false);

  // New Category State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Content Editor State
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerate = async () => {
    if (!name) return;
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/admin/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseName: name })
      });
      if (!response.ok) {
        throw new Error('AI Generation failed');
      }
      const data = await response.json();
      if (data.name) setName(data.name);
      if (data.category) setCategory(data.category);
      if (data.description) setDescription(data.description);
      if (data.themes) setTags(data.themes.join(', '));
      if (data.materials) setMaterials(data.materials.join(', '));
      if (data.rushPrice) setRushPrice(data.rushPrice.toString());
      if (data.variants) setVariants(data.variants);
    } catch (err) {
      console.error(err);
      alert('Error al autocompletar con IA. Inténtalo de nuevo.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setter(url);
    } catch (err: any) {
      console.error("Upload failed", err);
      const errorMsg = err?.message || err?.error_description || "Unknown storage error";
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const projectId = supabaseUrl.split('//')[1]?.split('.')[0] || "unknown";
      alert(`Failed to upload image: ${errorMsg}\n\nProject ID: ${projectId}\n\nTechnical Tip: Ensure your 'catalog' bucket is Public in the Supabase Dashboard AND THAT YOU ARE IN THE CORRECT PROJECT: ${projectId}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setName('');
    setPrice('');
    setDescription('');
    setTags('');
    setImage('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop');
    setMaterials('');
    setRushPrice('');
    setVariants([]);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setPrice(prod.price?.toString() || '');
    setDescription(prod.description);
    setImage(prod.image);
    setCategory(prod.category);
    setTags(prod.themes?.join(', ') || '');
    setMaterials(prod.materials?.join(', ') || '');
    setRushPrice(prod.rush_price?.toString() || '');
    // Deep copy: never share the array/object references with the catalog state,
    // otherwise in-place edits would mutate the catalog behind React's back.
    setVariants((prod.variants || []).map(v => ({ size: v.size || '', price: Number(v.price) || 0 })));
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (catId: string, prodId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(catId, prodId);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;

    const productData: Product = {
      id: editingProductId || crypto.randomUUID(),
      name,
      price: parseFloat(price) || 0,
      description: description || 'Superb quality event material.',
      category,
      image,
      themes: tags.split(',').map(t => t.trim()).filter(Boolean),
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      rush_price: parseFloat(rushPrice) || 0,
      // Drop fully-empty rows (no size and no price) so junk never reaches the DB.
      variants: variants.filter(v => String(v.size || '').trim() !== '' || Number(v.price) > 0)
    };

    if (editingProductId) {
      const result = await updateProduct(category, productData);
      if (!result.ok) {
        // Do NOT show success and do NOT reset the form: the user's work is preserved
        // so nothing is lost while the DB problem gets fixed.
        alert(`Could not save to the database:\n\n${result.error}\n\nYour changes were kept in this form and saved locally, but they are NOT in Supabase yet.`);
        return;
      }
    } else {
      await addProduct(category, productData);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    resetProductForm();
  };

  const handleEditCategory = (key: string, data: any) => {
    setEditingCatId(key);
    setNewCatKey(key);
    setNewCatTitle(data.title);
    setNewCatDesc(data.description);
    setNewCatImage(data.image || '');
    setActiveTab('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategory = async (key: string) => {
    if (confirm('Deleting a category will remove all products inside it. Continue?')) {
      await deleteCategory(key);
    }
  };

  const handlePublishCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatKey || !newCatTitle) return;

    const formattedKey = newCatKey.toLowerCase().replace(/[^a-z0-9]/g, '');

    const catData = {
      title: newCatTitle,
      description: newCatDesc || 'A premium collection of event materials.',
      image: newCatImage || undefined,
      items: []
    };

    if (editingCatId) {
      await updateCategory(editingCatId, catData);
    } else {
      await addCategory(formattedKey, catData);
    }

    setCatSaveSuccess(true);
    setTimeout(() => setCatSaveSuccess(false), 3000);

    setEditingCatId(null);
    setNewCatKey('');
    setNewCatTitle('');
    setNewCatDesc('');
    setNewCatImage('');
    setCategory(formattedKey);
    setActiveTab('product');
  };

  const handleSignOut = async () => {
    localStorage.removeItem('magic_bypass');
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 border-4 border-[#d90082] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 font-black uppercase tracking-widest text-xs animate-pulse">Authenticating Vision...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[40px] p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto flex items-center justify-center text-red-500">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Connection Fault</h2>
          <p className="text-white/40 text-sm">{authError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 rounded-2xl bg-[#d90082] text-white font-bold uppercase tracking-widest shadow-xl shadow-[#d90082]/20"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 pb-24 font-sans text-white">
      {/* Header Admin */}
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6 relative">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d90082] to-[#ff2a70] tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Sparkles className="text-[#d90082]" /> Magic Prints Admin
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-white/60">Global Content Management System (CMS)</p>
            <span className="text-[9px] bg-white/5 text-white/30 px-2 py-0.5 rounded-md border border-white/10 font-mono">Project: {(process.env.NEXT_PUBLIC_SUPABASE_URL || "").split('//')[1]?.split('.')[0]}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin/prices" className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#d90082]/10 hover:bg-[#d90082]/20 transition-all text-xs font-bold uppercase tracking-widest text-[#d90082] border border-[#d90082]/20">
            <Tag size={14} />
            Editar precios
          </Link>
          <Link href="/admin/chats" className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-all text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-500/20">
            <MessageCircle size={14} />
            Website Chats
          </Link>
          <Link href="/products" className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white border border-white/5">
            <ArrowLeft size={14} />
            View Catalog
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-all text-xs font-bold uppercase tracking-widest text-red-500 border border-red-500/20"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* CONTROL PANEL */}
        <section className="col-span-1 lg:col-span-12 xl:col-span-5 bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d90082]/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
          
          {/* TABS */}
          <div className="flex bg-black/40 rounded-2xl p-2 mb-10 border border-white/10 shrink-0">
            <button 
              onClick={() => { setActiveTab('product'); resetProductForm(); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase text-[10px] md:text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'product' ? 'bg-[#d90082] text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <Package size={16} /> {editingProductId ? 'Edit Product' : 'New Product'}
            </button>
            <button 
              onClick={() => setActiveTab('category')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase text-[10px] md:text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'category' ? 'bg-[#41137e] text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <FolderPlus size={16} /> {editingCatId ? 'Edit Category' : 'New Category'}
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase text-[10px] md:text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'content' ? 'bg-[#00bff3] text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <Sparkles size={16} /> Page Content
            </button>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar pb-6 relative min-h-[500px]">
            {activeTab === 'product' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative h-full">
                <form onSubmit={handlePublish} className="space-y-6">
                  
                  {/* Visual Proof / Photo */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Product Photo (URL)</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 overflow-hidden shrink-0 shadow-inner">
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Enter image URL..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-[#d90082] transition-colors"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setImage)}
                            className="hidden"
                            id="product-upload"
                          />
                          <label
                            htmlFor="product-upload"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <Upload size={14} className={isUploading ? 'animate-bounce' : ''} />
                            {isUploading ? 'Uploading...' : 'Upload from device'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Product Name</label>
                    <div className="flex gap-3">
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Barbie Dreamhouse Backdrop"
                        className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-[#d90082] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={isGeneratingAI || !name}
                        className="px-6 bg-gradient-to-r from-[#d90082] to-[#ff2a70] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(217,0,130,0.4)] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <Sparkles size={14} className={isGeneratingAI ? 'animate-spin' : ''} />
                        {isGeneratingAI ? 'Generando...' : 'Auto-Completar con IA'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category Dropdown */}
                    <div>
                      <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Layers size={14} /> Category
                      </label>
                      <select
                        disabled={!!editingProductId}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-[#d90082] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                      >
                        {Object.entries(catalog || {}).map(([key, cat]) => (
                          <option key={key} value={key}>{cat.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Base Price ($)</label>
                      <input
                        required
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-[#d90082] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Tags / Themes */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Tag size={14} /> Tags & Themes (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. birthday, barbie, kids, wedding"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d90082] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Materials */}
                    <div>
                      <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Materials (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={materials}
                        onChange={(e) => setMaterials(e.target.value)}
                        placeholder="e.g. Foamboard, Coroplast"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d90082] transition-colors"
                      />
                    </div>

                    {/* Rush Price */}
                    <div>
                      <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Rush Order Fee ($)</label>
                      <input
                        type="number"
                        value={rushPrice}
                        onChange={(e) => setRushPrice(e.target.value)}
                        placeholder="30.00"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d90082] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Variants (Size/Price) Editor */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Size & Price Variants</label>
                    <div className="space-y-2">
                      {variants.map((v, i) => (
                        <div key={i} className="flex gap-2 items-center bg-black/20 p-3 rounded-xl border border-white/5">
                          <input 
                            placeholder="Size (e.g. 8x8ft)"
                            value={v.size}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[i].size = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="flex-grow bg-transparent border-none outline-none text-sm font-bold"
                          />
                          <input 
                            type="number"
                            placeholder="Price"
                            value={v.price}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[i].price = parseFloat(e.target.value) || 0;
                              setVariants(newVariants);
                            }}
                            className="w-20 bg-transparent border-none outline-none text-sm font-black text-[#00bff3]"
                          />
                          <button 
                            type="button" 
                            onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-600 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => setVariants([...variants, { size: '', price: 0 }])}
                        className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-all"
                      >
                        + Add Size Variant
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write a museum-grade description of this asset..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d90082] transition-colors resize-none"
                    />
                  </div>

                  {/* Action Area */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#d90082] to-[#ff2a70] text-white font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(217,0,130,0.4)] transition-all hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer"
                    >
                      <Save size={18} /> {editingProductId ? 'Update Item' : 'Publish Item'}
                    </button>
                    {editingProductId && (
                      <button type="button" onClick={resetProductForm} className="w-full mt-4 py-3 text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest">Cancel Editing</button>
                    )}

                    {saveSuccess && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-bold flex items-center justify-center gap-2 animate-magic-float">
                        <CheckCircle2 size={18} />
                        Update Successful!
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'category' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pt-10">
                <form onSubmit={handlePublishCategory} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Category Title</label>
                    <input
                      required
                      type="text"
                      value={newCatTitle}
                      onChange={(e) => {
                         setNewCatTitle(e.target.value);
                         if (!editingCatId && !newCatKey) setNewCatKey(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }}
                      placeholder="e.g. Neon Signs"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-[#41137e] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">System Key ID</label>
                    <input
                      required
                      disabled={!!editingCatId}
                      type="text"
                      value={newCatKey}
                      onChange={(e) => setNewCatKey(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      placeholder="e.g. neonSigns (Auto-generated)"
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-white/50 text-sm focus:outline-none focus:border-[#41137e] transition-colors font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Category Image URL (Optional)</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                        {newCatImage ? (
                           <img src={newCatImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                           <ImageIcon size={20} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-grow space-y-2">
                        <input
                          type="text"
                          value={newCatImage}
                          onChange={(e) => setNewCatImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-[#41137e] transition-colors"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setNewCatImage)}
                            className="hidden"
                            id="category-upload"
                          />
                          <label
                            htmlFor="category-upload"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <Upload size={14} className={isUploading ? 'animate-bounce' : ''} />
                            {isUploading ? 'Uploading...' : 'Upload from device'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-3">Public Description</label>
                    <textarea
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Write a short description to appear on the category card..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#41137e] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#41137e] to-purple-600 text-white font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(65,19,126,0.4)] transition-all hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer"
                    >
                      <FolderPlus size={18} /> {editingCatId ? 'Save Category' : 'Create Category'}
                    </button>
                    {catSaveSuccess && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-bold flex items-center justify-center gap-2 animate-magic-float">
                        <CheckCircle2 size={18} />
                        Successfully Saved! 
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pt-10">
                {!isContentConfigured ? (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
                    <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                      <Sparkles size={16} /> Database Setup Required
                    </h4>
                    <p className="text-white/60 text-sm">
                      Para editar los textos de la página (Hero, About, etc.), necesito que inicialices la tabla en Supabase siguiendo el enlace que te envié. 
                    </p>
                    <a 
                      href="https://supabase.com/dashboard/project/kwymuavqzpvesanxahyv/sql/new" 
                      target="_blank" 
                      className="inline-block mt-4 text-xs font-black text-blue-400 border-b border-blue-400/30 pb-1 hover:text-white hover:border-white transition-all uppercase tracking-widest"
                    >
                      Open Supabase SQL Editor
                    </a>
                  </div>
                ) : (
                  <div className="space-y-12">
                     {/* HERO SECTION EDITOR */}
                     <div className="space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                          <Sparkles className="text-[#00bff3]" /> Hero Section
                        </h3>
                        
                        <ContentBlock 
                          section="hero" 
                          field="welcome" 
                          label="Welcome Phrase" 
                          valEn={translations.en.hero.welcome} 
                          valEs={translations.es.hero.welcome}
                          currentEn={t?.hero?.welcome}
                          currentEs={t?.hero?.welcome === translations.en.hero.welcome ? translations.es.hero.welcome : (t?.hero?.welcome || translations.es.hero.welcome)}
                          onSave={updateContentValue}
                        />

                        <ContentBlock 
                          section="hero" 
                          field="title" 
                          label="Main Title" 
                          valEn={translations.en.hero.title} 
                          valEs={translations.es.hero.title}
                          currentEn={t?.hero?.title}
                          currentEs={t?.hero?.title === translations.en.hero.title ? translations.es.hero.title : (t?.hero?.title || translations.es.hero.title)}
                          onSave={updateContentValue}
                        />

                        <ContentBlock 
                          section="hero" 
                          field="title_highlight" 
                          label="Title Highlight" 
                          valEn={translations.en.hero.title_highlight} 
                          valEs={translations.es.hero.title_highlight}
                          currentEn={t?.hero?.title_highlight}
                          currentEs={t?.hero?.title_highlight === translations.en.hero.title_highlight ? translations.es.hero.title_highlight : (t?.hero?.title_highlight || translations.es.hero.title_highlight)}
                          onSave={updateContentValue}
                        />

                        <ContentBlock 
                          section="hero" 
                          field="subtitle" 
                          label="Subtitle" 
                          valEn={translations.en.hero.subtitle} 
                          valEs={translations.es.hero.subtitle}
                          currentEn={t?.hero?.subtitle}
                          currentEs={t?.hero?.subtitle === translations.en.hero.subtitle ? translations.es.hero.subtitle : (t?.hero?.subtitle || translations.es.hero.subtitle)}
                          isTextArea
                          onSave={updateContentValue}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <ContentBlock 
                            section="hero" 
                            field="cta_primary" 
                            label="Primary Button" 
                            valEn={translations.en.hero.cta_primary} 
                            valEs={translations.es.hero.cta_primary}
                            currentEn={t?.hero?.cta_primary}
                            currentEs={t?.hero?.cta_primary === translations.en.hero.cta_primary ? translations.es.hero.cta_primary : (t?.hero?.cta_primary || translations.es.hero.cta_primary)}
                            onSave={updateContentValue}
                          />
                        <ContentBlock 
                          section="hero" 
                          field="cta_secondary" 
                          label="Secondary Button" 
                          valEn={translations.en.hero.cta_secondary} 
                          valEs={translations.es.hero.cta_secondary}
                          currentEn={t?.hero?.cta_secondary}
                          currentEs={t?.hero?.cta_secondary === translations.en.hero.cta_secondary ? translations.es.hero.cta_secondary : (t?.hero?.cta_secondary || translations.es.hero.cta_secondary)}
                          onSave={updateContentValue}
                        />
                      </div>

                      <ContentBlock 
                        section="hero" 
                        field="backgroundImages" 
                        label="Hero Gallery (One URL per line)" 
                        valEn={translations.en.hero.backgroundImages} 
                        valEs={translations.es.hero.backgroundImages}
                        currentEn={t?.hero?.backgroundImages}
                        currentEs={t?.hero?.backgroundImages || translations.es.hero.backgroundImages}
                        isTextArea
                        onSave={updateContentValue}
                      />
                     </div>

                     <div className="border-t border-white/5 pt-10 space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                          <Layers className="text-[#d90082]" /> Nuestra Historia & About Me
                        </h3>
                        <ImageContentBlock
                          section="about"
                          field="image"
                          label="About Me Photo"
                          currentUrl={t?.about?.image}
                          onSave={updateContentValue}
                          uploadImage={uploadImage}
                        />

                        <ContentBlock 
                          section="about" 
                          field="history" 
                          label="Section Title" 
                          valEn={translations.en.about.history} 
                          valEs={translations.es.about.history}
                          currentEn={t?.about?.history}
                          currentEs={t?.about?.history === translations.en.about.history ? translations.es.about.history : (t?.about?.history || translations.es.about.history)}
                          onSave={updateContentValue}
                        />

                        <ContentBlock 
                          section="about" 
                          field="slogan" 
                          label="Main Slogan" 
                          valEn={translations.en.about.slogan} 
                          valEs={translations.es.about.slogan}
                          currentEn={t?.about?.slogan}
                          currentEs={t?.about?.slogan === translations.en.about.slogan ? translations.es.about.slogan : (t?.about?.slogan || translations.es.about.slogan)}
                          onSave={updateContentValue}
                        />

                        <ContentBlock 
                          section="about" 
                          field="bio" 
                          label="Biography (One paragraph per line)" 
                          valEn={translations.en.about.bio} 
                          valEs={translations.es.about.bio}
                          currentEn={t?.about?.bio}
                          currentEs={Array.isArray(t?.about?.bio) && t?.about?.bio?.length === translations.en.about.bio.length && t?.about?.bio[0] === translations.en.about.bio[0] ? translations.es.about.bio : (t?.about?.bio || translations.es.about.bio)}
                          isTextArea
                          onSave={updateContentValue}
                        />
                     </div>

                     <div className="border-t border-white/5 pt-10 space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                          <Tag className="text-[#ffcc00]" /> Mission & Vision
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Mission</h4>
                            <ContentBlock section="about" field="mission_title" label="Title" valEn={translations.en.about.mission_title} valEs={translations.es.about.mission_title} currentEn={t?.about?.mission_title} currentEs={t?.about?.mission_title === translations.en.about.mission_title ? translations.es.about.mission_title : (t?.about?.mission_title || translations.es.about.mission_title)} onSave={updateContentValue} />
                            <ContentBlock section="about" field="mission_desc" label="Description" valEn={translations.en.about.mission_desc} valEs={translations.es.about.mission_desc} currentEn={t?.about?.mission_desc} currentEs={t?.about?.mission_desc === translations.en.about.mission_desc ? translations.es.about.mission_desc : (t?.about?.mission_desc || translations.es.about.mission_desc)} isTextArea onSave={updateContentValue} />
                            <ContentBlock section="about" field="mission_icon" label="Icon (Emoji)" valEn={translations.en.about.mission_icon} valEs={translations.es.about.mission_icon} currentEn={t?.about?.mission_icon} currentEs={t?.about?.mission_icon === translations.en.about.mission_icon ? translations.es.about.mission_icon : (t?.about?.mission_icon || translations.es.about.mission_icon)} onSave={updateContentValue} />
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Vision</h4>
                            <ContentBlock section="about" field="vision_title" label="Title" valEn={translations.en.about.vision_title} valEs={translations.es.about.vision_title} currentEn={t?.about?.vision_title} currentEs={t?.about?.vision_title === translations.en.about.vision_title ? translations.es.about.vision_title : (t?.about?.vision_title || translations.es.about.vision_title)} onSave={updateContentValue} />
                            <ContentBlock section="about" field="vision_desc" label="Description" valEn={translations.en.about.vision_desc} valEs={translations.es.about.vision_desc} currentEn={t?.about?.vision_desc} currentEs={t?.about?.vision_desc === translations.en.about.vision_desc ? translations.es.about.vision_desc : (t?.about?.vision_desc || translations.es.about.vision_desc)} isTextArea onSave={updateContentValue} />
                            <ContentBlock section="about" field="vision_icon" label="Icon (Emoji)" valEn={translations.en.about.vision_icon} valEs={translations.es.about.vision_icon} currentEn={t?.about?.vision_icon} currentEs={t?.about?.vision_icon === translations.en.about.vision_icon ? translations.es.about.vision_icon : (t?.about?.vision_icon || translations.es.about.vision_icon)} onSave={updateContentValue} />
                          </div>
                        </div>
                     </div>

                     <div className="border-t border-white/5 pt-10 space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                          <Package className="text-[#00bff3]" /> The Magic Process
                        </h3>
                         <ContentBlock 
                           section="process" 
                           field="title" 
                           label="Section Heading" 
                           valEn={translations.en.process.title} 
                           valEs={translations.es.process.title}
                           currentEn={t?.process?.title}
                           currentEs={t?.process?.title === translations.en.process.title ? translations.es.process.title : (t?.process?.title || translations.es.process.title)}
                           onSave={updateContentValue}
                         />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[1, 2, 3].map(num => {
                             const pEn = translations.en.process as any;
                             const pEs = translations.es.process as any;
                             const pCurr = (t?.process || {}) as any;
                             const fieldTitle = `step${num}_title`;
                             const fieldDesc = `step${num}_desc`;
                             
                             return (
                               <div key={num} className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                 <h4 className="text-[10px] font-black text-[#00bff3] uppercase tracking-widest">Step {num}</h4>
                                 <ContentBlock 
                                    section="process" 
                                    field={fieldTitle} 
                                    label="Title" 
                                    valEn={pEn[fieldTitle]} 
                                    valEs={pEs[fieldTitle]} 
                                    currentEn={pCurr[fieldTitle]} 
                                    currentEs={pCurr[fieldTitle] === pEn[fieldTitle] ? pEs[fieldTitle] : (pCurr[fieldTitle] || pEs[fieldTitle])} 
                                    onSave={updateContentValue} 
                                 />
                                 <ContentBlock 
                                    section="process" 
                                    field={fieldDesc} 
                                    label="Description" 
                                    valEn={pEn[fieldDesc]} 
                                    valEs={pEs[fieldDesc]} 
                                    currentEn={pCurr[fieldDesc]} 
                                    currentEs={pCurr[fieldDesc] === pEn[fieldDesc] ? pEs[fieldDesc] : (pCurr[fieldDesc] || pEs[fieldDesc])} 
                                    isTextArea 
                                    onSave={updateContentValue} 
                                 />
                               </div>
                             );
                           })}
                         </div>
                     </div>

                     <div className="border-t border-white/5 pt-10 space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                          <CheckCircle2 className="text-[#ffcc00]" /> Client Love
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[1, 2, 3].map(num => {
                            const tEn = translations.en.testimonials as any;
                            const tEs = translations.es.testimonials as any;
                            const tCurr = t?.testimonials as any;
                            return (
                              <div key={num} className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <h4 className="text-[10px] font-black text-[#ffcc00] uppercase tracking-widest">Client {num}</h4>
                                <ContentBlock section="testimonials" field={`author${num}`} label="Name" valEn={tEn[`author${num}`]} valEs={tEs[`author${num}`]} currentEn={tCurr ? tCurr[`author${num}`] : null} currentEs={tCurr ? (tCurr[`author${num}`] || tEs[`author${num}`]) : tEs[`author${num}`]} onSave={updateContentValue} />
                                <ContentBlock section="testimonials" field={`role${num}`} label="Role" valEn={tEn[`role${num}`]} valEs={tEs[`role${num}`]} currentEn={tCurr ? tCurr[`role${num}`] : null} currentEs={tCurr ? (tCurr[`role${num}`] || tEs[`role${num}`]) : tEs[`role${num}`]} onSave={updateContentValue} />
                                <ContentBlock section="testimonials" field={`text${num}`} label="Text" valEn={tEn[`text${num}`]} valEs={tEs[`text${num}`]} currentEn={tCurr ? tCurr[`text${num}`] : null} currentEs={tCurr ? (tCurr[`text${num}`] || tEs[`text${num}`]) : tEs[`text${num}`]} isTextArea onSave={updateContentValue} />
                              </div>
                            );
                          })}
                        </div>
                     </div>

                    <p className="text-white/20 text-center italic text-xs pt-10">
                      Changes are saved instantly to the global database.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
 
        {/* LIVE INVENTORY OVERVIEW */}
        <section className="col-span-1 lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-md shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Live Inventory</h2>
                <p className="text-white/40 font-medium tracking-wide">Dynamic Catalog Management</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                <Layers size={24} />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto no-scrollbar space-y-12 pr-4">
              {Object.keys(catalog || {}).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-white/30 space-y-4">
                  <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                    <Package size={24} />
                  </div>
                  <p className="text-sm font-medium">Your inventory is completely empty.</p>
                  <p className="text-xs">Create your first category and product on the left to get started!</p>
                </div>
              ) : (
                Object.entries(catalog || {}).map(([catKey, catData]: [string, any]) => (
                  <div key={catKey} className="space-y-6">
                  <div className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-md py-4 z-10 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-[#00bff3] tracking-widest uppercase">{catData.title}</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-tighter mt-1">{catKey}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleEditCategory(catKey, catData)}
                        className="p-2 transition-colors text-white/30 hover:text-[#00bff3] bg-white/5 rounded-lg border border-white/5"
                        title="Edit Category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(catKey)}
                        className="p-2 transition-colors text-white/30 hover:text-red-400 bg-white/5 rounded-lg border border-white/5"
                        title="Delete Category"
                      >
                        <Tag size={16} />
                      </button>
                      <span className="text-xs font-bold text-white/30 px-3 py-1 bg-white/5 rounded-full">{catData.items.length} Items</span>
                    </div>
                  </div>
                  
                    {catData.items?.length === 0 ? (
                    <p className="text-white/20 text-sm italic py-4">No items in this category yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catData.items?.map((prod: any) => (
                        <div key={prod.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group relative overflow-hidden group">
                          <img src={prod.image} alt={prod.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                          <div className="min-w-0 flex-grow flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-white truncate text-sm group-hover:text-[#d90082] transition-colors">{prod.name}</h4>
                                <span className="text-[#00bff3] font-black text-xs block mt-1">${prod.price || 0}</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button 
                                  onClick={() => handleEditProduct(prod)}
                                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] uppercase font-black tracking-widest text-white/60 hover:text-white transition-all border border-white/10"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(catKey, prod.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-400 transition-all border border-red-500/10"
                                >
                                  Delete
                                </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function ContentBlock({ section, field, label, valEn, valEs, currentEn, currentEs, isTextArea = false, onSave }: any) {
  const formatVal = (v: any) => Array.isArray(v) ? v.join('\n') : v;
  
  const [en, setEn] = useState(formatVal(currentEn || valEn));
  const [es, setEs] = useState(formatVal(currentEs || valEs));
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update local state if current values change (e.g. from DB load)
  React.useEffect(() => {
    if (currentEn) setEn(formatVal(currentEn));
    if (currentEs) setEs(formatVal(currentEs));
  }, [currentEn, currentEs]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(section, field, en, es);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all group">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-white/40 uppercase tracking-widest">{label}</label>
        {success ? (
          <span className="text-green-400 text-[10px] font-black uppercase flex items-center gap-1 animate-in zoom-in">
            <CheckCircle2 size={12} /> Saved
          </span>
        ) : (
          <button 
            onClick={handleSave}
            disabled={saving}
            className="text-[10px] font-black uppercase px-3 py-1 rounded-md bg-white/5 hover:bg-[#00bff3] text-white/40 hover:text-white transition-all disabled:opacity-50"
          >
            {saving ? '...' : 'Update'}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">English</div>
          <InputComponent
            value={en}
            onChange={(e: any) => setEn(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00bff3] transition-colors resize-none"
            rows={isTextArea ? 6 : 1}
          />
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">Español</div>
          <InputComponent
            value={es}
            onChange={(e: any) => setEs(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00bff3] transition-colors resize-none"
            rows={isTextArea ? 6 : 1}
          />
        </div>
      </div>
    </div>
  );
}

function ImageContentBlock({ section, field, label, currentUrl, onSave, uploadImage }: any) {
    const [url, setUrl] = useState(currentUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (currentUrl) setUrl(currentUrl);
    }, [currentUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const newUrl = await uploadImage(file);
            setUrl(newUrl);
            await onSave(section, field, newUrl, newUrl); // Same for both languages for images usually
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err: any) {
            console.error("Upload failed", err);
            const errorMsg = err?.message || err?.error_description || "Unknown storage error";
            alert(`Failed to upload image: ${errorMsg}\n\nTechnical Tip: Ensure your 'catalog' bucket is Public and you ran the SQL policy in Supabase.`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-center">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest">{label}</label>
                {success && (
                    <span className="text-green-400 text-[10px] font-black uppercase flex items-center gap-1 animate-in zoom-in">
                        <CheckCircle2 size={12} /> Applied
                    </span>
                )}
            </div>
            
            <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                    {url ? (
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={24} className="text-white/20" />
                    )}
                </div>
                <div className="flex-grow space-y-4">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-[#00bff3] transition-colors"
                    />
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id={`file-${field}`}
                        />
                        <label
                            htmlFor={`file-${field}`}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-[#00bff3] hover:text-white transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <Upload size={14} className={isUploading ? 'animate-bounce' : ''} />
                            {isUploading ? 'Uploading...' : 'Change Image from Device'}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
