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
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
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
