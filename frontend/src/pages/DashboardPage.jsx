import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Clock, Leaf, TrendingUp, ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import RecentScans from '../components/RecentScans';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import { getScanHistory } from '../services/api';
import { useAuth } from '../hooks/AuthContext';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState([]);
  const [stats, setStats] = useState({ totalScans: 0 });
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await getScanHistory(5);
        setRecentScans(result.data || []);
        if (result.stats) setStats(result.stats);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const dashboardStats = [
    { 
      icon: Activity, 
      label: 'System Status', 
      value: 'Operational', 
      detail: 'AI Engine Active',
      color: 'text-lime-400', 
      bg: 'bg-lime-500/10'
    },
    { 
      icon: Leaf, 
      label: 'Your Collection', 
      value: stats.totalScans || '0', 
      detail: 'Unique Species Found',
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10'
    },
    { 
      icon: ShieldCheck, 
      label: 'Accuracy Rating', 
      value: recentScans.length > 0 ? `${Math.round(recentScans.reduce((acc, s) => acc + s.confidence, 0) / recentScans.length)}%` : '98.4%', 
      detail: 'Global AI Benchmark',
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10'
    },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Premium Header */}
      <SectionHeader 
        badge="Botanical Dashboard"
        title={<>Welcome <span className="text-gradient">Back</span></>}
        subtitle={`Hello ${user?.email?.split('@')[0] || 'Explorer'}, your botanical exploration gateway is ready. What would you like to scan today?`}
        actions={
          <Button onClick={() => navigate('/scan')} className="px-8 !py-4 shadow-2xl group shadow-lime-500/20">
            <Camera size={20} className="group-hover:rotate-12 transition-transform" />
            START NEW SCAN
          </Button>
        }
      />

      {/* Hero Quick Action & Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* NEW SCAN HERO CARD */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-2 relative group cursor-pointer"
          onClick={() => navigate('/scan')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 to-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <GlassCard className="p-8 h-full border-lime-500/20 bg-lime-500/[0.02] flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/5 -mr-32 -mt-32 rounded-full blur-3xl animate-pulse" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-lime-500/40">
                <Zap size={32} className="text-slate-950 fill-current" />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Instant Analysis</h3>
              <p className="text-slate-400 max-w-xs font-medium">Use our neural vision engine to identify plants with over 99% accuracy in seconds.</p>
            </div>
            <div className="mt-12 flex items-center gap-2 text-lime-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Launch Scanner <ArrowRight size={16} />
            </div>
          </GlassCard>
        </motion.div>

        {/* STATS VERTICAL STACK */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full font-black">
          {dashboardStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 h-full flex flex-col justify-center border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">{stat.label}</span>
                </div>
                <div className="text-2xl text-white tracking-tight uppercase leading-none mb-1">{stat.value}</div>
                <div className="text-[9px] text-slate-600 uppercase tracking-tighter">{stat.detail}</div>
              </GlassCard>
            </motion.div>
          ))}
          <Button 
            variant="secondary" 
            className="h-full !rounded-[1rem] border-dashed border-2 border-white/5 hover:border-white/20 bg-transparent flex flex-col items-center justify-center p-6"
            onClick={() => navigate('/history')}
          >
            <Clock size={24} className="mb-2 text-slate-500" />
            <span className="text-[10px] tracking-widest opacity-60">VIEW FULL HISTORY</span>
          </Button>
        </div>
      </div>

      {/* Activity Section */}
      <section className="relative pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase text-white">Recent <span className="text-lime-400">Discoveries</span></h2>
            <p className="text-slate-500 text-sm font-medium">Log of your latest botanical findings</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 border border-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Manage Collection
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-4">
            <RecentScans scans={recentScans} limit={3} />
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
