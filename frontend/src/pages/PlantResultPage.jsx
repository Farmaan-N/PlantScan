import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Share2, Library, Sparkles, Printer, Download } from 'lucide-react';
import PlantInfoCard from '../components/PlantInfoCard';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

function PlantResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const plantData = location.state?.plantData;

  if (!plantData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="p-16 max-w-xl border-dashed border-white/10 rounded-[4rem] !bg-slate-950/40">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 relative">
              <div className="absolute inset-0 bg-white/5 animate-ping rounded-full" />
              <Sparkles className="text-slate-600 relative z-10" size={40} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white mb-4 leading-none">Record Not <span className="text-red-500">Found</span></h2>
            <p className="text-slate-500 font-medium mb-12 uppercase text-[10px] tracking-[0.2em] max-w-xs mx-auto">
              System failed to retrieve botanical parameters for this session.
            </p>
            <Button onClick={() => navigate('/scan')} className="px-12 !py-6 !rounded-2xl">
              <Camera size={20} />
              RE-INITIALIZE SCANNER
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Plant Identification: ${plantData.plantName || plantData.plant_name}`,
          text: `I just identified a ${plantData.plantName || plantData.plant_name} using PlantScan AI!`,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(`Plant: ${plantData.plantName || plantData.plant_name} - ${plantData.scientificName || plantData.scientific_name}`);
      alert('Record metadata copied to clipboard.');
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      {/* Dynamic Header */}
      <SectionHeader 
        badge="Sync Success"
        title={<>Analysis <span className="text-gradient">Complete</span></>}
        subtitle={`Session identified specimen as ${plantData.plantName || plantData.plant_name}. All parameters have been archived.`}
        actions={
          <div className="flex gap-3">
             <button
               onClick={handleShare}
               className="h-14 w-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-lime-400 hover:border-lime-500/30 transition-all active:scale-95 group"
             >
               <Share2 size={20} className="group-hover:scale-110 transition-transform" />
             </button>
             <button
               onClick={() => window.print()}
               className="h-14 w-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/30 transition-all active:scale-95 group hidden md:flex"
             >
               <Printer size={20} className="group-hover:translate-y-[-2px] transition-transform" />
             </button>
             <Button variant="secondary" onClick={() => navigate('/history')} className="h-14 px-8 !rounded-2xl border-white/10">
                <Library size={18} />
                COLLECTION
             </Button>
          </div>
        }
      />

      {/* Main Content Component */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <PlantInfoCard data={plantData} />
      </motion.div>

      {/* Post-Analysis Protocol Footer */}
      <section className="pt-16 mt-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="space-y-2">
              <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Botanical Protocol Concluded</h4>
              <p className="text-slate-500 text-sm font-medium">This specimen record has been securely stored in your local encrypted archive. Monitoring active.</p>
           </div>
           <div className="flex flex-wrap gap-4 md:justify-end">
              <Button variant="secondary" onClick={() => navigate('/scan')} className="px-10 h-14 !rounded-2xl border-white/5">
                <Camera size={20} />
                NEW SCAN SESSION
              </Button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-10 h-14 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all border border-white/5"
              >
                RETURN TO HUB
              </button>
           </div>
        </div>
      </section>

      {/* Technical Grain Deco */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-mesh" />
    </div>
  );
}

export default PlantResultPage;
