const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

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

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiClientError(0, "Could not reach the server. Is the backend running?");
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError(res.status, `Unexpected response from server (${res.status})`);
  }

  if (!res.ok || !body.success) {
    throw new ApiClientError(res.status, body.message ?? "Request failed", body.errors ?? []);
  }

  return body.data as T;
}
