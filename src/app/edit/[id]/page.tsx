import EventForm from '@/components/event-form'
import RouteGuard from '@/components/route-guard'

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const resolvedParams = await params;
  return (
    <RouteGuard requiredRole="coach">
      <EventForm eventId={resolvedParams.id} mode="edit" />
    </RouteGuard>
  )
} 