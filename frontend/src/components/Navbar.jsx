import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogIn, Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navbar Component (Premium Public Version)
 * Follows the high-end floating aesthetics of the application.
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on landing page, we could redirect to /#id
      window.location.href = `/#${id}`;
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <div className="sticky top-0 left-0 right-0 z-[100] px-4 sm:px-6 py-4 sm:py-6 pointer-events-none flex justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-7xl relative"
      >
        <div className="w-full flex items-center justify-between p-2 rounded-full bg-slate-950/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden">
          {/* Subtle Shine Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />

          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 pl-4 pr-6 py-2 group rounded-full transition-all duration-300 shrink-0">
            <span className="font-black text-lg sm:text-xl text-white tracking-tighter uppercase">
              Plant<span className="text-lime-400">Scan</span>
            </span>
          </NavLink>

          {/* Desktop Nav - Middle */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Nav - Right */}
          <div className="hidden md:flex items-center gap-2 pr-2">
            <NavLink
              to="/login"
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="flex items-center gap-2 bg-lime-500 text-slate-950 px-6 py-2.5 rounded-full hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 text-[10px] font-black uppercase tracking-widest group"
            >
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              Sign Up
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden pr-4 pointer-events-auto">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white border border-white/10 transition-all active:scale-90"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 p-4 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl pointer-events-auto md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                  >
                    {link.label}
                  </button>
                ))}
                
                <div className="h-px bg-white/5 my-2" />

                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl border border-white/5 transition-all"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center text-xs font-black uppercase tracking-widest bg-lime-500 text-slate-950 hover:bg-lime-400 rounded-2xl shadow-xl shadow-lime-500/10 flex items-center justify-center gap-3 transition-all"
                >
                  <Sparkles size={16} />
                  Start Scanning
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Navbar;
