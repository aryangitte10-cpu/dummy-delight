'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useUserRole } from "@/hooks/useUserRole"
import { CoachProfileForm } from "@/components/coach-profile-form"
import { CoachProfile, CoachProfileFormData } from "@/types/coach"
import { getCoachProfile, updateCoachProfile } from "@/lib/api"

export default function CoachProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { role, loading: roleLoading } = useUserRole()
  const [profile, setProfile] = useState<CoachProfileFormData>({
    tagline: "",
    areasOfExpertise: [],
    certifications: [],
    description: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Wait for role to be loaded
    if (roleLoading) {
      return
    }

    // Check role and redirect if not coach
    if (role !== 'coach') {
      router.push('/settings')
      return
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await getCoachProfile();
        if (response.success && response.data.coachProfile) {
          setProfile({
            tagline: response.data.coachProfile.tagline || "",
            areasOfExpertise: response.data.coachProfile.areasOfExpertise || [],
            certifications: response.data.coachProfile.certifications || [],
            description: response.data.coachProfile.description || ""
          });
        }
      } catch (error) {
        console.error('Failed to fetch coach profile:', error);
        setProfile({
          tagline: "",
          areasOfExpertise: [],
          certifications: [],
          description: ""
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, role, roleLoading, router]);

  const handleSubmit = async (data: CoachProfileFormData) => {
    try {
      await updateCoachProfile(data);
      // Could add a success toast/notification here
    } catch (error) {
      console.error('Failed to save coach profile:', error);
      // Could add an error toast/notification here
    }
  }

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <CoachProfileForm
        key={JSON.stringify(profile)}
        initialData={profile}
        onSubmit={handleSubmit}
      />
    </div>
  )
} 