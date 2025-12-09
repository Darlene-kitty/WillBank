import api from './api';

export interface ClientProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role: 'CLIENT' | 'ADMIN' | 'AGENT';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
  updatedAt: string;
}

export const clientService = {
  /**
   * Récupération du profil client
   */
  getProfile: async (clientId: number): Promise<ClientProfile> => {
    const response = await api.get(`/api/clients/${clientId}`);
    return response.data;
  },

  /**
   * Mise à jour du profil client
   */
  updateProfile: async (
    clientId: number,
    data: Partial<ClientProfile>
  ): Promise<ClientProfile> => {
    const response = await api.put(`/api/clients/${clientId}`, data);
    return response.data;
  },

  /**
   * Récupération de tous les clients (admin only)
   */
  getAllClients: async (): Promise<ClientProfile[]> => {
    const response = await api.get('/api/clients');
    return response.data;
  },

  /**
   * Suppression d'un client (admin only)
   */
  deleteClient: async (clientId: number): Promise<void> => {
    await api.delete(`/api/clients/${clientId}`);
  },
};
