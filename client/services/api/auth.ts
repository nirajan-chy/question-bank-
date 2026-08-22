import type { User, AuthResponse } from "@/types";

import { http } from "../http";

export const auth = {
  login: (email: string, password: string) =>
    http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    http<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  me: () => http<User>("/auth/me"),
};
