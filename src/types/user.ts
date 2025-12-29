export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  token?: string;
  group: undefined;
  userImage?: string;
}

export interface RegisterForm {
  userName: string;
  email: string;
  password: string;
  confirm?: string;
  phoneNumber: string;
  gender?: string;
}

export type LoginForm = {
  email: string;
  password: string;
};

export type PersonalInfo = {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  userImage: string;
};

