import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useInterview from '../hooks/useInterview'
import useAudioRecorder from '../hooks/useAudioRecorder'
import WaveformVisualizer from '../components/WaveformVisualizer'
import GlassCard from '../components/GlassCard'
import SparkleButton from '../components/SparkleButton'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Loader2, 
  ArrowRight, 
  Home, 
  Activity,
  AlertCircle
} from 'lucide-react'

export default function InterviewRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [cameraError, setCameraError] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)

  // Input modes
  const [inputType, setInputType] = useState('VOICE') // VOICE, KEYBOARD
  const [typedResponse, setTypedResponse] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recordingFinished, setRecordingFinished] = useState(false)
  const recognitionRef = useRef(null)

  // Hooks
  const {
    session,
    questions,
    currentIndex,
    status,
    submitAnswer,
    error: interviewError
  } = useInterview(id)

  const {
    isRecording,
    recordingTime,
    audioBlob,
    stream: audioStream,
    startRecording,
    stopRecording
  } = useAudioRecorder()

  // Initialize webcam
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        setCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.warn('Webcam permission denied or unavailable:', err)
        setCameraError(true)
      }
    }
    initCamera()

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onresult = (event) => {
        let interim = ''
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' '
          } else {
            interim += event.results[i][0].transcript
          }
        }
        if (final) {
          setLiveTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }

      recognitionRef.current = rec
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          // Ignore
        }
      }
    }
  }, [])

  const handleStartAudio = async () => {
    try {
      setLiveTranscript('')
      setInterimTranscript('')
      setRecordingFinished(false)
      await startRecording()
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {
          console.error('Recognition start error:', e)
        }
      }
    } catch (e) {
      alert('Could not access microphone. Please verify permission settings.')
    }
  }

  const handleStopAndSubmit = async () => {
    stopRecording()
    setRecordingFinished(true)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error('Recognition stop error:', e)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const activeQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <Home className="h-5 w-5" />
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-300 font-medium">
            Interviewing at: <strong className="text-white font-semibold">{session?.company || 'Loading...'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {status === 'RECORDING' ? 'Streaming Live' : 'Connected'}
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 items-start mt-6">
        
        {/* Left Panel: Camera Stream & Waveform */}
        <div className="space-y-6">
          <GlassCard className="overflow-hidden p-0 relative aspect-video flex items-center justify-center bg-slate-950/80 border-slate-800" hoverEffect={false}>
            {cameraError ? (
              <div className="text-center space-y-2 p-6 text-slate-500">
                <VideoOff className="h-10 w-10 mx-auto text-slate-600" />
                <p className="text-sm font-medium">Webcam stream unavailable</p>
                <p className="text-xs max-w-xs leading-normal">Verify browser camera permissions to enable video simulation.</p>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1]" // mirror view
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/60 backdrop-blur-md border border-slate-800/50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-200">
                  <Video className="h-3.5 w-3.5 text-accentEmerald" />
                  Live Preview Feed
                </div>
              </>
            )}
          </GlassCard>

          {/* Audio Visualizer */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Vocal Waveform Analyser
              </span>
              {isRecording && (
                <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  Recording • {formatTime(recordingTime)}
                </span>
              )}
            </div>
            <WaveformVisualizer stream={audioStream} isRecording={isRecording} />
          </div>
        </div>

        {/* Right Panel: Question Wizard & State Controls */}
        <div className="space-y-6">
          {interviewError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{interviewError}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {status === 'COMPLETED' ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard className="text-center py-10 space-y-6" hoverEffect={false}>
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-accentEmerald">
                    <Activity className="h-8 w-8 text-glow" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-white font-sans">Interview Completed!</h2>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-normal">
                      Your responses have been processed. Review speech pacing, emotion scores, and custom recommendations.
                    </p>
                  </div>
                  <div>
                    <SparkleButton 
                      onClick={() => navigate(`/analytics/${session?.id || 'mock-session-123'}`)}
                      className="px-8 py-3.5"
                    >
                      View Report Breakdown
                      <ArrowRight className="h-5 w-5" />
                    </SparkleButton>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <GlassCard className="space-y-6" hoverEffect={false}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full">
                      {activeQuestion?.type}
                    </span>
                    {status === 'ACTIVE' && (
                      <div className="flex gap-1.5 bg-slate-950/60 p-1 border border-slate-850 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setInputType('VOICE')}
                          className={`px-3 py-1 rounded-lg text-xxs font-bold uppercase tracking-wider transition-colors ${
                            inputType === 'VOICE'
                              ? 'bg-accentEmerald text-slate-950 shadow-emerald-glow'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Voice
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputType('KEYBOARD')}
                          className={`px-3 py-1 rounded-lg text-xxs font-bold uppercase tracking-wider transition-colors ${
                            inputType === 'KEYBOARD'
                              ? 'bg-accentEmerald text-slate-950 shadow-emerald-glow'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Written
                        </button>
                      </div>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed font-sans min-h-[96px]">
                    {activeQuestion?.content || 'Generating interview panels...'}
                  </h3>

                  <div className="h-px bg-slate-800/60" />

                  {/* Live Transcript log during Voice recording */}
                  {inputType === 'VOICE' && isRecording && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 min-h-[72px] text-xs text-slate-300 leading-normal">
                      <span className="text-accentEmerald font-bold uppercase tracking-wider text-xxs block mb-1">
                        Speech Feed:
                      </span>
                      {liveTranscript || interimTranscript ? (
                        <span>
                          {liveTranscript}
                          <span className="text-slate-550">{interimTranscript}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Speak now. Your transcript will stream here in real time...</span>
                      )}
                    </div>
                  )}

                  {/* Interactive Status Display */}
                  <div className="flex flex-col items-center justify-center py-2 w-full">
                    {status === 'PROCESSING' ? (
                      <div className="text-center space-y-3 py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-accentEmerald mx-auto" />
                        <p className="text-sm font-medium text-slate-300">Evaluating audio submission...</p>
                        <p className="text-xs text-slate-500">Transcribing response and measuring emotional confidence.</p>
                      </div>
                    ) : inputType === 'VOICE' ? (
                      status === 'RECORDING' ? (
                        <button 
                          onClick={handleStopAndSubmit}
                          className="flex flex-col items-center gap-3 p-6 rounded-full hover:bg-slate-800/20 group"
                        >
                          <div className="h-16 w-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform duration-300">
                            <MicOff className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Stop Recording</span>
                        </button>
                      ) : recordingFinished ? (
                        <div className="w-full space-y-4 animate-fadeIn">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                              Review & Edit Your Transcripted Response
                            </label>
                            <textarea
                              rows={4}
                              value={liveTranscript}
                              onChange={(e) => setLiveTranscript(e.target.value)}
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-white text-sm focus:outline-none focus:border-accentEmerald transition-colors resize-none leading-normal"
                              placeholder="Review your spoken answer here. You can make manual corrections if needed..."
                            />
                          </div>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={handleStartAudio}
                              className="flex-1 py-3.5 border border-slate-800 text-slate-300 hover:text-white rounded-xl font-bold hover:bg-slate-850/55 transition-all text-sm uppercase tracking-wider"
                            >
                              Re-record
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await submitAnswer(audioBlob, liveTranscript.trim())
                                setLiveTranscript('')
                                setInterimTranscript('')
                                setRecordingFinished(false)
                              }}
                              disabled={!liveTranscript.trim()}
                              className="flex-1 py-3.5 bg-accentEmerald text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all text-sm uppercase tracking-wider"
                            >
                              Submit Answer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={handleStartAudio}
                          disabled={questions.length === 0}
                          className="flex flex-col items-center gap-3 p-6 rounded-full hover:bg-slate-800/20 group disabled:opacity-40"
                        >
                          <div className="h-16 w-16 bg-accentEmerald rounded-full flex items-center justify-center text-slate-950 shadow-emerald-glow group-hover:scale-105 transition-transform duration-300">
                            <Mic className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Start Recording Answer</span>
                        </button>
                      )
                    ) : (
                      /* KEYBOARD MODE */
                      <div className="w-full space-y-4">
                        <textarea
                          rows={4}
                          placeholder="Type your structured answer in detail here..."
                          value={typedResponse}
                          onChange={(e) => setTypedResponse(e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-white text-sm focus:outline-none focus:border-accentEmerald transition-colors resize-none leading-normal"
                        />
                        <button
                          onClick={() => {
                            if (!typedResponse.trim()) return
                            submitAnswer(null, typedResponse.trim())
                            setTypedResponse('')
                          }}
                          disabled={!typedResponse.trim()}
                          className="w-full py-3.5 bg-accentEmerald disabled:opacity-45 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all text-sm uppercase tracking-wider"
                        >
                          Submit Answer
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
