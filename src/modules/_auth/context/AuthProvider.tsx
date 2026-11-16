import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextProps } from "@/models/interfaces/AuthContextProps";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const valid = auth.checkAuth();
    setIsAuthenticated(valid);
  }, [auth.userToken]);

  const value: AuthContextProps = {
    isAuthenticated,
    isHostAuthenticated: auth.isHostAuthenticated,
    isGuestAuthenticated: auth.isGuestAuthenticated,
    login: auth.login,
    logout: auth.logout,
    changeRole: auth.changeRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;