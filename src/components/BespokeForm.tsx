'use client';

import { useState } from 'react';
import { Upload, Sparkles, Calendar, MapPin, Building2, User, Mail, Phone, ArrowRight, Tag } from 'lucide-react';

import { useProducts, useLanguage } from '../context/ProductContext';

export default function BespokeForm() {
  const { uploadImage, cart, cartTotal, clearCart } = useProducts();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 10) {
        alert("Puedes subir un máximo de 10 archivos. / You can upload a maximum of 10 files.");
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
        fileUrls,
        cart,
        cartTotal,
      };

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send email');
      
      setSuccess(true);
      clearCart();
      setSelectedFiles([]);
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error.message || (language === 'en' ? 'There was a problem sending your request. Please try again.' : 'Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.'));
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <section className="py-24 bg-[#0f172a]" id="bespoke-quote">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#cc004e]/10 text-[#cc004e] font-black text-xs tracking-widest uppercase mb-6 border border-[#cc004e]/20">
            <Sparkles size={14} /> Custom & Bulk Orders
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tighter text-white">
            Bespoke <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a70] to-[#f9a826]">Quote.</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            {language === 'en' ? 'Planning an event or recurring prints for your agency? Tell us what you need and attach your inspiration. We will prepare a custom quote.' : '¿Planeando un evento monumental o necesitas impresiones recurrentes para tu agencia? Sube tu inspiración y nuestro equipo VIP te enviará una cotización exacta en menos de 24 horas.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Trust Signals */}
          <div className="lg:sticky lg:top-32 space-y-12">

            <div className="bg-white/5 rounded-3xl p-8 shadow-sm border border-white/10 flex gap-6 items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow">
               <div className="w-16 h-16 rounded-2xl bg-[#ff2a70]/10 flex items-center justify-center shrink-0">
                <Calendar className="text-[#ff2a70]" size={32} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">{language === 'en' ? 'Rush Production (24–48h)' : 'Tiempos Express (24-48h)'}</h3>
                 <p className="text-white/60 font-light leading-relaxed">{language === 'en' ? 'Event deadlines matter. Ask us about rush availability for your project.' : 'Sabemos que en la industria de eventos los tiempos son críticos. Contamos con turnos de producción ininterrumpida para no fallarte nunca.'}</p>
               </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-8 shadow-sm border border-white/10 flex gap-6 items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow">
               <div className="w-16 h-16 rounded-2xl bg-[#f9a826]/10 flex items-center justify-center shrink-0">
                <Sparkles className="text-[#f9a826]" size={32} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">{language === 'en' ? 'Large Birthdays & Baby Showers' : 'Cumpleaños y Baby Showers Grandes'}</h3>
                 <p className="text-white/60 font-light leading-relaxed">{language === 'en' ? 'We also create complete decor packages for large birthdays and baby showers. Ask for a custom quote.' : <>También producimos decoraciones completas para eventos sociales premium. Pide una cotización personalizada.</>}</p>
               </div>
            </div>
          </div>

          {/* Right Side: Dynamic Form */}
          <div className="bg-black/40 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden backdrop-blur-md">
            
            {/* Decorative Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#ff2a70]/20 to-[#00f2fe]/20 rounded-full blur-[80px] pointer-events-none"></div>

            {success ? (
              <div className="text-center py-20 relative z-10">
                <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">{language === 'en' ? 'Your request is on its way!' : '¡Magia en camino!'}</h2>
                <p className="text-white/70 font-light text-lg mb-8">{language === 'en' ? 'We received your request and will contact you with a custom quote.' : 'Hemos recibido tu solicitud. Nuestro equipo VIP elaborará tu cotización bespoke y te contactará en breve.'}</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-[#ff2a70] font-bold hover:underline"
                >
                  {language === 'en' ? 'Send another request' : 'Enviar otra solicitud'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                {cart && cart.length > 0 && (
                  <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#d90082]/10 flex items-center justify-center text-[#d90082]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </span>
                      {language === 'en' ? 'Configured Products' : 'Resumen de Cotización'}
                    </h3>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 items-center justify-between border-b border-white/5 pb-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.product.image} className="w-10 h-10 rounded-lg object-cover border border-white/5" alt={item.product.name} />
                            <div>
                              <h4 className="font-bold text-white">{item.product.name}</h4>
                              <p className="text-white/40 mt-0.5">
                                Size: {item.config?.variant?.size || 'Default'} | Mat: {item.config?.material}
                                {item.config?.isRushOrder && " | Rush"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-white/50">Qty: {item.quantity}</span>
                            <span className="font-black text-[#00bff3] ml-3">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3 text-sm font-black uppercase text-[#d90082]">
                        <span>{language === 'en' ? 'Estimated Total:' : 'Total Estimado:'}</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                <h2 className="text-2xl font-black text-white mb-2">{language === 'en' ? '1. Contact Details' : '1. Detalles del Cliente'}</h2>
                
                {/* Row 1: Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><User size={14}/> {language === 'en' ? 'Full Name' : 'Nombre Completo'}</label>
                    <input required name="name" type="text" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" placeholder={language === 'en' ? 'e.g. Your name' : 'Ej. Yndira P.'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Building2 size={14}/> {language === 'en' ? 'Company / Agency' : 'Empresa / Agency'}</label>
                    <input name="company" type="text" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" placeholder={language === 'en' ? 'Optional' : 'Opcional'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Mail size={14}/> {language === 'en' ? 'Email Address' : 'Correo Electrónico'}</label>
                    <input required name="email" type="email" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" placeholder="hello@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Phone size={14}/> {language === 'en' ? 'Phone (WhatsApp)' : 'Teléfono (WhatsApp)'}</label>
                    <input required name="phone" type="tel" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-2 pt-4 border-t border-white/10">{language === 'en' ? '2. Event Details' : '2. Información del Evento'}</h2>

                {/* Row 2: Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Calendar size={14}/> {language === 'en' ? 'Event Date' : 'Fecha del Evento'}</label>
                    <input required name="eventDate" type="date" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><MapPin size={14}/> Zip Code / Venue</label>
                    <input required name="location" type="text" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" placeholder={language === 'en' ? 'For delivery or pickup' : 'Para envío o pickup'} />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Sparkles size={14}/> {language === 'en' ? 'Estimated Budget' : 'Presupuesto Estimado'}</label>
                    <select required name="budget" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all cursor-pointer">
                      <option value="" disabled selected>{language === 'en' ? 'Select your budget range...' : 'Selecciona tu rango de presupuesto...'}</option>
                      <option value="bajo_1000">{language === 'en' ? 'Under $1,000 USD' : 'Menos de $1,000 USD'}</option>
                      <option value="rango_1000_2500">{language === 'en' ? '$1,000–$2,500 USD' : '$1,000 - $2,500 USD'}</option>
                      <option value="rango_2500_5000">{language === 'en' ? '$2,500–$5,000 USD' : '$2,500 - $5,000 USD'}</option>
                      <option value="medio_5000_10000">$5,000 - $10,000 USD</option>
                      <option value="alto_10000_mas">{language === 'en' ? 'Over $10,000 USD' : 'Más de $10,000 USD'}</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> {language === 'en' ? 'Planner Code (optional)' : 'Código de Vendedor o Planner (Opcional - 5% Descuento)'}</label>
                    <input name="promoCode" type="text" className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all" placeholder="Ej. SARAH5" />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-2 pt-4 border-t border-white/10">{language === 'en' ? '3. What You Need' : '3. Requerimientos B2B'}</h2>

                {/* What do they need? */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 block">{language === 'en' ? 'What do you need printed? (Select all that apply)' : '¿Qué necesitas imprimir? (Selecciona múltiples)'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Floor Wrap', 'Backdrop Boards', 'Cylinder Covers', 'Custom Cut-outs', 'Circle Signs', 'Banners', 'Corporate Merch', 'Otro'].map(item => (
                      <label key={item} className="flex items-center gap-2 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                        <input type="checkbox" name="needs" value={item} className="w-4 h-4 text-[#ff2a70] border-slate-600 rounded bg-[#0f172a] focus:ring-[#ff2a70]" />
                        <span className="text-sm text-white/80 font-medium">{item === 'Otro' && language === 'en' ? 'Other' : item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Upload Zone */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <label className="text-sm font-bold text-white/80 block">{language === 'en' ? 'Attach Files / Inspiration' : 'Adjuntar Archivos / Inspiración'}</label>
                  <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-[#ff2a70]/50 transition-all cursor-pointer group bg-black/20 relative">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.ai" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#ff2a70]/20 transition-colors">
                      <Upload size={20} className="text-white/40 group-hover:text-[#ff2a70]" />
                    </div>
                    <p className="text-white font-medium mb-1">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} ${language === 'en' ? 'files selected' : 'archivos seleccionados'}` : (language === 'en' ? 'Click or drag files here' : 'Haz clic o arrastra tus archivos aquí')}
                    </p>
                    <p className="text-white/40 text-sm font-light">{language === 'en' ? 'Inspiration photos or print-ready artwork. Up to 10 files / 50MB.' : 'Fotos de inspiración, artes finales. Máx 10 archivos / 50MB.'}</p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/60 flex items-center gap-2">
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isSubmitting && uploadProgress > 0 && (
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
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
                  <label className="text-sm font-bold text-white/80 block">{language === 'en' ? 'Tell us more about your project...' : 'Cuéntanos más sobre tu visión mágica...'}</label>
                  <textarea name="notes" rows={4} className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a70]/50 focus:bg-[#0f172a] transition-all resize-none italic placeholder:text-white/30" placeholder={language === 'en' ? 'Include dimensions, installation needs, and other details...' : 'Ingresa las medidas exactas si las tienes, requerimientos especiales de instalación, etc...'}></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#cc004e] to-[#8f2d56] text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(204,0,78,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (language === 'en' ? 'Sending...' : 'Procesando Magia...') : (language === 'en' ? 'Request a Custom Quote' : 'Solicitar Cotización VIP')}
                  {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                <p className="text-xs text-center text-white/50 font-medium">{language === 'en' ? 'We will use your details to respond to your quote request.' : 'Tus datos están seguros. Respuesta en menos de 24h laborables.'}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
