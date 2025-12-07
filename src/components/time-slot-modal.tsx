"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeSlotModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (slot: { seats: number; startTime: Date; endTime: Date }) => void
  initialValues?: { seats: number; startTime: Date; endTime: Date }
  isEditing?: boolean
  selectedDate?: Date
}

export default function TimeSlotModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialValues, 
  isEditing,
  selectedDate 
}: TimeSlotModalProps) {
  const [seats, setSeats] = useState(initialValues ? initialValues.seats.toString() : "")
  const [startTime, setStartTime] = useState(initialValues ? 
    initialValues.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 
    ""
  )
  const [endTime, setEndTime] = useState(initialValues ? 
    initialValues.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 
    ""
  )

  // Reset form when modal closes or initialValues change
  useEffect(() => {
    if (initialValues) {
      setSeats(initialValues.seats.toString())
      setStartTime(initialValues.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
      setEndTime(initialValues.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
    } else {
      setSeats("")
      setStartTime("")
      setEndTime("")
    }
  }, [initialValues, isOpen])

  const handleSubmit = () => {
    if (!seats || !startTime || !endTime || (!isEditing && !selectedDate)) {
      return
    }

    // Convert time strings to Date objects using the selected date or existing date
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const [endHours, endMinutes] = endTime.split(':').map(Number)
    
    const baseDate = isEditing ? initialValues!.startTime : selectedDate!
    const startDate = new Date(baseDate)
    const endDate = new Date(baseDate)
    
    startDate.setHours(startHours, startMinutes, 0, 0)
    endDate.setHours(endHours, endMinutes, 0, 0)
    
    onSubmit({
      seats: Number.parseInt(seats),
      startTime: startDate,
      endTime: endDate,
    })
    
    // Reset form after submission
    if (!isEditing) {
      setSeats("")
      setStartTime("")
      setEndTime("")
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Time Slot' : 'Add Time Slot'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edit the details of this time slot.' 
              : `Add a new time slot for ${selectedDate?.toLocaleDateString()}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="seats">Number of Seats</Label>
            <Input 
              id="seats" 
              type="number" 
              value={seats} 
              onChange={(e) => setSeats(e.target.value)}
              min="1"
              required 
            />
          </div>
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              required 
            />
          </div>
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              required 
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!seats || !startTime || !endTime || (!isEditing && !selectedDate)}>
            {isEditing ? 'Save Changes' : 'Add Slot'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

