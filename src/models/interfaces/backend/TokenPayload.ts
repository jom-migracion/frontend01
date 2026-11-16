export interface TokenPayload {
  identifier: string;
  value: string;
  sub: string;
  platform: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[] | string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface TokenPayloadLogin{
  roles: string[] | string;
  userName: string;
  photo: string;
  platform: string;
  isHost: boolean;
  isGuest: boolean;
  identifier: string;
}