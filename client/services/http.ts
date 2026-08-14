import { BASEURL } from "@/config/env";

export const BASE_URL = BASEURL;
export class ApiClientError extends Error {
  status: number;
  errors: unknown[];

  constructor(status: number, message: string, errors: unknown[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
};

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function httpForm<T>(path: string, form: FormData): Promise<T> {
  const headers = new Headers();
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: form,
    });
  } catch {
    throw new ApiClientError(
      0,
      "Could not reach the server. Is the backend running?",
    );
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError(
      res.status,
      `Unexpected response from server (${res.status})`,
    );
  }

  if (!res.ok || !body.success) {
    throw new ApiClientError(
      res.status,
      body.message ?? "Request failed",
      body.errors ?? [],
    );
  }

  return body.data as T;
}

export async function httpUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const headers = new Headers();
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch {
    throw new ApiClientError(
      0,
      "Could not reach the server. Is the backend running?",
    );
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError(
      res.status,
      `Unexpected response from server (${res.status})`,
    );
  }

  if (!res.ok || !body.success) {
    throw new ApiClientError(
      res.status,
      body.message ?? "Upload failed",
      body.errors ?? [],
    );
  }

  return body.data as T;
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiClientError(
      0,
      "Could not reach the server. Is the backend running?",
    );
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError(
      res.status,
      `Unexpected response from server (${res.status})`,
    );
  }

  if (!res.ok || !body.success) {
    throw new ApiClientError(
      res.status,
      body.message ?? "Request failed",
      body.errors ?? [],
    );
  }

  return body.data as T;
}
