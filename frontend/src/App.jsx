import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Import Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import InterviewRoom from './pages/InterviewRoom'
import AnalyticsPortal from './pages/AnalyticsPortal'
import JobsDirectory from './pages/JobsDirectory'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkBg text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accentEmerald border-t-transparent"></div>
          <span className="text-sm font-medium tracking-wide">Validating session credentials...</span>
        </div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkBg text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accentEmerald border-t-transparent"></div>
          <span className="text-sm font-medium tracking-wide">Validating session credentials...</span>
        </div>
      </div>
    )
  }
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <JobsDirectory />
            </ProtectedRoute>
          } />
          <Route path="/interview/:id" element={
            <ProtectedRoute>
              <InterviewRoom />
            </ProtectedRoute>
          } />
          <Route path="/analytics/:id" element={
            <ProtectedRoute>
              <AnalyticsPortal />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
