'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { NovelEditor } from "@/components/novel-editor"
import { CoachProfileFormData } from "@/types/coach"
import { cn } from "@/lib/utils"
import { JSONContent } from "@tiptap/react"

interface CoachProfileFormProps {
  initialData?: CoachProfileFormData;
  className?: string;
  onSubmit: (data: CoachProfileFormData) => Promise<void>;
}

export function CoachProfileForm({
  initialData,
  className,
  onSubmit
}: CoachProfileFormProps) {
  const [formData, setFormData] = useState<CoachProfileFormData>({
    tagline: initialData?.tagline || "",
    areasOfExpertise: initialData?.areasOfExpertise || [],
    certifications: initialData?.certifications || [],
    description: initialData?.description || ""
  })
  
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>(() => {
    if (!initialData?.description) return undefined;
    try {
      return typeof initialData.description === 'string' 
        ? JSON.parse(initialData.description)
        : initialData.description;
    } catch (e) {
      console.warn('Failed to parse initial description:', e);
      return undefined;
    }
  })
  const [newExpertise, setNewExpertise] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        ...formData,
        description: editorContent ? JSON.stringify(editorContent) : ""
      })
    } catch (error) {
      console.error('Failed to save coach profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addExpertise = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newExpertise.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        areasOfExpertise: [...prev.areasOfExpertise, newExpertise.trim()]
      }))
      setNewExpertise("")
    }
  }

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.filter((_, i) => i !== index)
    }))
  }

  const addCertification = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCertification.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }))
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <Card>
        <CardHeader className="px-6">
          <CardTitle>Coach Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="Your professional tagline"
              value={formData.tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Areas of Expertise</Label>
            <Input
              id="expertise"
              placeholder="Add expertise (press Enter)"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyDown={addExpertise}
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.areasOfExpertise.map((expertise, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {expertise}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeExpertise(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications</Label>
            <Input
              id="certifications"
              placeholder="Add certification (press Enter)"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyDown={addCertification}
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.certifications.map((certification, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {certification}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeCertification(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <NovelEditor
              initialContent={editorContent}
              onChange={setEditorContent}
              placeholder="Write about your coaching experience and approach..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
} 