import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardResponse } from '@/services';

interface UseDashboardReturn {
  dashboard: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
}

/**
 * Hook personnalisé pour gérer le dashboard
 */
export const useDashboard = (clientId: number | null): UseDashboardReturn => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!clientId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardService.getDashboard(clientId);
      setDashboard(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération du dashboard';
      setError(errorMessage);
      console.error('Fetch dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refreshDashboard = async () => {
    await fetchDashboard();
  };

  return {
    dashboard,
    isLoading,
    error,
    refreshDashboard,
  };
};
