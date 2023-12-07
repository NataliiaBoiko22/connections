export interface PeopleListResponseBody {
  Count: number;
  Items: PeopleItem[];
}

export interface PeopleItem {
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
}
