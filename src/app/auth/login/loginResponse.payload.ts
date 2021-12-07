export interface LoginResponsePayload {
  authenticationToken: string;
  refreshToken: string;
  expiresAt: Date;
  email: string;
  nickName: string;
}
