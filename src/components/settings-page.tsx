'use client'

import Link from "next/link"
import { CalendarIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useUserRole } from "@/hooks/useUserRole"
import { ProfileCompletionBanner } from "./profile-completion-banner"
import { CurrentCoachProfile } from "@/types/coach"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AuthUser } from "aws-amplify/auth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Loader2 } from 'lucide-react'
import Image from "next/image"
import { getUploadProfileImageUrl, uploadProfileImage, getCoachProfile } from "@/lib/api"
import { useUserDetails } from "@/hooks/useUserDetails"

export default function SettingsPage() {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useAuth()
  const { isCoach } = useUserRole()
  const { userDetails, loading: userDetailsLoading, refreshUserDetails } = useUserDetails()
  const [coachProfile, setCoachProfile] = useState<CurrentCoachProfile| null>(null)
  const isCoachUser = isCoach()
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      console.log('User not found')
      return
    }
    console.log('User found:', user)

    // If user is a coach, fetch their profile
    const fetchCoachProfile = async () => {
      if (isCoachUser) {
        setIsLoadingProfile(true)
        try {
          const profile = await getCoachProfile();
          setCoachProfile({
            ...profile.data.coachProfile,
            userId: user.userId,
            userName: userDetails?.name || "",
            profilePhotoUrl: userDetails?.profileImage || "",
          })
        } catch (error) {
          console.error('Failed to fetch coach profile:', error);
        } finally {
          setIsLoadingProfile(false)
        }
      }
    }

    fetchCoachProfile();
  }, [user, isCoachUser, router, userDetails])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { uploadUrl, imageUrl } = await getUploadProfileImageUrl(file)
      await uploadProfileImage(uploadUrl, file)
      await refreshUserDetails() // Also refresh user details after upload
    } catch (error) {
      console.error('Error uploading profile image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!user || userDetailsLoading) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      {isCoachUser && coachProfile && coachProfile.completionPercentage < 100 && (
        <ProfileCompletionBanner completionPercentage={coachProfile.completionPercentage} />
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6">
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="relative">
                  <Avatar 
                    className={cn(
                      "h-24 w-24 cursor-pointer",
                      (isUploading || isLoadingProfile) && "opacity-50"
                    )} 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                  >
                    {userDetails?.profileImage ? (
                      <AvatarImage src={userDetails.profileImage} alt="Profile" className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                    <div className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {(isUploading || isLoadingProfile) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </div>
                  </Avatar>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isLoadingProfile ? 'Loading profile...' : isUploading ? 'Uploading...' : 'Click to upload a profile picture'}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  defaultValue={userDetails?.name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  defaultValue={userDetails?.email}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coach Profile Section */}
        {isCoachUser && (
          <>
            <Separator />
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Organizer Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your organizer profile and visibility.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/settings/coach-profile">
                      Edit Organizer Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

