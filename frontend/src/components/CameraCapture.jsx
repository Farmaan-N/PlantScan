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
          <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] md:aspect-video object-cover" />
          
          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-950/20">
             {/* Scanning Lines */}
             <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-px bg-lime-500/30 shadow-[0_0_10px_#84cc16] z-10" 
             />
             
             {/* Corner Brackets */}
             <div className="absolute inset-12 border border-white/10">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-lime-400 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-lime-400 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-lime-400 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-lime-400 rounded-br-2xl" />
             </div>

             {/* HUD elements */}
             <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Ready to capture</span>
             </div>
              <div className="absolute bottom-8 right-8 text-right hidden sm:block">
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">Quality: High</p>
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">Camera: Active</p>
              </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between bg-gradient-to-t from-slate-950/80 to-transparent">
             <button onClick={onClose} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl text-white hover:bg-white/10 transition-all">
                <X size={24} />
             </button>
             
             <button 
               onClick={capturePhoto}
               disabled={!isStreaming}
               className="w-20 h-20 rounded-full bg-white flex items-center justify-center group active:scale-90 transition-transform shadow-2xl"
             >
                <div className="w-16 h-16 rounded-full border-4 border-slate-950 flex items-center justify-center">
                   <div className="w-10 h-10 bg-lime-500 rounded-full group-hover:scale-110 transition-transform" />
                </div>
             </button>

             <button onClick={flipCamera} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl text-white hover:bg-white/10 transition-all">
                <RefreshCw size={24} />
             </button>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <img src={capturedImage} alt="Captured" className="w-full aspect-[4/3] md:aspect-video object-cover" />
          <div className="absolute inset-0 bg-lime-500/5 backdrop-grayscale-[0.5]" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
             <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <Sparkles className="text-slate-950" size={32} />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight text-white">Photo Taken</h3>
             <p className="text-slate-300 font-medium mb-10 max-w-xs">Ready to identify this plant?</p>
             
             <div className="flex gap-4 w-full max-w-sm">
                <Button variant="secondary" onClick={retake} fullWidth className="!py-4 text-xs tracking-widest">
                   RETAKE
                </Button>
                <Button onClick={confirmCapture} fullWidth className="!py-4 text-xs tracking-widest shadow-2xl">
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
