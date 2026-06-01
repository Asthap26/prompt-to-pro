import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import SparkleButton from '../components/SparkleButton'
import ScoreChart from '../components/ScoreChart'
import AnimatedList, { AnimatedItem } from '../components/AnimatedList'
import { 
  PlusCircle, 
  Calendar, 
  Building2, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  Award,
  UploadCloud,
  X,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
  FolderOpen
} from 'lucide-react'

export default function Dashboard() {
  const { user, logout, authenticatedFetch } = useAuth()
  const navigate = useNavigate()
  
  // Common states
  const [loading, setLoading] = useState(true)
  
  // Candidate states
  const [interviews, setInterviews] = useState([])
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false)
  const [candidateCompany, setCandidateCompany] = useState('')
  const [candidateRole, setCandidateRole] = useState('')
  const [candidateFile, setCandidateFile] = useState(null)
  const [isInitializing, setIsInitializing] = useState(false)

  // Recruiter (Company) states
  const [recruiterJobs, setRecruiterJobs] = useState([])
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false)
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newJobCompany, setNewJobCompany] = useState('')
  const [newJobType, setNewJobType] = useState('EMPLOYEE')
  const [newJobDescription, setNewJobDescription] = useState('')
  const [newJobSkills, setNewJobSkills] = useState('')
  const [isPostingJob, setIsPostingJob] = useState(false)
  
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedJobApplications, setSelectedJobApplications] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)

  const defaultTrajectory = [
    { date: 'May 05', score: 62 },
    { date: 'May 12', score: 70 },
    { date: 'May 19', score: 68 },
    { date: 'May 24', score: 81 },
    { date: 'May 29', score: 88 }
  ]

  const defaultInterviews = [
    { id: 1, company: 'Netflix', targetRole: 'Senior Frontend Engineer', createdAt: '2026-05-29T14:30:00', status: 'COMPLETED', performanceReport: { overallScore: 88 } },
    { id: 2, company: 'Amazon', targetRole: 'Software Dev Engineer', createdAt: '2026-05-24T10:15:00', status: 'COMPLETED', performanceReport: { overallScore: 81 } },
    { id: 3, company: 'Stripe', targetRole: 'Fullstack Engineer', createdAt: '2026-05-19T18:45:00', status: 'COMPLETED', performanceReport: { overallScore: 68 } }
  ]

  useEffect(() => {
    if (!user) return

    if (user.role === 'COMPANY') {
      fetchRecruiterData()
    } else {
      fetchCandidateData()
    }
  }, [user])

  // ==========================================
  // CANDIDATE DATA FETCH
  // ==========================================
  const fetchCandidateData = async () => {
    setLoading(true)
    try {
      const response = await authenticatedFetch('/api/interviews')
      if (response.ok) {
        const data = await response.json()
        setInterviews(data.length > 0 ? data : defaultInterviews)
      } else {
        setInterviews(defaultInterviews)
      }
    } catch (e) {
      setInterviews(defaultInterviews)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // RECRUITER DATA FETCH
  // ==========================================
  const fetchRecruiterData = async () => {
    setLoading(true)
    try {
      const response = await authenticatedFetch('/api/jobs/recruiter')
      if (response.ok) {
        const data = await response.json()
        setRecruiterJobs(data)
        if (data.length > 0) {
          // Auto select first job
          handleSelectJob(data[0])
        }
      }
    } catch (e) {
      console.error('Error loading recruiter jobs:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectJob = async (job) => {
    setSelectedJob(job)
    setLoadingApplications(true)
    try {
      const response = await authenticatedFetch(`/api/jobs/${job.id}/applications`)
      if (response.ok) {
        const apps = await response.json()
        setSelectedJobApplications(apps)
      }
    } catch (e) {
      console.error('Error fetching applications:', e)
    } finally {
      setLoadingApplications(false)
    }
  }

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleLaunchInterview = async (e) => {
    e.preventDefault()
    setIsInitializing(true)
    
    try {
      const formData = new FormData()
      formData.append('company', candidateCompany)
      formData.append('role', candidateRole)
      if (candidateFile) {
        formData.append('resume', candidateFile)
      }

      const response = await authenticatedFetch('/api/interviews/initialize', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const session = await response.json()
        setIsCandidateModalOpen(false)
        navigate(`/interview/${session.id}`)
      } else {
        setTimeout(() => {
          setIsCandidateModalOpen(false)
          navigate(`/interview/mock-session-123`)
        }, 1500)
      }
    } catch (err) {
      setTimeout(() => {
        setIsCandidateModalOpen(false)
        navigate(`/interview/mock-session-123`)
      }, 1500)
    } finally {
      setIsInitializing(false)
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    setIsPostingJob(true)

    try {
      const response = await authenticatedFetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle,
          companyName: newJobCompany,
          type: newJobType,
          description: newJobDescription,
          skillsRequired: newJobSkills
        })
      })

      if (response.ok) {
        const createdJob = await response.json()
        setIsRecruiterModalOpen(false)
        setRecruiterJobs(prev => [createdJob, ...prev])
        handleSelectJob(createdJob)
        
        // Reset form
        setNewJobTitle('')
        setNewJobCompany('')
        setNewJobType('EMPLOYEE')
        setNewJobDescription('')
        setNewJobSkills('')
      } else {
        alert('Failed to post job. Please try again.')
      }
    } catch (err) {
      alert('Network error posting job')
    } finally {
      setIsPostingJob(false)
    }
  }

  // Candidate metric formatters
  const getChartData = () => {
    if (!interviews || interviews.length === 0) return defaultTrajectory
    return [...interviews]
      .filter(i => i.status === 'COMPLETED' && i.performanceReport)
      .reverse()
      .map(i => {
        const dateObj = new Date(i.createdAt)
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
        return {
          date: dateStr,
          score: i.performanceReport.overallScore
        }
      })
  }

  // Recruiter metrics
  const getRecruiterMetrics = () => {
    let totalApps = 0
    let completedApps = 0
    let scoreSum = 0

    // Since we only query applications for selected job, we can compute it dynamically
    // In a fully scaled app, a dedicated backend endpoint would exist.
    // For now we compute from loaded structures or show statistics for the active job.
    return {
      activeJobAppsCount: selectedJobApplications.length,
      activeJobCompletedCount: selectedJobApplications.filter(a => a.status === 'COMPLETED').length,
      activeJobAvgScore: selectedJobApplications.filter(a => a.status === 'COMPLETED' && a.performanceReport).length > 0
        ? Math.round(
            selectedJobApplications
              .filter(a => a.status === 'COMPLETED' && a.performanceReport)
              .reduce((acc, a) => acc + a.performanceReport.overallScore, 0) / 
            selectedJobApplications.filter(a => a.status === 'COMPLETED' && a.performanceReport).length
          )
        : 0
    }
  }

  const recMetrics = getRecruiterMetrics()

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold">
              P
            </span>
            <span className="font-bold text-lg text-white font-sans">
              PrepPro<span className="text-accentEmerald">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 border border-slate-800 px-3 py-1.5 rounded-full bg-slate-900/50">
              Role: <strong className="text-slate-200 uppercase">{user?.role}</strong>
            </span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-10">
        
        {/* ======================================================== */}
        {/* RECRUITER (COMPANY) DASHBOARD VIEW */}
        {/* ======================================================== */}
        {user?.role === 'COMPANY' && (
          <>
            {/* Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-white font-sans tracking-tight">Recruitment Dashboard</h1>
                <p className="text-slate-400 mt-1">Create Job Boards, manage candidates, and audit AI interviews.</p>
              </div>
              <SparkleButton onClick={() => setIsRecruiterModalOpen(true)} className="px-6 py-3.5 shadow-emerald-glow">
                <PlusCircle className="h-5 w-5" />
                Post New Job
              </SparkleButton>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6 flex flex-col justify-between" hoverEffect={false}>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Jobs Posted</span>
                  <h3 className="text-3xl font-extrabold text-white mt-2">{recruiterJobs.length}</h3>
                </div>
                <Briefcase className="h-6 w-6 text-accentEmerald self-end mt-4" />
              </GlassCard>

              <GlassCard className="p-6 flex flex-col justify-between" hoverEffect={false}>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Active Applicants ({selectedJob?.title || 'None Selected'})</span>
                  <h3 className="text-3xl font-extrabold text-white mt-2">{recMetrics.activeJobAppsCount}</h3>
                </div>
                <Users className="h-6 w-6 text-accentEmerald self-end mt-4" />
              </GlassCard>

              <GlassCard className="p-6 flex flex-col justify-between" hoverEffect={false}>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Average Interview Score</span>
                  <h3 className="text-3xl font-extrabold text-accentEmerald mt-2 text-glow">
                    {recMetrics.activeJobAvgScore > 0 ? `${recMetrics.activeJobAvgScore}%` : 'N/A'}
                  </h3>
                </div>
                <Award className="h-6 w-6 text-accentEmerald self-end mt-4" />
              </GlassCard>
            </div>

            {/* Split Screen Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Jobs List */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accentEmerald" />
                  Your Posted Jobs
                </h2>

                {loading ? (
                  <div className="text-slate-500 text-sm py-6">Loading recruiter jobs...</div>
                ) : recruiterJobs.length === 0 ? (
                  <GlassCard className="p-6 text-center text-slate-500" hoverEffect={false}>
                    <p className="text-sm">No job positions listed yet.</p>
                    <button 
                      onClick={() => setIsRecruiterModalOpen(true)}
                      className="text-xs text-accentEmerald underline mt-2 block mx-auto hover:text-emerald-400"
                    >
                      Post your first job opening
                    </button>
                  </GlassCard>
                ) : (
                  <div className="space-y-3">
                    {recruiterJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleSelectJob(job)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                          selectedJob?.id === job.id
                            ? 'border-accentEmerald bg-emerald-500/5'
                            : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'
                        }`}
                      >
                        <h4 className="text-sm font-bold text-white leading-tight">{job.title}</h4>
                        <p className="text-xs text-accentEmerald font-medium mt-1">{job.companyName}</p>
                        <div className="flex justify-between items-center mt-3 text-xxs text-slate-500">
                          <span className="uppercase tracking-wider font-semibold">{job.type}</span>
                          <span>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Selected Job Applications & Candidates */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                  <Users className="h-5 w-5 text-accentEmerald" />
                  Candidates for {selectedJob ? selectedJob.title : 'Selected Job'}
                </h2>

                {loadingApplications ? (
                  <div className="text-slate-500 text-sm py-10 text-center">Loading applicant registry...</div>
                ) : !selectedJob ? (
                  <GlassCard className="p-10 text-center text-slate-500" hoverEffect={false}>
                    <FolderOpen className="h-10 w-10 mx-auto text-slate-700 mb-2" />
                    <p className="text-sm">Select a job from the left panel to inspect applicant rosters.</p>
                  </GlassCard>
                ) : selectedJobApplications.length === 0 ? (
                  <GlassCard className="p-10 text-center text-slate-500" hoverEffect={false}>
                    <Users className="h-10 w-10 mx-auto text-slate-700 mb-2" />
                    <p className="text-sm">No candidates have applied to this position yet.</p>
                    <p className="text-xs text-slate-650 mt-1">Jobs directory remains public for all logged-in candidates.</p>
                  </GlassCard>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-xxs font-bold uppercase tracking-wider text-slate-500 bg-slate-900/30">
                          <th className="py-4 px-6">Candidate</th>
                          <th className="py-4 px-6">Applied Date</th>
                          <th className="py-4 px-6 text-center">Status</th>
                          <th className="py-4 px-6 text-center">AI Score</th>
                          <th className="py-4 px-6"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-sm">
                        {selectedJobApplications.map((session) => (
                          <tr key={session.id} className="hover:bg-slate-900/20 transition-colors">
                            <td className="py-4 px-6">
                              <span className="font-semibold text-white block">{session.user.email}</span>
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-400">
                              {new Date(session.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xxs font-semibold border ${
                                session.status === 'COMPLETED'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-accentEmerald'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-450'
                              }`}>
                                {session.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {session.status === 'COMPLETED' ? (
                                <span className="font-bold text-accentEmerald text-glow">
                                  {session.performanceReport?.overallScore}%
                                </span>
                              ) : (
                                <span className="text-slate-650">—</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              {session.status === 'COMPLETED' ? (
                                <button
                                  onClick={() => navigate(`/analytics/${session.id}`)}
                                  className="text-xs font-bold text-accentEmerald hover:text-emerald-400 transition-colors flex items-center gap-1 ml-auto"
                                >
                                  Review Report
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              ) : (
                                <span className="text-xs text-slate-500 font-medium">In Progress</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Post Job Modal */}
            {isRecruiterModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-glass p-8">
                  <button 
                    onClick={() => setIsRecruiterModalOpen(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  <h2 className="text-2xl font-bold text-white mb-2 font-sans">Post Job Position</h2>
                  <p className="text-slate-400 text-sm mb-6 font-medium">List job credentials and skills to feed mock interview generators.</p>

                  <form onSubmit={handleCreateJob} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Devops Engineer, Front-end Intern"
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Google, Stripe"
                          value={newJobCompany}
                          onChange={(e) => setNewJobCompany(e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
                        <select
                          value={newJobType}
                          onChange={(e) => setNewJobType(e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors"
                        >
                          <option value="EMPLOYEE">Full Time</option>
                          <option value="INTERN">Internship</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Required Core Skills (Comma-separated)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. React, TypeScript, Docker, Go"
                        value={newJobSkills}
                        onChange={(e) => setNewJobSkills(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Detail key responsibilities and expectations..."
                        value={newJobDescription}
                        onChange={(e) => setNewJobDescription(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors resize-none"
                      />
                    </div>

                    <SparkleButton 
                      type="submit" 
                      disabled={isPostingJob} 
                      className="w-full py-3.5 mt-2"
                    >
                      {isPostingJob ? 'Publishing Board...' : 'Publish Job Opening'}
                    </SparkleButton>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* CANDIDATE (USER) DASHBOARD VIEW */}
        {/* ======================================================== */}
        {user?.role !== 'COMPANY' && (
          <>
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-white font-sans tracking-tight">Candidate Dashboard</h1>
                <p className="text-slate-400 mt-1">Review your skill trajectories and search direct job postings.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/jobs">
                  <SparkleButton className="px-6 py-3.5 shadow-emerald-glow bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950">
                    <Compass className="h-5 w-5" />
                    Browse & Apply for Jobs
                  </SparkleButton>
                </Link>
                <button
                  onClick={() => setIsCandidateModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="h-5 w-5 text-accentEmerald" />
                  Practice Mock Interview
                </button>
              </div>
            </div>

            {/* Analytics Trajectory Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <GlassCard className="lg:col-span-2 flex flex-col justify-between" hoverEffect={false}>
                <div>
                  <div className="flex items-center gap-2 text-accentEmerald font-semibold text-sm uppercase tracking-wider mb-2">
                    <TrendingUp className="h-4 w-4" />
                    Score Trajectory
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6 font-sans">Your Progress Over Time</h2>
                </div>
                <ScoreChart data={getChartData()} />
              </GlassCard>

              <GlassCard className="flex flex-col justify-between" hoverEffect={false}>
                <div>
                  <div className="flex items-center gap-2 text-accentEmerald font-semibold text-sm uppercase tracking-wider mb-2">
                    <Award className="h-4 w-4" />
                    Summary Metrics
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6 font-sans">All-Time Statistics</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800/40 pb-4">
                    <span className="text-slate-400 text-sm">Interviews Completed</span>
                    <span className="text-2xl font-extrabold text-white">
                      {interviews.filter(i => i.status === 'COMPLETED').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800/40 pb-4">
                    <span className="text-slate-400 text-sm">Average Score</span>
                    <span className="text-2xl font-extrabold text-accentEmerald text-glow">
                      {interviews.filter(i => i.status === 'COMPLETED').length > 0 
                        ? Math.round(
                            interviews
                              .filter(i => i.status === 'COMPLETED')
                              .reduce((acc, i) => acc + (i.performanceReport?.overallScore || 0), 0) / 
                            interviews.filter(i => i.status === 'COMPLETED').length
                          )
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-slate-400 text-sm">Latest Company Focus</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {interviews.length > 0 ? interviews[0].company : 'N/A'}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* History List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-accentEmerald" />
                Your Application & Practice History
              </h2>
              {loading ? (
                <div className="text-center py-12 text-slate-500">Loading history...</div>
              ) : (
                <AnimatedList className="space-y-4">
                  {interviews.map((session) => (
                    <AnimatedItem key={session.id}>
                      <div 
                        onClick={() => {
                          if (session.status === 'COMPLETED') {
                            navigate(`/analytics/${session.id}`)
                          } else {
                            navigate(`/interview/${session.id}`)
                          }
                        }}
                        className="flex items-center justify-between p-6 rounded-2xl border bg-slate-900/30 transition-all duration-300 border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400">
                            <Building2 className="h-6 w-6 text-accentEmerald" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white leading-tight">{session.company}</h3>
                              {session.job && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-accentEmerald text-xxs font-semibold rounded-full uppercase tracking-wider">
                                  Applied Position
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                              {session.targetRole} {session.job?.type ? `(${session.job.type === 'EMPLOYEE' ? 'Full Time' : 'Internship'})` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(session.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              session.status === 'COMPLETED' 
                                ? 'bg-emerald-500/10 text-accentEmerald border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-550 border-amber-500/20'
                            }`}>
                              {session.status}
                            </span>
                          </div>

                          {session.status === 'COMPLETED' ? (
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/10 text-accentEmerald font-bold border border-emerald-500/25">
                                {session.performanceReport?.overallScore}
                              </div>
                              <ChevronRight className="h-5 w-5 text-slate-500" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-amber-500 border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-500/20 transition-all">
                                Take Interview
                              </span>
                              <ChevronRight className="h-5 w-5 text-slate-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              )}
            </div>

            {/* Practice Setup Wizard Modal */}
            {isCandidateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-glass p-8">
                  <button 
                    onClick={() => setIsCandidateModalOpen(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  <h2 className="text-2xl font-bold text-white mb-2 font-sans">Setup Mock Practice</h2>
                  <p className="text-slate-400 text-sm mb-6">Configure target settings to generate a customized mock interview session.</p>

                  <form onSubmit={handleLaunchInterview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Company</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amazon, Google, Stripe"
                        value={candidateCompany}
                        onChange={(e) => setCandidateCompany(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Software Engineer, Product Manager"
                        value={candidateRole}
                        onChange={(e) => setCandidateRole(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-accentEmerald transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Upload Resume (Optional)</label>
                      <div className="border border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(e) => setCandidateFile(e.target.files[0])}
                          className="hidden"
                          id="candidate-resume-upload"
                        />
                        <label htmlFor="candidate-resume-upload" className="cursor-pointer space-y-2">
                          <UploadCloud className="h-8 w-8 text-accentEmerald mx-auto" />
                          <div className="text-xs text-slate-300">
                            {candidateFile ? <strong className="text-accentEmerald">{candidateFile.name}</strong> : 'Drag and drop or click to upload PDF/DOCX'}
                          </div>
                        </label>
                      </div>
                    </div>

                    <SparkleButton 
                      type="submit" 
                      disabled={isInitializing} 
                      className="w-full py-3.5 mt-2"
                    >
                      {isInitializing ? 'Generating Questions...' : 'Launch Simulation'}
                    </SparkleButton>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
