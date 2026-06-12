import { api } from "@/lib/api-client";
import type {
  AuthResponse,
  LoginResponseDto,
  RegisterResponseDto,
} from "@/lib/types/api-types";

import type { LoginFormData, RegisterFormData } from "./schemas";

const mapAuthResponse = (
  response: LoginResponseDto | RegisterResponseDto,
  name?: string,
): AuthResponse => ({
  token: response.accessToken,
  refreshToken: response.refreshToken,
  expiresInMinutes: response.expiresInMinutes,
  user: {
    id: response.id,
    name: name ?? response.username,
    username: response.username,
    email: response.email,
    emailConfirmed: response.emailConfirmed,
  },
});

export const login = async (
  credentials: LoginFormData,
): Promise<AuthResponse> => {
  const response = await api.post<LoginResponseDto>("/auth/login", {
    identifier: credentials.email,
    password: credentials.password,
  });

  return mapAuthResponse(response);
};

export const register = async (
  data: RegisterFormData,
): Promise<AuthResponse> => {
  const response = await api.post<RegisterResponseDto>("/auth/register", {
    name: data.fullName,
    username: data.username,
    email: data.email,
    password: data.password,
  });

  return mapAuthResponse(response, data.fullName);
};
