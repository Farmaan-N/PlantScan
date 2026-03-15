import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Leaf,
  History,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className={`glass-card glass-card-hover p-10 group flex flex-col items-center text-center !rounded-none ${className} relative overflow-hidden`}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/5 relative">
      <div className="absolute inset-0 blur-xl bg-white/5 rounded-full" />
      <Icon className="w-10 h-10 text-white relative z-10" />
    </div>
    <h3 className="text-2xl font-black mb-4 text-white group-hover:text-gradient transition-all uppercase tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium text-sm">
      {description}
    </p>

    {/* Minimal Decoration */}
    <div className="mt-8 opacity-20 group-hover:opacity-100 transition-opacity">
      <div className="flex gap-1">
        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
      </div>
    </div>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Smart Recognition",
      description: "Our AI identifies plants instantly with high accuracy using just a photo.",
      className: "shape-blob-2 bg-dots border-lime-500/20"
    },
    {
      icon: Search,
      title: "Detailed Guides",
      description: "Get care info, medicinal facts, and growing tips for every plant you find.",
      className: "shape-leaf bg-grid-subtle border-emerald-500/20"
    },
    {
      icon: History,
      title: "Your History",
      description: "Keep a digital library of all your scans and findings in one secure place.",
      className: "shape-blob-3 bg-dots border-slate-500/20"
    }
  ];

  const stats = [
    { value: "5k+", label: "Plants Identified" },
    { value: "95%", label: "Accuracy" }
  ];

  return (
    <div className="relative min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-lime-400">Identify Any Plant Instantly</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 tracking-tighter leading-[0.95] sm:leading-[0.9]"
            >
              NATURE <span className="text-gradient">SIMPLIFIED</span> <br />
              BY AI.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-slate-400 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 max-w-2xl leading-relaxed font-medium px-4"
            >
              Turn your phone into a powerful plant expert. Identify flowers, trees, and herbs
              instantly with our easy-to-use scanner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto max-w-sm sm:max-w-none"
            >
              <button
                onClick={() => navigate('/signup')}
                className="btn-premium group w-full sm:w-[220px] h-16 sm:h-auto !py-4 sm:!py-5 flex items-center justify-center text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-lime-500/20 active:scale-95 transition-all"
              >
                Scan Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="btn-premium-outline w-full sm:w-[220px] h-16 sm:h-auto !py-4 sm:!py-5 flex items-center justify-center text-sm font-black uppercase tracking-[0.2em] bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] active:scale-95 transition-all backdrop-blur-xl"
              >
                Login Account
              </button>
            </motion.div>
          </div>
        </div>

        {/* Abstract Floating Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] sm:w-[120%] h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-lime-500/20 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-700/20 blur-[80px] sm:blur-[120px] rounded-full animate-float" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative z-10 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 max-w-2xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-lime-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 sm:gap-24">

            {/* About Visual - Premium Glass Composition */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative group w-full lg:self-stretch"
            >
              <div className="absolute -inset-4 bg-lime-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl w-full h-full min-h-[400px] lg:min-h-0">
                <img
                  src="/auth_bg_botanical_1773584546373.png"
                  alt="Our Botanical Vision"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 p-6 sm:p-8 glass-card rounded-3xl border-white/5 backdrop-blur-md max-w-[240px] sm:max-w-xs">
                  <p className="text-[10px] font-black text-lime-400 uppercase tracking-[0.4em] mb-3">Our Vision</p>
                  <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight uppercase">Naming Nature, <br /> Protecting Life.</h4>
                </div>
              </div>
            </motion.div>

            {/* About Content - User Friendly Narrative */}
            <div className="lg:w-1/2 space-y-10 text-center lg:text-left">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                >
                  Meet Your AI Companion
                </motion.div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-[0.95]">
                  WE HELP YOU <br /> <span className="text-gradient">UNDERSTAND</span> <br /> THE GREEN WORLD.
                </h2>
                <p className="text-slate-400 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                  PlantScan is built for regular people—not just scientists. Whether you're curious about a flower in your park or trying to save a plant in your bedroom, our AI identifies it in seconds using just a photo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                  <h5 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 justify-center lg:justify-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-500" /> FRIENDLY SCANNING
                  </h5>
                  <p className="text-slate-500 text-sm font-medium">Just point and shoot. Our AI does the heavy scientific lifting for you, instantly.</p>
                </div>
                <div className="space-y-3">
                  <h5 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 justify-center lg:justify-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-500" /> SMART LEARNING
                  </h5>
                  <p className="text-slate-500 text-sm font-medium">Get clear info on location, watering, and safety—wrapped in simple human language.</p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/signup')}
                  className="group flex items-center gap-4 text-xs font-black text-white uppercase tracking-[0.3em] hover:text-lime-400 transition-colors mx-auto lg:mx-0"
                >
                  BEGIN YOUR BOTANICAL JOURNEY
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-6">
          <div className="mb-12 sm:mb-20 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">APP <span className="text-gradient">FEATURES</span></h2>
            <p className="text-slate-400 max-w-xl text-base sm:text-lg font-medium mx-auto sm:mx-0">
              Everything you need to identify and learn about the plants around you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter uppercase">SIMPLE <span className="text-gradient">PRICING</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-medium">
              Transparent scaling for every botanical enthusiast, from casual observers to professional arborists.
            </p>
          </div>

          <div className="flex justify-center max-w-xl mx-auto">
            {/* Free Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              className="glass-card p-10 sm:p-12 rounded-[3.5rem] border-lime-500/20 bg-lime-500/[0.02] flex flex-col w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Sparkles size={120} className="text-white" />
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Seedling Plan</h3>
                <p className="text-lime-500/60 text-[10px] font-black uppercase tracking-[0.3em]">Unlimited Accessibility</p>
              </div>
              <div className="mb-10">
                <span className="text-5xl font-black text-white tracking-tighter">$0</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2">/ lifetime</span>
              </div>
              <ul className="space-y-6 flex-1 mb-12 text-left">
                {[
                  "Unlimited AI Botanical Scans",
                  "High-Precision Specimen IDs",
                  "Full Encrypted History Access",
                  "Deep Phyto-Analysis Specs",
                  "Multi-Device Sync"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">
                    <div className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_10px_#84cc16]" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="btn-premium w-full !py-5 text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-lime-500/20"
              >
                INITIALIZE ARCHIVE
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 text-2xl font-black mb-6">

                <span>Plant<span className="text-lime-400">Scan</span></span>
              </div>
              <p className="text-slate-500 max-w-xs font-medium">
                The easy way to identify and learn about plants using AI.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Connect</h4>
                <ul className="space-y-4 text-slate-500 font-medium">
                  <li><a href="#" className="hover:text-lime-400 transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-lime-400 transition-colors">Instagram</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-slate-600 font-bold text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} PlantScan App. All rights reserved.
            <br />With ❤️ by PlantScan Team
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
