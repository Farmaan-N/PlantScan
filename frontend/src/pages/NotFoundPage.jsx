import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, Sparkles, Terminal, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

/**
 * NotFoundPage (404)
 * Premium error page with a technical network-failure aesthetic.
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <GlassCard className="p-16 text-center relative overflow-hidden rounded-[4rem] border-white/5 bg-slate-950/40 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 blur-[120px] rounded-full" />
          
          <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-inner group">
              <Terminal size={40} className="text-red-500 group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="space-y-2">
               <h1 className="text-[120px] font-black text-white leading-none tracking-tighter opacity-10 select-none">404</h1>
               <div className="relative -mt-12">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white leading-none">
                    Route <span className="text-red-500">Severed</span>
                  </h2>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">Tactical Navigation Failure</p>
               </div>
            </div>

            <p className="text-slate-400 font-medium max-w-sm mx-auto leading-[1.6]">
              The botanical coordinate you're attempting to access is either encrypted or non-existent in our local neural matrix.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <Button onClick={() => navigate('/dashboard')} className="px-10 h-14 !rounded-2xl tracking-[0.2em] font-black uppercase">
                 <Home size={18} /> BACK TO HUB
               </Button>
               <button 
                 onClick={() => navigate(-1)}
                 className="h-14 px-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
               >
                 <ArrowLeft size={16} /> Previous Node
               </button>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-4 opacity-40">
               <div className="h-[1px] w-8 bg-white/20" />
               <span className="text-[8px] font-black tracking-[0.5em] text-slate-500 uppercase">System Error 0x404</span>
               <div className="h-[1px] w-8 bg-white/20" />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
