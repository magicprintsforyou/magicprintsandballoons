"use client";

import React, { useState } from 'react';
import { Upload, Sparkles, Check, ArrowRight, Image as ImageIcon, Ruler, Layers, UserCheck, Mail } from 'lucide-react';

export default function AIInspirationMockup() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);
  const [category, setCategory] = useState<'backdrop' | 'retractable' | 'floor' | 'cutout'>('backdrop');
  const [selectedSize, setSelectedSize] = useState<string>('8x8');
  const [posY, setPosY] = useState<number>(50);
  const [zoom, setZoom] = useState<number>(100);

  // Modal Email Form state for quote requests
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const sizesByCategory: Record<string, Array<{ id: string; labelEn: string; labelEs: string; ratioW: number; ratioH: number; heightFt: number }>> = {
    backdrop: [
      { id: '4x5', labelEn: '4 x 5 ft Photo Backdrop', labelEs: 'Backdrop 4 x 5 pies', ratioW: 4, ratioH: 5, heightFt: 5 },
      { id: '4x6', labelEn: '4 x 6 ft Photo Backdrop', labelEs: 'Backdrop 4 x 6 pies', ratioW: 4, ratioH: 6, heightFt: 6 },
      { id: '4x7', labelEn: '4 x 7 ft Photo Backdrop', labelEs: 'Backdrop 4 x 7 pies', ratioW: 4, ratioH: 7, heightFt: 7 },
      { id: '4x8', labelEn: '4 x 8 ft Photo Backdrop', labelEs: 'Backdrop 4 x 8 pies', ratioW: 4, ratioH: 8, heightFt: 8 },
      { id: '6x6', labelEn: '6 x 6 ft Photo Backdrop', labelEs: 'Backdrop 6 x 6 pies', ratioW: 6, ratioH: 6, heightFt: 6 },
      { id: '7x7', labelEn: '7 x 7 ft Photo Backdrop', labelEs: 'Backdrop 7 x 7 pies', ratioW: 7, ratioH: 7, heightFt: 7 },
      { id: '8x8', labelEn: '8 x 8 ft Photo Backdrop', labelEs: 'Backdrop 8 x 8 pies', ratioW: 8, ratioH: 8, heightFt: 8 },
    ],
    retractable: [
      { id: '33x83', labelEn: '33" W x 83" H Retractable Banner', labelEs: 'Banner Retráctil Roll-Up (33" W x 83" H)', ratioW: 2.75, ratioH: 6.9, heightFt: 6.9 },
    ],
    floor: [
      { id: '8x8_floor', labelEn: '8 x 8 ft Floor Wrap Vinyl', labelEs: 'Piso Vinil 8 x 8 pies', ratioW: 8, ratioH: 8, heightFt: 8 },
      { id: '10x10_floor', labelEn: '10 x 10 ft Floor Wrap Vinyl', labelEs: 'Piso Vinil 10 x 10 pies', ratioW: 10, ratioH: 10, heightFt: 10 },
      { id: '12x12_floor', labelEn: '12 x 12 ft Floor Wrap Vinyl', labelEs: 'Piso Vinil 12 x 12 pies', ratioW: 12, ratioH: 12, heightFt: 12 },
      { id: '15x15_floor', labelEn: '15 x 15 ft Floor Wrap Vinyl', labelEs: 'Piso Vinil 15 x 15 pies', ratioW: 15, ratioH: 15, heightFt: 15 },
      { id: '20x20_floor', labelEn: '20 x 20 ft Floor Wrap Vinyl', labelEs: 'Piso Vinil 20 x 20 pies', ratioW: 20, ratioH: 20, heightFt: 20 },
    ],
    cutout: [
      { id: '4ft_cutout', labelEn: '4 ft Character Cut-Out Standee', labelEs: 'Figura Troquelada Cut-Out de 4 pies', ratioW: 2.5, ratioH: 4, heightFt: 4 },
      { id: '5ft_cutout', labelEn: '5 ft Character Cut-Out Standee', labelEs: 'Figura Troquelada Cut-Out de 5 pies', ratioW: 3, ratioH: 5, heightFt: 5 },
      { id: '6ft_cutout', labelEn: '6 ft Character Cut-Out Standee (Real Life-Size)', labelEs: 'Figura Troquelada Cut-Out de 6 pies (Tamaño Real)', ratioW: 3.5, ratioH: 6, heightFt: 6 },
      { id: '7ft_cutout', labelEn: '7 ft Character Cut-Out Standee (Giant)', labelEs: 'Figura Troquelada Cut-Out Gigante de 7 pies', ratioW: 4, ratioH: 7, heightFt: 7 },
    ]
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = url;
    }
  };

  const currentSizeObj = sizesByCategory[category]?.find(s => s.id === selectedSize) || sizesByCategory[category]?.[0];

  const getQualityAssessment = () => {
    if (!imgDimensions || !currentSizeObj) return null;
    const targetWInches = currentSizeObj.ratioW * 12;
    const effectiveDPI = Math.round(imgDimensions.width / targetWInches);

    if (effectiveDPI >= 150) {
      return {
        level: 'HD',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        titleEn: '🟢 Museum Grade HD Quality',
        titleEs: '🟢 Calidad HD Grado Museo',
        descEn: `Your image is ${imgDimensions.width}x${imgDimensions.height}px (~${effectiveDPI} DPI). It will print razor-sharp with crisp details!`,
        descEs: `Tu imagen tiene ${imgDimensions.width}x${imgDimensions.height}px (~${effectiveDPI} DPI). ¡Se imprimirá con máxima nitidez!`
      };
    } else if (effectiveDPI >= 75) {
      return {
        level: 'GOOD',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        titleEn: '🟡 Good Viewing Quality',
        titleEs: '🟡 Buena Calidad para Visualización',
        descEn: `Your image is ${imgDimensions.width}x${imgDimensions.height}px (~${effectiveDPI} DPI). Great clarity at standard event viewing distances.`,
        descEs: `Tu imagen tiene ${imgDimensions.width}x${imgDimensions.height}px (~${effectiveDPI} DPI). Buena claridad para distancia de evento.`
      };
    } else {
      return {
        level: 'LOW',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/30',
        titleEn: '🔴 Low Resolution Warning',
        titleEs: '🔴 Advertencia de Baja Resolución',
        descEn: `Your file is ${imgDimensions.width}x${imgDimensions.height}px (~${effectiveDPI} DPI). Yndira can upscale it with AI for you!`,
        descEs: `Tu archivo tiene ${imgDimensions.width}x${imgDimensions.height}px (~${effectiveDPI} DPI). ¡Yndira puede mejorarlo con IA!`
      };
    }
  };

  const quality = getQualityAssessment();

  return (
    <div className="bg-[#0A0212] border border-white/10 rounded-3xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden my-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d90082]/20 border border-[#d90082]/40 text-[#ffcc00] text-xs font-bold uppercase tracking-widest mb-4">
          <Ruler className="w-4 h-4 text-[#ffcc00]" />
          'REAL LIFE-SIZE SCALE & QUALITY CHECKER'
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">
          'Check Real Life-Size Scale & Print Quality'
        </h2>
        <p className="text-[#a0a0a0] text-sm md:text-base font-light">
          'Upload your photo or character cut-out to see exact dimensions and real-life scale next to a 5.8ft human silhouette.'
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Size Controls */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div 
            className="border-2 border-dashed border-white/20 hover:border-[#d90082] transition-all rounded-xl p-5 text-center cursor-pointer bg-black/40 flex flex-col items-center justify-center min-h-[160px]"
            onClick={() => document.getElementById('print-file-input')?.click()}
          >
            <input 
              id="print-file-input"
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div className="relative w-full text-center">
                <img src={previewUrl} alt="Uploaded print art" className="max-h-36 mx-auto rounded-md object-contain mb-2" />
                <span className="text-[10px] text-[#ffcc00] font-bold block">
                  {imgDimensions ? `${imgDimensions.width} x ${imgDimensions.height} px` : 'File Loaded'}
                </span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#ffcc00] mb-2 animate-bounce" />
                <p className="font-bold text-xs text-white">
                  'Upload Artwork or Character Cut-Out'
                </p>
                <span className="text-[10px] text-[#a0a0a0] mt-1">PNG, JPG, WEBP, PDF</span>
              </>
            )}
          </div>

          {/* Category Tabs */}
          <div>
            <label className="text-[11px] text-[#a0a0a0] uppercase tracking-wider block mb-2 font-bold">
              '1. Select Solution Category'
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setCategory('backdrop'); setSelectedSize('8x8'); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${category === 'backdrop' ? 'bg-[#d90082] text-white border-[#d90082]' : 'bg-black/50 text-[#a0a0a0] border-white/10'}`}
              >
                'Photo Backdrops'
              </button>
              <button 
                onClick={() => { setCategory('cutout'); setSelectedSize('6ft_cutout'); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${category === 'cutout' ? 'bg-[#d90082] text-white border-[#d90082]' : 'bg-black/50 text-[#a0a0a0] border-white/10'}`}
              >
                'Character Cut-Out'
              </button>
              <button 
                onClick={() => { setCategory('retractable'); setSelectedSize('33x83'); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${category === 'retractable' ? 'bg-[#d90082] text-white border-[#d90082]' : 'bg-black/50 text-[#a0a0a0] border-white/10'}`}
              >
                'Retractable Banner'
              </button>
              <button 
                onClick={() => { setCategory('floor'); setSelectedSize('10x10_floor'); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${category === 'floor' ? 'bg-[#d90082] text-white border-[#d90082]' : 'bg-black/50 text-[#a0a0a0] border-white/10'}`}
              >
                'Floor Wrap Vinyl'
              </button>
            </div>
          </div>

          {/* Size Select dropdown */}
          <div>
            <label className="text-[11px] text-[#a0a0a0] uppercase tracking-wider block mb-2 font-bold">
              '2. Select Exact Print Dimensions'
            </label>
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-black/80 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-[#d90082] outline-none font-bold"
            >
              {sizesByCategory[category]?.map(s => (
                <option key={s.id} value={s.id}>
                  {s.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Resolution Quality Feedback Badge */}
          {quality && (
            <div className={`p-4 rounded-xl border ${quality.bg} text-xs font-medium`}>
              <div className={`font-bold text-sm mb-1 ${quality.color}`}>{quality.titleEn}</div>
              <p className="text-white/80 leading-relaxed text-[11px]">{quality.descEn}</p>
            </div>
          )}
        </div>

        {/* Right Column: Real Life-Size Visualizer & Human Scale Comparison */}
        <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[440px] relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ffcc00] flex items-center gap-1">
              <UserCheck className="w-4 h-4" />
              'Real Life-Size Scale (vs 5.8ft Human)'
            </span>
            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded text-white font-mono">
              {currentSizeObj ? (currentSizeObj.labelEn) : ''}
            </span>
          </div>

          {/* Scale Canvas Stage */}
          <div className="w-full flex-1 bg-gradient-to-b from-black/80 to-[#120822] rounded-xl border border-white/10 p-6 flex items-end justify-center gap-8 relative overflow-hidden min-h-[280px]">
            {/* Grid Floor Line */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d90082] to-transparent"></div>

            {/* Human Silhouette (5.8 ft reference) */}
            <div className="flex flex-col items-center z-10 opacity-80" style={{ height: '128px' }}>
              <div className="w-6 h-6 rounded-full bg-white/60 mb-1"></div>
              <div className="w-9 flex-1 bg-white/40 rounded-t-lg"></div>
              <span className="text-[9px] text-[#a0a0a0] mt-1 font-mono">5.8ft</span>
            </div>

            {/* Print Product Scale Render */}
            <div 
              className={`flex flex-col items-center justify-center transition-all duration-500 rounded-lg border-2 shadow-2xl relative overflow-hidden ${
                category === 'cutout' 
                  ? 'border-[#ffcc00] bg-black/80' 
                  : 'border-[#d90082] bg-black/90'
              }`}
              style={{
                height: `${currentSizeObj ? Math.min(currentSizeObj.heightFt * 22, 280) : 175}px`,
                width: `${currentSizeObj ? Math.min(currentSizeObj.ratioW * 22, 280) : 150}px`,
              }}
            >
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Print Preview" 
                  className={`w-full h-full ${category === 'cutout' ? 'object-contain' : 'object-cover'} transition-all`} 
                  style={{
                    objectPosition: `center ${posY}%`,
                    transform: `scale(${zoom / 100})`,
                  }}
                />
              ) : (
                <div className="p-3 text-center">
                  <span className="text-xs font-black text-white block uppercase">
                    {category === 'cutout' ? 'CUT-OUT' : 'PRINT'}
                  </span>
                  <span className="text-[9px] text-[#ffcc00] font-mono block mt-1">
                    {currentSizeObj ? currentSizeObj.id : ''}
                  </span>
                </div>
              )}

              <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-[#ffcc00] font-bold">
                {currentSizeObj ? currentSizeObj.id : ''}
              </div>
            </div>
          </div>

          {/* Interactive Image Repositioning Controls */}
          {previewUrl && (
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 mt-3 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
                <span>↕️ 'Adjust Position (Move Face Up/Down)'</span>
                <button 
                  onClick={() => { setPosY(50); setZoom(100); }}
                  className="text-[10px] text-white/70 hover:text-white underline cursor-pointer"
                >
                  'Reset Center'
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] text-[#a0a0a0] mb-1 font-bold">
                    <span>Vertical Y</span>
                    <span>{posY}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={posY} 
                    onChange={(e) => setPosY(Number(e.target.value))}
                    className="w-full accent-[#d90082] cursor-pointer h-1.5 bg-black/60 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#a0a0a0] mb-1 font-bold">
                    <span>Scale</span>
                    <span>{zoom}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="80" 
                    max="160" 
                    value={zoom} 
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#ffcc00] cursor-pointer h-1.5 bg-black/60 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button: Opens Email Quote Modal */}
          <div className="w-full mt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#ffcc00] text-white hover:scale-[1.01] transition-transform rounded-xl text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              {`Send Quote Request via Email`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Email Quote Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0212] border border-[#d90082]/40 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <span className="text-[10px] text-[#ffcc00] font-bold uppercase tracking-widest block mb-1">
              'QUOTE REQUEST'
            </span>
            <h3 className="text-xl font-black uppercase mb-2">
              'Send Quote Request to Print Inbox'
            </h3>
            <p className="text-xs text-[#a0a0a0] mb-6">
              'Your quote will land in our dedicated inbox for rapid response. Selected product: '
              <strong className="text-white">{currentSizeObj ? (currentSizeObj.labelEn) : ''}</strong>
            </p>

            {emailSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center">
                <Check className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-emerald-300 mb-1">
                  'Quote Sent to Email Folder!'
                </h4>
                <p className="text-xs text-white/80">
                  'Your request has been routed to our dedicated quote inbox.'
                </p>
                <button 
                  onClick={() => { setIsModalOpen(false); setEmailSuccess(false); }}
                  className="mt-4 px-6 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase"
                >
                  'Close'
                </button>
              </div>
            ) : (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingEmail(true);
                  try {
                    const res = await fetch('/api/email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: clientName,
                        email: clientEmail,
                        phone: clientPhone,
                        eventDate: eventDate,
                        needs: [currentSizeObj ? (currentSizeObj.labelEn) : 'Print Product'],
                        notes: `[WEB-QUOTE] Size: ${currentSizeObj ? currentSizeObj.id : ''}. User Position Y: ${posY}%, Zoom: ${zoom}%. ${eventNotes}`,
                      })
                    });
                    if (res.ok) {
                      setEmailSuccess(true);
                    } else {
                      window.location.href = `mailto:info@magicprintsforyou.com?subject=[WEB-QUOTE] ${encodeURIComponent(clientName)} - ${currentSizeObj?.id}&body=${encodeURIComponent(`Client: ${clientName}
Email: ${clientEmail}
Phone: ${clientPhone}
Event Date: ${eventDate}
Product: ${currentSizeObj?.labelEn}
Notes: ${eventNotes}`)}`;
                      setEmailSuccess(true);
                    }
                  } catch (err) {
                    window.location.href = `mailto:info@magicprintsforyou.com?subject=[WEB-QUOTE] ${encodeURIComponent(clientName)}`;
                    setEmailSuccess(true);
                  }
                  setIsSubmittingEmail(false);
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-[10px] text-[#a0a0a0] font-bold uppercase block mb-1">
                    'Your Name / Company Name' *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jennings / Premier Events"
                    className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-[#d90082] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#a0a0a0] font-bold uppercase block mb-1">
                      'Email Address' *
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="planner@events.com"
                      className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-[#d90082] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#a0a0a0] font-bold uppercase block mb-1">
                      'Phone (Optional)'
                    </label>
                    <input 
                      type="tel" 
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(214) 555-0199"
                      className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-[#d90082] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#a0a0a0] font-bold uppercase block mb-1">
                    'Event Date'
                  </label>
                  <input 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-[#d90082] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#a0a0a0] font-bold uppercase block mb-1">
                    'Additional Notes or Venue Setup Info'
                  </label>
                  <textarea 
                    rows={2}
                    value={eventNotes}
                    onChange={(e) => setEventNotes(e.target.value)}
                    placeholder='e.g. Need venue setup completed by 8:00 AM'
                    className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-[#d90082] outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingEmail}
                  className="w-full py-3.5 bg-gradient-to-r from-[#cc004e] via-[#d90082] to-[#ffcc00] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                >
                  {isSubmittingEmail 
                    ? ('Routing Email...') 
                    : ('Send Quote Request to Print Inbox')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
