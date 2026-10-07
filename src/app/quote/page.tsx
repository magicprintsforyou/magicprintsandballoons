'use client';

import { useState } from 'react';
import { Upload, Sparkles, Calendar, MapPin, Building2, User, Mail, Phone, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';

import { useProducts } from '../../context/ProductContext';

export default function QuotePage() {
  const { t, uploadImage } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 10) {
        alert("You can upload a maximum of 10 files.");
        setSelectedFiles(files.slice(0, 10));
      } else {
        setSelectedFiles(files);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // 1. Upload files first
      const fileUrls: string[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
        const url = await uploadImage(selectedFiles[i], 'client-assets');
        fileUrls.push(url);
      }

            const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        eventDate: formData.get('eventDate'),
        location: formData.get('location'),
        budget: formData.get('budget'),
        promoCode: formData.get('promoCode'),
        needs: formData.getAll('needs'),
        notes: formData.get('notes'),
        fileUrls, // Send the uploaded links
      };// 2. Send Email
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send email');
      
      setSuccess(true);
      setSelectedFiles([]);
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error.message || 'Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left Side: Sales Pitch & Trust Signals */}
        <div className="lg:sticky lg:top-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#cc004e]/10 text-[#cc004e] font-black text-xs tracking-widest uppercase mb-6 border border-[#cc004e]/20">
            <Sparkles size={14} /> Bespoke & Volume Productions
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter text-[#0f172a]">
            <span className="text-white drop-shadow-lg">{t?.quote?.dream || 'You Visualize.'}</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#ffcc00] drop-shadow-[0_0_20px_rgba(217,0,130,0.3)] italic">
              {t?.quote?.print || 'We Materialize.'}
            </span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl font-light italic leading-relaxed">
            "{t?.quote?.desc || 'Handling a large-scale production? Our VIP logistics team ensures a bespoke quote and a flawless plan in record time.'}"
          </p>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]">
            <Sparkles size={20} /> {t?.quote?.express || 'Record Turnaround (24-48h)'}
          </div>
        
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <Sparkles className="text-[#f9a826] animate-pulse" size={18} /> 
              Cumpleaños y Baby Showers Grandes
            </h4>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              También producimos decoraciones completas para eventos sociales premium. Pide una cotización personalizada.
            </p>
          </div>
        </div>{/* Right Side: Dynamic Form */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100 relative overflow-hidden">

          {/* Decorative Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#ff2a70]/20 to-[#00f2fe]/20 rounded-full blur-[80px] pointer-events-none"></div>

          {success ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-black text-[#0f172a] mb-4">Magic is on its way!</h2>
              <p className="text-slate-600 font-light text-lg mb-8">We have received your request. Our VIP production team will craft your bespoke quote and contact you shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="text-[#ff2a70] font-bold hover:underline"
              >
                'Send another request'
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <h2 className="text-2xl font-black text-[#0f172a] mb-2">
                Tell us about your Vision
              </h2>

              {/* Row 1: Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input required name="name" type="text" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" placeholder="e.g. Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Building2 size={14} /> Company / Agency
                  </label>
                  <input name="company" type="text" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={14} /> Email Address
                  </label>
                  <input required name="email" type="email" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" placeholder="hello@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Phone size={14} /> 'Phone (WhatsApp)'
                  </label>
                  <input required name="phone" type="tel" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              {/* Row 2: Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={14} /> Event Date
                  </label>
                  <input required name="eventDate" type="date" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MapPin size={14} /> Zip Code / Event Location
                  </label>
                  <input required name="location" type="text" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" placeholder="For shipping or installation" />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Sparkles size={14}/> Presupuesto Estimado / Budget</label>
                  <select required name="budget" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all cursor-pointer">
                    <option value="" disabled selected>Selecciona tu rango de presupuesto...</option>
                    <option value="bajo_1000">Menos de $1,000 USD</option>
                    <option value="rango_1000_2500">$1,000 - $2,500 USD</option>
                    <option value="rango_2500_5000">$2,500 - $5,000 USD</option>
                    <option value="medio_5000_10000">$5,000 - $10,000 USD</option>
                    <option value="alto_10000_mas">Más de $10,000 USD</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Vendor or Planner Code (Optional - 5% Discount)</label>
                  <input name="promoCode" type="text" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all" placeholder="e.g. SARAH5" />
                </div>
              </div>

              {/* What do they need? */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 block">
                  What do you need printed? (Select multiples)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Dance Floors', 'Backdrops', 'Cylinder Wraps', 'Pedestals', 'Round Signs', 'Banners', 'Corporate Merch', 'Other'].map(item => (
                    <label key={item} className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="checkbox" name="needs" value={item} className="w-4 h-4 text-[#ff2a70] border-slate-300 rounded focus:ring-[#ff2a70]" />
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 block">
                  Attach Files / Inspiration
                </label>
                <div className="space-y-4">
                  <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-[#ff2a70]/50 transition-all cursor-pointer group bg-white relative">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.ai" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#ff2a70]/10 transition-colors pointer-events-none">
                      <Upload size={20} className="text-slate-400 group-hover:text-[#ff2a70]" />
                    </div>
                    <p className="text-[#0f172a] font-medium mb-1 pointer-events-none">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Tap to upload or drag files here'}
                    </p>
                    <p className="text-slate-500 text-sm font-light pointer-events-none">
                      Inspiration photos, final art (PDF, AI, PNG). Max 10 files / 50MB.
                    </p>
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 flex items-center gap-2">
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isSubmitting && uploadProgress > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#ff2a70] to-[#00f2fe] h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">
                  Additional Details / Measurements
                </label>
                <textarea name="notes" rows={4} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-white transition-all resize-none" placeholder="Enter exact measurements if known, special requirements, etc..."></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-[#0f172a] text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-[#ff2a70] transition-all shadow-[0_10px_30px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_30px_rgba(255,42,112,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting
                  ? 'Processing Magic...'
                  : 'Request VIP Quote'}
                {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
              <p className="text-xs text-center text-slate-500 font-medium">
                Your data is secure. Response in less than 24 business hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
