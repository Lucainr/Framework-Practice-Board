"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AUTH_CHANGED_EVENT,
  StoredAuth,
  clearAuth as clearStoredAuth,
  loadAuth,
  saveAuth,
} from "../_lib/auth-storage";

export function useAuth() {
  const [auth, setAuthState] = useState<StoredAuth | null>(null);

  useEffect(() => {
    setAuthState(loadAuth());

    const handleStorage = () => {
      setAuthState(loadAuth());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleStorage);
    };
  }, []);

  const setAuth = useCallback((value: StoredAuth | null) => {
    if (value) {
      saveAuth(value);
      setAuthState(value);
    } else {
      clearStoredAuth();
      setAuthState(null);
    }
  }, []);

  const clearAuth = useCallback(() => {
    clearStoredAuth();
    setAuthState(null);
  }, []);

  return {
    auth,
    setAuth,
    clearAuth,
  };
}
