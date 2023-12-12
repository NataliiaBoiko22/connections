export interface Profile {
  uid: string;
  email: string;
  token: string;
}

export interface ProfileResponseBody {
  email: {
    S: string;
  };
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
  createdAt: {
    S: string;
  };
}

export interface EditProfileBody {
  name: string;
}
