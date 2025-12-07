"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from 'next/dynamic'
import RightColumn from "./right-column"
import { Button } from "./ui/button"
import { EventFormData, FormTimeSlot } from "@/types/event"
import { saveEvent, updateEvent, uploadEventImage, deleteEventImage, getEvent, deleteEvent, getCoachEvent } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"
import Image from "next/image"
import { getCurrentUser } from "aws-amplify/auth"
import type { SingleEventResponse, Event } from "@/types/event"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const LeftColumn = dynamic(() => import('./left-column'), {
  ssr: false
})

// Image validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Validation helper
function validateImage(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 5MB.';
  }
  return null;
}

interface EventFormProps {
  eventId?: string;
  mode?: 'create' | 'edit';
}

interface LeftColumnProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  timeSlots: Array<{ date: Date; seats: number; startTime: string; endTime: string }>
  onAddTimeSlot: (slot: { seats: number; startTime: string; endTime: string; date: Date }) => void
  onDeleteTimeSlot?: (index: number) => void
  onEditTimeSlot: (index: number, slot: { seats: number; startTime: string; endTime: string; date: Date }) => void
  onFormChange: (field: keyof EventFormData, value: any) => void
  formData: Partial<EventFormData>
}

export default function EventForm({ eventId, mode = 'create' }: EventFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<FormTimeSlot[]>([])
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    title: "",
    description: "",
    location: "",
    categories: [],
    pricePerSeat: 0,
    timeSlots: [],
    galleryImages: []
  })
  const [coverImagePreview, setCoverImagePreview] = useState<string>("")
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const coverImageRef = useRef<HTMLInputElement>(null)
  const galleryImagesRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (mode === 'edit' && eventId) {
      const fetchEventData = async () => {
        try {
          const response = await getCoachEvent(eventId)
          if (!response.success || !response.data) {
            throw new Error('Failed to fetch event data')
          }
          
          const event = response.data
          
          // Convert UTC ISO strings to Date objects for FormTimeSlot
          const formattedTimeSlots: FormTimeSlot[] = event.timeSlots.map(slot => ({
            id: slot.id, // Backend-assigned ID
            date: new Date(slot.startTime),
            seats: slot.totalSeats,
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime)
          }))
          
          setTimeSlots(formattedTimeSlots)
          
          // Convert FormTimeSlot[] to EventFormData time slots
          const convertedSlots = formattedTimeSlots.map(slot => ({
            ...(slot.id ? { id: slot.id } : {}), // Only include ID if it exists
            date: slot.date,
            seats: slot.seats,
            startTime: slot.startTime.toISOString(),
            endTime: slot.endTime.toISOString()
          }))
          
          setFormData({
            title: event.title,
            description: event.description,
            location: event.location,
            categories: event.eventTypes,
            pricePerSeat: event.pricePerSeat,
            coverImage: event.coverImage,
            galleryImages: event.galleryImages || [],
            timeSlots: convertedSlots
          })
          
          setCoverImagePreview(event.coverImage || '')
          setGalleryPreviews(event.galleryImages || [])
          
        } catch (error) {
          console.error('Error fetching event:', error)
          setError(error instanceof Error ? error.message : 'Failed to fetch event data')
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load event data. Please try again.",
          })
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchEventData()
    }
  }, [mode, eventId])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleAddTimeSlot = (slot: Omit<FormTimeSlot, "date" | "id">) => {
    if (selectedDate) {
      const newSlot: FormTimeSlot = { 
        date: selectedDate, 
        ...slot
        // No ID for new slots
      }
      const newSlots = [...timeSlots, newSlot]
      setTimeSlots(newSlots)
      
      // Convert FormTimeSlot[] to EventFormData time slots
      const convertedSlots = newSlots.map(slot => ({
        ...(slot.id ? { id: slot.id } : {}), // Only include ID if it exists
        date: slot.date,
        seats: slot.seats,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString()
      }))
      
      setFormData(prev => ({ ...prev, timeSlots: convertedSlots }))
      setSelectedDate(undefined)
    }
  }

  const handleDeleteTimeSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index)
    setTimeSlots(newSlots)
    
    // Convert FormTimeSlot[] to EventFormData time slots
    const convertedSlots = newSlots.map(slot => ({
      ...(slot.id ? { id: slot.id } : {}), // Only include ID if it exists
      date: slot.date,
      seats: slot.seats,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString()
    }))
    
    setFormData(prev => ({ ...prev, timeSlots: convertedSlots }))
  }

  const handleEditTimeSlot = (index: number, updatedSlot: FormTimeSlot) => {
    const newSlots = timeSlots.map((slot, i) => 
      i === index ? { ...updatedSlot, ...(slot.id ? { id: slot.id } : {}) } : slot // Preserve ID only if it exists
    )
    setTimeSlots(newSlots)
    
    // Convert FormTimeSlot[] to EventFormData time slots
    const convertedSlots = newSlots.map(slot => ({
      ...(slot.id ? { id: slot.id } : {}), // Only include ID if it exists
      date: slot.date,
      seats: slot.seats,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString()
    }))
    
    setFormData(prev => ({ ...prev, timeSlots: convertedSlots }))
  }

  const handleFormChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      const error = validateImage(file);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        return;
      }

      try {
        setIsUploading(true);
        // Show preview immediately
        const preview = URL.createObjectURL(file)
        setCoverImagePreview(preview)

        // Upload to cloud storage
        const cloudFrontUrl = await uploadEventImage(file)
        
        // If there was a previous cover image, delete it
        if (formData.coverImage) {
          await deleteEventImage(formData.coverImage)
        }

        // Update form data with new CloudFront URL
        setFormData(prev => ({ ...prev, coverImage: cloudFrontUrl }))
        
        toast({
          title: "Success",
          description: "Cover image uploaded successfully",
        });
      } catch (error) {
        console.error('Failed to upload cover image:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload cover image. Please try again.",
        });
        // Reset preview on error
        setCoverImagePreview("")
      } finally {
        setIsUploading(false);
      }
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Validate all files
      const errors = files.map(validateImage).filter(Boolean);
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: errors[0],
        });
        return;
      }

      try {
        setIsUploading(true);
        // Show previews immediately
        const previews = files.map(file => URL.createObjectURL(file))
        setGalleryPreviews(prev => [...prev, ...previews])

        // Upload all images to cloud storage
        const cloudFrontUrls = await Promise.all(
          files.map(file => uploadEventImage(file))
        )

        // Update form data with new CloudFront URLs
        setFormData(prev => ({ 
          ...prev, 
          galleryImages: [...(prev.galleryImages || []), ...cloudFrontUrls]
        }))

        toast({
          title: "Success",
          description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`,
        });
      } catch (error) {
        console.error('Failed to upload gallery images:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload gallery images. Please try again.",
        });
        // Reset previews on error
        setGalleryPreviews(prev => prev.slice(0, prev.length - files.length))
      } finally {
        setIsUploading(false);
      }
    }
  }

  const handleDeleteCoverImage = async () => {
    try {
      if (formData.coverImage) {
        await deleteEventImage(formData.coverImage)
      }
      setCoverImagePreview("")
      setFormData(prev => ({ ...prev, coverImage: undefined }))
      toast({
        title: "Success",
        description: "Cover image deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete cover image:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete cover image. Please try again.",
      });
    }
  }

  const handleDeleteGalleryImage = async (index: number) => {
    try {
      const imageUrl = formData.galleryImages?.[index]
      if (imageUrl) {
        await deleteEventImage(imageUrl)
      }
      
      // Remove from previews and form data
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
      setFormData(prev => ({
        ...prev,
        galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index)
      }))

      toast({
        title: "Success",
        description: "Gallery image deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete gallery image:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete gallery image. Please try again.",
      });
    }
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      // Validation checks
      const validationErrors: string[] = [];

      // 1. Title validation (minimum 20 characters)
      if (!formData.title || formData.title.length < 20) {
        validationErrors.push("Title must be at least 20 characters long");
      }

      // 2. Description validation (minimum 100 characters)
      const descriptionContent = formData.description ? JSON.parse(formData.description) : null;
      let descriptionText = "";
      if (descriptionContent?.content) {
        descriptionText = descriptionContent.content
          .map((node: any) => 
            node.content?.map((content: any) => content.text || "").join("") || ""
          )
          .join("");
      }
      if (!descriptionText || descriptionText.length < 100) {
        validationErrors.push("Description must be at least 100 characters long");
      }

      // 3. Time slots validation
      if (!timeSlots || timeSlots.length === 0) {
        validationErrors.push("At least one time slot must be created");
      } else {
        // Check each slot's time validity
        timeSlots.forEach((slot, index) => {
          const start = new Date(`1970-01-01T${slot.startTime}`);
          const end = new Date(`1970-01-01T${slot.endTime}`);
          if (end <= start) {
            validationErrors.push(`Time slot ${index + 1}: End time must be after start time`);
          }
        });
      }

      // 4. Gallery images validation
      if (!formData.galleryImages || formData.galleryImages.length === 0) {
        validationErrors.push("At least one gallery image must be uploaded");
      }

      // 5. Cover image validation
      if (!formData.coverImage) {
        validationErrors.push("A cover image must be selected");
      }

      // 6. Location, categories, and price validation
      if (!formData.location || formData.location.trim() === "") {
        validationErrors.push("Location must be provided");
      }

      if (!formData.categories || formData.categories.length === 0) {
        validationErrors.push("At least one category must be selected");
      }

      if (!formData.pricePerSeat || formData.pricePerSeat <= 0) {
        validationErrors.push("Price per seat must be greater than 0");
      }

      // If there are validation errors, show them and return
      if (validationErrors.length > 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: validationErrors.join("\n"),
        });
        return;
      }

      // If all validations pass, proceed with submission
      setIsSubmitting(true)
      const currentUser = await getCurrentUser()
      
      // FormTimeSlot dates are already converted to ISO strings in formData
      const eventData: EventFormData = {
        ...formData as EventFormData,
        status,
        coachId: currentUser.userId,
        coachName: currentUser.username
      }

      if (mode === 'edit' && eventId) {
        // Update existing event
        await updateEvent(eventId, eventData)
      } else {
        // Create new event
        await saveEvent(eventData)
      }

      toast({
        title: "Success",
        description: `Event ${status === 'draft' ? 'draft saved' : 'published'} successfully`,
      });
      // Redirect to my events page
      window.location.href = '/my-events'
    } catch (error) {
      console.error('Error saving event:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event. Please try again.",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!eventId) return
    
    try {
      setIsDeleting(true)
      await deleteEvent(eventId)
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
      // Redirect to my events page
      window.location.href = '/my-events'
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8">{mode === 'create' ? 'Create' : 'Edit'} Event</h1>
      
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 min-h-screen">
        <div className="col-span-2">
          <Card>
            <CardContent className="p-6">
              <LeftColumn
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                timeSlots={timeSlots}
                onAddTimeSlot={handleAddTimeSlot}
                onDeleteTimeSlot={handleDeleteTimeSlot}
                onEditTimeSlot={handleEditTimeSlot}
                onFormChange={handleFormChange}
                formData={formData}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto bg-background">
          <RightColumn 
            isSubmitting={isSubmitting || isUploading}
            onSubmit={handleSubmit}
            coverImagePreview={coverImagePreview}
            galleryPreviews={galleryPreviews}
            onCoverImageUpload={handleCoverImageUpload}
            onGalleryUpload={handleGalleryUpload}
            onDeleteCoverImage={handleDeleteCoverImage}
            onDeleteGalleryImage={handleDeleteGalleryImage}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 lg:hidden">
        <Card>
          <CardContent className="p-4">
            <LeftColumn
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              timeSlots={timeSlots}
              onAddTimeSlot={handleAddTimeSlot}
              onDeleteTimeSlot={handleDeleteTimeSlot}
              onEditTimeSlot={handleEditTimeSlot}
              onFormChange={handleFormChange}
              formData={formData}
            />
          </CardContent>
        </Card>
        
        {/* Image upload sections without submit buttons */}
        <RightColumn 
          isSubmitting={isSubmitting || isUploading}
          onSubmit={handleSubmit}
          coverImagePreview={coverImagePreview}
          galleryPreviews={galleryPreviews}
          onCoverImageUpload={handleCoverImageUpload}
          onGalleryUpload={handleGalleryUpload}
          onDeleteCoverImage={handleDeleteCoverImage}
          onDeleteGalleryImage={handleDeleteGalleryImage}
          hideButtons={true}
        />

        {/* Mobile Submit Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleSubmit('published')}
                disabled={isSubmitting || isUploading}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Event'}
              </Button>
              <Button
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting || isUploading}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Save as Draft
              </Button>
              {mode === 'edit' && (
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                  variant="destructive"
                  size="lg"
                  className="w-full"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Event'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

