import { TokenPayload, TokenPayloadLogin } from '@/models/interfaces/backend/TokenPayload';
import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;

  try {
    const now = Date.now();

    if (token) {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (exp && now >= exp * 1000) return true;
    }
  } catch (error) {
    console.error('Error decodificando token:', error);
    return true;
  }

  return false;
};

export const getClaimsTokenPayload = (token: string | null): TokenPayloadLogin | null => {
  const claims: TokenPayloadLogin = {
    roles: [],
    userName: '',
    photo: '',
    platform: '',
    isHost : false,
    isGuest : false,
    identifier: '',
  };

  if (!token) return null;

  const decodedToken = jwtDecode<TokenPayload>(token);
  const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  if (Array.isArray(roles) && roles.includes('Guest')) {  
    claims.isGuest = true;
  } else if(typeof roles === "string") {
    if(roles.toLocaleLowerCase()==="Guest".toLocaleLowerCase()){
      claims.isGuest = true;
    }
  }
  claims.photo = decodedToken.photo;
  claims.roles = roles;
  claims.userName = decodedToken.sub;
  claims.platform = decodedToken.platform;
  claims.identifier = decodedToken.identifier;
  return claims;
};
