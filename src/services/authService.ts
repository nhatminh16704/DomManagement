const API_URL = process.env.NEXT_PUBLIC_API_URL + "/auth";
import { LoginCredentials, JwtPayload } from "../types/auth";
import { ApiResponse } from "../types/api";

class AuthService {
  private apiUrl: string = API_URL; 
  private tokenKey: string = "token";

  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorResponse: ApiResponse<null> = await response.json();
        const errorMessage = errorResponse.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const apiResponse: ApiResponse<string> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }

      const jwtToken = apiResponse.data;
      localStorage.setItem(this.tokenKey, jwtToken);
      return jwtToken;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Lỗi đăng nhập: ${errorMessage}`);
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }


  getPayload(token?: string): JwtPayload | null {
    const currentToken = token || this.getToken();
    if (!currentToken) return null;

    try {
      const payloadBase64 = currentToken.split(".")[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as JwtPayload;
    } catch (error) {
      console.error("Lỗi giải mã JWT:", error);
      return null;
    }
  }


  getRole(): string | null {
    const payload = this.getPayload();
    return payload?.role || null;
  }


  isTokenExpired(token?: string): boolean {
    const payload = this.getPayload(token);
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  }


  getUsername(): string | null {
    const payload = this.getPayload();
    return payload?.sub || null;
  }

  getUserId(): number | null {
    const payload = this.getPayload();
    return payload?.id || null;
  }
}

// Export instance (singleton)
const authService = new AuthService();
export default authService;

