import { apiClient } from './client';

export interface DashboardMetrics {
  active_jobs: number;
  time_to_fill: number;
  offer_rate: number;
  cost_per_hire: number;
  
  // Trends (percentage change)
  active_jobs_change: number;
  time_to_fill_change: number;
  offer_rate_change: number;
  cost_per_hire_change: number;
  
  // Pipeline summary
  total_candidates: number;
  candidates_by_stage: Record<string, number>;
  
  // Recent activity
  interviews_today: number;
  offers_pending: number;
  new_applications: number;
}

export interface SourcePerformance {
  id: number;
  source_name: string;
  total_applications: number;
  qualified_candidates: number;
  hires_made: number;
  qualification_rate: number;
  cost_per_hire: number;
  conversion_rate: number;
}

export interface RecentActivity {
  id: number;
  type: 'interview' | 'feedback' | 'offer' | 'schedule';
  title: string;
  candidate: string;
  job: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface JobAnalytics {
  id: number;
  title: string;
  department_name: string;
  applications_count: number;
  candidates_by_stage: Record<string, number>;
  days_open: number;
  urgency: string;
  next_action: string;
  sla_days: number;
  is_overdue: boolean;
}

// Analytics API
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiClient.get<DashboardMetrics>('/analytics/dashboard/');
}

export async function getSourcePerformance(): Promise<SourcePerformance[]> {
  const response = await apiClient.get<{ results: SourcePerformance[] }>('/analytics/sources/');
  return response.results;
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const response = await apiClient.get<{ results: RecentActivity[] }>('/analytics/activity/');
  return response.results;
}

export async function getJobsAnalytics(): Promise<JobAnalytics[]> {
  const response = await apiClient.get<{ results: JobAnalytics[] }>('/analytics/jobs/');
  return response.results;
}