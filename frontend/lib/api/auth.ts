import { apiClient } from './client';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  organization: number;
  organization_details?: Organization;
  phone?: string;
  avatar?: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  plan: string;
  max_users: number;
  max_jobs: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface Session {
  user: User;
  access: string;
  refresh: string;
}

const SESSION_KEY = 'recruitment_session';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/users/login/', {
    email,
    password,
  });
  
  setSession(response);
  return response;
}

export async function register(data: {
  email: string;
  password: string;
  password_confirm: string;
  username: string;
  first_name: string;
  last_name: string;
  role?: string;
  organization?: number;
}): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/users/register/', data);
  setSession(response);
  return response;
}

export async function logout(): Promise<void> {
  clearSession();
}

export async function refreshToken(): Promise<AuthTokens> {
  const session = getSession();
  if (!session?.refresh) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post<AuthTokens>('/auth/token/refresh/', {
    refresh: session.refresh,
  });
  
  // Update session with new access token
  const newSession = { ...session, access: response.access };
  if (response.refresh) {
    newSession.refresh = response.refresh;
  }
  setSession(newSession);
  
  return response;
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/users/me/');
}

export async function changePassword(data: {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}): Promise<void> {
  await apiClient.post('/auth/users/change_password/', data);
}