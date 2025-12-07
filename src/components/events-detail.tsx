'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, X, ChevronLeft, ChevronRight } from "lucide-react"
import { getCurrentUser } from "aws-amplify/auth"
import { getEvent, registerForEvent } from "@/lib/api"
import type { Event, EventResponse } from "@/types/event"
import Image from "next/image"
import { SlotSelectionModal } from "@/components/slot-selection-modal"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookingConfirmationModal } from "@/components/booking-confirmation-modal"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"
import { ConfettiCelebration } from "@/components/confetti-celebration"
import { ShareButton } from "@/components/share-button"
import { FavoriteButton } from "@/components/favorite-button"
import { CountUp } from "@/components/count-up"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ParallaxHero } from "@/components/parallax-hero"
import { useToast } from "@/hooks/use-toast"

interface ContentMark {
  type: string
  attrs?: Record<string, any>
}

interface ContentNode {
  type: string
  content?: ContentNode[]
  marks?: ContentMark[]
  text?: string
}

interface ContentBlock {
  type: string
  content?: ContentNode[]
  attrs?: {
    level: number
  }
}

// Helper function to format date and time in user's local timezone
const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString)
  const time = date.toLocaleTimeString('en-de', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  return `${time}`
}

export function EventsIdPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [eventData, setEventData] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null)
  const [showSlotSelection, setShowSlotSelection] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [selectedSlotCount, setSelectedSlotCount] = useState(1)
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  const [userTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [fullscreenImage, setFullscreenImage] = useState<number | null>(null)
  const [allImages, setAllImages] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (eventData) {
      setAllImages([eventData.coverImage, ...eventData.galleryImages])
    }
  }, [eventData])

  useEffect(() => {
    checkAuthStatus()
    fetchEventData()
  }, [params.id])

  const fetchEventData = async () => {
    try {
      const response = await getEvent(params.id)
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch event data')
      }
      // Since we know response.data is Event[], take the first event
      const event = response.data
      if (!event) {
        throw new Error('Event not found')
      }
      setEventData(event)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching event data')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser()
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const handleSlotCountConfirm = (slotCount: number) => {
    setSelectedSlotCount(slotCount)
    setShowSlotSelection(false)
    setShowBookingConfirmation(true)
  }

  const handleBookingConfirm = async () => {
    if (!selectedTimeSlotId) {
      return
    }

    setIsBookingLoading(true)
    try {
      const response = await registerForEvent(params.id, {
        timeSlotId: selectedTimeSlotId,
        slotCount: selectedSlotCount,
      })

      if (response.success) {
        setShowConfetti(true)
        toast({
          title: '🎉 Booking Confirmed!',
          description: `Successfully booked ${selectedSlotCount} seat(s)`,
        })
        
        setTimeout(() => {
        const searchParams = new URLSearchParams()
        searchParams.set('id', response.data.id)
        router.push(`/booking-confirmation?${searchParams.toString()}`)
        }, 2000)
      } else {
        throw new Error(response.message || 'Failed to register for event')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to register for event',
        variant: 'destructive',
      })
      setError(error instanceof Error ? error.message : 'Failed to register for event')
    } finally {
      setIsBookingLoading(false)
      setShowBookingConfirmation(false)
    }
  }

  const handleSlotSelection = (timeSlotId: string, startTime: string, endTime: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${params.id}`)
      return
    }
    setSelectedTimeSlotId(timeSlotId)
    setSelectedSlot(`${formatDateTime(startTime)} - ${formatDateTime(endTime)}`)
    setShowSlotSelection(true)
  }

  const handleNextImage = () => {
    if (fullscreenImage !== null && allImages.length > 0) {
      setFullscreenImage((fullscreenImage + 1) % allImages.length)
    }
  }

  const handlePrevImage = () => {
    if (fullscreenImage !== null && allImages.length > 0) {
      setFullscreenImage((fullscreenImage - 1 + allImages.length) % allImages.length)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage !== null) {
        if (e.key === 'ArrowRight') handleNextImage()
        if (e.key === 'ArrowLeft') handlePrevImage()
        if (e.key === 'Escape') setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullscreenImage, allImages])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !eventData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-muted-foreground">{error || 'Failed to load event data'}</p>
            <Button onClick={fetchEventData} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <ConfettiCelebration show={showConfetti} />
      
      {/* Hero Section with Gradient */}
      <ParallaxHero className="mb-8">
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <Carousel className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div 
                  className="relative h-[400px] w-full overflow-hidden group cursor-zoom-in"
                  onClick={() => setFullscreenImage(index)}
                >
                  <Image 
                    src={image} 
                    alt={`Event image ${index + 1}`} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        
        {/* Floating Title Card */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="backdrop-blur-xl bg-card/80 rounded-2xl p-6 border border-border/50 shadow-2xl animate-fade-up">
            <div className="flex items-start justify-between mb-3 gap-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {eventData.title}
              </h1>
              <div className="flex gap-2 flex-shrink-0">
                <FavoriteButton eventId={params.id} />
                <ShareButton title={eventData.title} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {eventData.eventTypes.map((type, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="animate-scale-in hover:scale-110 transition-transform duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      </ParallaxHero>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2 space-y-6">
          {/* About Section with Icon */}
          <ScrollReveal direction="up">
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                About This Event
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: JSON.parse(eventData.description).content.map((block: ContentBlock) => {
                if (block.type === 'paragraph') {
                  return `<p class="text-muted-foreground leading-relaxed mb-4">${block.content?.map((content: ContentNode) => {
                    if (content.marks?.some((mark: ContentMark) => mark.type === 'bold')) {
                      return `<strong class="text-foreground">${content.text}</strong>`
                    }
                    return content.text
                  }).join('')}</p>`
                }
                if (block.type === 'heading') {
                  return `<h${block.attrs?.level} class="text-foreground font-bold mb-3 mt-6">${block.content?.[0].text}</h${block.attrs?.level}>`
                }
                return ''
              }).join('')}} />
            </CardContent>
          </Card>
          </ScrollReveal>
          
          {/* Quick Info Cards */}
          <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-2 gap-4">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{eventData.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold text-primary">
                      €<CountUp end={eventData.pricePerSeat} duration={1500} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </ScrollReveal>
        </div>
        
        <div className="space-y-6">
          {/* Sticky Booking Card */}
          <ScrollReveal direction="left" delay={0.3}>
          <Card className="sticky top-4 border-2 border-primary/20 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary animate-shimmer" />
            <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Book Your Spot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3">
                {eventData.timeSlots.map((slot, index) => {
                  const isLowSeats = slot.availableSeats <= 3 && slot.availableSeats > 0
                  const isSelected = selectedTimeSlotId === slot.id
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer animate-scale-in ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-1'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => !(!slot.isAvailable || slot.availableSeats === 0 || isBookingLoading) && handleSlotSelection(slot.id, slot.startTime, slot.endTime)}
                    >
                      {/* Urgency Badge */}
                      {isLowSeats && (
                        <div className="absolute -top-2 -right-2 px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-lg animate-pulse">
                          Only {slot.availableSeats} left!
                    </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{formatDate(slot.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                        {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                      </span>
                    </div>
                        
                        {/* Seats Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span className="font-medium">{slot.availableSeats} seats available</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLowSeats ? 'bg-destructive' : 'bg-primary'
                              }`}
                              style={{ width: `${(slot.availableSeats / (slot.availableSeats + 5)) * 100}%` }}
                            />
                          </div>
                        </div>
                    </div>
                      
                    <Button
                        className={`w-full mt-3 transition-all duration-300 ${
                          isSelected ? 'shadow-lg' : 'group-hover:shadow-md'
                        }`}
                        variant={isSelected ? "default" : "outline"}
                      disabled={!slot.isAvailable || slot.availableSeats === 0 || isBookingLoading}
                    >
                        {slot.isAvailable && slot.availableSeats > 0 
                          ? (isSelected ? '✓ Selected' : 'Select Slot')
                          : 'Sold Out'}
                    </Button>
                  </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Coach Card with hover effect */}
      <ScrollReveal direction="up" delay={0.4}>
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            Meet Your Organizer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Link href={`/coaches/${eventData.coachId}`} className="block group">
            <div className="flex items-center space-x-6 p-6 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300">
              <div className="relative h-20 w-20 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-110">
                <Image 
                  src={eventData.coach.profileImage} 
                  alt={eventData.coach.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{eventData.coach.name}</h3>
                <Button variant="link" className="p-0 h-auto text-primary group-hover:gap-2 transition-all">
                  View Full Profile 
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
      </ScrollReveal>

      {showSlotSelection && selectedTimeSlotId && (
        <SlotSelectionModal
          isOpen={showSlotSelection}
          onClose={() => {
            if (!isBookingLoading) {
              setShowSlotSelection(false)
              setSelectedTimeSlotId(null)
            }
          }}
          onConfirm={handleSlotCountConfirm}
          maxSlots={eventData?.timeSlots.find(slot => slot.id === selectedTimeSlotId)?.availableSeats || 1}
          isLoading={isBookingLoading}
        />
      )}

      {/* Fullscreen Image Gallery */}
      <Dialog open={fullscreenImage !== null} onOpenChange={(open) => !open && setFullscreenImage(null)}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black/95 border-0">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/10 hover:bg-white/20 p-2 backdrop-blur-sm transition-all duration-200 hover:scale-110">
            <X className="h-6 w-6 text-white" />
          </DialogClose>
          
          {fullscreenImage !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center p-16">
                <Image
                  src={allImages[fullscreenImage]}
                  alt={`Event image ${fullscreenImage + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 hover:bg-white/20 p-3 backdrop-blur-sm transition-all duration-200 hover:scale-110 group"
                  >
                    <ChevronLeft className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 hover:bg-white/20 p-3 backdrop-blur-sm transition-all duration-200 hover:scale-110 group"
                  >
                    <ChevronRight className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium">
                  {fullscreenImage + 1} / {allImages.length}
                </span>
              </div>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/30 backdrop-blur-sm rounded-lg">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setFullscreenImage(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
                      index === fullscreenImage ? 'border-primary ring-2 ring-primary/50' : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showBookingConfirmation && selectedTimeSlotId && (
        <BookingConfirmationModal
          isOpen={showBookingConfirmation}
          onClose={() => {
            if (!isBookingLoading) {
              setShowBookingConfirmation(false)
              setSelectedTimeSlotId(null)
            }
          }}
          onConfirm={handleBookingConfirm}
          slotCount={selectedSlotCount}
          isLoading={isBookingLoading}
        />
      )}
    </div>
  )
}