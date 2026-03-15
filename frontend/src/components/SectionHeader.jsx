import { motion } from 'framer-motion';

function SectionHeader({ title, subtitle, badge, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative">
      <div className="space-y-4">
        {badge && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/[0.6] text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.6)]" />
            {badge}
          </motion.div>
        )}
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 font-medium max-w-lg"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {actions && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}

export default SectionHeader;
