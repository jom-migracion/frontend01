import { useAuthContext } from '@/modules/_auth/context';
import { ReactNode } from 'react';
import { Navigate } from 'react-router';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isHostAuthenticated, isGuestAuthenticated } = useAuthContext();
  return isHostAuthenticated || isGuestAuthenticated ? children : <Navigate to="/" />;
};


export default PrivateRoute;