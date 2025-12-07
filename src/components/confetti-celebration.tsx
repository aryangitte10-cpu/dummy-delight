'use client'

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/use-window-size'

interface ConfettiCelebrationProps {
  show: boolean
  onComplete?: () => void
}

export function ConfettiCelebration({ show, onComplete }: ConfettiCelebrationProps) {
  const { width, height } = useWindowSize()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (show) {
      setIsActive(true)
      const timer = setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isActive) return null

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
    />
  )
}
