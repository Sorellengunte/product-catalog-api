import { createContext, useContext, useState } from "react";

// 🔹 Types de rôle
export type Role = "ADMIN" | "CLIENT";

// 🔹 Type utilisateur
interface AppUser {
  id: number;
  username: string;
  role: Role;
  token?: string; // Token seulement pour client DummyJSON
}

// 🔹 Type contexte Auth
interface AuthContextType {
  user: AppUser | null;
  login: (username: string, password: string) => Promise<AppUser>;
  logout: () => void;
}

// 🔹 Créer le contexte
const AuthContext = createContext<AuthContextType | null>(null);

// 🔹 Provider Auth
export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  // 🔹 Login
  const login = async (username: string, password: string): Promise<AppUser> => {
    // 🔹 Admin fictif
    if (username === "admin" && password === "admin123") {
      const adminUser: AppUser = {
        id: 0,
        username: "admin",
        role: "ADMIN",
      };
      setUser(adminUser);
      return adminUser;
    }

    // 🔹 Client DummyJSON
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,
      }),
    });

    if (!res.ok) {
      throw new Error("Identifiants client incorrects");
    }

    const data = await res.json();

    const clientUser: AppUser = {
      id: data.id,
      username: data.username,
      role: "CLIENT",
      token: data.token || data.accessToken,
    };

    setUser(clientUser);
    return clientUser;
  };

  // 🔹 Logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
