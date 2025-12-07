import EventForm from '@/components/event-form'
import RouteGuard from '@/components/route-guard'

export default function CreateEvent() {
  return (
    <RouteGuard requiredRole="coach">
      <EventForm />
    </RouteGuard>
  )
} 