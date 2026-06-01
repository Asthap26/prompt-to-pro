import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useInterview(sessionId) {
  const { authenticatedFetch } = useAuth()
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [status, setStatus] = useState('IDLE') // IDLE, ACTIVE, RECORDING, PROCESSING, COMPLETED
  const [error, setError] = useState(null)
  const [responseDetails, setResponseDetails] = useState([])

  useEffect(() => {
    if (sessionId && sessionId !== 'mock-session-123') {
      fetchSession()
    } else if (sessionId === 'mock-session-123') {
      setSession({ id: 'mock-session-123', company: 'Google', targetRole: 'Frontend Developer' })
      setQuestions([
        { id: 1, content: 'Tell me about yourself and your experience working with React and Tailwind CSS.', type: 'BEHAVIORAL' },
        { id: 2, content: 'How would you build a micro-frontend architecture? What are the key performance bottlenecks?', type: 'TECHNICAL' },
        { id: 3, content: 'Describe a situation where you had a disagreement with your project manager regarding a deadline.', type: 'BEHAVIORAL' }
      ])
      setStatus('ACTIVE')
    }
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await authenticatedFetch(`/api/interviews/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSession(data)
        setQuestions(data.questions || [])
        const answeredCount = data.questions ? data.questions.filter(q => q.response).length : 0
        setCurrentIndex(answeredCount >= data.questions.length ? data.questions.length - 1 : answeredCount)
        setStatus(answeredCount >= data.questions.length ? 'COMPLETED' : 'ACTIVE')
      } else {
        throw new Error('Failed to retrieve session')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const submitAnswer = async (audioBlob, textTranscript) => {
    if (sessionId === 'mock-session-123') {
      setStatus('PROCESSING')
      return new Promise((resolve) => {
        setTimeout(() => {
          setResponseDetails(prev => [...prev, {
            questionId: questions[currentIndex].id,
            transcript: textTranscript || "Honestly, in my last project, we, um, had to build a real-time messaging server. It was, like, quite difficult because we had to scale to thousands of active sessions, basically. But we resolved it using Redis.",
            confidenceScore: 88,
            emotionVector: "PROFESSIONAL",
            fillerWordCount: 3
          }])
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setStatus('ACTIVE')
          } else {
            setStatus('COMPLETED')
          }
          resolve()
        }, 2000)
      })
    }

    setStatus('PROCESSING')
    const activeQuestion = questions[currentIndex]
    
    try {
      const formData = new FormData()
      if (audioBlob) {
        formData.append('audio', audioBlob)
      }
      if (textTranscript) {
        formData.append('transcript', textTranscript)
      }
      formData.append('questionId', activeQuestion.id)

      const response = await authenticatedFetch(`/api/interviews/${sessionId}/responses/submit`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setResponseDetails(prev => [...prev, data])
        
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1)
          setStatus('ACTIVE')
        } else {
          setStatus('COMPLETED')
        }
      } else {
        throw new Error('Response submission failed')
      }
    } catch (err) {
      setError(err.message)
      setStatus('ACTIVE') 
    }
  }

  return {
    session,
    questions,
    currentIndex,
    status,
    setStatus,
    error,
    responseDetails,
    submitAnswer
  }
}
