import { get, post, put, del } from 'aws-amplify/api';
import { EventFormData, EventPageResponse, EventResponse } from "@/types/event"
import { UserRole } from '@/hooks/useUserRole';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { CoachProfile, CoachProfileFormData, Coach, CurrentCoachProfile } from "@/types/coach";

interface ApiOptions {
  body?: any;
  queryParams?: Record<string, string>;
}

const API_NAME = 'api';

export async function apiGet<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { queryParams } = options;
  try {
    const response = await get({
      apiName: API_NAME,
      path,
      options: {
        queryParams
      }
    }).response;
    const result = await response.body.json();
    return result as T;
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
}

export async function apiPost<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, queryParams } = options;
  try {
    const response = await post({
      apiName: API_NAME,
      path,
      options: {
        body,
        queryParams
      }
    }).response;
    const result = await response.body.json();
    return result as T;
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  } 
}

export async function apiPut<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, queryParams } = options;
  try {
    const response = await put({
      apiName: API_NAME,
      path,
      options: {
        body,
        queryParams
      }
    }).response;
    const result = await response.body.json();
    return result as T;
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
}

export async function apiDelete(path: string, options: ApiOptions = {}): Promise<number> {
  const { queryParams } = options;
  try {
    const response = await del({
      apiName: API_NAME,
      path,
      options: {
        queryParams
      }
    }).response;
    const result = await response;
    return result.statusCode;
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
}

// Image upload functions
export async function uploadEventImage(file: File): Promise<string> {
  try {
    // Get pre-signed URL for upload
    const response = await apiPost<{ data: { uploadUrl: string; key: string; url: string } }>('/api/upload/event-image', {
      body: {
        fileName: file.name,
        contentType: file.type
      }
    });


    console.log(JSON.stringify(response));

    // Validate response has all required fields
    if (!response?.data?.uploadUrl || !response?.data?.key || !response?.data?.url) {
      throw new Error('Invalid response from server: Missing required fields');
    }



    // Upload file directly to S3 using pre-signed URL
    const uploadResponse = await fetch(response.data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload to S3: ${uploadResponse.statusText}`);
    }

    return response.data.url;
  } catch (error) {
    console.error('Error in uploadEventImage:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

export async function deleteEventImage(cloudFrontUrl: string): Promise<void> {
  await apiDelete('/api/upload/event-image', {
    queryParams: { cloudFrontUrl }
  });
}

// Event management functions
export async function saveEvent(eventData: EventFormData): Promise<EventResponse> {
  const response = await apiPost<EventResponse>('/api/events', {
    body: eventData
  });

  return response;
}

export async function updateEvent(eventId: string, eventData: Partial<EventFormData>): Promise<EventResponse> {
  const response = await apiPut<EventResponse>(`/api/events/${eventId}`, {
    body: eventData
  });

  return response;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await apiDelete(`/api/events/${eventId}`);
}

export async function getEvent(eventId: string): Promise<EventPageResponse> {
  const response = await apiGet<EventPageResponse>(`/api/events/${eventId}`);
  return response;
}

interface EventRegistrationData {
  timeSlotId: string;
  slotCount: number;
}

interface EventRegistrationResponse {
  success: boolean;
  data: {
    id: string;
    eventId: string;
    timeSlotId: string;
    slotCount: number;
    status: string;
  };
  message?: string;
}

export async function registerForEvent(eventId: string, registrationData: EventRegistrationData): Promise<EventRegistrationResponse> {
  const response = await apiPost<EventRegistrationResponse>(`/api/events/${eventId}/register`, {
    body: registrationData
  });
  return response;
}

// User role functions
export async function getUserRole(): Promise<UserRole> {
  try {
    const userAttributes = await fetchUserAttributes();
    return (userAttributes['custom:custom_role'] as UserRole) || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default to user role if error
  }
}

export async function isUserCoach(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'coach';
}

// Profile management functions
export async function getUserDetails(): Promise<{ success: boolean; data: { id: string; name: string; email: string; profileImage?: string } }> {
  const response = await apiGet<{ success: boolean; data: { id: string; name: string; email: string; profileImage?: string } }>('/api/user/profile');
  return response;
}

export async function getUploadProfileImageUrl(file: File): Promise<{ uploadUrl: string; imageUrl: string }> {
  const response = await apiPost<{ data: { uploadUrl: string; key: string; url: string } }>('/api/upload/profile-image', {
    body: {
      fileName: file.name,
      contentType: file.type
    }
  });

  if (!response?.data?.uploadUrl || !response?.data?.key || !response?.data?.url) {
    throw new Error('Invalid response from server: Missing required fields');
  }

  return {
    uploadUrl: response.data.uploadUrl,
    imageUrl: response.data.url
  };
}

export async function uploadProfileImage(uploadUrl: string, file: File): Promise<void> {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CoachProfileResponse {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  isCoach: boolean;
  coachProfile: CoachProfile;
}
interface CurrentCoachProfileResponse {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  isCoach: boolean;
  coachProfile: CurrentCoachProfile;
}

// Coach profile management functions
export async function getCoachProfile(): Promise<ApiResponse<CurrentCoachProfileResponse>> {
  const response = await apiGet<ApiResponse<CurrentCoachProfileResponse>>('/api/coach/profile');
  return response;
}

export async function updateCoachProfile(profileData: CoachProfileFormData): Promise<ApiResponse<CurrentCoachProfileResponse>> {
  const response = await apiPut<ApiResponse<CurrentCoachProfileResponse>>('/api/coach/profile', {
    body: profileData
  });
  return response;
}

export async function getCoachById(id: string): Promise<ApiResponse<CoachProfileResponse>> {
  const path = `/api/coaches/${id}`;
  console.log(path);
  const response = await apiGet<ApiResponse<CoachProfileResponse>>(path);
  return response;
}

// Event confirmation types and functions
export interface Confirmation {
  id: string;
  title: string;
  registrationCount: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  price: number;
  coach: {
    name: string;
    bio: string;
    image: string;
  };
  invitees?: string[];
}

export async function getEventConfirmation(eventId: string): Promise<ApiResponse<Confirmation>> {
  const response = await apiGet<ApiResponse<Confirmation>>(`/api/events/confirmation/${eventId}`);
  return response;
}

// Coach events
export async function getCoachEvents(): Promise<EventResponse> {
  const response = await apiGet<EventResponse>('/api/coach/events');
  return response;
}

export async function getCoachEvent(eventId: string): Promise<EventPageResponse> {
  const response = await apiGet<EventPageResponse>(`/api/coach/events/${eventId}`);
  return response;
}

// Invitee management functions
export async function addInvitee(registrationId: string, email: string): Promise<ApiResponse<{ success: boolean }>> {
  return await apiPost<ApiResponse<{ success: boolean }>>(`/api/registrations/${registrationId}/invitees/add`, {
    body: { email }
  });
}

export async function removeInvitee(registrationId: string, email: string): Promise<ApiResponse<{ success: boolean }>> {
  return await apiPost<ApiResponse<{ success: boolean }>>(`/api/registrations/${registrationId}/invitees/remove`, {
    body: { email }
  });
}

// Coach listing function
export async function getAllCoaches(): Promise<ApiResponse<Coach[]>> {
  const response = await apiGet<ApiResponse<Coach[]>>('/api/coaches');
  return response;
} 