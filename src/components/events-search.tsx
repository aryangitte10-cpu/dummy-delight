'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ChevronLeft, ChevronRight, X, MapPin, Users } from 'lucide-react'
import { EventCardSkeleton } from '@/components/event-card-skeleton'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { searchClient, indexName, EventData, parseDescription, getUniqueLocations } from '@/lib/algolia'

// Constants for event types (from your example)
const EVENT_TYPES = ['SEMINAR', 'NETWORKING', 'TEAM_BUILDING', 'BEACH_CLEANUP', 'REFORESTATION', 'WILDLIFE_CONSERVATION']

export function EventsSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEventTypes, setSelectedEventTypes] = useState<Record<string, boolean>>({})
  const [selectedLocation, setSelectedLocation] = useState('')
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState<EventData[]>([])
  const [totalHits, setTotalHits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [isSearchClearing, setIsSearchClearing] = useState(false)
  const [locations, setLocations] = useState<string[]>([])
  const [locationsLoading, setLocationsLoading] = useState(true)
  
  const eventsPerPage = 9

  // Fetch unique locations from Algolia on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true)
        const uniqueLocations = await getUniqueLocations()
        setLocations(uniqueLocations)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setLocations([])
      } finally {
        setLocationsLoading(false)
      }
    }
    fetchLocations()
  }, [])

  // Function to search events using Algolia
  const searchEvents = async () => {
    setLoading(true)
    
    try {
      // Build filters
      const filters = []
      
      // Add event type filters
      const selectedTypes = Object.entries(selectedEventTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([type]) => type)
      
      if (selectedTypes.length > 0) {
        // Use OR condition between all selected event types
        // This ensures we get events that contain ANY of the selected types
        const eventTypeFilters = selectedTypes.map(type => `eventTypes:"${type}"`).join(' OR ')
        filters.push(`(${eventTypeFilters})`)
      }
      
      // Add location filter
      if (selectedLocation && selectedLocation !== "any") {
        filters.push(`location:"${selectedLocation}"`)
      }
      
      // Add price filter
      filters.push(`pricePerSeat >= ${priceRange[0]} AND pricePerSeat <= ${priceRange[1]}`)
      
      // Add date filter if selected
      if (selectedDate) {
        const selectedDateTimestamp = new Date(selectedDate).getTime()
        filters.push(`timeSlots.startTime >= ${selectedDateTimestamp}`)
      }
      
      // Simplified search with the liteClient
      console.log('Executing search with filters:', filters.join(' AND '));
      try {
        // Using standard structure for Algolia liteClient
        const searchResults = await searchClient.search([
          {
            indexName,
            params: {
              query: searchQuery,
              filters: filters.join(' AND '),
              page: currentPage - 1,
              hitsPerPage: eventsPerPage,
            },
          },
        ]);
        
        console.log('Search response:', searchResults);
        // Extract results
        if (searchResults && searchResults.results && searchResults.results[0]) {
          // Use type assertion to handle TypeScript errors
          const hitResults = searchResults.results[0] as any;
          setEvents(hitResults.hits as EventData[]);
          setTotalHits(hitResults.nbHits || 0);
        } else {
          console.error('Unexpected response structure:', searchResults);
          setEvents([]);
          setTotalHits(0);
        }
      } catch (error) {
        console.error('Error searching events:', error);
        setEvents([]);
        setTotalHits(0);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error searching events:', error);
      setEvents([]);
      setTotalHits(0);
    }
  }
  
  // Fetch events when component mounts or when page changes
  useEffect(() => {
    searchEvents()
  }, [currentPage])
  
  // Initial search when component mounts
  useEffect(() => {
    searchEvents()
  }, [])
  
  // Handler for applying filters
  const handleApplyFilters = () => {
    setCurrentPage(1) // Reset to first page when filters change
    searchEvents() // Search with new filters
  }
  
  // Handle event type selection
  const handleEventTypeChange = (type: string, checked: boolean) => {
    setSelectedEventTypes(prev => ({
      ...prev,
      [type]: checked
    }))
  }

  // Reset all filters
  const handleResetFilters = () => {
    setIsResetting(true)
    setSearchQuery('')
    setSelectedEventTypes({})
    setSelectedLocation('')
    setPriceRange([0, 200])
    setSelectedDate('')
    setCurrentPage(1)
  }

  // Effect to handle search after reset
  useEffect(() => {
    if (isResetting) {
      searchEvents()
      setIsResetting(false)
    }
  }, [isResetting])

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchEvents()
  }

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearchClearing(true)
  }

  // Effect to handle search after clearing search
  useEffect(() => {
    if (isSearchClearing) {
      searchEvents()
      setIsSearchClearing(false)
    }
  }, [isSearchClearing])

  // Calculate total pages
  const totalPages = Math.ceil(totalHits / eventsPerPage)

  // Pagination handler
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b p-6 bg-gradient-to-r from-background to-muted/20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold gradient-text-animated float animate-fade-in">Explore Events</h1>
          <p className="text-muted-foreground mt-2 animate-fade-up" style={{ animationDelay: '150ms' }}>Discover amazing events and experiences</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-6 animate-slide-in">
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Search</h3>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search events..." 
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Event Type</h3>
              <div className="space-y-2">
                {EVENT_TYPES.map((type) => (
                  <div key={type} className="flex items-center group">
                    <Checkbox 
                      id={type} 
                      checked={selectedEventTypes[type] || false}
                      onCheckedChange={(checked) => 
                        handleEventTypeChange(type, checked === true)
                      }
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <label htmlFor={type} className="ml-2 text-sm cursor-pointer transition-colors duration-200 group-hover:text-primary">
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Location</h3>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
                disabled={locationsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={locationsLoading ? "Loading locations..." : "Select location"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Location</SelectItem>
                  {locations.length > 0 ? (
                    locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))
                  ) : (
                    !locationsLoading && (
                      <SelectItem value="" disabled>
                        No locations available
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
              <Slider 
                value={priceRange} 
                onValueChange={setPriceRange} 
                max={priceRange[1]} 
                step={1}
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <span>€</span>
                  <Input
                    type="number"
                    min={0}
                    max={priceRange[1] - 1}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setPriceRange([value, Math.max(value + 1, priceRange[1])])
                    }}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span>€</span>
                  <Input
                    type="number"
                    min={priceRange[0] + 1}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      const newMax = Math.max(priceRange[0] + 1, value)
                      setPriceRange([priceRange[0], newMax])
                    }}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Date</h3>
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <Button 
              className="w-full mb-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover-lift glow-primary"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              className="w-full transition-all duration-200 hover:scale-105 hover:border-primary/50"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </aside>

          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <ScrollReveal key={event.id} delay={index * 0.1}>
                    <Link href={`/events/${event.id}`} className="block group">
                      <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover-lift hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary/30 relative">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                             style={{ boxShadow: '0 0 30px rgba(var(--primary), 0.2)' }} />
                        
                        <div className="relative h-48 w-full overflow-hidden">
                        <Image 
                          src={event.coverImage || '/placeholder.svg'} 
                          alt={event.title} 
                          fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Floating badge */}
                          {event.timeSlots.reduce((total, slot) => total + slot.availableSeats, 0) <= 5 && (
                            <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                              Almost Full!
                      </div>
                          )}
                        </div>
                        <div className="p-5 relative">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{parseDescription(event.description)}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.eventTypes.slice(0, 3).map((type, idx) => (
                              <span key={type} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium transition-all duration-200 hover:bg-primary/20 hover:scale-105" style={{ animationDelay: `${idx * 50}ms` }}>
                              {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                            </span>
                          ))}
                            {event.eventTypes.length > 3 && (
                              <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-medium">
                                +{event.eventTypes.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">
                                {event.timeSlots.reduce((total, slot) => total + slot.availableSeats, 0)} spots
                              </span>
                            </div>
                            <p className="text-lg font-bold text-primary">€{event.pricePerSeat}</p>
                          </div>
                      </div>
                    </div>
                  </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            )}

            {events.length > 0 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <span className="mx-4 flex items-center px-4 py-2 bg-muted rounded-lg font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}