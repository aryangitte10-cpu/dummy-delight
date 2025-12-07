import { EventsIdPage } from '@/components/events-detail'

interface EventPageProps {
  params: Promise<{
    id: string
  }> 
}

export default async function EventPage({ params }: EventPageProps) {
  const resolvedParams = await params
  return <EventsIdPage params={resolvedParams} />
}