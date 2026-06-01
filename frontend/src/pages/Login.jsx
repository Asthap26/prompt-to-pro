import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import SparkleButton from '../components/SparkleButton'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md shadow-glass border-emerald-500/20" hoverEffect={false}>
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-accentEmerald mb-4">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-2">Sign in to your PrepPro account</p>
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
                placeholder="••••••••"
              />
            </div>
          </div>

          <SparkleButton type="submit" disabled={loading} className="w-full py-3.5">
            {loading ? 'Signing In...' : 'Sign In'}
          </SparkleButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-accentEmerald hover:text-accentEmerald-light font-medium underline underline-offset-4">
            Register now
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}
