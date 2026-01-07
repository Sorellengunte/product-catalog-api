import { z } from "zod";

export const signupSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string()
    .min(1, "L'email est requis")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Format d'email invalide")
    .refine(e => !['example.com', 'test.com'].includes(e.split('@')[1]?.toLowerCase()), 
      "Les emails de test ne sont pas autorisés"),
  motDePasse: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmerMotDePasse: z.string().min(1, "La confirmation du mot de passe est requise"),
}).refine(data => data.motDePasse === data.confirmerMotDePasse, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmerMotDePasse"],
});

export type SignupFormData = z.infer<typeof signupSchema>;