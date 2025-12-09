// Types et interfaces pour l'authentification et les clients

export enum ClientRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role?: ClientRole;
  status?: ClientStatus;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  cin: string;
  fcmToken?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  client: Client;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}
