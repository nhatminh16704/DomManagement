
export interface JwtPayload {
  sub: string; // Username
  role: string;
  exp: number;
  id: number;
  iat: number;
}


export interface LoginCredentials {
  userName: string;
  password: string;
}