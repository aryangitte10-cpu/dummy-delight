"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { NovelEditor } from "@/components/novel-editor"
import TimeSlotModal from "./time-slot-modal"
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
import { EventFormData, FormTimeSlot } from "@/types/event"
import { JSONContent } from '@tiptap/react'
import { getUniqueLocations } from "@/lib/algolia"

const categories = [
  { label: "Workshop", value: "WORKSHOP" },
  { label: "Training", value: "TRAINING" },
  { label: "Seminar", value: "SEMINAR" },
  { label: "Conference", value: "CONFERENCE" },
  { label: "Networking", value: "NETWORKING" },
  { label: "Team Building", value: "TEAM_BUILDING" },
]

interface LeftColumnProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  timeSlots: FormTimeSlot[]
  onAddTimeSlot: (slot: Omit<FormTimeSlot, "date">) => void
  onDeleteTimeSlot?: (index: number) => void
  onEditTimeSlot: (index: number, slot: FormTimeSlot) => void
  onFormChange: (field: keyof EventFormData, value: any) => void
  formData: Partial<EventFormData>
}

// Helper function to format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function LeftColumn({ 
  selectedDate, 
  onDateSelect, 
  timeSlots, 
  onAddTimeSlot, 
  onDeleteTimeSlot, 
  onEditTimeSlot,
  onFormChange,
  formData 
}: LeftColumnProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [editingSlot, setEditingSlot] = useState<{ index: number; slot: FormTimeSlot } | null>(null)
  const [locations, setLocations] = useState<string[]>([])
  const [locationOpen, setLocationOpen] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")

  // Fetch unique locations from Algolia on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const uniqueLocations = await getUniqueLocations()
        setLocations(uniqueLocations)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setLocations([])
      }
    }
    fetchLocations()
  }, [])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleDeleteClick = (index: number) => {
    setSelectedSlotIndex(index)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedSlotIndex !== null && onDeleteTimeSlot) {
      onDeleteTimeSlot(selectedSlotIndex)
      setDeleteConfirmOpen(false)
      setSelectedSlotIndex(null)
    }
  }

  const handleEditClick = (index: number, slot: FormTimeSlot) => {
    setEditingSlot({ 
      index, 
      slot
    })
  }

  const handleEditSubmit = (slot: { seats: number; startTime: Date; endTime: Date }) => {
    if (editingSlot) {
      onEditTimeSlot(editingSlot.index, {
        ...slot,
        date: timeSlots[editingSlot.index].date
      })
      setEditingSlot(null)
    }
  }

  const handleAddTimeSlot = (slot: { seats: number; startTime: Date; endTime: Date }) => {
    if (selectedDate) {
      onAddTimeSlot({
        ...slot
      })
      onDateSelect(undefined) // Close the add modal
    }
  }

  const handleDescriptionChange = (content: JSONContent) => {
    onFormChange('description', JSON.stringify(content))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange('location', e.target.value)
  }

  const handleLocationSelect = (location: string) => {
    onFormChange('location', location)
    setLocationOpen(false)
    setLocationSearch("")
  }

  // Filter locations based on search
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const handleCategoryChange = (category: string) => {
    const currentCategories = formData.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    onFormChange('categories', newCategories)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0
    onFormChange('pricePerSeat', price)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          className="!text-xl !sm:text-2xl !font-bold !px-4 !py-3 !h-auto !border-none !focus-visible:ring-0 !focus-visible:ring-offset-0 !md:text-xl"
          placeholder="Event Title"
          value={formData.title}
          onChange={(e) => onFormChange('title', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <NovelEditor 
          onChange={handleDescriptionChange}
          initialContent={formData.description ? JSON.parse(formData.description) : undefined}
          placeholder="Write your event description..."
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={locationOpen}
              className="w-full justify-between"
            >
              {formData.location || "Select or type location..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search locations..." 
                value={locationSearch}
                onValueChange={setLocationSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {locationSearch ? (
                    <div className="py-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        No existing location found. You can type a new location.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleLocationSelect(locationSearch)}
                      >
                        Use &quot;{locationSearch}&quot;
                      </Button>
                    </div>
                  ) : (
                    "No locations found."
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {filteredLocations.map((location) => (
                    <CommandItem
                      key={location}
                      onSelect={() => handleLocationSelect(location)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.location === location ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {location}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input 
          id="location" 
          placeholder="Or type a new location" 
          value={formData.location} 
          onChange={handleLocationChange}
          className="mt-2"
        />
        {formData.location && !locations.includes(formData.location) && (
          <p className="mt-1 text-xs text-muted-foreground">
            This is a new location that will be added to the system.
          </p>
        )}
      </div>

      <div>
        <Label>Categories</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {formData.categories?.length 
                ? `${formData.categories.length} categories selected` 
                : "Select categories..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem 
                      key={category.value} 
                      onSelect={() => handleCategoryChange(category.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (formData.categories || []).includes(category.value) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {category.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="mt-2 flex flex-wrap gap-2">
          {(formData.categories || []).map((category) => (
            <div key={category} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              {categories.find((c) => c.value === category)?.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="price">Price per seat (€)</Label>
        <Input 
          id="price" 
          type="number" 
          placeholder="0.00" 
          value={formData.pricePerSeat} 
          onChange={handlePriceChange}
        />
      </div>

      <div>
        <Label>Time Slots</Label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Calendar 
              mode="single" 
              selected={selectedDate} 
              onSelect={onDateSelect} 
              className="w-full border rounded-md" 
            />
          </div>
          <div className="w-full sm:w-1/2">
            {timeSlots.map((slot, index) => (
              <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm mt-1 flex justify-between items-center">
                <span className="text-xs sm:text-sm">
                  {slot.date.getDate().toString().padStart(2, '0')}.
                  {(slot.date.getMonth() + 1).toString().padStart(2, '0')}.
                  {slot.date.getFullYear()} - Seats: {slot.seats}, 
                  Time: {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(index, slot)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && !editingSlot && (
        <TimeSlotModal 
          isOpen={!!selectedDate} 
          onClose={() => onDateSelect(undefined)} 
          onSubmit={handleAddTimeSlot}
          selectedDate={selectedDate}
        />
      )}

      {editingSlot && (
        <TimeSlotModal
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          onSubmit={handleEditSubmit}
          initialValues={editingSlot.slot}
          isEditing={true}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the time slot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

