'use client'

import { Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ShareButtonProps {
  title: string
  url?: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Event link has been copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      })
    }
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled share
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover-lift">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          {typeof window !== 'undefined' && 'share' in navigator && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share via...
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
