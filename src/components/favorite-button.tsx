'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

interface FavoriteButtonProps {
  eventId: string
}

export function FavoriteButton({ eventId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if event is favorited in localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]')
    setIsFavorite(favorites.includes(eventId))
  }, [eventId])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]')
    
    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== eventId)
      localStorage.setItem('favoriteEvents', JSON.stringify(updated))
      setIsFavorite(false)
      toast({
        title: 'Removed from favorites',
        description: 'Event has been removed from your favorites',
      })
    } else {
      favorites.push(eventId)
      localStorage.setItem('favoriteEvents', JSON.stringify(favorites))
      setIsFavorite(true)
      toast({
        title: 'Added to favorites',
        description: 'Event has been added to your favorites',
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFavorite}
      className="gap-2 hover-lift relative overflow-hidden"
    >
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-4 w-4 transition-all duration-300 ${
            isFavorite ? 'fill-red-500 text-red-500' : ''
          }`}
        />
      </motion.div>
      {isFavorite ? 'Saved' : 'Save'}
    </Button>
  )
}
