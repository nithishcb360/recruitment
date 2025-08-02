import { apiClient } from './client';

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  location?: string;
  current_title?: string;
  current_company?: string;
  years_of_experience?: number;
  linkedin_url?: string;
  portfolio_url?: string;
  skills: string[];
  source?: string;
  tags: string[];
  applications_count: number;
  latest_application?: {
    job_title: string;
    stage: string;
    applied_at: string;
  };
  created_at: string;
}

export interface JobApplication {
  id: number;
  job: number;
  job_details?: {
    id: number;
    title: string;
    department_name: string;
  };
  candidate: number;
  candidate_details?: {
    id: number;
    full_name: string;
    email: string;
  };
  stage: 'applied' | 'screening' | 'phone_screen' | 'technical' | 'onsite' | 'final' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  status: 'active' | 'on_hold' | 'rejected' | 'withdrawn' | 'hired';
  overall_rating?: number;
  ai_score?: number;
  applied_at: string;
  stage_updated_at: string;
  created_at: string;
}

export interface ApplicationFilters {
  job?: number;
  stage?: string;
  status?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Candidates API
export async function getCandidates(page?: number): Promise<PaginatedResponse<Candidate>> {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  
  const query = params.toString();
  return apiClient.get<PaginatedResponse<Candidate>>(`/candidates/${query ? `?${query}` : ''}`);
}

export async function getCandidate(id: number): Promise<Candidate> {
  return apiClient.get<Candidate>(`/candidates/${id}/`);
}

export async function createCandidate(data: Partial<Candidate>): Promise<Candidate> {
  return apiClient.post<Candidate>('/candidates/', data);
}

export async function updateCandidate(id: number, data: Partial<Candidate>): Promise<Candidate> {
  return apiClient.patch<Candidate>(`/candidates/${id}/`, data);
}

// Job Applications API
export async function getJobApplications(filters?: ApplicationFilters): Promise<PaginatedResponse<JobApplication>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
  }
  
  const query = params.toString();
  return apiClient.get<PaginatedResponse<JobApplication>>(`/applications/${query ? `?${query}` : ''}`);
}

export async function getJobApplication(id: number): Promise<JobApplication> {
  return apiClient.get<JobApplication>(`/applications/${id}/`);
}

export async function createJobApplication(data: {
  job: number;
  candidate_data?: Partial<Candidate>;
  candidate_id?: number;
  application_responses?: Record<string, any>;
}): Promise<JobApplication> {
  return apiClient.post<JobApplication>('/applications/', data);
}

export async function updateJobApplication(id: number, data: Partial<JobApplication>): Promise<JobApplication> {
  return apiClient.patch<JobApplication>(`/applications/${id}/`, data);
}

export async function advanceApplicationStage(id: number): Promise<void> {
  await apiClient.post(`/applications/${id}/advance_stage/`);
}

export async function rejectApplication(id: number, reason?: string): Promise<void> {
  await apiClient.post(`/applications/${id}/reject/`, { reason });
}