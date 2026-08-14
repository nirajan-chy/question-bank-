"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";

/** Kicks off client-side rehydration of the persisted auth state. */
export function AuthHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);
  return null;
}
