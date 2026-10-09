'use client';

import { useState } from 'react';
import { Upload, X, Sparkles, Calendar, User, Mail, Phone, PartyPopper, CheckCircle, ImagePlus } from 'lucide-react';
import { useLanguage } from '../../context/ProductContext';

const EVENT_TYPES = [
  { value: 'birthday', en: 'Birthday', es: 'Cumpleaños' },
  { value: 'wedding', en: 'Wedding', es: 'Boda' },
  { value: 'quinceanera', en: 'Quinceañera', es: 'Quinceañera' },
  { value: 'baby-shower', en: 'Baby Shower', es: 'Baby Shower' },
  { value: 'graduation', en: 'Graduation', es: 'Graduación' },
  { value: 'corporate', en: 'Corporate', es: 'Corporativo' },
  { value: 'other', en: 'Other', es: 'Otro' },
];

const BUDGET_RANGES = [
  { value: '', en: 'Prefer not to say', es: 'Prefiero no decir' },
  { value: 'under-500', en: 'Under $500', es: 'Menos de $500' },
  { value: '500-1000', en: '$500 – $1,000', es: '$500 – $1,000' },
  { value: '1000-2500', en: '$1,000 – $2,500', es: '$1,000 – $2,500' },
  { value: '2500-plus', en: 'Over $2,500', es: 'Más de $2,500' },
];

const inputClass = 'w-full bg-white border-2 border-pink-100 rounded-2xl px-5 py-3.5 text-slate-800 font-medium outline-none focus:border-[#d90082] transition-colors placeholder:text-slate-400 placeholder:font-normal';

