export interface UserPayload {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface UpdateUserPayload {
  name?: string;
  role?: string;
  isActive?: boolean;
}

export interface ChangePasswordPayload {
  newPassword: string;
}
