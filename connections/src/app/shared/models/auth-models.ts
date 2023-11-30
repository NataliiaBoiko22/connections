import { User } from './user-models';

export interface SignInBody {
  login: string;
  password: string;
}

export interface SignInResponseBody extends User {
  token: string;
}
export interface SignUpResponseBody extends User {
  token: string;
  _id: string;
}
export interface SignUpBody extends SignInBody {
  name: string;
}

export type SignUpResponse = User;
