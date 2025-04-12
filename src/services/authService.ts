const API_URL = process.env.NEXT_PUBLIC_API_URL + "/auth";

// Định nghĩa kiểu dữ liệu cho payload của JWT (tùy chỉnh theo back-end)
interface JwtPayload {
  sub: string; // username hoặc id
  role?: string; // vai trò người dùng (admin/user)
  exp: number; // thời gian hết hạn (timestamp)
  id: number; // id người dùng
  iat: number; // thời gian phát hành (timestamp)
}

// Định nghĩa kiểu dữ liệu cho thông tin đăng nhập
interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private apiUrl: string = API_URL; // URL back-end
  private tokenKey: string = "token"; // Key lưu token trong localStorage

  // Đăng nhập và lấy JWT
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
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Đăng nhập thất bại!");
      }

      const jwtToken = await response.text();
      localStorage.setItem(this.tokenKey, jwtToken); // Lưu token
      return jwtToken;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Lỗi đăng nhập: ${errorMessage}`);
    }
  }

  // Đăng xuất
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    // Nếu dùng cookie: document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  // Giải mã payload từ JWT
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

  // Lấy role từ token
  getRole(): string | null {
    const payload = this.getPayload();
    return payload?.role || null;
  }

  // Kiểm tra token có hết hạn không
  isTokenExpired(token?: string): boolean {
    const payload = this.getPayload(token);
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now(); // Chuyển từ giây sang mili giây
  }

  // Lấy tên người dùng/subject từ token
  getUsername(): string | null {
    const payload = this.getPayload();
    return payload?.sub || null;
  }

  getUserId(): number | null {
    const payload = this.getPayload();
    return payload?.id || null;
  }
}

export default new AuthService(); // Export instance singleton
