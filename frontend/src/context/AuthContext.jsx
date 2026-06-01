import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      handleRefresh(refreshToken)
    } else {
      setLoading(false)
    }
  }, [])

  const handleRefresh = async (rToken) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rToken }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.accessToken)
        setToken(data.accessToken)
        setUser({ email: data.email, role: data.role })
      } else {
        logout()
      }
    } catch (e) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const msg = await response.text()
      throw new Error(msg || 'Invalid login credentials')
    }
    const data = await response.json()
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
    setToken(data.accessToken)
    setUser({ email: data.email, role: data.role })
    return data
  }

  const register = async (email, password, role) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
    if (!response.ok) {
      const msg = await response.text()
      throw new Error(msg || 'Registration failed')
    }
    const data = await response.json()
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
    setToken(data.accessToken)
    setUser({ email: data.email, role: data.role })
    return data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
    setLoading(false)
  }

  const authenticatedFetch = async (url, options = {}) => {
    let currentToken = token
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${currentToken}`
    }

    let response = await fetch(url, { ...options, headers })

    if (response.status === 401) {
      const rToken = localStorage.getItem('refresh_token')
      if (rToken) {
        try {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rToken }),
          })
          if (refreshRes.ok) {
            const data = await refreshRes.json()
            localStorage.setItem('access_token', data.accessToken)
            setToken(data.accessToken)
            currentToken = data.accessToken
            headers['Authorization'] = `Bearer ${currentToken}`
            response = await fetch(url, { ...options, headers })
          } else {
            logout()
          }
        } catch (e) {
          logout()
        }
      } else {
        logout()
      }
    }
    return response
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
