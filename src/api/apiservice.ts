// src/api/apiservice.ts
import ky from "ky";
import { HTTPError } from "ky";

// Types pour les erreurs
interface ApiError {
  code: string;
  message: string;
}

// Types pour DummyJSON
export interface DummyJSONProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface DummyJSONResponse {
  products: DummyJSONProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoriesResponse {
  categories: string[];
}

// Configuration pour DummyJSON
const baseUrl = ky.create({
  prefixUrl: "https://dummyjson.com",
  timeout: 15000,
});

const getMessage = (status: number): ApiError => {
  switch (status) {
    case 400:
      return { code: "400", message: "Requête invalide" };
    case 404:
      return { code: "404", message: "La ressource demandée n'a pas été trouvée" };
    case 500:
      return { code: "500", message: "Le serveur est indisponible" };
    case 429:
      return { code: "429", message: "Trop de requêtes, veuillez réessayer plus tard" };
    default:
      return { code: "unknown", message: `Erreur ${status}` };
  }
};

// Service API
export const apiService = {
  get: async <T>(endpoint: string, searchParams?: Record<string, string>): Promise<T> => {
    try {
      const response = await baseUrl.get(endpoint, { searchParams });
      return (await response.json()) as T;
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        const err = getMessage(error.response.status);
        throw new Error(err.message);
      }
      throw new Error("Erreur inattendue");
    }
  },
};

// Export par défaut pour faciliter les imports
export default apiService;