import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, ArrowLeft, AlertCircle, CheckCircle2, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

/**
 * AuthPage component
 * A premium split-screen authentication experience with sliding transitions.
 * Combines Login and Signup into a single high-fidelity interface.
 */
function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  // Set initial mode based on route
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with URL if user navigates via browser buttons
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setError('');
    setSuccess(false);
  }, [location.pathname]);

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    setError('');
    setSuccess(false);
    navigate(newMode ? '/login' : '/signup', { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        if (error.message.includes('rate limit')) throw new Error('Email rate limit exceeded. Please try again.');
        throw error;
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 py-8 sm:p-0">
      <div className="relative w-full max-w-4xl min-h-[580px] sm:h-[540px] flex flex-col sm:block overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] glass-card !bg-slate-950/40 shadow-2xl border-white/10 border transform transition-all duration-300">
        
        {/* Back to Home Link (Responsive Positioning) */}
        <Link 
          to="/" 
          className={`absolute top-4 left-4 sm:top-6 sm:left-6 z-[200] inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em] ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'} duration-500`}
        >
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden xs:inline">BACK TO HOME</span>
        </Link>
        <Link 
          to="/" 
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-[200] inline-flex items-center gap-2 text-slate-300 hover:text-white transition-all group font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em] ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'} duration-500`}
        >
          <span className="hidden xs:inline">BACK TO HOME</span>
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform rotate-180" />
          </div>
        </Link>

        {/* ── SPLIT SCREENS ────────────────────────────────────── */}
        
        {/* LOGIN FORM */}
        <div className={`
          relative sm:absolute left-0 top-0 w-full sm:w-1/2 min-h-[500px] sm:h-full flex flex-col justify-center px-6 sm:px-12 py-10 transition-all duration-700 ease-in-out
          ${isLogin ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-10 sm:translate-x-[-20%] invisible sm:visible'}
        `}>
          <div className="space-y-6 max-w-sm mx-auto w-full pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lime-400 font-black uppercase tracking-[0.2em] text-[10px]">
                <ShieldCheck size={12} /> PLANT IDENTIFICATION
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white leading-none">WELCOME <br /><span className="text-lime-500">BACK</span></h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Sign in to access your plant collection.</p>
            </div>

            {error && isLogin && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-lime-500 transition-colors" size={16} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com" 
                    className="input-premium pl-11 py-2.5 bg-white/[0.02] border-white/5 focus:bg-white/[0.05]" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-lime-500 transition-colors" size={16} />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="input-premium pl-11 py-2.5 bg-white/[0.02] border-white/5 focus:bg-white/[0.05]" 
                    required 
                  />
                </div>
              </div>

              <Button type="submit" fullWidth disabled={loading} className="!py-3.5 tracking-[0.2em] font-black !rounded-xl shadow-xl shadow-lime-500/10 mt-2">
                {loading ? <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <>SIGN IN <LogIn size={16} /></>}
              </Button>

              <div className="sm:hidden text-center pt-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  NEW TO PLANTSCAN? {' '}
                  <button type="button" onClick={toggleMode} className="text-white hover:text-lime-400 underline underline-offset-4 decoration-lime-500/50">CREATE ACCOUNT</button>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM */}
        <div className={`
          relative sm:absolute right-0 top-0 w-full sm:w-1/2 min-h-[550px] sm:h-full flex flex-col justify-center px-6 sm:px-12 py-10 transition-all duration-700 ease-in-out
          ${!isLogin ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-10 sm:translate-x-[20%] invisible sm:visible'}
        `}>
          <div className="space-y-6 max-w-sm mx-auto w-full pt-4">
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="w-16 h-16 bg-lime-500/10 border border-lime-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-lime-500/10">
                  <CheckCircle2 className="text-lime-500" size={32} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Email Sent</h3>
                   <p className="text-slate-500 text-xs font-medium leading-relaxed">Verification link sent to <br /><span className="text-white">{email}</span></p>
                </div>
                <Button onClick={toggleMode} fullWidth className="!rounded-xl !py-3">BACK TO SIGN IN</Button>
              </motion.div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">
                    <Sparkles size={12} /> START EXPLORING
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white leading-none">CREATE <br /><span className="text-emerald-500">ACCOUNT</span></h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Join us to identify plants instantly.</p>
                </div>

                {error && !isLogin && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle size={14} className="shrink-0" /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="name@example.com" 
                        className="input-premium pl-11 py-2.5 bg-white/[0.02] border-white/5 focus:bg-white/[0.05]" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        className="input-premium py-2.5 bg-white/[0.02] border-white/5 focus:bg-white/[0.05]" 
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm</label>
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="••••••••" 
                        className="input-premium py-2.5 bg-white/[0.02] border-white/5 focus:bg-white/[0.05]" 
                        required 
                      />
                    </div>
                  </div>

                  <Button type="submit" fullWidth disabled={loading} className="!py-3.5 tracking-[0.2em] font-black !rounded-xl !bg-emerald-600 shadow-xl shadow-emerald-500/10 mt-2">
                    {loading ? <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <>SIGN UP <UserPlus size={16} /></>}
                  </Button>

                  <div className="sm:hidden text-center pt-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      ALREADY HAVE AN ACCOUNT? {' '}
                      <button type="button" onClick={toggleMode} className="text-white hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/50">SIGN IN NOW</button>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── THE SLIDING OVERLAY (Desktop Only) ───────────────────────────────── */}
        <motion.div
           animate={{ x: isLogin ? '100%' : '0%' }}
           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
           className="hidden sm:block absolute top-0 left-0 w-1/2 h-full z-50 overflow-hidden pointer-events-auto shadow-[-20px_0_50px_rgba(0,0,0,0.5)] bg-slate-900"
        >
           {/* Background Image Panel */}
           <div className="relative w-[200%] h-full flex transition-transform duration-[0.6s] ease-[cubic-bezier(0.22, 1, 0.36, 1)]" style={{ transform: isLogin ? 'translateX(-50%)' : 'translateX(0%)' }}>
              <div className="w-full h-full relative">
                 <img src="/auth_bg_botanical_1773584546373.png" alt="Botanical Overlay" className="w-full h-full object-cover blur-[2px] scale-[1.05]" />
                 <div className="absolute inset-0 bg-slate-950/50" />
              </div>
              <div className="w-full h-full relative">
                 <img src="/auth_bg_botanical_1773584546373.png" alt="Botanical Overlay" className="w-full h-full object-cover blur-[2px] scale-[1.05]" />
                 <div className="absolute inset-0 bg-slate-950/50" />
              </div>
           </div>

           {/* Content on the Sliding Panel */}
           <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <AnimatePresence mode="wait">
                 {isLogin ? (
                    <motion.div 
                      key="to-signup" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                       <div className="space-y-3">
                          <h3 className="text-3xl font-black tracking-tighter uppercase text-white">NEW TO<br />PLANTSCAN?</h3>
                          <p className="text-slate-300 text-sm font-medium max-w-[240px] mx-auto leading-relaxed">Create an account to start scanning plants and building your collection.</p>
                       </div>
                       <button onClick={toggleMode} className="inline-flex items-center gap-3 group px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all">
                          SIGN UP NOW <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </motion.div>
                 ) : (
                    <motion.div 
                      key="to-login" 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                       <div className="space-y-3">
                          <h3 className="text-3xl font-black tracking-tighter uppercase text-white">HAVE AN<br />ACCOUNT?</h3>
                          <p className="text-slate-300 text-sm font-medium max-w-[240px] mx-auto leading-relaxed">Sign in to view your scanned plants and save new discoveries.</p>
                       </div>
                       <button onClick={toggleMode} className="inline-flex items-center gap-3 group px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all">
                          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> SIGN IN NOW
                       </button>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
           
           {/* Decorative Grid */}
           <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        </motion.div>

      </div>
      
      {/* Background Decorative Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-[-1] bg-mesh" />
    </div>
  );
}

export default AuthPage;
