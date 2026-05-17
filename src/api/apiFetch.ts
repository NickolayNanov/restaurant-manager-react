import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL as string;
const SESSION_EXPIRED_EVENT = "restaurant-manager:session-expired";

type AuthMode = "silent" | "redirect";

export type ApiFetchOptions = RequestInit & {
  showToast?: boolean;
  toastValidation?: boolean;
  authMode?: AuthMode;
};

type ProblemDetails = {
  title?: string;
  detail?: string;
  status?: number;
  traceId?: string;
  errors?: Record<string, string[] | string>;
};

export class ApiError extends Error {
  status: number | null;
  title: string;
  detail: string | null;
  messages: string[];
  errorsByField: Record<string, string[]>;
  traceId: string | null;
  isValidationError: boolean;
  isAuthError: boolean;
  isNetworkError: boolean;

  constructor({
    status,
    title,
    detail,
    messages,
    errorsByField = {},
    traceId,
    isNetworkError = false,
  }: {
    status: number | null;
    title: string;
    detail: string | null;
    messages: string[];
    errorsByField?: Record<string, string[]>;
    traceId: string | null;
    isNetworkError?: boolean;
  }) {
    const uniqueMessages = uniqueStrings(messages.length ? messages : [detail ?? title]);
    super(uniqueMessages[0] ?? "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.messages = uniqueMessages;
    this.errorsByField = errorsByField;
    this.traceId = traceId;
    this.isValidationError = status === 422 || Object.keys(errorsByField).length > 0;
    this.isAuthError = status === 401 || status === 403;
    this.isNetworkError = isNetworkError;
  }
}

const uniqueStrings = (values: Array<unknown>) => {
  return Array.from(
    new Set(
      values
        .flat()
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );
};

const normalizeErrorsByField = (errors: ProblemDetails["errors"]) => {
  const result: Record<string, string[]> = {};
  if (!errors) return result;

  Object.entries(errors).forEach(([field, value]) => {
    result[field] = Array.isArray(value) ? uniqueStrings(value) : uniqueStrings([value]);
  });

  return result;
};

const parseApiError = async (res: Response) => {
  const problem = (await res.json().catch(() => null)) as ProblemDetails | null;
  const errorsByField = normalizeErrorsByField(problem?.errors);
  const validationMessages = uniqueStrings(Object.values(errorsByField).flat());
  const fallbackMessage = problem?.detail ?? problem?.title ?? `Request failed with status ${res.status}`;
  const messages = validationMessages.length ? validationMessages : uniqueStrings([fallbackMessage]);

  return new ApiError({
    status: res.status,
    title: problem?.title ?? res.statusText ?? "Request failed",
    detail: problem?.detail ?? null,
    messages,
    errorsByField,
    traceId: problem?.traceId ?? null,
  });
};

const showErrorToasts = (error: ApiError, toastValidation: boolean) => {
  if (error.isValidationError && !toastValidation) return;

  error.messages.forEach((message) => {
    toast.error(message);
  });
};

const apiFetch = async (endpoint: string, options: ApiFetchOptions = {}) => {
  const fullEndpoint = new URL(endpoint, API_BASE_URL).toString();
  const {
    showToast = true,
    toastValidation = true,
    authMode = "redirect",
    ...requestOptions
  } = options;
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(fullEndpoint, {
      ...requestOptions,
      credentials: "include", // includes http only cookie
      headers,
    });
  } catch {
    const networkError = new ApiError({
      status: null,
      title: "Network error",
      detail: "Unable to reach the server. Please check your connection and try again.",
      messages: ["Unable to reach the server. Please check your connection and try again."],
      traceId: null,
      isNetworkError: true,
    });

    if (showToast) showErrorToasts(networkError, toastValidation);
    throw networkError;
  }

  if (!res.ok) {
    const error = await parseApiError(res);

    if (error.status === 401 && authMode === "redirect") {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }

    if (showToast) showErrorToasts(error, toastValidation);
    throw error;
  }

  if (res.status == 200 || res.status == 201) {
    return await res.json();
  }
}

const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

const getApiErrorMessages = (error: unknown, fallback = "Something went wrong. Please try again.") => {
  if (isApiError(error)) {
    return error.messages.length ? error.messages : [fallback];
  }

  if (error instanceof Error && error.message) {
    return [error.message];
  }

  return [fallback];
};

export {
  apiFetch,
  getApiErrorMessages,
  isApiError,
  SESSION_EXPIRED_EVENT
};
