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
    scan.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <SectionHeader 
        badge="Botanical Archives"
        title={<>Plant <span className="text-gradient">Collection</span></>}
        subtitle="Access your complete log of identified species and architectural plant data."
        actions={
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
             <div className="relative group w-full sm:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-lime-400 transition-colors" />
                <input 
                  type="text"
                  placeholder="Filter botanical records..."
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
             { label: 'Archive Capacity', value: `${scans.length} / 100`, detail: 'System Utilization', icon: Database, color: 'text-slate-400' },
             { label: 'Species Diversity', value: new Set(scans.map(s => s.plant_name)).size, detail: 'Unique Identifications', icon: Library, color: 'text-lime-400' },
             { label: 'AI Reliability', value: `${Math.round(scans.reduce((acc, s) => acc + s.confidence, 0) / (scans.length || 1))}%`, detail: 'Average Accuracy', icon: Sparkles, color: 'text-emerald-400' },
             { label: 'Data Status', value: 'Synced', detail: 'Encrypted Cloud Storage', icon: RefreshCw, color: 'text-blue-400' }
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
               <Loader message="Accessing secure botanical archives..." />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20">
              <GlassCard className="p-16 text-center border-red-500/20 max-w-xl mx-auto !bg-slate-950/60 shadow-2xl">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                   <AlertCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Sync Error Detected</h3>
                <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto">{error}</p>
                <div className="flex justify-center">
                  <button onClick={fetchHistory} className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all">
                     <RefreshCw size={16} /> Re-establish Connection
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div 
              key="list" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-4"
            >
              <RecentScans
                scans={filteredScans}
                onDelete={handleDelete}
                showDeleteButton={true}
              />
              
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
      <div className="pt-20 border-t border-white/5 flex items-center justify-center gap-4">
         <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-white/10" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Protocol Complete</p>
         <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-white/10" />
      </div>
    </div>
  );
}

export default HistoryPage;
