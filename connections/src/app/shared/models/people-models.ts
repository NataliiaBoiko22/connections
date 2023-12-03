export interface PeopleListResponseBody {
  Count: number;
  Items: PeopleItem[];
}

interface PeopleItem {
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
}
