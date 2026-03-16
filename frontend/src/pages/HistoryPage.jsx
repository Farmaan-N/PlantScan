import { useEffect, useState } from 'react';
import { Clock, Trash2, RefreshCw, Library, Search, Filter, Sparkles, AlertCircle, Database, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import RecentScans from '../components/RecentScans';
import Loader from '../components/Loader';
import SectionHeader from '../components/SectionHeader';
import { getScanHistory, deleteScan } from '../services/api';

function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [visibleCount, setVisibleCount] = useState(3);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getScanHistory(100);
      setScans(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load scan history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;
    setDeletingId(id);
    try {
      await deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredScans = scans.filter(scan =>
    scan.plant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.tamil_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <SectionHeader
        badge="My History"
        title={<>My <span className="text-gradient">Plants</span></>}
        subtitle="Review all the plants you've scanned and saved to your collection."
        actions={
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative group w-full sm:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-lime-400 transition-colors" />
              <input
                type="text"
                placeholder="Search your plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium pl-12 h-12 bg-white/5 border-white/5 focus:bg-white/[0.08] w-full"
              />
            </div>
            <button
              onClick={fetchHistory}
              disabled={isLoading}
              className="h-12 w-full sm:w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-lime-500/30 transition-all active:scale-95 shrink-0"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      />

      {/* Database Context Stats */}
      {!isLoading && !error && scans.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          {[
            { label: 'Saved Scans', value: `${scans.length} / 100`, detail: 'Total history', icon: Database, color: 'text-slate-400' },
            { label: 'Found Plants', value: new Set(scans.map(s => s.plant_name)).size, detail: 'Unique species', icon: Library, color: 'text-lime-400' },
            { label: 'AI Accuracy', value: `${Math.round(scans.reduce((acc, s) => acc + s.confidence, 0) / (scans.length || 1))}%`, detail: 'Average score', icon: Sparkles, color: 'text-emerald-400' },
            { label: 'Cloud Sync', value: 'Active', detail: 'Data is backed up', icon: RefreshCw, color: 'text-blue-400' }
          ].map((stat, i) => (
            <GlassCard key={i} className="px-5 py-4 border-white/5 flex items-center justify-between group">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mb-0.5">{stat.label}</p>
                <p className="text-xl font-black text-white leading-none">{stat.value}</p>
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">{stat.detail}</p>
              </div>
              <div className={`w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={14} />
              </div>
            </GlassCard>
          ))}
        </section>
      )}

      {/* Main Content Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20">
              <Loader message="Loading your plant history..." />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20">
              <GlassCard className="p-16 text-center border-red-500/20 max-w-xl mx-auto !bg-slate-950/60 shadow-2xl">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Connection Error</h3>
                <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto">{error}</p>
                <div className="flex justify-center">
                  <button onClick={fetchHistory} className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all">
                    <RefreshCw size={16} /> Try Again
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-12"
            >
              <RecentScans
                scans={filteredScans.slice(0, visibleCount)}
                onDelete={handleDelete}
                showDeleteButton={true}
              />

              {filteredScans.length > visibleCount && (
                <div className="flex justify-center pt-8 sm:pt-12 px-4 pb-12 sm:pb-0">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 3)}
                    className="group relative w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] overflow-hidden transition-all hover:bg-white/10 hover:border-lime-500/30 active:scale-95 shadow-2xl"
                  >
                    <div className="absolute top-0 left-0 w-full h-[px] bg-gradient-to-r from-transparent via-lime-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <RefreshCw size={14} className="text-lime-500 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="whitespace-nowrap">LOAD MORE</span>
                        <span className="sm:hidden">PLANTS</span>
                      </div>
                      <span className="hidden sm:inline whitespace-nowrap">PLANTS DATA CATALOG</span>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 group-hover:border-lime-500/20 transition-colors">
                        <span className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none">
                          {filteredScans.length - visibleCount} REMAINING
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {filteredScans.length === 0 && scans.length > 0 && (
                <div className="py-32 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-slate-600" size={28} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Matches Found</h3>
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mt-2">Adjust your filter or search query</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to Top Reveal (Deco only) */}
      <div className="pt-20 pb-24 sm:pb-12 border-t border-white/5 flex items-center justify-center gap-4">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-white/10" />
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-600">End of History</p>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-white/10" />
      </div>
    </div>
  );
}

export default HistoryPage;
