"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Trash2 } from "lucide-react"
import Image from "next/image"
import { EventFormData } from "@/types/event"

interface RightColumnProps {
  isSubmitting?: boolean;
  onSubmit: (status: 'draft' | 'published') => void;
  coverImagePreview: string;
  galleryPreviews: string[];
  onCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCoverImage: () => void;
  onDeleteGalleryImage: (index: number) => void;
  hideButtons?: boolean;
  mode?: 'create' | 'edit';
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function RightColumn({ 
  isSubmitting = false, 
  onSubmit,
  coverImagePreview,
  galleryPreviews,
  onCoverImageUpload,
  onGalleryUpload,
  onDeleteCoverImage,
  onDeleteGalleryImage,
  hideButtons = false,
  mode = 'create',
  onDelete,
  isDeleting = false
}: RightColumnProps) {
  const coverImageRef = useRef<HTMLInputElement>(null)
  const galleryImagesRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6">
      {!hideButtons && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => onSubmit('published')}
                disabled={isSubmitting}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Event'}
              </Button>
              <Button
                onClick={() => onSubmit('draft')}
                disabled={isSubmitting}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Save as Draft
              </Button>
              {/* {mode === 'edit' && onDelete && (
                <Button
                  onClick={onDelete}
                  disabled={isDeleting}
                  variant="destructive"
                  size="lg"
                  className="w-full"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Event'}
                </Button>
              )} */}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Label className="mb-2 block">Cover Image</Label>
          <input
            type="file"
            ref={coverImageRef}
            className="hidden"
            accept="image/*"
            onChange={onCoverImageUpload}
          />
          <div 
            onClick={() => coverImageRef.current?.click()}
            className="w-full h-40 flex flex-col items-center justify-center relative border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
          >
            {coverImagePreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={coverImagePreview}
                  alt="Cover preview"
                  fill
                  className="object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCoverImage();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mb-2" />
                <span>Upload Cover Image</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Label className="mb-2 block">Gallery Images</Label>
          <input
            type="file"
            ref={galleryImagesRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={onGalleryUpload}
          />
          <div className="grid grid-cols-2 gap-4">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={preview}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => onDeleteGalleryImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="relative aspect-square">
              <div 
                onClick={() => galleryImagesRef.current?.click()}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <Upload className="h-6 w-6 mb-2" />
                <span>Add to Gallery</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

