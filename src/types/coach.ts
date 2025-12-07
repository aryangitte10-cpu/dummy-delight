export interface CurrentCoachProfile {
  userName: string;
  userId: string;
  tagline: string;
  areasOfExpertise: string[];
  certifications: string[];
  profilePhotoUrl?: string;
  galleryPhotos: string[];
  description: string;
  completionPercentage: number;
}

export interface CoachProfile {
  tagline: string;
  areasOfExpertise: string[];
  certifications: string[];
  description: string;
  profileCompletePercent: number;
}

export interface Coach {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  profile: CoachProfile;
}

export interface CoachProfileFormData {
  tagline: string;
  areasOfExpertise: string[];
  certifications: string[];
  description: string;
}

