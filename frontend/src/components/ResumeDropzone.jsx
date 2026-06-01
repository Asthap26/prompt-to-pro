import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react'

export default function ResumeDropzone({ onFileSelected, file }) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return

    setUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval)
          setUploading(false)
          onFileSelected(selectedFile)
          return 100
        }
        return old + 10
      })
    }, 80)
  }, [onFileSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  })

  return (
    <div 
      {...getRootProps()} 
      className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 bg-slate-950/30 ${
        isDragActive 
          ? 'border-accentEmerald bg-emerald-500/5' 
          : 'border-slate-800 hover:border-emerald-500/40'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {uploading ? (
          <div className="w-full max-w-[220px] space-y-3 py-2">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accentEmerald transition-all duration-150" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-medium">Extracting skills & keywords... {progress}%</p>
          </div>
        ) : file ? (
          <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 px-4 py-3 rounded-xl max-w-sm mx-auto">
            <FileText className="h-6 w-6 text-accentEmerald" />
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold text-white truncate max-w-[180px]">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-accentEmerald ml-auto flex-shrink-0" />
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-accentEmerald">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your resume'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF or DOCX up to 10MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
