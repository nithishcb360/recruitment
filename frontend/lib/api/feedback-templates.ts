import { apiClient } from './client';

export interface FeedbackTemplate {
  id: number;
  organization: number;
  name: string;
  description: string;
  questions: Array<{
    id: number;
    text: string;
    type: 'text' | 'number' | 'rating' | 'yes/no' | 'multiple-choice' | 'textarea';
    options?: string[];
    required: boolean;
  }>;
  sections: any[];
  rating_criteria: any[];
  status: 'draft' | 'published';
  is_active: boolean;
  is_default: boolean;
  created_by?: number;
  created_by_details?: any;
  created_at: string;
  updated_at: string;
}

export interface FeedbackTemplateCreateData {
  name: string;
  description: string;
  questions: Array<{
    id: number;
    text: string;
    type: string;
    options?: string[];
    required: boolean;
  }>;
  status?: 'draft' | 'published';
  is_active?: boolean;
  is_default?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Feedback Templates API
export async function getFeedbackTemplates(): Promise<PaginatedResponse<FeedbackTemplate>> {
  return apiClient.get<PaginatedResponse<FeedbackTemplate>>('/feedback-templates/');
}

export async function getFeedbackTemplate(id: number): Promise<FeedbackTemplate> {
  return apiClient.get<FeedbackTemplate>(`/feedback-templates/${id}/`);
}

export async function createFeedbackTemplate(data: FeedbackTemplateCreateData): Promise<FeedbackTemplate> {
  return apiClient.post<FeedbackTemplate>('/feedback-templates/', data);
}

export async function updateFeedbackTemplate(id: number, data: Partial<FeedbackTemplateCreateData>): Promise<FeedbackTemplate> {
  return apiClient.patch<FeedbackTemplate>(`/feedback-templates/${id}/`, data);
}

export async function deleteFeedbackTemplate(id: number): Promise<void> {
  await apiClient.delete(`/feedback-templates/${id}/`);
}

export async function publishFeedbackTemplate(id: number): Promise<void> {
  await apiClient.post(`/feedback-templates/${id}/publish/`);
}

export async function unpublishFeedbackTemplate(id: number): Promise<void> {
  await apiClient.post(`/feedback-templates/${id}/unpublish/`);
}