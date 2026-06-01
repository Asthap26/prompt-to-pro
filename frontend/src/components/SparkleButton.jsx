import React from 'react'
import { motion } from 'framer-motion'

export default function SparkleButton({ children, className = '', onClick, type = 'button', disabled = false, ...props }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 px-6 py-3 font-semibold text-slate-950 shadow-emerald-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {/* Shimmer Overlay */}
      <span className="absolute inset-0 block h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
