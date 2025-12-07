import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiGet } from "@/lib/api"
import { Suspense } from "react"
import { headers } from 'next/headers'

interface TimeSlot {
  time: string
  available: number
}

interface DaySlot {
  date: string
  slots: TimeSlot[]
}

async function getEventSlots(eventId: string): Promise<DaySlot[]> {
  // Force dynamic behavior by reading headers
  headers()
  
  try {
    return await apiGet<DaySlot[]>(`/events/${eventId}/slots`, {
      // Add cache-busting query param to ensure fresh data
      queryParams: {
        _t: new Date().getTime().toString()
      }
    })
  } catch (error) {
    console.error('Failed to fetch slots:', error)
    throw new Error('Failed to load available slots')
  }
}

function SlotSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}

export async function EventSlots({ eventId }: { eventId: string }) {
  const slots = await getEventSlots(eventId)

  return (
    <Suspense fallback={
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available Slots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SlotSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    }>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available Slots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {slots.map((day) => (
            <div key={day.date} className="mb-4">
              <h4 className="font-medium">
                {(() => {
                  const date = new Date(day.date);
                  return date.toLocaleDateString('de-DE', { 
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                })()}
              </h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {day.slots.map((slot) => (
                  <Button
                    key={`${day.date}-${slot.time}`}
                    variant="outline"
                    disabled={slot.available === 0}
                  >
                    {slot.time} ({slot.available} slots)
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Suspense>
  )
} 