import { useState } from 'react';
import { Camera, Upload, Scan, AlertCircle, X, Sparkles, ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import CameraCapture from '../components/CameraCapture';
import ImageUpload from '../components/ImageUpload';
import Loader from '../components/Loader';
import Button from '../components/Button';
import usePlantScan from '../hooks/usePlantScan';

function ScannerPage() {
  const [mode, setMode] = useState(null); // null | 'camera' | 'upload'
  const { selectedFile, isLoading, error, setSelectedFile, handleScan, clearError } = usePlantScan();

  const handleCameraCapture = (file) => {
    setSelectedFile(file);
    setMode(null);
  };

  const handleUpload = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header - Completely removed when camera is active for a focused experience */}
      <AnimatePresence>
        {mode !== 'camera' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SectionHeader
              badge="AI Scanner"
              title={<>Identify <span className="text-gradient">Plant</span></>}
              subtitle="Use our AI scanner to find out exactly what plant you have in front of you."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-8 sm:py-12"
          >
            <GlassCard className="p-8 sm:p-16 text-center max-w-xl mx-auto overflow-hidden !bg-slate-950/60 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1/2 h-full bg-lime-500 shadow-[0_0_20px_#84cc16]"
                />
              </div>
              <Loader message="Analyzing plant with AI model..." />
              <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 text-left max-w-xs mx-auto">
                {['Processing image...', 'Running machine learning model...', 'Identifying plant species...'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.4 }}
                    className="flex items-center gap-4 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500"
                  >
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full shadow-[0_0_8px_#84cc16]" />
                    {step}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Error handling */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 sm:p-5 bg-red-500/5 border border-red-500/10 rounded-2xl sm:rounded-[2rem] flex items-center gap-4 text-red-400">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                      <AlertCircle size={20} className="shrink-0" />
                    </div>
                     <div className="flex-1">
                       <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-0.5">Scanning Error</p>
                       <p className="text-sm font-bold leading-tight">{error}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearError();
                      }} 
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors relative z-50 cursor-pointer"
                      title="Clear error"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection Grid */}
            {mode === null && !selectedFile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <GlassCard
                  className="group cursor-pointer p-0 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-white/5 hover:border-lime-500/30 transition-all duration-700 bg-slate-950/40 shadow-2xl"
                  onClick={() => setMode('camera')}
                >
                  <div className="p-10 sm:p-12 flex flex-col items-center text-center space-y-6 sm:space-y-8 relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-[1px] bg-lime-500 shadow-[0_0_20px_#84cc16] z-20"
                      />
                    </div>

                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700">
                      <div className="absolute inset-0 bg-lime-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Camera size={40} className="text-white relative z-10 sm:w-[48px] sm:h-[48px]" />
                    </div>

                     <div className="space-y-3 relative z-10">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">Step 01</p>
                      <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white leading-none">
                        Camera <br /> <span className="text-lime-500">Scan</span>
                      </h3>
                      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest pt-3 sm:pt-4">Take a photo of your plant</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard
                  className="group cursor-pointer p-0 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-white/5 hover:border-emerald-500/30 transition-all duration-700 bg-slate-950/40 shadow-2xl"
                  onClick={() => setMode('upload')}
                >
                  <div className="p-10 sm:p-12 flex flex-col items-center text-center space-y-6 sm:space-y-8 relative">
                    <div className="absolute inset-0 bg-grid-subtle opacity-20 group-hover:opacity-40 transition-opacity" />

                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center relative group-hover:rotate-[15deg] transition-transform duration-700">
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-[1.5rem] sm:rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Upload size={40} className="text-white relative z-10 sm:w-[48px] sm:h-[48px]" />
                    </div>

                     <div className="space-y-3 relative z-10">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Step 02</p>
                      <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white leading-none">
                        Upload <br /> <span className="text-emerald-500">Image</span>
                      </h3>
                      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest pt-3 sm:pt-4">Choose a photo from your device</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Active Mode View - Optimized for Large & Small Screens */}
            {mode === 'camera' && (
              <div className="fixed inset-0 z-[200] bg-slate-950 sm:relative sm:inset-auto sm:z-auto sm:bg-transparent sm:animate-fade-in sm:space-y-8 max-w-4xl mx-auto">
                {/* Mobile Top Bar (Only visible on small devices) */}
                <div className="flex sm:hidden items-center justify-between p-6 absolute top-0 left-0 right-0 z-[210] pointer-events-none">
                   <button 
                     onClick={() => setMode(null)} 
                     className="pointer-events-auto p-3 bg-slate-950/40 backdrop-blur-md rounded-2xl text-white/70 hover:text-white transition-all border border-white/5"
                   >
                     <ChevronLeft size={20} />
                   </button>
                   <div className="pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">Live Lens</span>
                   </div>
                </div>

                {/* Desktop/Tablet Header (Only visible on larger screens) */}
                <div className="hidden sm:flex flex-row items-center justify-between gap-4 px-4 sm:px-0 mb-8">
                    <button onClick={() => setMode(null)} className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all group">
                     <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                     <span>BACK TO SCANNER</span>
                   </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-full w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500">Live Lens Active</span>
                  </div>
                </div>

                <div className="h-full sm:h-auto sm:rounded-[4rem] overflow-hidden sm:border sm:border-white/10 sm:glass-card sm:p-2 sm:shadow-2xl">
                  <div className="h-full sm:h-auto sm:rounded-[3.5rem] overflow-hidden bg-black relative">
                    <CameraCapture onCapture={handleCameraCapture} onClose={() => setMode(null)} />
                  </div>
                </div>
              </div>
            )}

            {mode === 'upload' && (
              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
                <div className="flex items-center justify-between px-4">
                    <button onClick={() => setMode(null)} className="flex items-center gap-3 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all group">
                     <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO SCANNER
                   </button>
                </div>
                <ImageUpload onUpload={handleUpload} />
                {selectedFile && (
                  <Button onClick={handleScan} fullWidth className="!py-6 sm:!py-8 text-sm sm:text-xl tracking-[0.2em] sm:tracking-[0.3em] font-black !rounded-2xl sm:!rounded-[2.5rem] shadow-2xl shadow-lime-500/20">
                     <Scan size={24} />
                    START PLANT SCAN
                  </Button>
                )}
              </div>
            )}

            {/* Confirm section for camera capture result */}
            {selectedFile && mode === null && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-8 sm:p-12 max-w-2xl mx-auto rounded-[2.5rem] sm:rounded-[3.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-lime-500/5 -mr-24 -mt-24 rounded-full blur-3xl opacity-50 pointer-events-none" />

                  <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <div className="space-y-1">
                           <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">Image Ready</p>
                           <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Confirm Photo</h3>
                        </div>
                         <button 
                           type="button"
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedFile(null);
                           }} 
                           className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 relative z-50 cursor-pointer active:scale-90"
                           title="Discard photo"
                         >
                           <X size={20} className="sm:w-6 sm:h-6" />
                         </button>
                       </div>

                  <div className="p-4 sm:p-6 bg-white/[0.03] rounded-2xl sm:rounded-3xl border border-white/10 flex items-center gap-4 sm:gap-8 mb-8 sm:mb-12 group hover:bg-white/[0.05] transition-colors overflow-hidden">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-lime-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-lime-500/20 shrink-0">
                      <Scan className="text-slate-950" size={32} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-black uppercase text-xs sm:text-sm tracking-widest truncate">{selectedFile.name || 'SESSION_DATA_01.JPG'}</p>
                      <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">Status: Unprocessed // Signal 1.0</p>
                    </div>
                  </div>

                     <Button onClick={handleScan} fullWidth className="!py-5 sm:!py-6 tracking-[0.3em] sm:tracking-[0.4em] font-black !rounded-xl sm:!rounded-2xl text-xs sm:text-base">
                      <Scan size={20} />
                      ANALYZE PLANT
                    </Button>
                </GlassCard>
              </motion.div>
            )}

            {/* Tactical Grid Overlay on the bottom - Completely hidden in camera mode for zero distraction */}
            <AnimatePresence>
              {mode !== 'camera' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 sm:pt-12"
                >
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-4">
                          <div className="h-[1px] flex-1 bg-white/5" />
                         <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-600">Scan Tips</p>
                         <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-2 xs:grid-cols-2 gap-4">
                      {[
                        { label: 'Lighting', value: 'High Lux', icon: Sparkles },
                        { label: 'Position', value: 'Centered', icon: Scan },
                        { label: 'Background', value: 'Clean', icon: Info },
                        { label: 'Focus', value: 'Macro', icon: HelpCircle }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 sm:p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <item.icon size={14} className="text-slate-600 shrink-0" />
                          <div className="space-y-0.5 overflow-hidden">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                            <p className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-tight truncate">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end p-4 border-t sm:border-t-0 sm:border-l border-white/5 sm:pl-8 text-center sm:text-left">
                       <p className="text-slate-700 font-bold uppercase tracking-[0.3em] text-[8px] leading-[2]">
                        PlantScan v1.0 <br className="hidden sm:block" />
                        AI Model: Active <br className="hidden sm:block" />
                        Status: Online <br className="hidden sm:block" />
                        Secure Connection
                      </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ScannerPage;
