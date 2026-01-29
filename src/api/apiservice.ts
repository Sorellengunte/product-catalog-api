import ky, { HTTPError } from "ky";

const api = ky.create({
  prefixUrl: "https://dummyjson.com",
  timeout: 15000,
});

const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Requête invalide";
    case 401:
      return "Non autorisé";
    case 403:
      return "Accès interdit";
    case 404:
      return "Ressource introuvable";
    case 409:
      return "Conflit de données";
    case 422:
      return "Données non traitables";
    case 500:
      return "Erreur serveur";
    case 502:
      return "Mauvaise passerelle";
    case 503:
      return "Service indisponible";
    case 504:
      return "Délai de réponse dépassé";
    default:
      return "Erreur inconnue";
  }
};

const handleError = (error: unknown): never => {
  if (error instanceof HTTPError) {
    throw new Error(getErrorMessage(error.response.status));
  }
  throw new Error("Erreur réseau");
};

export const apiService = {
  async get<T>(endpoint: string, params?: Record<string, string>) {
    try {
      return await api.get(endpoint, { searchParams: params }).json<T>();
    } catch (error) {
      handleError(error);
    }
  },

  async post<T>(endpoint: string, data?: unknown, params?: Record<string, string>) {
    try {
      return await api.post(endpoint, { 
        json: data,
        searchParams: params 
      }).json<T>();
    } catch (error) {
      handleError(error);
    }
  },

  async put<T>(endpoint: string, data?: unknown, params?: Record<string, string>) {
    try {
      return await api.put(endpoint, { 
        json: data,
        searchParams: params 
      }).json<T>();
    } catch (error) {
      handleError(error);
    }
  },

  async patch<T>(endpoint: string, data?: unknown, params?: Record<string, string>) {
    try {
      return await api.patch(endpoint, { 
        json: data,
        searchParams: params 
      }).json<T>();
    } catch (error) {
      handleError(error);
    }
  },

  async delete<T>(endpoint: string, data?: unknown, params?: Record<string, string>) {
    try {
      return await api.delete(endpoint, { 
        json: data,
        searchParams: params 
      }).json<T>();
    } catch (error) {
      handleError(error);
    }
  },
};

export default apiService;