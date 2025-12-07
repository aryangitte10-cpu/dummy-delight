'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface PageLoaderProps {
  onComplete?: () => void
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--accent)) 100%)'
          }}
        >
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full blur-3xl"
                style={{
                  width: '40vw',
                  height: '40vw',
                  background: i === 0 
                    ? 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)'
                    : i === 1
                    ? 'radial-gradient(circle, hsl(var(--accent) / 0.3) 0%, transparent 70%)'
                    : 'radial-gradient(circle, hsl(var(--secondary) / 0.3) 0%, transparent 70%)',
                }}
                animate={{
                  x: ['-20%', '120%', '-20%'],
                  y: ['-20%', '120%', '-20%'],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </motion.div>

          {/* Main loader content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Circular loader system */}
            <div className="relative w-32 h-32">
              {/* Outer glowing ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid hsl(var(--primary) / 0.3)',
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.3)'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Middle rotating ring */}
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  border: '3px solid transparent',
                  borderTopColor: 'hsl(var(--primary))',
                  borderRightColor: 'hsl(var(--accent))',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Inner segmented ring */}
              <svg className="absolute inset-4" viewBox="0 0 80 80">
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="2"
                    strokeDasharray="10 40"
                    strokeLinecap="round"
                    initial={{ rotate: i * 45 }}
                    animate={{
                      rotate: [i * 45, i * 45 + 360],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.1,
                    }}
                    style={{ originX: '50%', originY: '50%' }}
                  />
                ))}
              </svg>

              {/* Central pulsing core */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                    boxShadow: '0 0 30px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.5)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 30px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.5)',
                      '0 0 50px hsl(var(--primary)), 0 0 100px hsl(var(--primary) / 0.7)',
                      '0 0 30px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: 'hsl(var(--accent))',
                    boxShadow: '0 0 10px hsl(var(--accent))',
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, 50 * Math.cos((i * Math.PI) / 2), 0],
                    y: [0, 50 * Math.sin((i * Math.PI) / 2), 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Animated text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                style={{
                  textShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Loading Impact Board
              </motion.h2>
              
              {/* Progress bar with shimmer */}
              <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--accent)))',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                    backgroundPosition: ['0% 50%', '200% 50%'],
                  }}
                  transition={{
                    x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Background floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
