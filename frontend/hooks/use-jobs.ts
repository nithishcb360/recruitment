import { useState, useEffect } from 'react';
import { getJobs, JobListItem, JobFilters } from '@/lib/api/jobs';

export function useJobs(filters?: JobFilters) {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobs(filters);
      setJobs(response.results);
    } catch (err: any) {
      setError(err.detail || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters)]);

  return { jobs, loading, error, refetch: fetchJobs };
}