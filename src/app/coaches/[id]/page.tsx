'use client';

import { useState, useEffect } from 'react';
import { CoachPageClient } from "../../../components/coach-page-client"
import { getCoachById } from "@/lib/api"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default function CoachPage({ params }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [coach, setCoach] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try { 
        const resolvedParams = await params;
        const response = await getCoachById(resolvedParams.id);
        
        if (!response.success || !response.data) {
          notFound();
        }

        const { data: coachData } = response;
        
        // Transform API data to match the client component's expected format
        const transformedCoach = {
          id: coachData.id,
          name: `${coachData.firstName} ${coachData.lastName}`,
          title: coachData.coachProfile.tagline || '',
          image: coachData.profileImage || '/placeholder.svg?height=400&width=400',
          bio: coachData.coachProfile.description || '',
          expertise: coachData.coachProfile.areasOfExpertise || [],
          certifications: coachData.coachProfile.certifications || [],
          gallery: [
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
          ],
          upcomingEvents: [] // We'll need to add this endpoint later
        };

        setCoach(transformedCoach);
      } catch (error) {
        console.error('Error fetching coach:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch coach'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoach();
  }, [params]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CoachPageClient coach={coach} />
    </div>
  );
} 