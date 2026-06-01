import React from 'react'
import { motion } from 'framer-motion'

export default function AnimatedList({ children, className = '' }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ children, className = '' }) {
  const item = {
    hidden: { y: 15, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      } 
    }
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
