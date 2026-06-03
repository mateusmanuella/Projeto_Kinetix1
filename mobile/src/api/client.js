import axios from "axios";
import Constants from "expo-constants";

export const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:8080"
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}
