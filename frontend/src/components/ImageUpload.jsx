import { useState, useRef } from 'react';
import { Upload, Image, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

/**
 * ImageUpload Component
 * Premium drag-and-drop interface for botanical imagery
 */
function ImageUpload({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file format. Please use JPEG, PNG, or WEBP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Max size is 10MB.');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPreview({ url: previewUrl, name: file.name, size: file.size });
    onUpload(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {preview ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="p-0 overflow-hidden group">
            <div className="relative aspect-video">
              <img src={preview.url} alt="Sample" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <button
                onClick={clearPreview}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors z-20"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-6 left-6 z-20">
                 <div className="flex items-center gap-2 px-3 py-1 bg-lime-500 rounded-full text-slate-950 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={10} />
                    File Selected
                 </div>
              </div>
            </div>
            <div className="p-6 flex items-center justify-between">
               <div>
                  <h4 className="text-white font-black uppercase tracking-tight text-sm truncate max-w-[200px]">{preview.name}</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    Image File // {(preview.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
               </div>
               <div className="flex items-center gap-2 text-lime-400">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ready</span>
               </div>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <motion.div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleFile(file); }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            border-2 border-dashed rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 text-center cursor-pointer transition-all duration-500
            ${isDragging 
              ? 'border-lime-500 bg-lime-500/10 shadow-[0_0_30px_rgba(132,204,22,0.1)]' 
              : 'border-white/10 bg-white/5 hover:border-lime-500/30 hover:bg-white/10'}
          `}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/10 group-hover:rotate-12 transition-transform">
             <Upload className={isDragging ? 'text-lime-500' : 'text-slate-500'} size={28} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-white mb-2">Upload <span className="text-gradient">Photo</span></h3>
          <p className="text-slate-500 text-sm sm:text-base font-medium mb-8 sm:mb-12">Drag a photo here or click to browse</p>
          
          <div className="flex items-center justify-center gap-6 sm:gap-12 pt-6 sm:pt-8 border-t border-white/5">
             <div className="text-center">
                <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Formats</p>
                <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400">JPG, PNG, WEBP</p>
             </div>
             <div className="text-center">
                <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Max Size</p>
                <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400">10 MB</p>
             </div>
          </div>
        </motion.div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
    </div>
  );
}

export default ImageUpload;
