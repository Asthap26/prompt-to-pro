import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hoverEffect = true, onClick, ...props }) {
  const CardComponent = onClick ? motion.button : motion.div

  return (
    <CardComponent
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 ${hoverEffect ? 'glass-card-hover' : ''} text-left ${className}`}
      {...(onClick && { whileTap: { scale: 0.98 } })}
      {...props}
    >
      {children}
    </CardComponent>
  )
}
