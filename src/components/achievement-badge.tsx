'use client'

import { motion } from 'framer-motion'
import { Award, TrendingUp, Star, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AchievementBadgeProps {
  type: 'first-booking' | 'streak' | 'regular' | 'early-bird'
  delay?: number
}

const achievements = {
  'first-booking': {
    icon: Award,
    label: 'First Booking!',
    color: 'from-yellow-400 to-yellow-600',
  },
  'streak': {
    icon: TrendingUp,
    label: '3 Day Streak!',
    color: 'from-orange-400 to-red-600',
  },
  'regular': {
    icon: Star,
    label: 'Regular Attendee',
    color: 'from-purple-400 to-pink-600',
  },
  'early-bird': {
    icon: Zap,
    label: 'Early Bird',
    color: 'from-blue-400 to-cyan-600',
  },
}

export function AchievementBadge({ type, delay = 0 }: AchievementBadgeProps) {
  const achievement = achievements[type]
  const Icon = achievement.icon

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
    >
      <Badge className={`bg-gradient-to-r ${achievement.color} text-white border-0 gap-2 px-3 py-1.5 shadow-lg`}>
        <Icon className="h-4 w-4" />
        {achievement.label}
      </Badge>
    </motion.div>
  )
}
