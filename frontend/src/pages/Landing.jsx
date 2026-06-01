import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion'
import SparkleButton from '../components/SparkleButton'
import GlassCard from '../components/GlassCard'
import { 
  Sparkles, 
  BrainCircuit, 
  Mic, 
  LineChart, 
  ShieldCheck, 
  FileText, 
  Zap,
  ArrowRight
} from 'lucide-react'

function FeatureCard({ title, description, icon: Icon }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-glass transition-all duration-300 hover:border-emerald-500/30"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.12),
              transparent 80%
            )
          `
        }}
      />
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-accentEmerald mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Glow Ambient Lights */}
      <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none" />

      {/* Header / Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/40 bg-darkBg/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-lg">
              P
            </span>
            <span className="font-bold text-xl tracking-tight text-white font-sans">
              PrepPro<span className="text-accentEmerald">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <button className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-accentEmerald"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Next-Gen AI Interview Coaching
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-sans"
          >
            Master your dream job interviews with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent text-glow">
              Real-Time AI
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume, get custom mock interview questions, receive real-time audio pacing feedback, and review detailed emotional sentiment analytics.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/register">
              <SparkleButton className="w-full sm:w-auto px-8 py-4 text-base">
                Start Interviewing Free
                <ArrowRight className="h-5 w-5" />
              </SparkleButton>
            </Link>
            <Link to="/login">
              <button className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-900/40 px-8 py-4 font-semibold text-white hover:bg-slate-900/80 transition-colors">
                View Sample Reports
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sans">Tailored Mock Panels, Automated Intelligence</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Everything you need to analyze tone, confidence, pacing, and core competencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Resume Parsing" 
            description="Upload your PDF or Word resume. Our parser auto-extracts technical keywords and tailors questions targeting your exact skill matrix."
            icon={FileText}
          />
          <FeatureCard 
            title="Company-Specific Prompts" 
            description="Specify target companies (e.g. Amazon Leadership Principles, Google Core Competencies) to inject behavioral constraints."
            icon={BrainCircuit}
          />
          <FeatureCard 
            title="Live Waveform Visualizer" 
            description="Talk directly. The interface registers vocal audio streams, rendering Web Audio Analyser waveforms on HTML Canvas."
            icon={Mic}
          />
          <FeatureCard 
            title="Filler Word Scanner" 
            description="Flags speech pacing anomalies by scanning verbal submissions for filler terms like 'like', 'um', 'uh', and 'basically'."
            icon={Zap}
          />
          <FeatureCard 
            title="Emotion Vectors" 
            description="Understands emotional sentiment dynamically, classifying speech response vectors from ANXIOUS to PROFESSIONAL."
            icon={ShieldCheck}
          />
          <FeatureCard 
            title="Comprehensive Portal" 
            description="Review radar and bar charts tracking skill levels per-question, coupled with personalized action cards for improvement."
            icon={LineChart}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/20 py-12 text-center text-sm text-slate-500 mt-12">
        <p>© 2026 PrepPro AI. Built for premium technical interview readiness.</p>
      </footer>
    </div>
  )
}
