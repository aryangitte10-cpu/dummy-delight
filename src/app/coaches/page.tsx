import { Metadata } from 'next'
import CoachesListingClient from '@/components/coaches-listing'

export const metadata: Metadata = {
  title: 'Organizers | ImpactBoard',
  description: 'Find and connect with organizers on ImpactBoard',
}

export default async function CoachesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CoachesListingClient />
    </div>
  )
} 