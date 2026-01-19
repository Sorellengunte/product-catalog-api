import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import TextInput from "../components/TextInput";
import Button from "../components/Button";

export default function ClientAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const loggedUser = await login(username.trim(), password.trim());
      if (loggedUser.role === "ADMIN") navigate("/admin");
      else navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Login échoué. Vérifie les identifiants !");
    }
  };





  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-8">Connexion</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <TextInput
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />

          {/* Password avec œil */}
          <div className="relative w-full">
            <TextInput
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Boutons Se connecter */}
          <div className="flex justify-between gap-4 mt-2">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Se connecter
            </Button>
          </div>
        </form>

       
      </div>
    </div>
  );
}
