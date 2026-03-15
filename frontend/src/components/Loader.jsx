import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Loader Component
 * Premium animated scanner loader
 */
function Loader({ message = 'Loading...', size = 'lg' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`${sizeMap[size]} rounded-full border-2 border-white/5 border-t-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.2)]`}
        />
        
        {/* Pulsing Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-lime-500/20 blur-xl rounded-full"
          />
          <Leaf size={size === 'lg' ? 32 : 16} className="text-lime-400 relative z-10" />
        </div>
      </div>

      <div className="text-center space-y-3">
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white font-black uppercase tracking-[0.2em] text-xs"
        >
          {message}
        </motion.p>
        
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], backgroundColor: ['#475569', '#84cc16', '#475569'] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loader;
