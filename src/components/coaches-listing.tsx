'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAllCoaches } from "@/lib/api"
import type { Coach } from "@/types/coach"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function CoachesListingClient() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const response = await getAllCoaches()
      if (!response.success) {
        throw new Error('Failed to fetch organizers')
      }
      setCoaches(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load organizers. Please try again later.')
      setLoading(false)
    }
  }

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.profile.areasOfExpertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold gradient-text-animated float">Find Your Organizer</h1>
        <div className="w-full md:w-80 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Input
            type="search"
            placeholder="Search organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-105"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map((coach, index) => (
          <ScrollReveal key={coach.id} delay={index * 0.1}>
            <Card className="hover-lift hover:shadow-xl transition-all duration-300 hover:scale-105 border-transparent hover:border-primary/20 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4">
                  {coach.profileImage ? (
                    <div className="relative">
                      <Image
                        src={coach.profileImage}
                        alt={coach.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/30">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {coach.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{coach.name}</CardTitle>
                    {coach.profile.tagline && (
                      <p className="text-sm text-muted-foreground mt-1">{coach.profile.tagline}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coach.profile.description && (
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {typeof coach.profile.description === 'string' && coach.profile.description.startsWith('{') 
                        ? JSON.parse(coach.profile.description).content[0].content[0].text 
                        : coach.profile.description}
                    </p>
                  )}
                  {coach.profile.areasOfExpertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {coach.profile.areasOfExpertise.map((exp, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:bg-primary/20 hover:scale-105"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`/coaches/${coach.id}`} className="mt-4 block">
                    <Button className="w-full transition-all duration-200 hover:scale-105 hover:shadow-lg">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {filteredCoaches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No organizers found matching your search criteria.
        </div>
      )}
    </div>
  )
} 