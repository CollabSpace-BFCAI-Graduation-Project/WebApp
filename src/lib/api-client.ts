import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import type { LoginResponseDto } from "@/lib/types/api-types";
import { useAuthStore } from "@/store/auth-store";

const DEFAULT_API_BASE_URL = "/api/backend";

const API_BASE_URL = DEFAULT_API_BASE_URL;

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ detail?: string; title?: string; errors?: Record<string, string[]> }>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      error.response.headers?.["token-expired"] === "true" &&
      originalRequest &&
      originalRequest._retry !== true
    ) {
      originalRequest._retry = true;

      const { refreshToken, setAuth, user } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const { data } = await axios.post<LoginResponseDto>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const refreshedUser = {
            id: data.id,
            name: user?.name ?? data.username,
            username: data.username,
            email: data.email,
            emailConfirmed: data.emailConfirmed,
          };

          setAuth(refreshedUser, data.accessToken, data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return apiClient(originalRequest);
        } catch {
          redirectToLogin();
        }
      } else {
        redirectToLogin();
      }
    }

    const errorData = error.response?.data;
    const fieldErrors = errorData?.errors
      ? Object.values(errorData.errors).flat()
      : [];

    const message =
      fieldErrors.length > 0
        ? fieldErrors.join("\n")
        : (errorData?.detail ?? errorData?.title ?? error.message ?? "Request failed");

    return Promise.reject(
      new ApiError(message, error.response?.status ?? 0, error.response?.data),
    );
  },
);

function redirectToLogin() {
  useAuthStore.getState().logout();

  if (typeof window !== "undefined") {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
}

export const api = {
  get: async <T>(path: string, config?: AxiosRequestConfig) => {
    const response = await apiClient.get<T>(path, config);
    return response.data;
  },
  post: async <T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const response = await apiClient.post<T>(path, body, config);
    return response.data;
  },
  put: async <T>(path: string, body?: unknown, config?: AxiosRequestConfig) => {
    const response = await apiClient.put<T>(path, body, config);
    return response.data;
  },
  patch: async <T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const response = await apiClient.patch<T>(path, body, config);
    return response.data;
  },
  delete: async <T>(path: string, config?: AxiosRequestConfig) => {
    const response = await apiClient.delete<T>(path, config);
    return response.data;
  },
};

export { API_BASE_URL };
