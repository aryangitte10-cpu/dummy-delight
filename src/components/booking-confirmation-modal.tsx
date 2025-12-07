'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  slotCount: number
  isLoading?: boolean
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  slotCount,
  isLoading = false
}: BookingConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Your Booking
          </DialogTitle>
          <DialogDescription className="pt-2">
            You are about to book {slotCount} {slotCount === 1 ? 'slot' : 'slots'} for this event.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-sm text-muted-foreground space-y-4">
            <p className="font-medium">Please confirm that:</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>You have selected the correct number of slots</li>
              <li>You understand that this booking will require payment to be confirmed</li>
              <li>You have reviewed and agree to the cancellation policy</li>
              <li>You understand that this booking is subject to availability</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 