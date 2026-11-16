import { AuthContextProps } from '@/models/interfaces/AuthContextProps';
import { createContext, useContext } from 'react';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  return context;
};

export { AuthContext, useAuthContext };