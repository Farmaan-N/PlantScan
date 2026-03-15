import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Camera, 
  Clock, 
  User,
  LogOut,
  Leaf
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { motion } from 'framer-motion';

/**
 * Sidebar Component - Redeveloped as an Ultra-Wide Premium Command Pill
 * Following the specific horizontal expansion and layout requested.
 */
function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { icon: LayoutGrid, path: '/dashboard', label: 'Dashboard' },
    { icon: Camera, path: '/scan', label: 'Scanner' },
    { icon: Clock, path: '/history', label: 'History' },
  ];

  return (
    <div className="w-full pointer-events-none fixed bottom-6 left-0 right-0 sm:sticky sm:top-0 sm:bottom-auto z-[100] px-4 sm:px-6 flex justify-center">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[1600px] flex items-center justify-between p-1.5 sm:p-2 rounded-full bg-slate-950/80 sm:bg-slate-950/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden"
      >
        {/* Subtle Shine Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* SECTION 1: LOGO (LEFT - Hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-2 relative z-10 lg:w-[200px]">
          <NavLink to="/dashboard" className="flex items-center gap-3 pl-6 pr-3 py-2 group hover:bg-white/5 rounded-full transition-all duration-300">
            <span className="font-black text-xl text-white tracking-tighter uppercase whitespace-nowrap">
              Plant<span className="text-lime-400">Scan</span>
            </span>
          </NavLink>
        </div>

        {/* SECTION 2: NAVIGATION (CENTER) */}
        <nav className="flex items-center justify-around sm:justify-center flex-1 sm:flex-none gap-1 sm:gap-2 relative z-10 px-2 sm:px-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative group flex items-center justify-center transition-all duration-500
                ${isActive ? 'w-12 h-12 bg-white/10 text-white rounded-full' : 'w-12 h-12 text-slate-500 hover:text-white hover:bg-white/5 rounded-full'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={`relative z-10 ${isActive ? 'scale-110 text-lime-400' : 'scale-100'} transition-all`} />
                  {isActive && (
                    <motion.div
                      layoutId="pill-nav-active"
                      className="absolute inset-0 rounded-full bg-white/5 border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {/* Tooltip (Hidden on mobile) */}
                  <span className="hidden sm:block absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* SECTION 3: USER + LOGOUT (RIGHT) */}
        <div className="flex items-center gap-1 sm:gap-2 relative z-10 px-1 sm:px-2 lg:min-w-[200px] justify-end">
          <NavLink 
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 group transition-all duration-500 rounded-full py-1 pr-1 pl-1 sm:pl-4
              ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
            `}
          >
            <div className="text-right hidden lg:block">
              <p className="text-[10px] font-black text-white uppercase tracking-wider leading-none group-hover:text-lime-400 transition-colors whitespace-nowrap">
                {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Botanist</p>
            </div>
            <div className="relative">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2
                ${location.pathname === '/settings' 
                  ? 'bg-lime-500 text-slate-950 border-lime-400' 
                  : 'bg-slate-900 border-white/10 text-slate-500 group-hover:border-lime-500/50 group-hover:text-white'}
              `}>
                  <User size={18} />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-950 rounded-full ${location.pathname === '/settings' ? 'bg-white' : 'bg-lime-500'}`} />
            </div>
          </NavLink>

          {/* Logout Action (Modified for touch friendly sizing) */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group relative mr-1"
          >
            <LogOut size={18} sm:size={20} />
            <span className="hidden sm:block absolute -bottom-10 right-0 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-black uppercase tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              LOGOUT
            </span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default Sidebar;
