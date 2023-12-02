// import { User } from './user-models';

export interface SignInBody {
  email: string;
  password: string;
}

// export interface SignInResponseBody extends User {
//   token: string;
// }
// export interface SignUpResponseBody extends User {
//   token: string;
//   uid: string;
// }
export interface SignInResponseBody {
  token: string;
  uid: string;
}
export interface SignUpBody extends SignInBody {
  name: string;
}

// export type SignUpResponse = User;
export interface SignUpResponse {
  status: {};
  // Другие поля, если они присутствуют в ответе
}
