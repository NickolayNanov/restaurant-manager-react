import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL as string;

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const fullEndpoint = new URL(endpoint, API_BASE_URL).toString();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(fullEndpoint, {
    credentials: "include", // includes http only cookie
    headers,
    ...options,
  }); 

  if (!res.ok) {
    const exception = await res.json().catch(() => null);
    const errors = exception?.errors
      ? Object.values(exception.errors).flat()
      : [exception?.detail ?? exception?.title ?? "Request failed"];

    for (let i = 0; i < errors.length; i++) {
      toast.error(errors[i] as string);
    }

    throw new Error(errors[0] as string);
  }

  if (res.status == 200 || res.status == 201) {
    return await res.json();
  }
}

export {
  apiFetch
};
