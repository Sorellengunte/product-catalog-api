import { z } from 'zod';

// Schéma de validation pour un produit
export const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .trim(),
  
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .default(''),
  
  price: z
    .union([
      z.number().positive('Le prix doit être supérieur à 0'),
      z.string()
        .transform((val) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        })
        .refine((val) => val > 0, 'Le prix doit être supérieur à 0'),
    ])
    .transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  
  discountPercentage: z
    .union([
      z.number().min(0, 'La remise ne peut pas être négative').max(100, 'La remise ne peut pas dépasser 100%'),
      z.string()
        .transform((val) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        })
        .refine((val) => val >= 0 && val <= 100, 'La remise doit être entre 0 et 100%'),
    ])
    .transform((val) => typeof val === 'string' ? parseFloat(val) : val)
    .default(0),
  
  rating: z
    .union([
      z.number().min(0, 'La note doit être au moins 0').max(5, 'La note ne peut pas dépasser 5'),
      z.string()
        .transform((val) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        })
        .refine((val) => val >= 0 && val <= 5, 'La note doit être entre 0 et 5'),
    ])
    .transform((val) => typeof val === 'string' ? parseFloat(val) : val)
    .default(0),
  
  stock: z
    .union([
      z.number().min(0, 'Le stock ne peut pas être négatif'),
      z.string()
        .transform((val) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        })
        .refine((val) => val >= 0, 'Le stock ne peut pas être négatif'),
    ])
    .transform((val) => typeof val === 'string' ? parseFloat(val) : val)
    .default(0),
  
  brand: z
    .string()
    .max(100, 'La marque ne peut pas dépasser 100 caractères')
    .optional()
    .default(''),
  
  category: z
    .string()
    .min(1, 'La catégorie est requise')
    .trim(),
  
  thumbnail: z
    .string()
    .min(1, "L'URL de l'image est requise")
    .url('URL invalide')
    .trim(),
  
  images: z
    .array(z.string().url('URL invalide').trim())
    .default([]),
});

// Type TypeScript déduit du schéma
export type ProductFormData = z.infer<typeof productSchema>;

// Interface pour le produit complet (avec ID)
export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Schéma pour l'ID de produit (pour les routes)
export const productIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "L'ID doit être un nombre")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "L'ID doit être positif"),
});

// Fonction utilitaire pour formater les erreurs Zod
export const formatZodError = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      const fieldName = err.path[0] as string;
      formattedErrors[fieldName] = err.message;
    }
  });
  
  return formattedErrors;
};

// Fonction pour valider un produit côté client
export const validateProduct = (data: unknown): { 
  success: boolean; 
  data?: ProductFormData; 
  errors?: Record<string, string> 
} => {
  const result = productSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: formatZodError(result.error),
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
};

// Schéma partiel pour les mises à jour (tous les champs optionnels)
export const productUpdateSchema = productSchema.partial();

// Valeurs par défaut pour un nouveau produit
export const defaultProductValues: ProductFormData = {
  title: '',
  description: '',
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: '',
  category: '',
  thumbnail: '',
  images: [],
};