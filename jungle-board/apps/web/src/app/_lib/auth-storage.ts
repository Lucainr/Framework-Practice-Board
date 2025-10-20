"use client";

export type StoredAuthUser = {
  id: number;
  email: string;
  name: string;
};

export type StoredAuth = {
  token: string;
  user: StoredAuthUser;
};

const STORAGE_KEY = "jungle-board-auth";
export const AUTH_CHANGED_EVENT = "auth-changed";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadAuth(): StoredAuth | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredAuth>;
    if (
      !parsed ||
      typeof parsed.token !== "string" ||
      !parsed.token ||
      !parsed.user ||
      typeof parsed.user.id !== "number" ||
      typeof parsed.user.email !== "string" ||
      typeof parsed.user.name !== "string"
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      token: parsed.token,
      user: {
        id: parsed.user.id,
        email: parsed.user.email,
        name: parsed.user.name,
      },
    };
  } catch (error) {
    console.error("Failed to parse auth storage", error);
    if (isBrowser()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }
}

function emitAuthChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function saveAuth(value: StoredAuth) {
  if (!isBrowser()) {
    return;
  }

  const payload = JSON.stringify(value);
  window.localStorage.setItem(STORAGE_KEY, payload);
  emitAuthChanged();
}

export function clearAuth() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  emitAuthChanged();
}
