export interface GroupListResponseBody {
  Count: number;
  Items: GroupItem[];
}

interface GroupItem {
  id: {
    S: string;
  };
  name: {
    S: string;
  };
  createdAt: {
    S: string;
  };
  createdBy: {
    S: string;
  };
}
