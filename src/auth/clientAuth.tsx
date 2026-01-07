import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import Button from "../components/buttonForm";
import Input from "../components/inputForm";
import { signupSchema } from "../auth/signup.schema";

type SignupFormData = {
  nom: string;
  email: string;
  motDePasse: string;
  confirmerMotDePasse: string;
};

export default function ClientAuth() {
  const [voirPassword, setVoirPassword] = useState(false);
  const [voirConfirm, setVoirConfirm] = useState(false);
  const [succes, setSucces] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log(data);
    setSucces("Inscription réussie !");
    
    // Afficher le spinner et rediriger
    setIsRedirecting(true);
    
    setTimeout(() => {
      navigate("/home");
    }, 1000);
    
    reset();
    setVoirPassword(false);
    setVoirConfirm(false);
  };

  const handleReset = () => {
    reset();
    setSucces("");
    setVoirPassword(false);
    setVoirConfirm(false);
    setIsRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      {/* Spinner simple au centre */}
      {isRedirecting && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Chargement de la page d'accueil...</p>
          </div>
        </div>
      )}

      <div className={`max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden ${
        isRedirecting ? "opacity-50" : ""
      }`}>
        
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
        </div>

        <div className="p-6">
          {succes && !isRedirecting && (
            <div className="mb-4 bg-green-100 border border-green-300 rounded-lg p-3 text-center">
              <p className="text-green-700 font-medium">{succes}</p>
              <p className="text-green-600 text-sm mt-1">Redirection vers l'accueil...</p>
            </div>
          )}

          {isRedirecting ? (
            // Message pendant la redirection
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Préparation de votre espace...</p>
            </div>
          ) : (
            // Formulaire
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div>
                <Input label="Nom complet" placeholder="Votre nom" {...register("nom")} />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <Input label="Email" type="email" placeholder="email@domaine.com" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Input label="Mot de passe" type={voirPassword ? "text" : "password"} placeholder="Votre mot de passe"
                  showToggle toggleState={voirPassword} onToggle={() => setVoirPassword(!voirPassword)} {...register("motDePasse")}
                />
                {errors.motDePasse && <p className="text-red-500 text-sm mt-1">{errors.motDePasse.message}</p>}
              </div>

              <div>
                <Input label="Confirmation" type={voirConfirm ? "text" : "password"} placeholder="Retapez le mot de passe"
                  showToggle toggleState={voirConfirm} onToggle={() => setVoirConfirm(!voirConfirm)} {...register("confirmerMotDePasse")}
                />
                {errors.confirmerMotDePasse && <p className="text-red-500 text-sm mt-1">{errors.confirmerMotDePasse.message}</p>}
              </div>

              <div className="pt-4">
                <div className="flex justify-center gap-3">
                  <Button type="button" variant="danger" onClick={handleReset}>
                    Annuler
                  </Button>
                  
                  <Button type="submit" variant="primary">
                    S'inscrire
                  </Button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200 mt-4">
                  <p className="text-sm text-gray-600">
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-600 font-medium hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}