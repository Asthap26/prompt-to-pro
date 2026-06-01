import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import SparkleButton from '../components/SparkleButton'
import { UserPlus, Mail, Lock } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('CANDIDATE')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    try {
      await register(email, password, role)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md shadow-glass border-emerald-500/20" hoverEffect={false}>
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-accentEmerald mb-4">
            <UserPlus className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Create Account</h2>
          <p className="text-sm text-slate-400 mt-2">Get started with PrepPro today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accentEmerald transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accentEmerald transition-colors"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accentEmerald transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Registering as a</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('CANDIDATE')}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                  role === 'CANDIDATE'
                    ? 'border-accentEmerald bg-emerald-500/10 text-white shadow-emerald-glow'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('COMPANY')}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                  role === 'COMPANY'
                    ? 'border-accentEmerald bg-emerald-500/10 text-white shadow-emerald-glow'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          <SparkleButton type="submit" disabled={loading} className="w-full py-3.5">
            {loading ? 'Creating Account...' : 'Create Account'}
          </SparkleButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-accentEmerald hover:text-accentEmerald-light font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}
