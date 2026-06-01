import React, { useEffect, useRef } from 'react'

export default function WaveformVisualizer({ stream, isRecording }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = canvas.width
    let height = canvas.height

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      width = canvas.width
      height = canvas.height
      ctx.scale(2, 2)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    if (stream && isRecording) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audioCtx = new AudioContext()
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = audioCtx
      analyserRef.current = analyser
      sourceRef.current = source
    } else {
      cleanupAudio()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width / 2 
      const h = canvas.height / 2

      ctx.lineWidth = 3
      ctx.lineCap = 'round'

      if (analyserRef.current && isRecording) {
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteTimeDomainData(dataArray)

        const gradient = ctx.createLinearGradient(0, 0, w, 0)
        gradient.addColorStop(0, '#34d399')
        gradient.addColorStop(0.5, '#10b981')
        gradient.addColorStop(1, '#059669')
        ctx.strokeStyle = gradient

        ctx.beginPath()
        const sliceWidth = w / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = v * (h / 2) 

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }
        ctx.lineTo(w, h / 2)
        ctx.stroke()
      } else {
        const time = Date.now() * 0.003
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)'
        ctx.beginPath()
        ctx.moveTo(0, h / 2)
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.02 + time) * 4
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      cleanupAudio()
    }
  }, [stream, isRecording])

  const cleanupAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
  }

  return (
    <div className="relative w-full h-32 rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
