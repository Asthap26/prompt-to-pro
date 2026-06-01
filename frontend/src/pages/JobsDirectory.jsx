import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import SparkleButton from '../components/SparkleButton'
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Calendar, 
  UploadCloud, 
  ArrowLeft, 
  BookOpen, 
  Compass, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react'

export default function JobsDirectory() {
  const { logout, authenticatedFetch, user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  
  // Selection & Application modal states
  const [selectedJob, setSelectedJob] = useState(null)
  const [file, setFile] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await authenticatedFetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (e) {
      console.error('Error fetching jobs:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!selectedJob) return
    setIsApplying(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('jobId', selectedJob.id)
      if (file) {
        formData.append('resume', file)
      }

      const response = await authenticatedFetch('/api/interviews/initialize', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const session = await response.json()
        setSelectedJob(null)
        navigate(`/interview/${session.id}`)
      } else {
        const text = await response.text()
        setError(text || 'Failed to initialize interview application')
      }
    } catch (err) {
      setError('Connection error initializing interview application')
    } finally {
      setIsApplying(false)
    }
  }

  // Filter jobs based on search & filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'ALL' || job.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen pb-24">
      {/* Top Header */}
      <header className="border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-semibold">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold">
              P
            </span>
            <span className="font-bold text-lg text-white font-sans">
              PrepPro<span className="text-accentEmerald">AI</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-accentEmerald rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="h-3.5 w-3.5" />
            Careers Directory
          </span>
          <h1 className="text-4xl font-extrabold text-white font-sans tracking-tight">Available Positions</h1>
          <p className="text-slate-400 mt-1">Apply for direct positions and start live-simulated interviews immediately.</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search jobs, companies, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-slate-800 pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accentEmerald transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'EMPLOYEE', 'INTERN'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 ${
                  typeFilter === type
                    ? 'border-accentEmerald bg-emerald-500/10 text-white shadow-emerald-glow'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                {type === 'ALL' ? 'All Roles' : type === 'EMPLOYEE' ? 'Full Time' : 'Internship'}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accentEmerald border-t-transparent"></div>
            <span>Fetching available career boards...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <GlassCard className="text-center py-16 text-slate-500" hoverEffect={false}>
            <Briefcase className="h-10 w-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium">No job postings found</p>
            <p className="text-xs text-slate-600 mt-1">Try resetting search query or filtering filters.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <GlassCard 
                key={job.id} 
                className="flex flex-col justify-between p-6 border-slate-800/80 hover:border-emerald-500/20"
                hoverEffect={true}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight font-sans">{job.title}</h3>
                      <p className="text-sm font-medium text-accentEmerald mt-1">{job.companyName}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      job.type === 'EMPLOYEE'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {job.type === 'EMPLOYEE' ? 'Full-Time' : 'Internship'}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm line-clamp-3 leading-normal">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.skillsRequired.split(',').map((skill, i) => (
                      <span key={i} className="text-xxs px-2.5 py-1 bg-slate-950 text-slate-400 border border-slate-850 rounded-full font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <button
                    onClick={() => {
                      if (user?.role === 'COMPANY') {
                        alert('Recruiters cannot apply for jobs. Please log in as a candidate.')
                      } else {
                        setSelectedJob(job)
                      }
                    }}
                    className="flex items-center gap-1 text-sm font-bold text-accentEmerald hover:text-emerald-400 transition-colors"
                  >
                    Apply Now
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>

      {/* Apply & Interview Wizard Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-glass p-8">
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-accentEmerald rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Apply Position
            </span>
            <h2 className="text-2xl font-bold text-white mb-1 font-sans">{selectedJob.title}</h2>
            <p className="text-sm font-semibold text-slate-400 mb-6">{selectedJob.companyName}</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Requirements Check</h4>
                  <p className="text-slate-350 text-xs leading-normal">
                    This interview comprises simulated technical and behavioral prompts tailored to:
                    <strong className="text-slate-200 font-semibold block mt-1">
                      {selectedJob.skillsRequired}
                    </strong>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Upload Resume (Optional)</label>
                  <div className="border border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="resume-apply-upload"
                    />
                    <label htmlFor="resume-apply-upload" className="cursor-pointer space-y-2">
                      <UploadCloud className="h-8 w-8 text-accentEmerald mx-auto" />
                      <div className="text-xs text-slate-300">
                        {file ? <strong className="text-accentEmerald">{file.name}</strong> : 'Drag and drop or click to upload PDF/DOCX'}
                      </div>
                      <p className="text-xxs text-slate-500">We extract key skills to customize interview questions.</p>
                    </label>
                  </div>
                </div>
              </div>

              <SparkleButton 
                type="submit" 
                disabled={isApplying} 
                className="w-full py-3.5 mt-2"
              >
                {isApplying ? 'Generating Interview Rooms...' : 'Launch Application & Interview'}
              </SparkleButton>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
