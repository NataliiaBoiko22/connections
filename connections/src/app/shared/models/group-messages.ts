export interface GroupMessagesResponseBody {
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
  lastTimestamp?: number;
}
// export interface GroupMessagesRequestBody {
//   Count: number;
//   Items: GroupMessageRequest[];
// }

// interface GroupMessageRequest {
//   authorID: {
//     S: string;
//   };
//   message: {
//     S: string;
//   };
//   createdAt: {
//     S: string;
//   };
// }

export interface RequestGroupMessagesBody {
  groupID: string;
  message: string;
}
