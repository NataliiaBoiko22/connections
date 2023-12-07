export interface GroupMessagesResponseBody {
  Count: number;
  Items: GroupMessage[];
}

interface GroupMessage {
  authorID: {
    S: string;
  };
  message: {
    S: string;
  };
  createdAt: {
    S: string;
  };
}

export interface RequestGroupMessagesBody {
  groupID: string;
  message: string;
}
