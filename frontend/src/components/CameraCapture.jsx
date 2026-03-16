import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RefreshCw, ZoomIn, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

/**
 * CameraCapture Component
 * Premium botanical capture interface
 */
function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError(err.name === 'NotAllowedError' 
        ? 'Permission Denied: Please allow camera access.' 
        : 'Error: Camera not found.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const confirmCapture = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.95);
  }, [onCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const flipCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="relative bg-slate-950 overflow-hidden">
      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
               <Zap size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Camera Error</h3>
            <p className="text-slate-500 font-medium">{error}</p>
            <Button variant="secondary" onClick={onClose} className="w-full">CLOSE CAMERA</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Viewfinder */}
      {!error && !capturedImage && (
        <div className="relative group">
          <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[3/4] md:aspect-video object-cover" />
          
          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none border-[10px] sm:border-[20px] border-slate-950/20">
             {/* Scanning Lines */}
             <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-px bg-lime-500/30 shadow-[0_0_10px_#84cc16] z-10" 
             />
             
             {/* Corner Brackets */}
             <div className="absolute inset-6 sm:inset-12 border border-white/10 overflow-hidden">
                <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-lime-400 rounded-tl-xl sm:rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-lime-400 rounded-tr-xl sm:rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-lime-400 rounded-bl-xl sm:rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-lime-400 rounded-br-xl sm:rounded-br-2xl" />
                
                {/* Botanical Guide Central */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <div className="w-32 h-44 sm:w-48 sm:h-64 border-2 border-dashed border-lime-400/50 rounded-[100%_0%_100%_0%] rotate-45" />
                </div>
             </div>

             {/* HUD elements */}
             <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white">Ready to capture</span>
             </div>
              <div className="absolute bottom-6 right-6 text-right hidden sm:block">
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">Quality: High</p>
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">Camera: Active</p>
              </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-center justify-between bg-gradient-to-t from-slate-950/90 to-transparent">
             <button 
               type="button"
               onClick={(e) => {
                 e.stopPropagation();
                 onClose();
               }} 
               className="p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-2xl text-white hover:bg-white/10 active:scale-95 transition-all border border-white/5 relative z-50 cursor-pointer"
               aria-label="Close Camera"
             >
                <X size={20} className="sm:w-6 sm:h-6" />
             </button>
             
             <button 
               onClick={capturePhoto}
               disabled={!isStreaming}
               className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center group active:scale-90 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] relative"
               aria-label="Capture Photo"
             >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full border-[3px] border-slate-950 flex items-center justify-center">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-lime-500 rounded-full group-hover:scale-110 transition-transform" />
                </div>
             </button>

             <button 
               onClick={flipCamera} 
               className="p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-2xl text-white hover:bg-white/10 active:scale-95 transition-all border border-white/5"
               aria-label="Switch Camera"
             >
                <RefreshCw size={20} className="sm:size-[24px]" />
             </button>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative bg-slate-950">
          <img src={capturedImage} alt="Captured" className="w-full aspect-[3/4] md:aspect-video object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/90" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-end p-8 sm:p-12 text-center">
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-14 h-14 sm:w-16 sm:h-16 bg-lime-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(132,204,22,0.4)]"
             >
                <Sparkles className="text-slate-950" size={28} sm:size={32} />
             </motion.div>
             <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">Snapshot Secured</h3>
             <p className="text-slate-400 text-xs sm:text-sm font-medium mb-8 sm:mb-10 max-w-[240px] sm:max-w-xs uppercase tracking-widest">Image processed and ready for botanical analysis.</p>
             
             <div className="flex gap-3 sm:gap-4 w-full max-w-sm">
                <Button variant="secondary" onClick={retake} fullWidth className="!py-3 sm:!py-4 text-[10px] sm:text-xs tracking-widest !rounded-xl transition-all hover:bg-white/10">
                   RETAKE
                </Button>
                <Button onClick={confirmCapture} fullWidth className="!py-3 sm:!py-4 text-[10px] sm:text-xs tracking-widest shadow-[0_0_20px_rgba(132,204,22,0.3)] !rounded-xl">
                   IDENTIFY
                </Button>
             </div>
          </div>
        </motion.div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CameraCapture;
