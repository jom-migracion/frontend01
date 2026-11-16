export interface AuthState {
  user: string | null;
  userToken: string | null;
  photo: string;
  roles: string[] | string;
  isHostAuthenticated: boolean;
  isGuestAuthenticated: boolean;
  identifier: string; 
  checkAuth: () => boolean;
  login: (token: string, photo: string) => void;
  changeRole: (role: string) => void;
  logout: () => void;
}