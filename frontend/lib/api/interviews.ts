import { apiClient } from './client';

export interface Interview {
  id: number;
  application: number;
  application_details?: {
    id: number;
    candidate_name: string;
    job_title: string;
    candidate_id: number;
    job_id: number;
  };
  interviewers: number[];
  interviewers_details?: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  }>;
  lead_interviewer?: number;
  lead_interviewer_details?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
  interview_type: 'phone-screen' | 'technical' | 'behavioral' | 'final-round' | 'cultural-fit' | 'panel' | 'onsite';
  round_number: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  instructions?: string;
  internal_notes?: string;
  preparation_materials?: any[];
  send_calendar_invite: boolean;
  send_confirmation_email: boolean;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewCreateData {
  application: number;
  interviewers: number[];
  lead_interviewer?: number;
  interview_type: Interview['interview_type'];
  round_number?: number;
  scheduled_at: string;
  duration_minutes?: number;
  location?: string;
  meeting_link?: string;
  instructions?: string;
  internal_notes?: string;
  preparation_materials?: any[];
  send_calendar_invite?: boolean;
  send_confirmation_email?: boolean;
}

export interface InterviewFilters {
  status?: string;
  interview_type?: string;
  application__job?: number;
  my_interviews?: boolean;
}

export interface InterviewFeedback {
  id: number;
  interview: number;
  interviewer: number;
  interviewer_details?: {
    id: number;
    full_name: string;
    email: string;
  };
  overall_rating?: number;
  technical_rating?: number;
  communication_rating?: number;
  cultural_fit_rating?: number;
  recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
  strengths?: string;
  weaknesses?: string;
  detailed_feedback?: string;
  questions_asked?: string;
  is_submitted: boolean;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewFeedbackCreateData {
  interview: number;
  overall_rating?: number;
  technical_rating?: number;
  communication_rating?: number;
  cultural_fit_rating?: number;
  recommendation: InterviewFeedback['recommendation'];
  strengths?: string;
  weaknesses?: string;
  detailed_feedback?: string;
  questions_asked?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Interviews API
export async function getInterviews(filters?: InterviewFilters): Promise<PaginatedResponse<Interview>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
  }
  
  const query = params.toString();
  return apiClient.get<PaginatedResponse<Interview>>(`/interviews/${query ? `?${query}` : ''}`);
}

export async function getInterview(id: number): Promise<Interview> {
  return apiClient.get<Interview>(`/interviews/${id}/`);
}

export async function createInterview(data: InterviewCreateData): Promise<Interview> {
  return apiClient.post<Interview>('/interviews/', data);
}

export async function updateInterview(id: number, data: Partial<InterviewCreateData>): Promise<Interview> {
  return apiClient.patch<Interview>(`/interviews/${id}/`, data);
}

export async function deleteInterview(id: number): Promise<void> {
  await apiClient.delete(`/interviews/${id}/`);
}

export async function confirmInterview(id: number): Promise<void> {
  await apiClient.post(`/interviews/${id}/confirm/`);
}

export async function cancelInterview(id: number, reason: string): Promise<void> {
  await apiClient.post(`/interviews/${id}/cancel/`, { reason });
}

export async function completeInterview(id: number): Promise<void> {
  await apiClient.post(`/interviews/${id}/complete/`);
}

// Interview Feedback API
export async function getInterviewFeedback(filters?: { interview?: number; interviewer?: number; my_feedback?: boolean }): Promise<PaginatedResponse<InterviewFeedback>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
  }
  
  const query = params.toString();
  return apiClient.get<PaginatedResponse<InterviewFeedback>>(`/interview-feedback/${query ? `?${query}` : ''}`);
}

export async function createInterviewFeedback(data: InterviewFeedbackCreateData): Promise<InterviewFeedback> {
  return apiClient.post<InterviewFeedback>('/interview-feedback/', data);
}

export async function updateInterviewFeedback(id: number, data: Partial<InterviewFeedbackCreateData>): Promise<InterviewFeedback> {
  return apiClient.patch<InterviewFeedback>(`/interview-feedback/${id}/`, data);
}

export async function submitInterviewFeedback(id: number): Promise<void> {
  await apiClient.post(`/interview-feedback/${id}/submit/`);
}

// Users API for interviewer selection
export async function getUsers(): Promise<PaginatedResponse<{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}>> {
  return apiClient.get<PaginatedResponse<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  }>>('/users/');
}