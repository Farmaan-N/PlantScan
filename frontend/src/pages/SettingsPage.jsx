import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Cloud,
  Zap,
  LogOut
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../hooks/AuthContext';

/**
 * SettingsPage
 * Allows users to manage their profile, password, and account with a premium control-center UI.
 */
function SettingsPage() {
  const { user, updateProfile, updatePassword, deleteAccount, signOut } = useAuth();
  const navigate = useNavigate();
  
  // States for form inputs
  const [username, setUsername] = useState(user?.user_metadata?.username || user?.email?.split('@')[0] || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status messages
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileStatus({ type: '', message: '' });
    try {
      await updateProfile({ username });
      setProfileStatus({ type: 'success', message: 'Username updated successfully!' });
    } catch (err) {
      setProfileStatus({ type: 'error', message: err.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    
    setIsUpdatingPassword(true);
    setPasswordStatus({ type: '', message: '' });
    try {
      await updatePassword(password);
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: This will permanently delete your account data and sign you out. This action cannot be undone. Proceed?')) {
      try {
        await deleteAccount();
      } catch (err) {
        alert('Failed to delete account: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader 
        badge="Account Settings"
        title={<>Profile & <span className="text-gradient">Security</span></>}
        subtitle="Manage your profile details and keep your account secure."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions & Specs */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-8 border-white/5 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-lime-500/10 transition-colors" />
              
              <div className="flex flex-col items-center text-center mb-10">
                 <div className="relative mb-6">
                    <div className="w-24 h-24 bg-slate-900 border-2 border-white/10 rounded-full flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                       <span className="text-4xl font-black text-white">{username?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-lime-500 border-4 border-slate-950 rounded-full flex items-center justify-center z-20">
                       <ShieldCheck size={14} className="text-slate-950" />
                    </div>
                 </div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate w-full">{username}</h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{user?.email}</p>
              </div>

              <div className="space-y-4">
                 {[
                   { label: 'Security Level', value: 'High', icon: Lock, color: 'text-lime-400' },
                   { label: 'Cloud Status', value: 'Synced', icon: Cloud, color: 'text-blue-400' },
                   { label: 'Data Safety', value: 'Secure', icon: ShieldCheck, color: 'text-emerald-400' }
                 ].map((spec, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <spec.icon size={14} className="text-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{spec.label}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${spec.color}`}>{spec.value}</span>
                   </div>
                 ))}
              </div>

               <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-lime-500/5 rounded-lg border border-lime-500/10 mb-2">
                     <Zap size={14} className="text-lime-500" />
                     <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest">Premium Member</span>
                  </div>

                  {/* MOBILE-ONLY LOGOUT BUTTON (Visible on small screens) */}
                  <div className="sm:hidden pt-4">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 h-14 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
                     >
                        <LogOut size={16} />
                        LOG OUT
                     </button>
                  </div>
               </div>
            </GlassCard>

            {/* DESKTOP SESSION CONTROL CARD (Unique implementation) */}
            <GlassCard className="hidden sm:block p-6 border-white/5 bg-white/[0.01]">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                  <ShieldCheck size={14} /> SESSION CONTROL
               </h3>
               <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between group py-2"
               >
                  <div className="text-left">
                     <p className="text-xs font-black text-white uppercase tracking-tight">Log Out</p>
                     <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">End your session securely</p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 group-hover:bg-red-500/10 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-red-500 transition-all border border-white/5">
                     <LogOut size={16} />
                  </div>
               </button>
            </GlassCard>
         </div>

        {/* Right Column: Main Configs */}
        <div className="lg:col-span-8 space-y-8">
           {/* Profile Information */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                 <User size={16} className="text-lime-400" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Account Details</h3>
              </div>
              <GlassCard className="p-8 border-white/5">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                      <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-premium bg-white/[0.03] border-white/5 focus:bg-white/[0.08]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Email</label>
                      <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-slate-500 opacity-50 cursor-not-allowed text-sm">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  {profileStatus.message && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-white/5 bg-white/5">
                      {profileStatus.type === 'success' ? <CheckCircle2 size={14} className="text-lime-400" /> : <XCircle size={14} className="text-red-400" />}
                      <span className={profileStatus.type === 'success' ? 'text-white' : 'text-red-400'}>{profileStatus.message}</span>
                    </motion.div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdatingProfile} className="px-10">
                      {isUpdatingProfile ? 'SAVING...' : 'SAVE PROFILE'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
           </div>

           {/* Security / Password */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                 <Lock size={16} className="text-emerald-400" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Security Settings</h3>
              </div>
              <GlassCard className="p-8 border-white/5">
                <form onSubmit={handleUpdatePassword} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-premium bg-white/[0.03] border-white/5 focus:bg-white/[0.08]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-premium bg-white/[0.03] border-white/5 focus:bg-white/[0.08]"
                        />
                      </div>
                   </div>

                   {passwordStatus.message && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border ${passwordStatus.type === 'success' ? 'bg-lime-500/5 border-lime-500/10 text-lime-400' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}>
                      {passwordStatus.type === 'success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {passwordStatus.message}
                    </motion.div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" variant="secondary" disabled={isUpdatingPassword} className="px-10">
                      {isUpdatingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
           </div>

           {/* Danger Zone */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                 <AlertTriangle size={16} className="text-red-500" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Danger Zone</h3>
              </div>
              <GlassCard className="p-8 border-red-500/10 bg-red-500/[0.03]">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                       <h4 className="text-lg font-black text-white uppercase tracking-tight">Delete Account</h4>
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Permanently erase all your plant data and history.</p>
                    </div>
                    <Button variant="danger" onClick={handleDeleteAccount} noShimmer className="px-10 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all">
                       <Trash2 size={16} /> DELETE EVERYTHING
                    </Button>
                 </div>
              </GlassCard>
           </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="pt-20 pb-10 flex flex-col items-center gap-4 border-t border-white/5">
         <div className="flex items-center gap-3 opacity-20">
            <div className="h-[1px] w-12 bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="h-[1px] w-12 bg-white" />
         </div>
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
           PlantScan v1.0
         </p>
      </div>
    </div>
  );
}

export default SettingsPage;
