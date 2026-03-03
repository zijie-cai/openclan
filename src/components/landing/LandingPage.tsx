import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mascot } from './Mascot';
import { useAppStore } from '../../store/useAppStore';
import { FileText, Layers, Activity, ArrowRight, Mic, Edit3, ShieldCheck, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from '../ui/Logo';

export const LandingPage: React.FC = () => {
  const { startApp } = useAppStore();
  const [isMascotHovered, setIsMascotHovered] = useState(false);

  const features = [
    {
      Icon: FileText,
      title: "Native .cha Generation",
      description: "Generate structured transcripts directly from audio. No installation required. Private by default—your data stays yours."
    },
    {
      Icon: Layers,
      title: "Automatic Tiers",
      description: "Instantly build %mor, %gra, and %err tiers. Lock them, regenerate selectively, or edit manually at any time."
    },
    {
      Icon: Activity,
      title: "Live Metrics",
      description: "Dynamically compute MLU, TTR, FREQ, and CoreLex. Metrics update instantly as you edit your transcripts."
    },
    {
      Icon: Mic,
      title: "Speaker Diarization",
      description: "Automatically detect and label speakers from uploaded audio files. Works with any conversational audio."
    },
    {
      Icon: Edit3,
      title: "Full Control",
      description: "A modern, AI-assisted workflow for CLAN-style analysis. Fully editable and researcher-controlled—your choice."
    },
    {
      Icon: ShieldCheck,
      title: "Strict Compliance",
      description: "Fully compatible with existing tools. Export strict CHAT-compliant data to .cha, .csv, and .json for downstream analysis."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500/30 relative">
      {/* Deep Ocean Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-[#020617]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

      <main className="relative z-10 flex flex-col items-center px-4 pt-12 pb-4 max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-3xl"
        >
          <motion.div 
            className="flex flex-col items-center mb-0 relative z-20 cursor-pointer"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            onMouseEnter={() => setIsMascotHovered(true)}
            onMouseLeave={() => setIsMascotHovered(false)}
          >
            <Mascot className="scale-90 sm:scale-100 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]" />
          </motion.div>
          
          <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter -mt-6 mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-[#FFD166] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent relative z-10">
            OpenCLAN
          </h1>

          <div className="relative h-6 sm:h-8 mb-12 mt-4 w-full flex items-center justify-center">
            <p className={`absolute text-sm sm:text-base font-bold tracking-[0.2em] text-cyan-400 uppercase transition-all duration-500 ease-out ${isMascotHovered ? "opacity-0 translate-y-4 scale-90 blur-sm" : "opacity-100 translate-y-0 scale-100 blur-0"}`}>
              The AI that analyzes language.
            </p>
            <p className={`absolute text-sm sm:text-base font-black tracking-[0.3em] text-[#FFD166] uppercase drop-shadow-[0_0_15px_rgba(255,209,102,0.8)] animate-shake transition-all duration-500 ease-out ${isMascotHovered ? "opacity-100 translate-y-0 scale-110 blur-0" : "opacity-0 -translate-y-4 scale-90 blur-sm"}`}>
              PEARL! PEARL!
            </p>
          </div>

          <div className="space-y-4 text-lg sm:text-xl font-medium text-slate-300 mb-10 flex flex-col items-center">
            <p className="flex items-center justify-center gap-2">
              Generates <span className="font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded">.cha</span> transcripts.
            </p>
            <p className="flex items-center justify-center gap-2">
              Builds <span className="font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded">%mor</span>, <span className="font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded">%gra</span>, and <span className="font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded">%err</span> tiers.
            </p>
            <p>Computes MLU, TTR, FREQ.</p>
            <p className="text-cyan-400 font-semibold mt-2">All from audio you upload.</p>
          </div>

          <p className="text-slate-400 mb-10">
            Modern CLAN. Fully editable. Fully compatible.
          </p>

          <Button 
            onClick={startApp}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] transition-all hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.7)] hover:-translate-y-1"
          >
            Try Early Beta <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-40 w-full"
        >
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <span className="text-cyan-500">&gt;</span>
              What It Does
              <span className="text-cyan-500">&lt;</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)] transition-all duration-300 group flex flex-col items-start text-left"
              >
                <div className="w-full flex justify-center mb-8">
                  <feature.Icon className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 w-full border-t border-white/5 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6 px-6 max-w-6xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-0.5">
              <div className="mt-[9px]">
                <Logo />
              </div>
              <span className="font-mono text-lg font-bold tracking-tight text-slate-200">
                OpenCLAN
              </span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
            <p className="text-slate-500 text-sm font-medium">
              Modernizing linguistic analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
            <span className="text-slate-500">
              Designed & Built by{' '}
              <a 
                href="https://zijiecai.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 hover:text-[#FFD166] font-medium transition-colors duration-300"
              >
                Zijie Cai
              </a>
            </span>
            
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
            
            <a 
              href="https://github.com/zijie-cai/openclan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan-400 hover:text-[#FFD166] font-medium transition-colors duration-300 group"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Open Source on GitHub</span>
            </a>
          </div>
        </motion.footer>

      </main>
    </div>
  );
};
