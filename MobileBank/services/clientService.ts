import { clientApi } from './api';
import { API_CONFIG } from '@/config/environment';

// Types
export interface ClientDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role: 'CLIENT' | 'ADMIN';
  status?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  cin: string;
}

export interface UpdateClientRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

// Alias pour rétrocompatibilité
export type ClientProfile = ClientDTO;

const ENDPOINTS = API_CONFIG.CLIENT_SERVICE.ENDPOINTS;

export const clientService = {
  /**
   * Création d'un nouveau client
   */
  createClient: async (data: CreateClientRequest): Promise<ClientDTO> => {
    const response = await clientApi.post<ClientDTO>(ENDPOINTS.CLIENTS, data);
    return response.data;
  },

  /**
   * Récupération d'un client par ID
   */
  getClientById: async (clientId: number): Promise<ClientDTO> => {
    const response = await clientApi.get<ClientDTO>(ENDPOINTS.CLIENT_BY_ID(clientId));
    return response.data;
  },

  /**
   * Récupération de tous les clients (admin)
   */
  getAllClients: async (): Promise<ClientDTO[]> => {
    const response = await clientApi.get<ClientDTO[]>(ENDPOINTS.CLIENTS);
    return response.data;
  },

  /**
   * Mise à jour d'un client
   */
  updateClient: async (clientId: number, data: UpdateClientRequest): Promise<ClientDTO> => {
    const response = await clientApi.put<ClientDTO>(ENDPOINTS.CLIENT_BY_ID(clientId), data);
    return response.data;
  },

  /**
   * Suppression d'un client (admin)
   */
  deleteClient: async (clientId: number): Promise<void> => {
    await clientApi.delete(ENDPOINTS.CLIENT_BY_ID(clientId));
  },

  /**
   * Alias pour rétrocompatibilité - Récupération du profil
   */
  getProfile: async (clientId: number): Promise<ClientDTO> => {
    return clientService.getClientById(clientId);
  },

  /**
   * Alias pour rétrocompatibilité - Mise à jour du profil
   */
  updateProfile: async (clientId: number, data: UpdateClientRequest): Promise<ClientDTO> => {
    return clientService.updateClient(clientId, data);
  },
};

export default clientService;
