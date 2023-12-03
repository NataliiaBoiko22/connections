import { ProfileResponseBody } from '../shared/models/profile-models';

export interface ConnectionsState {
  profile: ProfileResponseBody;
  emailError: boolean;
}

export const initialState: ConnectionsState = {
  profile: {
    email: {
      S: '',
    },
    name: {
      S: '',
    },
    uid: {
      S: '',
    },
    createdAt: {
      S: '',
    },
  },
  emailError: false,
};
