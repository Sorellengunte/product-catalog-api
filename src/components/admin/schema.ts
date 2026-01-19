// components/admin/schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  title: z.string()
    .min(2, { message: 'Le nom du produit est requis' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    .trim(),
    
  price: z.string()
    .min(1, { message: 'Le prix est requis' })
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, { message: 'Le prix doit être supérieur à 0' }),
  
  stock: z.string()
    .min(1, { message: 'Le stock est requis' })
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    }, { message: 'Le stock ne peut pas être négatif' }),
  
  category: z.string()
    .min(1, { message: 'La catégorie est requise' }),
    
  thumbnail: z.string()
    .min(1, { message: "L'URL de l'image est requise" })
    .url({ message: "L'URL n'est pas valide" }),
    
  brand: z.string()
    .max(50, { message: 'La marque ne peut pas dépasser 50 caractères' })
    .optional()
    .or(z.literal('')),
    
  rating: z.string()
    .refine((val) => {
      if (!val) return true; // Champ optionnel
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 5;
    }, { message: 'La note doit être entre 0 et 5' })
    .optional()
    .or(z.literal('')),
  
  discountPercentage: z.string()
    .refine((val) => {
      if (!val) return true; // Champ optionnel
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, { message: 'La remise doit être entre 0 et 100%' })
    .optional()
    .or(z.literal('')),
  
  description: z.string()
    .max(500, { message: 'La description ne peut pas dépasser 500 caractères' })
    .optional()
    .or(z.literal('')),
});

// Export du type
export type ProductFormData = z.infer<typeof productSchema>;

// Export des valeurs par défaut
export const defaultProductFormData: ProductFormData = {
  title: '',
  price: '',
  stock: '',
  category: '',
  thumbnail: '',
  brand: '',
  rating: '',
  discountPercentage: '',
  description: '',
};