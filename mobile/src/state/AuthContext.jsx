import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "kinetix.session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession(parsed);
        setAuthToken(parsed.token);
      }
      setLoadingSession(false);
    }

    loadSession();
  }, []);

  async function login(payload) {
    const { data } = await api.post("/api/auth/login", payload);
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
    setAuthToken(data.token);
    setSession(data);
    return data;
  }

  async function register(payload) {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
  }

  async function logout() {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    setAuthToken(null);
    setSession(null);
  }

  const value = useMemo(() => ({ session, loadingSession, login, register, logout }), [session, loadingSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
