import { useState, useEffect } from 'react';
import { getCandidates, getJobApplications, Candidate, JobApplication, ApplicationFilters } from '@/lib/api/candidates';

export function useCandidates(page?: number) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCandidates(page);
      setCandidates(response.results);
      setTotal(response.count);
    } catch (err: any) {
      setError(err.detail || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page]);

  return { candidates, loading, error, total, refetch: fetchCandidates };
}

export function useJobApplications(filters?: ApplicationFilters) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJobApplications(filters);
      setApplications(response.results);
    } catch (err: any) {
      setError(err.detail || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [JSON.stringify(filters)]);

  return { applications, loading, error, refetch: fetchApplications };
}