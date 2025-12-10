import { useState, useEffect, useCallback } from 'react';
import { clientService, ClientProfile } from '@/services';

interface UseClientReturn {
  client: ClientProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshClient: () => Promise<void>;
  updateClient: (data: Partial<ClientProfile>) => Promise<ClientProfile>;
}

/**
 * Hook personnalisé pour gérer le profil client
 */
export const useClient = (clientId: number | null): UseClientReturn => {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    if (!clientId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await clientService.getProfile(clientId);
      setClient(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération du profil';
      setError(errorMessage);
      console.error('Fetch client error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const refreshClient = async () => {
    await fetchClient();
  };

  const updateClient = async (data: Partial<ClientProfile>): Promise<ClientProfile> => {
    if (!clientId) throw new Error('Client ID is required');

    try {
      setIsLoading(true);
      setError(null);
      const updatedClient = await clientService.updateProfile(clientId, data);
      setClient(updatedClient);
      return updatedClient;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      console.error('Update client error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    client,
    isLoading,
    error,
    refreshClient,
    updateClient,
  };
};
