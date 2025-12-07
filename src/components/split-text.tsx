'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  type?: 'words' | 'chars'
}

export function SplitText({ children, className = '', delay = 0, type = 'words' }: SplitTextProps) {
  const items = type === 'words' ? children.split(' ') : children.split('')
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: type === 'words' ? 0.12 : 0.03, delayChildren: delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', marginRight: type === 'words' ? '0.3em' : '0' }}
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  )
}
