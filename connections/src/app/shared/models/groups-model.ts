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

export interface RequestGroupItem {
  name: string;
}
export interface ResponseGroupID {
  groupID: string;
}

export interface CreatedGroupItem {
  name: string;
  groupID: string;
}
