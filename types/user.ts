export type UserType = {
  id: string;
  name?: string;
  email: string;
  user_type?: string;
  avatar?: string;
  has_set_password?: boolean;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name?: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type GoogleLoginData = {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified?: boolean;
  idToken: string;
  accessToken: string;
};

export type FacebookLoginData = {
  facebookId: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
};

export function getUserName(user: UserType | null): string {
  if (!user) return '';

  return user.name || user.email.split('@')[0] || '';
}

export function getUserInitials(user: UserType | null): string {
  if (!user) return '';

  const userName = getUserName(user);
  return userName.charAt(0).toUpperCase();
}
