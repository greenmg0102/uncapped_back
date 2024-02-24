export interface User {
  googleId: string;
  facebookId: string;
  customerId?: string;
  email: string;
  isVerifiedEmail: boolean;
  isActive: boolean;
  provider: string;
  accessToken: string;
  refreshToken: string;
}
