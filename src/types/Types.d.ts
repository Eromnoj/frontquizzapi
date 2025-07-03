export type ResponseUserType = {
  user : {
    id: string;
    email: string;
    role: string;
    name: string;
  }
}

export type LoginType = {
  email: string;
  password: string;
}

export type RegisterType = {
  name:string;
  email :string;
  password  :string;
  passwordConfirm: string;
  role: Role;
}

export type SendMailPasswordType = {
  email: string;
}

export type RecoverPasswordType = {
  token: string;
  email: string;
  newPassword: string;
}

export type AuthResponseType = {
  status: number;
  response: ResponseUserType | {errors: Record<string, string[]>};
}