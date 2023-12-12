export interface GroupMessagesResponseBody {
  groupID: string;
  lastTimestampInGroup?: number;
  Count: number;
  Items: GroupMessage[];
}

export interface GroupMessage {
  authorID: {
    S: string;
  };
  message: {
    S: string;
  };
  createdAt: {
    S: string;
  };
  authorName: string;
}

export interface GroupMessagesRequestBody {
  groupID: string;
  message: string;
}

export interface GroupMessagesStateBody {
  [groupID: string]: GroupMessagesResponseBody;
}
