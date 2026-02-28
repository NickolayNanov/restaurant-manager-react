export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  exp: number;
};

export type AuthState = {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  tokenExpiration: Date;
  user: AuthUser;
};

export type UserInfo = {
    id: string;
    username: string;
    email: string;
    roles: string[];
}