'use client'

import { useSearchParams } from 'next/navigation'
import { BookingConfirmation } from "@/components/booking-confirmation"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  
  const id = searchParams.get('id')

  return (
    <BookingConfirmation 
      params={{ id: id || undefined }}
    />
  )
} 