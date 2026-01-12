// src/api/apiService.ts
import ky, { HTTPError } from "ky";

const api = ky.create({
  prefixUrl: "https://dummyjson.com",
  timeout: 15000,
});

const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Requête invalide";
    case 404:
      return "Ressource introuvable";
    case 500:
      return "Erreur serveur";
    default:
      return "Erreur inconnue";
  }
};

export const apiService = {
  async get<T>(endpoint: string, params?: Record<string, string>) {
    try {
      return await api.get(endpoint, { searchParams: params }).json<T>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw new Error(getErrorMessage(error.response.status));
      }
      throw new Error("Erreur réseau");
    }
  },

  async post<T>(endpoint: string, data: any) {
    try {
      return await api.post(endpoint, { json: data }).json<T>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw new Error(getErrorMessage(error.response.status));
      }
      throw new Error("Erreur réseau");
    }
  },

  async put<T>(endpoint: string, data: any) {
    try {
      return await api.put(endpoint, { json: data }).json<T>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw new Error(getErrorMessage(error.response.status));
      }
      throw new Error("Erreur réseau");
    }
  },

  async delete<T>(endpoint: string) {
    try {
      return await api.delete(endpoint).json<T>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw new Error(getErrorMessage(error.response.status));
      }
      throw new Error("Erreur réseau");
    }
  },
};

export default apiService;
