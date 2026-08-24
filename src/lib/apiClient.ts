import { API_BASE_URL } from "./branding";
import { clearSession, getToken } from "./session";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Enveloppe standard du backend : { success, message, data, timestamp } */
export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
};

type RequestOptions = {
  /** Ne pas envoyer le header Authorization (login). */
  anonymous?: boolean;
  signal?: AbortSignal;
};

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (!options.anonymous) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? null : JSON.stringify(body),
      ...(options.signal ? { signal: options.signal } : {}),
    });
  } catch {
    throw new ApiError(
      `Impossible de joindre l'API (${API_BASE_URL}). Vérifiez que le backend est démarré.`,
      0,
    );
  }

  if (response.status === 401 && !options.anonymous) {
    clearSession();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new ApiError("Session expirée. Veuillez vous reconnecter.", 401);
  }

  const text = await response.text();
  let payload: ApiResponse<T> | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as ApiResponse<T>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok || payload?.success === false) {
    const message =
      payload?.message?.trim() ||
      (text && text.length < 300 ? text : "") ||
      `Erreur ${response.status} sur ${path}`;
    throw new ApiError(message, response.status);
  }

  if (payload && "data" in payload) return payload.data as T;
  return payload as unknown as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
};
