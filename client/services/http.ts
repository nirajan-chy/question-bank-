import { API_BASE_URL, API_ORIGIN, SERVER_API_BASE } from "@/config/env";

export { API_BASE_URL, API_ORIGIN };

export class ApiClientError extends Error {
  readonly status: number;
  readonly errors: unknown[];

  constructor(status: number, message: string, errors: unknown[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
};

/**
 * The token lives in a module variable rather than being read from the store on
 * every call, so `services/http` stays free of React/store imports. The auth
 * store is the single owner and pushes the value here on login, logout and
 * rehydration.
 */
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

function buildHeaders(options: RequestInit): Headers {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
  return headers;
}

/**
 * Unwraps the backend's `{ success, message, data, errors }` envelope and
 * turns anything else into an `ApiClientError`, so callers only ever deal with
 * the payload or an exception.
 */
async function unwrap<T>(res: Response): Promise<T> {
  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError(
      res.status,
      res.status === 204
        ? "The server returned an empty response."
        : `The server returned an unreadable response (${res.status}).`
    );
  }

  if (!res.ok || !body.success) {
    throw new ApiClientError(res.status, body.message ?? `Request failed (${res.status})`, body.errors ?? []);
  }

  return body.data as T;
}

/**
 * Returns a signal that aborts on whichever comes first: our timeout, or the
 * caller's own signal (so an unmount or a "stop" button still cancels work).
 */
function withTimeout(timeoutMs: number, callerSignal?: AbortSignal | null) {
  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const forwardAbort = () => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener("abort", forwardAbort, { once: true });
  }

  return {
    signal: controller.signal,
    didTimeOut: () => timedOut,
    done: () => {
      clearTimeout(timer);
      callerSignal?.removeEventListener("abort", forwardAbort);
    },
  };
}

const DEFAULT_TIMEOUT = 20_000;

/**
 * Resolves the API base for the current runtime.
 *
 * In the browser the base is relative (`/api`) so Next's rewrite proxy
 * forwards it — same-origin, therefore no CORS. Node has no proxy in front of
 * it, so there we resolve to the backend's absolute address instead.
 */
export function apiUrl(path: string): string {
  if (typeof window !== "undefined") return `${API_BASE_URL}${path}`;
  return `${SERVER_API_BASE}${path}`;
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT
): Promise<T> {
  const timeout = withTimeout(timeoutMs, options.signal ?? null);

  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      ...options,
      headers: buildHeaders(options),
      signal: timeout.signal,
    });
  } catch {
    if (timeout.didTimeOut()) {
      throw new ApiClientError(0, "The server took too long to respond.");
    }
    throw new ApiClientError(0, "Could not reach the server. Check your connection and try again.");
  } finally {
    timeout.done();
  }

  return unwrap<T>(res);
}

export async function httpForm<T>(path: string, form: FormData, timeoutMs = 120_000): Promise<T> {
  const timeout = withTimeout(timeoutMs, null);

  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      method: "POST",
      headers: buildHeaders({}),
      body: form,
      signal: timeout.signal,
    });
  } catch {
    if (timeout.didTimeOut()) {
      throw new ApiClientError(0, "The upload took too long. Try a smaller file.");
    }
    throw new ApiClientError(0, "Upload failed — check your connection and try again.");
  } finally {
    timeout.done();
  }

  return unwrap<T>(res);
}

/** Builds `?a=1&b=2`, dropping `undefined`, `null` and `false`. */
export function withQuery(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === false || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

export const httpUpload = httpForm;
