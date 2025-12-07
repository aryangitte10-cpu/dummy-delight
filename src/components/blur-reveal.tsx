'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface BlurRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function BlurReveal({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up' 
}: BlurRevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const directionOffset = {
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
    none: { x: 0, y: 0 }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        filter: 'blur(10px)',
        ...directionOffset[direction]
      }}
      animate={inView ? { 
        opacity: 1, 
        filter: 'blur(0px)',
        x: 0,
        y: 0
      } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