export default function QuotePage() {
  const { language } = useLanguage();
  const en = language === 'en';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('birthday');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [waUrl, setWaUrl] = useState('');
  const [waText, setWaText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    const combined = [...files, ...incoming].slice(0, 5);
    if (incoming.length > 0 && files.length + incoming.length > 5) {
      // silently capped at 5
    }
    setFiles(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(waText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (files.length === 0) {
      setError(en ? 'Please add at least one inspiration photo.' : 'Por favor agrega al menos una foto de inspiración.');
      return;
    }
    setSubmitting(true);
    try {
      const request = {
        id: `QTE-${Date.now().toString(36).toUpperCase()}`,
        name,
        email,
        phone,
        eventDate,
        eventType,
        budget,
        description,
        photoCount: files.length,
        photoNames: files.map(f => f.name),
        createdAt: new Date().toISOString(),
      };
      // Save a local copy in this browser
      const key = 'magicprintsandballoons_quote_requests';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(request);
      localStorage.setItem(key, JSON.stringify(existing));

      // Email the quote to the business via Resend so the lead is never lost,
      // even if the customer never presses send in WhatsApp.
      try {
        const emailRes = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        if (!emailRes.ok) {
          console.warn('Quote email failed, WhatsApp remains the delivery channel.');
        }
      } catch (emailErr) {
        console.warn('Quote email failed, WhatsApp remains the delivery channel.', emailErr);
      }

      // Deliver the quote to the business instantly via WhatsApp. localStorage
      // alone never reaches us, so the request is opened as a WhatsApp chat
      // with every detail prefilled — the customer just presses send, then
      // sends the inspiration photos in the same chat.
      const eventLabel = EVENT_TYPES.find(t => t.value === eventType)?.en ?? eventType;
      const budgetLabel = BUDGET_RANGES.find(b => b.value === budget)?.en ?? '';
      const waLines = [
        `New quote request ${request.id} - magicprintsandballoons.vercel.app`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Event: ${eventLabel} on ${eventDate}`,
        budgetLabel ? `Budget: ${budgetLabel}` : null,
        ``,
        `Details: ${description}`,
        ``,
        `Inspiration photos: ${files.length} (sending them in this chat next)`,
      ].filter(Boolean).join('\n');
      const url = `https://wa.me/18179415183?text=${encodeURIComponent(waLines)}`;
      setWaText(waLines);
      setWaUrl(url);
      setCopied(false);
      window.open(url, '_blank', 'noopener');
      setSuccess(true);
    } catch {
      setError(en ? 'Something went wrong. Please try again.' : 'Algo salió mal. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {en ? 'Request received!' : '¡Solicitud recibida!'}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            {en
              ? 'Almost done! We opened WhatsApp with your request details ready — just press send there, then send your inspiration photos in the same chat and we\'ll get back to you with a custom quote.'
              : '¡Ya casi! Abrimos WhatsApp con los detalles de tu solicitud listos — solo presiona enviar ahí y luego manda tus fotos de inspiración en el mismo chat y te contactaremos con una cotización personalizada.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#d90082] text-white font-extrabold hover:bg-[#b0006b] transition-colors shadow-lg shadow-pink-200"
              >
                {en ? 'Open WhatsApp' : 'Abrir WhatsApp'}
              </a>
            )}
            <button
              type="button"
              onClick={copyDetails}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-pink-200 text-[#d90082] font-extrabold hover:bg-[#fdf2f8] transition-colors"
            >
              {copied ? (en ? 'Copied!' : '¡Copiado!') : (en ? 'Copy request details' : 'Copiar detalles')}
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-8">
            {en
              ? 'Didn\'t see WhatsApp open? Use the button above, or copy the details and send them to us at (817) 941-5183.'
              : '¿No se abrió WhatsApp? Usa el botón de arriba, o copia los detalles y envíalos al (817) 941-5183.'}
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setName(''); setEmail(''); setPhone(''); setEventDate('');
              setEventType('birthday'); setBudget(''); setDescription('');
              setFiles([]); setPreviews([]);
              setWaUrl(''); setWaText(''); setCopied(false);
            }}
            className="text-[#d90082] font-bold hover:underline"
          >
            {en ? 'Send another request' : 'Enviar otra solicitud'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-28 pb-10 px-6" style={{ background: 'linear-gradient(180deg, #fdf2f8 0%, #ffffff 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d90082]/10 text-[#d90082] font-bold text-xs uppercase tracking-[0.2em] mb-5">
            <Sparkles className="w-4 h-4" />
            {en ? 'Custom Decoration Quotes' : 'Cotizaciones de Decoración'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            {en ? 'Get a Custom Decoration Quote' : 'Cotización para tu Decoración'}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {en
              ? 'Planning a party and want a full decoration? Show us the styles you love — upload inspiration photos from Pinterest or anywhere — tell us about your event, and we\'ll put together a custom quote for you.'
              : '¿Planeando una fiesta y quieres una decoración completa? Muéstranos los estilos que te gustan — sube fotos de inspiración de Pinterest o de donde sea — cuéntanos de tu evento y te preparamos una cotización a tu medida.'}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-3xl border border-pink-100 shadow-xl shadow-pink-100/50 p-6 md:p-10 space-y-8">

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-[#d90082]" />
              {en ? 'Your information' : 'Tus datos'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required value={name} onChange={e => setName(e.target.value)} placeholder={en ? 'Full name' : 'Nombre completo'} className={inputClass} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={en ? 'Email address' : 'Correo electrónico'} className={inputClass} />
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={en ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'} className={inputClass} />
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className={`${inputClass} pl-12`} aria-label={en ? 'Event date' : 'Fecha del evento'} />
              </div>
            </div>
          </div>

          {/* Event type + budget */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-[#d90082]" />
              {en ? 'About your event' : 'Sobre tu evento'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">{en ? 'Event type' : 'Tipo de evento'}</label>
                <select value={eventType} onChange={e => setEventType(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  {EVENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{en ? t.en : t.es}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">{en ? 'Budget (optional)' : 'Presupuesto (opcional)'}</label>
                <select value={budget} onChange={e => setBudget(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  {BUDGET_RANGES.map(b => (
                    <option key={b.value} value={b.value}>{en ? b.en : b.es}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inspiration photos */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-[#d90082]" />
              {en ? 'Inspiration photos' : 'Fotos de inspiración'}
            </h2>
            <p className="text-slate-500 text-sm mb-5">
              {en
                ? 'Upload 1–5 photos of decorations you like (from Pinterest, Instagram, anywhere). This helps us understand your style.'
                : 'Sube de 1 a 5 fotos de decoraciones que te gusten (de Pinterest, Instagram, donde sea). Esto nos ayuda a entender tu estilo.'}
            </p>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden aspect-square border border-pink-100">
                    <img src={src} alt={`inspiration-${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#d90082]"
                      aria-label={en ? 'Remove photo' : 'Quitar foto'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length < 5 && (
              <label className="block border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:bg-[#fdf2f8] hover:border-[#d90082]/50 transition-all cursor-pointer">
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                <Upload className="w-8 h-8 mx-auto mb-3 text-[#d90082]" />
                <p className="font-bold text-slate-800">
                  {en ? `Add photos (${files.length}/5)` : `Agregar fotos (${files.length}/5)`}
                </p>
                <p className="text-slate-500 text-sm mt-1">JPG, PNG — {en ? 'up to 5' : 'hasta 5'}</p>
              </label>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xl font-bold text-slate-900 mb-2">
              {en ? 'Tell us about your event' : 'Cuéntanos de tu evento'}
            </label>
            <p className="text-slate-500 text-sm mb-4">
              {en
                ? 'What do you want? Colors, theme, venue, how many guests — anything that helps us quote you right.'
                : '¿Qué quieres? Colores, tema, lugar, cuántos invitados — todo lo que nos ayude a cotizarte bien.'}
            </p>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder={en
                ? 'Example: Quinceañera for 100 guests, pink and gold theme, need backdrop, balloon garland and photo board...'
                : 'Ejemplo: Quinceañera para 100 invitados, tema rosa y dorado, necesito backdrop, guirnalda de globos y photo board...'}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="text-[#d90082] font-bold text-sm bg-[#fdf2f8] border border-pink-200 rounded-2xl px-5 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 rounded-full bg-[#d90082] text-white font-extrabold text-lg hover:bg-[#b0006b] transition-colors shadow-lg shadow-pink-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            {submitting ? (en ? 'Sending...' : 'Enviando...') : (en ? 'Request My Quote' : 'Pedir Mi Cotización')}
          </button>
          <p className="text-xs text-center text-slate-400">
            {en
              ? 'We usually reply within 24 hours. Pickup in Arlington, TX — local delivery in DFW, shipping nationwide.'
              : 'Normalmente respondemos en 24 horas. Pickup en Arlington, TX — delivery local en DFW, envío nacional.'}
          </p>
        </form>
      </section>
    </div>
  );
}
