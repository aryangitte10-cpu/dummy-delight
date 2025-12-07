'use client'

import { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'

interface Statistics {
  activeEvents: number
  totalCoaches: number
  totalRegistrations: number
  loading: boolean
}

export function useStatistics() {
  const [stats, setStats] = useState<Statistics>({
    activeEvents: 0,
    totalCoaches: 0,
    totalRegistrations: 0,
    loading: true
  })

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch events
        const eventsResponse = await apiGet<{ success: boolean; data: any[] }>('/api/events')
        const activeEvents = eventsResponse.success ? eventsResponse.data.length : 0

        // Fetch coaches
        const coachesResponse = await apiGet<{ success: boolean; data: any[] }>('/api/coaches')
        const totalCoaches = coachesResponse.success ? coachesResponse.data.length : 0

        // Calculate total registrations from events
        let totalRegistrations = 0
        if (eventsResponse.success && eventsResponse.data) {
          eventsResponse.data.forEach((event: any) => {
            if (event.timeSlots && Array.isArray(event.timeSlots)) {
              event.timeSlots.forEach((slot: any) => {
                totalRegistrations += (slot.bookedSlots || 0)
              })
            }
          })
        }

        setStats({
          activeEvents,
          totalCoaches,
          totalRegistrations,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching statistics:', error)
        setStats({
          activeEvents: 0,
          totalCoaches: 0,
          totalRegistrations: 0,
          loading: false
        })
      }
    }

    fetchStatistics()
  }, [])

  return stats
}
