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
    <div className="relative bg-slate-950 overflow-hidden h-[100dvh] sm:h-auto">
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
        <div className="relative h-full w-full flex flex-col">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="flex-1 w-full h-full object-cover sm:aspect-video" 
          />
          
          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none border-[12px] sm:border-[20px] border-slate-950/20">
             {/* Scanning Lines */}
             <motion.div 
               animate={{ top: ['10%', '90%', '10%'] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-px bg-lime-500/30 shadow-[0_0_15px_#84cc16] z-10" 
             />
             
             {/* Corner Brackets */}
             <div className="absolute inset-10 sm:inset-16 border border-white/5 overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-lime-400 rounded-tl-2xl sm:rounded-tl-[3rem]" />
                <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-lime-400 rounded-tr-xl sm:rounded-tr-[3rem]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-lime-400 rounded-bl-2xl sm:rounded-bl-[3rem]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-lime-400 rounded-br-xl sm:rounded-br-[3rem]" />
                
                {/* Botanical Guide Central */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <div className="w-40 h-56 sm:w-64 sm:h-80 border-2 border-dashed border-lime-400/50 rounded-[100%_0%_100%_0%] rotate-45" />
                </div>
             </div>

             {/* HUD elements */}
             <div 
               className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/5"
               style={{ marginTop: 'env(safe-area-inset-top)' }}
             >
                <div className="w-1.5 h-1.5 rounded-full bg-lime-500 shadow-[0_0_8px_#84cc16]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">ISO 400 // OPTIC READY</span>
             </div>
              <div 
                className="absolute bottom-40 sm:bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
              >
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full">AI BOUNDING BOX ACTIVE</p>
              </div>
          </div>

          {/* Controls - Positioned at the bottom for thumb reach */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-8 pb-12 sm:pb-8 flex items-center justify-between bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 3rem)' }}
          >
             <button 
               type="button"
               onClick={(e) => {
                 e.stopPropagation();
                 onClose();
               }} 
               className="p-4 sm:p-5 bg-white/5 backdrop-blur-xl rounded-2xl text-white/50 hover:text-white active:scale-95 transition-all border border-white/5 relative z-50 cursor-pointer"
               aria-label="Close Camera"
             >
                <X size={20} className="sm:w-6 sm:h-6" />
             </button>
             
             <button 
               onClick={capturePhoto}
               disabled={!isStreaming}
               className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center group active:scale-90 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.2)] relative z-50"
               aria-label="Capture Photo"
             >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[4px] border-slate-950 flex items-center justify-center">
                   <div className="w-12 h-12 sm:w-14 sm:h-14 bg-lime-500 rounded-full group-hover:scale-110 transition-transform shadow-inner" />
                </div>
             </button>

             <button 
               type="button"
               onClick={(e) => {
                 e.stopPropagation();
                 flipCamera();
               }} 
               className="p-4 sm:p-5 bg-white/5 backdrop-blur-xl rounded-2xl text-white/50 hover:text-white active:scale-95 transition-all border border-white/5 relative z-50 cursor-pointer"
               aria-label="Switch Camera"
             >
                <RefreshCw size={20} className="sm:w-6 sm:h-6" />
             </button>
          </div>
        </div>
      )}

      {/* Captured Image Preview - Optimized for Full Screen */}
      {capturedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-full w-full flex flex-col bg-slate-950">
          <img src={capturedImage} alt="Captured" className="flex-1 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/95" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-16 h-16 bg-lime-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(132,204,22,0.5)]"
             >
                <Sparkles className="text-slate-950" size={32} />
             </motion.div>
             
             <div className="space-y-2 mb-12">
               <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">Specimen Captured</h3>
               <p className="text-lime-400 text-[10px] font-black uppercase tracking-[0.3em]">Processing Visual Signal 1.0</p>
               <p className="text-slate-400 text-xs font-medium max-w-[260px] mx-auto mt-4">The AI model is ready to analyze this plant's characteristics.</p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
                <Button variant="secondary" onClick={retake} fullWidth className="!py-4 text-[10px] sm:text-xs tracking-widest !rounded-2xl border-white/10 hover:bg-white/5">
                   RETAKE PHOTO
                </Button>
                <Button onClick={confirmCapture} fullWidth className="!py-4 text-[10px] sm:text-xs tracking-widest shadow-[0_0_30px_rgba(132,204,22,0.3)] !rounded-2xl">
                   START BOTANICAL SCAN
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
