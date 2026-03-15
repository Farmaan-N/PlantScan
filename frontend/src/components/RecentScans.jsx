import { Leaf, Clock, ChevronRight, Trash2, ShieldCheck, Sparkles, MapPin, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

/**
 * RecentScans Component
 * Displays a list or grid of recent plant scans with a premium specimen-file aesthetic.
 */
function RecentScans({ scans = [], onDelete, limit = 0, showDeleteButton = false }) {
  const navigate = useNavigate();
  const displayedScans = limit > 0 ? scans.slice(0, limit) : scans;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}M AGO`;
    if (diffHours < 24) return `${diffHours}H AGO`;
    return date.toLocaleDateString();
  };

  const confidenceColor = (conf) => {
    if (conf >= 80) return 'text-lime-400';
    if (conf >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  if (displayedScans.length === 0) {
    return (
      <GlassCard className="p-16 text-center border-dashed border-white/5 bg-transparent">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-lime-500/10 rounded-full animate-ping" />
          <Leaf className="text-slate-600 relative z-10" size={32} />
        </div>
        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Empty Collection</h3>
        <p className="text-slate-500 font-medium max-w-xs mx-auto text-xs uppercase tracking-widest">
          Initiate your first scan to begin your botanical catalog.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className={`grid gap-6 ${limit > 0 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {displayedScans.map((scan, idx) => (
        <motion.div
          key={scan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="group"
        >
          <GlassCard
            className="relative overflow-hidden h-full flex flex-col !bg-slate-950/40 border-white/5 hover:border-lime-500/30 transition-all duration-700 shadow-2xl"
            hover={false}
            onClick={!showDeleteButton ? () => navigate('/result', { state: { plantData: scan } }) : undefined}
          >
            {/* Specimen Number Overlay */}
            <div className="absolute top-4 right-4 z-30 font-black text-[32px] text-white/[0.03] pointer-events-none select-none italic group-hover:text-lime-500/10 transition-colors uppercase">
              #{String(idx + 1).padStart(2, '0')}
            </div>

            {/* Header Identity */}
            <div className="p-5 flex items-center justify-between border-b border-white/5 relative z-20">
               <div className="flex items-center gap-2">
                 <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center">
                    <Leaf size={14} className="text-lime-500" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Specimen File</span>
               </div>
               {scan.confidence >= 90 && (
                 <BadgeCheck size={16} className="text-lime-500 shadow-[0_0_10px_#84cc16]" />
               )}
            </div>

            {/* Image/Visual Placeholder area */}
            <div className="h-44 relative bg-slate-900 overflow-hidden cursor-pointer" onClick={() => navigate('/result', { state: { plantData: scan } })}>
               <div className="absolute inset-0 bg-grid-subtle opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
               
               {/* Animated Scanning Line (Hover) */}
               <motion.div 
                 initial={{ top: '-10%' }}
                 whileHover={{ top: '100%' }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 w-full h-[1px] bg-lime-500 shadow-[0_0_15px_#84cc16] z-20 opacity-0 group-hover:opacity-100"
               />

               <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <Sparkles size={60} className="text-white" />
               </div>

               {/* Quality Badge */}
               <div className="absolute top-4 left-4 z-20">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest ${confidenceColor(scan.confidence)}`}>
                    <div className={`w-1 h-1 rounded-full animate-pulse ${scan.confidence >= 80 ? 'bg-lime-400' : 'bg-amber-400'}`} />
                    {scan.confidence}% MATCH
                  </div>
               </div>

               {/* Location / Meta (Simulated) */}
               <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest italic">Global Region</span>
                  </div>
               </div>
            </div>

            {/* Botanical Content */}
            <div className="p-6 flex-1 flex flex-col bg-slate-950/20">
              <div className="space-y-1 mb-6">
                <h4 className="text-xl font-black tracking-tighter text-white uppercase group-hover:text-lime-400 transition-colors cursor-pointer" onClick={() => navigate('/result', { state: { plantData: scan } })}>
                  {scan.plant_name}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-4 bg-slate-700" />
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px]">
                    {scan.scientific_name}
                  </p>
                </div>
              </div>

              {/* Action/Footer Area */}
              <div className="mt-auto flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 leading-none">Cataloged at</p>
                   <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{formatTime(scan.created_at)}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                  {showDeleteButton && onDelete ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(scan.id); }}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate('/result', { state: { plantData: scan } })}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:bg-lime-500 group-hover:text-slate-950 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(132,204,22,0.4)]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tech Underline Accent */}
            <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-lime-500/50 to-transparent transition-all duration-700 absolute bottom-0 left-0" />
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

export default RecentScans;
