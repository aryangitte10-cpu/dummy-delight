'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Edit, Plus } from "lucide-react";
import { getCoachEvents } from '@/lib/api';
import RouteGuard from '@/components/route-guard';
import type { EventResponse } from '@/types/event';

type Event = EventResponse['data'][number];

export default function MyEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getCoachEvents();
        if (response.success) {
          setEvents(response.data);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch events'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard requiredRole="coach">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Events</h1>
          <Button asChild>
            <Link href="/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {error && (
          <div className="text-red-500 mb-4">
            Failed to load events. Please try again later.
          </div>
        )}

        {!error && events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">You haven&apos;t created any events yet.</p>
              <Button asChild>
                <Link href="/create">Create Your First Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.coverImage || '/placeholder.svg'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.timeSlots[0] && (
                      <>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {(() => {
                              const date = new Date(event.timeSlots[0].startTime);
                              return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {(() => {
                              const startDate = new Date(event.timeSlots[0].startTime);
                              const endDate = new Date(event.timeSlots[0].endTime);
                              return `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`;
                            })()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                      {event.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/edit/${event.id}`} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RouteGuard>
  );
} 