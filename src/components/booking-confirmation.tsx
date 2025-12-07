"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Plus, X, CheckCircle2, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiGet, getEventConfirmation, addInvitee, removeInvitee, type Confirmation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const formatCoachName = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatEventDate = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, 'EEEE, MMMM d, yyyy');
};

const formatEventTime = (startTime: string, endTime: string) => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
};

interface ContentMark {
  type: string;
}

interface ContentNode {
  type: string;
  text?: string;
  marks?: ContentMark[];
}

interface ContentBlock {
  type: string;
  content?: ContentNode[];
  attrs?: {
    level: number;
  };
}

export function BookingConfirmation({ params }: { params?: { id?: string } }) {
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newAttendee, setNewAttendee] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [removingAttendee, setRemovingAttendee] = useState<string | null>(null);
  const { toast } = useToast();

  const eventId = params?.id || "0";

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await getEventConfirmation(eventId);
        setConfirmation(response.data);
        if (response.data.invitees) {
          setAttendees(response.data.invitees);
        }
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load event data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleAddAttendee = async () => {
    if (!newAttendee || !confirmation) return;
    if (attendees.includes(newAttendee)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This email has already been added"
      });
      return;
    }

    setIsAddingAttendee(true);
    try {
      const response = await addInvitee(confirmation.id, newAttendee);
      if (response.success) {
        setAttendees([...attendees, newAttendee]);
        setNewAttendee("");
        toast({
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Invitee added successfully</span>
            </div>
          )
        });
      } else {
        throw new Error("Failed to add invitee");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add invitee. Please try again."
      });
    } finally {
      setIsAddingAttendee(false);
    }
  };

  const handleRemoveAttendee = async (email: string) => {
    if (!confirmation) return;
    
    setRemovingAttendee(email);
    try {
      const response = await removeInvitee(confirmation.id, email);
      if (response.success) {
        setAttendees(attendees.filter((attendee) => attendee !== email));
        toast({
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Invitee removed successfully</span>
            </div>
          )
        });
      } else {
        throw new Error("Failed to remove invitee");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove invitee. Please try again."
      });
    } finally {
      setRemovingAttendee(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!confirmation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Event not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Alert className="mb-8">
        <AlertTitle>Booking Confirmed!</AlertTitle>
        <AlertDescription>
          Your team building event has been successfully booked.
        </AlertDescription>
      </Alert>

      <h1 className="text-3xl font-bold mb-6">Booking Confirmation</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{confirmation?.title}</CardTitle>
            <CardDescription>Event Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Booking Reference:</span>
              <Badge variant="outline">{confirmation?.id}</Badge>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Seats Booked:</span>
              <Badge variant="secondary">
                {confirmation?.registrationCount}
              </Badge>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formatEventDate(confirmation?.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{formatEventTime(confirmation?.startTime, confirmation?.endTime)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{confirmation?.location}</span>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Event Description</h3>
              <div 
                className="prose dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: JSON.parse(confirmation?.description || '{"content":[]}').content.map((block: ContentBlock) => {
                    if (block.type === 'paragraph') {
                      return `<p>${block.content?.map((content: ContentNode) => {
                        if (content.marks?.some((mark: ContentMark) => mark.type === 'bold')) {
                          return `<strong>${content.text}</strong>`;
                        }
                        return content.text;
                      }).join('')}</p>`;
                    }
                    if (block.type === 'heading') {
                      return `<h${block.attrs?.level}>${block.content?.[0].text}</h${block.attrs?.level}>`;
                    }
                    return '';
                  }).join('')
                }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-lg font-semibold">
              Total Price: €{confirmation?.price} per person
            </p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Image
                  src={confirmation?.coach?.image || "/placeholder.svg?height=100&width=100"}
                  alt={confirmation?.coach?.name || "Placeholder Coach Image"}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {confirmation?.coach?.name ? formatCoachName(confirmation.coach.name) : ''}
                  </h3>
                  <div 
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: JSON.parse(confirmation?.coach?.bio || '{"content":[]}').content.map((block: ContentBlock) => {
                        if (block.type === 'paragraph') {
                          return `<p>${block.content?.map((content: ContentNode) => {
                            if (content.marks?.some((mark: ContentMark) => mark.type === 'bold')) {
                              return `<strong>${content.text}</strong>`;
                            }
                            return content.text;
                          }).join('')}</p>`;
                        }
                        if (block.type === 'heading') {
                          return `<h${block.attrs?.level}>${block.content?.[0].text}</h${block.attrs?.level}>`;
                        }
                        return '';
                      }).join('')
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Attendees</CardTitle>
              <CardDescription>
                Enter email addresses of team members attending this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  disabled={isAddingAttendee}
                />
                <Button 
                  onClick={handleAddAttendee} 
                  disabled={isAddingAttendee || !newAttendee}
                >
                  {isAddingAttendee ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                {attendees.map((attendee) => (
                  <Badge
                    key={attendee}
                    variant="secondary"
                    className="flex items-center justify-between"
                  >
                    {attendee}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttendee(attendee)}
                      disabled={removingAttendee === attendee}
                    >
                      {removingAttendee === attendee ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/">Back to Events</Link>
        </Button>
        <Button>Send Invitations</Button>
      </div>
    </div>
  );
}
