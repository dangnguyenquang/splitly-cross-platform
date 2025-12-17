export interface User {
    userId: number,
    username: string,
    email: string,
    phone: string,
    gender?: boolean
    token?: string
    group: undefined
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