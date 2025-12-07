'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Star, Award } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useMemo } from 'react'

interface Coach {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string; // This will be JSON string
  expertise: string[];
  certifications: string[];
  gallery: string[];
  upcomingEvents: {
    id: number;
    title: string;
    date: string;
    location: string;
  }[];
}

interface CoachPageClientProps {
  coach: Coach;
}

export function CoachPageClient({ coach }: CoachPageClientProps) {
  // Parse the bio JSON if it exists
  const parsedBio = useMemo(() => {
    try {
      if (!coach.bio) return '';
      const parsed = JSON.parse(coach.bio);
      // Simple text extraction - you might want to add a proper JSON-to-text parser
      return parsed.content?.[0]?.content?.[0]?.text || '';
    } catch (e) {
      console.error('Error parsing bio:', e);
      return coach.bio;
    }
  }, [coach.bio]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About {coach.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <Image
                  src={coach.image}
                  alt={coach.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{coach.name}</h2>
                  {coach.title && (
                    <p className="text-lg text-muted-foreground mb-4">{coach.title}</p>
                  )}
                  <p className="text-muted-foreground">{parsedBio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {coach.gallery.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel>
                  <CarouselContent>
                    {coach.gallery.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image src={image} alt={`Gallery image ${index + 1}`} width={600} height={400} className="rounded-lg" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {coach.expertise.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coach.expertise.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {coach.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coach.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {coach.upcomingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coach.upcomingEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <div className="group p-4 rounded-lg hover:bg-accent transition-colors">
                        <h3 className="font-semibold group-hover:text-primary">{event.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/">Back to Events</Link>
        </Button>
      </div>
    </>
  )
} 