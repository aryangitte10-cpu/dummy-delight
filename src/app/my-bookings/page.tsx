"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiGet } from "@/lib/api";

interface TimeSlot {
  id: string;
  eventId: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  availableSeats: number;
  isAvailable: boolean;
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    eventTypes: string[];
    pricePerSeat: number;
    status: string;
    coverImage: string;
    galleryImages: string[];
    coachId: string;
    coach: {
      id: string;
      name: string;
      email: string;
      firstName: string;
      lastName: string;
      profileImage: string;
      isCoach: boolean;
    };
  };
}

interface Booking {
  id: string;
  userId: string;
  timeSlotId: string;
  inviteeEmails: string[];
  registrationCount: number;
  registeredAt: string;
  timeSlot: TimeSlot;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  const checkAuthAndFetchBookings = async () => {
    try {
      await getCurrentUser();
      fetchBookings();
    } catch (error) {
      router.push("/login?redirect=/my-bookings");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await apiGet("/api/user/events");
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch bookings");
      }
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchBookings} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Bookings Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t made any bookings yet.
            </p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/booking-confirmation?id=${booking.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={booking.timeSlot.event.coverImage || "/placeholder.svg"}
                    alt={booking.timeSlot.event.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {booking.timeSlot.event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.timeSlot.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{`${new Date(booking.timeSlot.startTime).toLocaleTimeString()} - ${new Date(booking.timeSlot.endTime).toLocaleTimeString()}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.timeSlot.event.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={booking.timeSlot.event.coach.profileImage || "/placeholder.svg"}
                        alt={booking.timeSlot.event.coach.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{booking.timeSlot.event.coach.name}</span>
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    Seats booked: {booking.registrationCount}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 