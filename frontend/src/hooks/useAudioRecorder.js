import { useState, useRef, useEffect } from 'react'

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [stream, setStream] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      audioChunksRef.current = []
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(mediaStream)
      
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      mediaRecorderRef.current = recorder
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop())
        }
      }

      recorder.start(250) // sample slice rate
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1)
      }, 1000)

    } catch (err) {
      console.error('Failed to get media devices for audio recording:', err)
      throw new Error('Microphone permission denied or device not found')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsRecording(false)
    setStream(null)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [stream])

  return {
    isRecording,
    recordingTime,
    audioBlob,
    stream,
    startRecording,
    stopRecording
  }
}
