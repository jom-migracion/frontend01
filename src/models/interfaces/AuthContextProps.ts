export interface AuthContextProps {
  isAuthenticated: boolean;
  isHostAuthenticated: boolean;
  isGuestAuthenticated: boolean;
  login: (token: string, photo: string) => void;
  logout: () => void;
  changeRole: (role: string) => void;
}