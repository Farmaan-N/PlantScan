import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../hooks/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * AppLayout - Orchestrates the sidebar and main content area
 */
function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const containerRef = useRef(null);
  
  // Public routes don't show the sidebar
  const publicRoutes = ['/', '/login', '/signup'];
  const isPublic = publicRoutes.includes(location.pathname);
  
  // Custom transition variant
  const pageVariants = {
    initial: { opacity: 0, x: -10, filter: 'blur(10px)' },
    enter: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: 10, filter: 'blur(10px)' }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-slate-950 bg-mesh relative selection:bg-lime-500/30 selection:text-lime-200 overflow-x-hidden"
    >
      {/* Background Orbs and Noise remain absolute/fixed to the container */}
      <div className="noise" />
      
      {/* Dynamic Background Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full animate-pulse pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full animate-float pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/[0.02] blur-[150px] rounded-full pointer-events-none z-0" />
      
      {user && !isPublic ? (
        <div className="flex flex-col min-h-screen">
          {/* HEADER SECTION - NO BACKGROUND, PILL FLOATS FREELY */}
          <header className="sticky top-0 z-[100]">
            <Sidebar />
          </header>

          {/* MAIN CONTENT SECTION */}
          <main className="flex-grow relative z-10 transition-all duration-700">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* FOOTER SECTION */}
          <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-slate-950/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                   <div className="w-4 h-4 border border-lime-400 shape-leaf" />
                </div>
                <span className="font-black text-lg text-white tracking-tighter uppercase">
                  Plant<span className="text-lime-400">Scan</span>
                </span>
              </div>
              
              <div className="flex items-center gap-8">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">© 2026 PlantScan AI System</p>
                <div className="flex items-center gap-4">
                  {['Privacy', 'Terms', 'Docs'].map(link => (
                    <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Functional</span>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* PUBLIC LAYOUT */
        <div className="relative min-h-screen">
          {location.pathname === '/' ? <Navbar /> : null}
          {!isPublic && user && <Sidebar />}
          <main className={location.pathname === '/' ? 'relative z-10 min-h-screen' : 'relative z-10 min-h-screen flex items-center justify-center p-4'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={location.pathname === '/' ? 'w-full' : 'w-full flex justify-center'}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
