import { apiClient } from './client';

export interface CandidateNote {
  id: number;
  candidate: number;
  application?: number;
  note_type: 'general' | 'interview' | 'phone_call' | 'email' | 'feedback' | 'reminder';
  title?: string;
  content: string;
  created_by?: number;
  created_by_details?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
  is_private: boolean;
  visible_to_candidate: boolean;
}

export interface CandidateNoteCreateData {
  candidate: number;
  application?: number;
  note_type: CandidateNote['note_type'];
  title?: string;
  content: string;
  is_private?: boolean;
  visible_to_candidate?: boolean;
}

export interface CandidateNoteFilters {
  candidate?: number;
  application?: number;
  note_type?: string;
  is_private?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Candidate Notes API
export async function getCandidateNotes(filters?: CandidateNoteFilters): Promise<PaginatedResponse<CandidateNote>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
  }
  
  const query = params.toString();
  return apiClient.get<PaginatedResponse<CandidateNote>>(`/candidate-notes/${query ? `?${query}` : ''}`);
}

export async function getCandidateNote(id: number): Promise<CandidateNote> {
  return apiClient.get<CandidateNote>(`/candidate-notes/${id}/`);
}

export async function createCandidateNote(data: CandidateNoteCreateData): Promise<CandidateNote> {
  return apiClient.post<CandidateNote>('/candidate-notes/', data);
}

export async function updateCandidateNote(id: number, data: Partial<CandidateNoteCreateData>): Promise<CandidateNote> {
  return apiClient.patch<CandidateNote>(`/candidate-notes/${id}/`, data);
}

export async function deleteCandidateNote(id: number): Promise<void> {
  await apiClient.delete(`/candidate-notes/${id}/`);
}

// Helper function to get timeline notes for a specific candidate
export async function getCandidateTimeline(candidateId: number): Promise<CandidateNote[]> {
  const response = await getCandidateNotes({ candidate: candidateId });
  return response.results;
}