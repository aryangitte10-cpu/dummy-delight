export interface TimeSlot {
  id: string
  eventId: string
  startTime: string // UTC ISO string
  endTime: string // UTC ISO string
  totalSeats: number
  availableSeats: number
  isAvailable: boolean
}

export interface FormTimeSlot {
  id?: string
  date: Date
  startTime: Date // Full date object including time
  endTime: Date // Full date object including time
  seats: number
}

export interface EventFormData {
  id?: string
  title: string
  description: string
  location: string
  categories: string[]
  pricePerSeat: number
  timeSlots: {
    id?: string
    date: Date
    seats: number
    startTime: string // UTC ISO string for API
    endTime: string // UTC ISO string for API
  }[]
  coverImage?: string
  galleryImages?: string[]
  status: 'draft' | 'published'
  coachId: string
  coachName: string
}

export interface Event {
  id: string
  title: string
  description: string
  location: string
  eventTypes: string[]
  pricePerSeat: number
  status: 'draft' | 'published'
  coverImage: string
  galleryImages: string[]
  coachId: string
  createdAt: string
  updatedAt: string
  timeSlots: TimeSlot[]
  timezone: string
  coach: {
    id: string
    name: string
    email: string
    profileImage: string
  }
}

export interface EventResponse {
  success: boolean
  data: Event[]
  pagination?: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface EventPageResponse {
  success: boolean
  data: Event
}

export interface SingleEventResponse {
  success: boolean
  data: Event
} 