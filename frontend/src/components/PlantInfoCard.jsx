import { Leaf, FlaskConical, MapPin, Globe, Award, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, Share2, Camera, ArrowLeft, Info, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

/**
 * PlantInfoCard Component
 * Displays high-fidelity botanical analysis with a technical specimen-file aesthetic.
 */
function PlantInfoCard({ data }) {
  if (!data) return null;

  const normalizedData = {
    ...data,
    plantName: data.plantName || data.plant_name,
    scientificName: data.scientificName || data.scientific_name,
    keyBenefits: data.keyBenefits || data.key_benefits || [],
    sideEffects: data.sideEffects || data.side_effects,
    habitat: data.habitat,
    growingRegions: data.growingRegions || data.growing_regions,
    commonNames: data.commonNames || data.common_names || [],
  };

  // Local dictionary for common Indian plants as a safety net
  const localDictionary = {
    'Mango': { hindi: 'आम', tamil: 'மாம்பழம்', english: 'Indian Mango' },
    'Tulsi': { hindi: 'तुलसी', tamil: 'துளசி', english: 'Holy Basil' },
    'Neem': { hindi: 'नीम', tamil: 'வேம்பு', english: 'Indian Lilac' },
    'Aloe Vera': { hindi: 'घृतकुमारी', tamil: 'கற்றாழை', english: 'Aloe Vera' },
    'Hibiscus': { hindi: 'गुड़हल', tamil: 'செம்பருத்தி', english: 'Shoe Flower' },
    'Peppermint': { hindi: 'पुदीना', tamil: 'புதினா', english: 'Mint' },
    'Coriander': { hindi: 'धनिया', tamil: 'கொத்தமல்லி', english: 'Coriander' },
    'Turmeric': { hindi: 'हल्दी', tamil: 'மஞ்சள்', english: 'Turmeric' },
    'Spinach': { hindi: 'पालक', tamil: 'பசலைக்கீரை', english: 'Spinach' }
  };

  const nameMatch = Object.keys(localDictionary).find(k => 
    k.toLowerCase() === (normalizedData.plantName || '').toLowerCase() || 
    k.toLowerCase() === (normalizedData.scientificName || '').toLowerCase()
  );

  normalizedData.hindiName = data.hindiName || data.hindi_name || (nameMatch ? localDictionary[nameMatch].hindi : 'N/A');
  normalizedData.tamilName = data.tamilName || data.tamil_name || (nameMatch ? localDictionary[nameMatch].tamil : 'N/A');
  normalizedData.indianEnglishName = data.indianEnglishName || data.indian_english_name || (nameMatch ? localDictionary[nameMatch].english : normalizedData.plantName);

  // Still treat "N/A" from DB as something to potentially override with dictionary
  if (nameMatch && (normalizedData.hindiName === 'N/A' || !normalizedData.hindiName)) normalizedData.hindiName = localDictionary[nameMatch].hindi;
  if (nameMatch && (normalizedData.tamilName === 'N/A' || !normalizedData.tamilName)) normalizedData.tamilName = localDictionary[nameMatch].tamil;


  const confidenceColor = (conf) => {
    if (conf >= 80) return 'text-lime-400';
    if (conf >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto px-4 sm:px-0">
      
      {/* ── Header: Identity & Master Status ────────────────────── */}
      <section className="relative">
         <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start">
            
            {/* Visual Specimen Preview */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-[400px] shrink-0"
            >
               <GlassCard className="aspect-[4/5] sm:aspect-[4/5] rounded-[2.5rem] sm:rounded-[4rem] p-3 sm:p-4 border-white/10 bg-slate-950/60 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid-subtle opacity-20" />
                  <div className="w-full h-full rounded-[2rem] sm:rounded-[3.2rem] overflow-hidden relative bg-slate-900 flex items-center justify-center border border-white/5">
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                     
                     {/* Scanning Animation on Image */}
                     <motion.div 
                       animate={{ top: ['0%', '100%', '0%'] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 w-full h-[2px] bg-lime-500 shadow-[0_0_20px_#84cc16] z-20 opacity-40"
                     />

                     <Leaf size={100} className="text-lime-500/10 group-hover:scale-110 transition-transform duration-1000 sm:w-[120px] sm:h-[120px]" />
                     
                     <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Scanned Image</p>
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">ID_{Math.floor(Math.random() * 9000) + 1000}</p>
                           </div>
                           <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                              <Camera size={16} className="text-white" />
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Floating Confidence Badge */}
                  <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-30">
                     <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 px-4 py-2 sm:px-6 sm:py-3 rounded-[1.25rem] flex flex-col items-center shadow-2xl"
                     >
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5 sm:mb-1">Confidence</span>
                        <span className={`text-xl sm:text-3xl font-black ${confidenceColor(normalizedData.confidence)}`}>{normalizedData.confidence}%</span>
                     </motion.div>
                  </div>
               </GlassCard>
            </motion.div>

            {/* Core Taxonomy Details */}
            <div className="flex-1 space-y-6 sm:space-y-10 py-2 sm:py-4 w-full">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-4"
               >
                  <div className="flex items-center gap-3">
                     <div className="px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-lime-500">
                        Match Found
                     </div>
                     <div className="h-[1px] w-8 sm:w-12 bg-white/5" />
                     <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Analysis Complete</div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase text-white leading-[0.95] sm:leading-[0.85] break-words">
                      {normalizedData.indianEnglishName || normalizedData.plantName}
                    </h1>
                    <p className="text-xl sm:text-2xl md:text-3xl italic font-medium text-slate-500 tracking-tight">
                      {normalizedData.scientificName}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                    {/* Hindi Name Tag */}
                    {normalizedData.hindiName && !['N/A', 'NA', 'NONE', 'UNKNOWN'].includes(normalizedData.hindiName.toUpperCase()) && (
                      <div className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:px-5 sm:py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                         <span className="text-[10px] sm:text-xs font-bold text-orange-200">{normalizedData.hindiName}</span>
                      </div>
                    )}
                    
                    {/* Tamil Name Tag */}
                    {normalizedData.tamilName && !['N/A', 'NA', 'NONE', 'UNKNOWN'].includes(normalizedData.tamilName.toUpperCase()) && (
                      <div className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:px-5 sm:py-2 bg-sky-500/10 border border-sky-500/20 rounded-full">
                         <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                         <span className="text-[10px] sm:text-xs font-bold text-sky-200">{normalizedData.tamilName}</span>
                      </div>
                    )}

                    {/* Indian English Tag (if different from main name) */}
                    {normalizedData.indianEnglishName && 
                      normalizedData.indianEnglishName.toLowerCase() !== normalizedData.plantName.toLowerCase() && 
                      !['N/A', 'NA', 'UNKNOWN'].includes(normalizedData.indianEnglishName.toUpperCase()) && (
                      <div className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:px-5 sm:py-2 bg-lime-500/10 border border-lime-500/20 rounded-full">
                         <div className="w-1.5 h-1.5 rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]" />
                         <span className="text-[10px] sm:text-xs font-bold text-lime-200">{normalizedData.indianEnglishName}</span>
                      </div>
                    )}

                    {/* Fallback to other common names if regional ones missing or empty */}
                    {normalizedData.commonNames?.filter(n => n !== normalizedData.plantName).map((name, i) => (
                      <div key={name} className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:px-5 sm:py-2 bg-white/[0.03] border border-white/5 rounded-full">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                         <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300">{name}</span>
                      </div>
                    ))}
                  </div>
               </motion.div>

               {/* Quick Specs Grid (Responsive) */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Plant Family', value: normalizedData.family || 'Unknown', icon: FlaskConical },
                    { label: 'Hardiness', value: 'Adaptable', icon: Zap },
                    { label: 'Identified By', value: 'PlantScan AI', icon: Database }
                  ].map((spec, i) => (
                    <div key={i} className={`p-5 bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[2rem] flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-between sm:h-32 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                       <spec.icon size={18} className="text-slate-600 shrink-0" />
                       <div className="space-y-0.5 sm:space-y-1 text-right sm:text-left">
                          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 sm:text-slate-500">{spec.label}</p>
                          <p className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">{spec.value}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ── Body: Detailed Analysis ───────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
         
         {/* Descriptions & History */}
         <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <GlassCard className="p-6 sm:p-10 border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] sm:opacity-[0.05] pointer-events-none">
                  <FileText size={160} className="text-white sm:w-[160px] sm:h-[160px] w-24 h-24" />
               </div>
               <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-6 sm:mb-8 flex items-center gap-4">
                  <div className="w-6 sm:w-8 h-[1px] bg-lime-500" />
                  PLANT OVERVIEW
               </h3>
               <div className="relative z-10">
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                     {normalizedData.description}
                  </p>
               </div>
               
               {/* Technical Footer deco */}
               <div className="mt-8 sm:mt-12 flex items-center justify-between pt-6 sm:pt-8 border-t border-white/5 opacity-50">
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] sm:tracking-[0.5em]">PlantScan v1.0</p>
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] sm:tracking-[0.5em]">VERIFIED</p>
               </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
               <GlassCard className="p-6 sm:p-8 border-white/5 border-l-4 border-amber-500 bg-amber-500/[0.01]">
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 sm:mb-6 flex items-center gap-3">
                     <AlertCircle size={14} /> WARNINGS & TOXICITY
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wide leading-relaxed">
                     {normalizedData.sideEffects || 'NO KNOWN SIDE EFFECTS.'}
                  </p>
               </GlassCard>

               <GlassCard className="p-6 sm:p-8 border-white/5 border-l-4 border-sky-500 bg-sky-500/[0.01]">
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 mb-4 sm:mb-6 flex items-center gap-3">
                     <Globe size={14} /> NATURAL ENVIRONMENT
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Habitat</p>
                        <p className="text-slate-300 text-xs sm:text-sm font-bold uppercase">{normalizedData.habitat}</p>
                     </div>
                     <div>
                        <p className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Indian Regions</p>
                        <p className="text-slate-300 text-xs sm:text-sm font-bold uppercase">{normalizedData.growingRegions}</p>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* Sidebar: Benefits & Protocol */}
         <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <GlassCard className="p-6 sm:p-8 border-white/5 border-t-4 border-lime-500 h-full">
               <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-lime-400 mb-6 sm:mb-8 flex items-center gap-3">
                  <CheckCircle2 size={16} /> KEY BENEFITS
               </h3>
               <div className="space-y-4 sm:space-y-6">
                  {normalizedData.keyBenefits?.length > 0 ? normalizedData.keyBenefits.map((benefit, i) => (
                    <div key={i} className="group flex items-start gap-4">
                       <span className="text-[9px] sm:text-[10px] font-black text-slate-700 group-hover:text-lime-500 transition-colors pt-1">0{i+1}</span>
                       <div className="h-[1px] w-3 sm:w-4 bg-slate-800 mt-2.5 shrink-0" />
                       <p className="text-slate-200 text-[10px] sm:text-xs font-black uppercase tracking-widest leading-normal group-hover:translate-x-1 transition-transform">{benefit}</p>
                    </div>
                  )) : (
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-normal italic">No benefits recorded.</p>
                  )}
               </div>

               <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-red-500/5 rounded-2xl sm:rounded-[2rem] border border-red-500/10 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 text-red-500">
                     <ShieldCheck size={16} />
                     <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Important Advice</span>
                  </div>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                     {normalizedData.restrictions || 'ALWAYS CONSULT A PROFESSIONAL BEFORE USE.'}
                  </p>
               </div>
            </GlassCard>
         </div>
      </section>

      {/* ── Footer Metadata ───────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 py-8 sm:py-12 border-t border-white/5">
         <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1 h-1 bg-white/10 rounded-full" />
            ))}
         </div>
         <p className="text-[8px] sm:text-[9px] font-black text-slate-700 uppercase tracking-[0.6em] sm:tracking-[1em] text-center">END OF PLANT DETAILS</p>
      </div>
    </div>
  );
}

const Database = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 5c0 1.5 4.5 3 9 3s9-1.5 9-3A9 3 0 0 0 3 5Z"/><path d="M21 12c0 1.5-4.5 3-9 3s-9-1.5-9-3"/><path d="M3 5v14c0 1.5 4.5 3 9 3s9-1.5 9-3V5"/></svg>
);

export default PlantInfoCard;
