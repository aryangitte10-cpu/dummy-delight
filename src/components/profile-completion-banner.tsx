'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'

interface ProfileCompletionBannerProps {
  completionPercentage: number;
}

export function ProfileCompletionBanner({ completionPercentage }: ProfileCompletionBannerProps) {
  const [show, setShow] = useState(true)

  // Hide banner if profile is complete
  useEffect(() => {
    if (completionPercentage === 100) {
      setShow(false)
    }
  }, [completionPercentage])

  if (!show) return null

  return (
    <Alert className="mb-6">
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium">Complete your coach profile</div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {completionPercentage}% complete
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="ml-4">
          <Link href="/settings/coach-profile">
            Complete Profile
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
} 