'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface SlotSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (slotCount: number) => void
  maxSlots: number
  isLoading?: boolean
}

export function SlotSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  maxSlots,
  isLoading = false
}: SlotSelectionModalProps) {
  const [slotCount, setSlotCount] = React.useState(1)

  const handleConfirm = () => {
    onConfirm(slotCount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Number of Slots</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slot-count">Number of Slots</Label>
              <Input
                id="slot-count"
                type="number"
                min={1}
                max={maxSlots}
                value={slotCount}
                onChange={(e) => setSlotCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), maxSlots))}
                disabled={isLoading}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Please Note:</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Booking is subject to availability</li>
                <li>Payment will be required to confirm your booking</li>
                <li>Cancellation policy applies</li>
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              'Continue to Booking'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 