import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import SparkleButton from '../components/SparkleButton'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { 
  Home, 
  ArrowLeft, 
  Award, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Smile 
} from 'lucide-react'

export default function AnalyticsPortal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { authenticatedFetch } = useAuth()
  
  const [session, setSession] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Expandable list items
  const [expandedIndex, setExpandedIndex] = useState(null)

  // Default Mock Fallback Data
  const defaultReport = {
    overallScore: 82,
    skillBreakdown: '{"Communication":85,"Technical":78,"Behavioral":90,"Pacing":75}',
    suggestions: `### Core Optimization Guidelines

- ⚠️ **Speech Pacing**: You averaged **2.7** filler words per reply. Try pausing deliberately for 1 second instead of voicing fillers.
- ✨ **High behavioral performance**: Star answers demonstrate high alignment with modern team settings.
- 💡 **Technical Depth**: Introduce specific system design trade-offs (e.g. explaining horizontal scaling implications) to boost technical points.`
  }

  const defaultSession = {
    id: 'mock-session-123',
    company: 'Google',
    targetRole: 'Frontend Developer',
    questions: [
      {
        id: 1,
        content: 'Tell me about yourself and your experience working with React and Tailwind CSS.',
        type: 'BEHAVIORAL',
        response: {
          transcript: "Honestly, in my last project, we, um, had to build a real-time messaging server. It was, like, quite difficult because we had to scale to thousands of active sessions, basically. But we resolved it using Redis.",
          confidenceScore: 85,
          fillerWordCount: 3,
          emotionVector: 'PROFESSIONAL'
        }
      },
      {
        id: 2,
        content: 'How would you build a micro-frontend architecture? What are the key performance bottlenecks?',
        type: 'TECHNICAL',
        response: {
          transcript: "So, micro-frontends can be built using module federation. I, uh, usually prefer this to minimize bundle sizing, though orchestrating standard routing gets slightly complex. Pacing was mostly professional.",
          confidenceScore: 78,
          fillerWordCount: 2,
          emotionVector: 'NEUTRAL'
        }
      },
      {
        id: 3,
        content: 'Describe a situation where you had a disagreement with your project manager regarding a deadline.',
        type: 'BEHAVIORAL',
        response: {
          transcript: "I once argued for delaying a feature to complete integration testing. We, like, discussed details and reached a consensus. I was very enthusiastic about quality delivery.",
          confidenceScore: 90,
          fillerWordCount: 1,
          emotionVector: 'ENTHUSIASTIC'
        }
      }
    ]
  }

  useEffect(() => {
    fetchReportData()
  }, [id])

  const fetchReportData = async () => {
    try {
      if (id === 'mock-session-123') {
        setSession(defaultSession)
        setReport(defaultReport)
        setLoading(false)
        return
      }

      // Fetch session detail
      const sessionRes = await authenticatedFetch(`/api/interviews/${id}`)
      const reportRes = await authenticatedFetch(`/api/analytics/reports/${id}`)
      
      if (sessionRes.ok && reportRes.ok) {
        const sessionData = await sessionRes.json()
        const reportData = await reportRes.json()
        setSession(sessionData)
        setReport(reportData)
      } else {
        throw new Error('Failed to retrieve performance report details')
      }
    } catch (err) {
      // Load fallback
      setSession(defaultSession)
      setReport(defaultReport)
    } finally {
      setLoading(false)
    }
  }

  // Parse skill breakdown JSON
  const getRadarData = () => {
    if (!report) return []
    try {
      const skills = JSON.parse(report.skillBreakdown)
      return Object.keys(skills).map(key => ({
        subject: key,
        score: skills[key],
        fullMark: 100
      }))
    } catch (e) {
      return [
        { subject: 'Communication', score: 85 },
        { subject: 'Technical', score: 78 },
        { subject: 'Behavioral', score: 90 },
        { subject: 'Pacing', score: 75 }
      ]
    }
  }

  const getBarData = () => {
    if (!session || !session.questions) return []
    return session.questions.map((q, i) => ({
      name: `Q${i + 1}`,
      'Confidence Score': q.response ? q.response.confidenceScore : 0,
      'Filler Words': q.response ? q.response.fillerWordCount : 0
    }))
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const getEmotionBadge = (vector) => {
    const colors = {
      PROFESSIONAL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      NEUTRAL: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
      ENTHUSIASTIC: 'bg-teal-500/10 text-teal-400 border-teal-500/25',
      ANXIOUS: 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[vector] || colors.NEUTRAL}`}>
        {vector}
      </span>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-300 font-medium">
            Report Summary: <strong className="text-white font-semibold">{session?.company || 'Loading'}</strong>
          </span>
        </div>
        <Link to="/dashboard">
          <SparkleButton className="px-5 py-2.5 text-sm">
            <Home className="h-4 w-4" />
            Dashboard
          </SparkleButton>
        </Link>
      </header>

      {loading ? (
        <div className="flex min-h-[70vh] items-center justify-center text-slate-500">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-accentEmerald mx-auto" />
            <p className="text-sm">Assembling performance matrices...</p>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 mt-12 space-y-10">
          
          {/* Dashboard Summary Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white font-sans tracking-tight">Performance Summary</h1>
              <p className="text-slate-400 mt-1">Review speech pacing, sentiment classification, and AI-recommended tips.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-800 px-6 py-4 rounded-2xl">
              <Award className="h-10 w-10 text-accentEmerald" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Overall Rating</p>
                <p className="text-3xl font-extrabold text-white leading-tight mt-0.5">
                  {report?.overallScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Recharts Displays Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Radar Dimension Card */}
            <GlassCard className="flex flex-col items-center justify-between" hoverEffect={false}>
              <div className="w-full text-left">
                <div className="flex items-center gap-2 text-accentEmerald font-semibold text-sm uppercase tracking-wider mb-2">
                  <TrendingUp className="h-4 w-4" />
                  Competency Vector
                </div>
                <h2 className="text-2xl font-bold text-white mb-6 font-sans">Core Skill Dimensions</h2>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                    <PolarAngleAxis dataKey="subject" stroke="rgba(255, 255, 255, 0.4)" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.1)" />
                    <Radar
                      name="Mock Profile"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Bar chart confidence metrics */}
            <GlassCard className="flex flex-col items-center justify-between" hoverEffect={false}>
              <div className="w-full text-left">
                <div className="flex items-center gap-2 text-accentEmerald font-semibold text-sm uppercase tracking-wider mb-2">
                  <Volume2 className="h-4 w-4" />
                  Question Confidence
                </div>
                <h2 className="text-2xl font-bold text-white mb-6 font-sans">Confidence vs. Pacing</h2>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getBarData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} />
                    <YAxis yAxisId="left" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#090d16', 
                        border: '1px solid rgba(16, 185, 129, 0.25)', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar yAxisId="left" dataKey="Confidence Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="Filler Words" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>

          {/* AI Tips Card Section */}
          <GlassCard className="border-emerald-500/25 bg-emerald-500/5 relative overflow-hidden" hoverEffect={false}>
            <div className="absolute top-6 right-6 text-accentEmerald opacity-20">
              <Sparkles className="h-20 w-20" />
            </div>
            
            <div className="flex items-center gap-2 text-accentEmerald font-semibold text-sm uppercase tracking-wider mb-3">
              <Sparkles className="h-4 w-4" />
              AI Improvement suggestions
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              {report?.suggestions.split('\n').map((line, idx) => {
                if (line.startsWith('###')) {
                  return <h3 key={idx} className="text-lg font-bold text-white mt-4 font-sans">{line.replace('###', '')}</h3>
                }
                return <p key={idx} className="mt-1">{line}</p>
              })}
            </div>
          </GlassCard>

          {/* Expandable Question-by-Question breakdown */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-accentEmerald" />
              Question-by-Question Transcript Analysis
            </h2>

            <div className="space-y-4">
              {session?.questions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden"
                >
                  <button 
                    onClick={() => toggleExpand(idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mr-4">
                      <span className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-white truncate max-w-2xl leading-normal">
                          {q.content}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{q.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-500/10 text-accentEmerald font-semibold border border-emerald-500/20 text-sm">
                        {q.response ? q.response.confidenceScore : 0}
                      </span>
                      {expandedIndex === idx ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedIndex === idx && q.response && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-800 bg-slate-950/20"
                      >
                        <div className="p-6 space-y-6">
                          
                          {/* Answer Metadata pills */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-1">
                              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Tone Category</span>
                              {getEmotionBadge(q.response.emotionVector)}
                            </div>
                            
                            <div className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-1">
                              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Pacing Fillers</span>
                              <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                                <Clock className="h-3.5 w-3.5 text-accentEmerald" />
                                {q.response.fillerWordCount} filler words
                              </span>
                            </div>

                            <div className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-1 col-span-2 md:col-span-1">
                              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Sentiment Tag</span>
                              <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                                <Smile className="h-3.5 w-3.5 text-accentEmerald" />
                                Dynamic Speech Match
                              </span>
                            </div>
                          </div>

                          {/* Response Text */}
                          <div className="space-y-2">
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Answer Transcript</span>
                            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                              "{q.response.transcript}"
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </main>
      )}
    </div>
  )
}
