'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6), hsl(var(--primary)), hsl(var(--primary) / 0.6))',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </motion.div>
  )
}
