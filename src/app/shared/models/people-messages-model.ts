export interface PeopleConversationRequestBody {
  companion: string;
}

export interface PeopleConversationResonseBody {
  conversationID: string;
}

export interface PeopleMessagesRequestBody {
  conversationID: string;
}

export interface PeopleMessagesResponseBody {
  conversationID: string;
  Count: number;
  Items: PeopleMessage[];
  lastTimestampInPeople?: number;
}

export interface PeopleMessage {
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
export interface PeopleMessagesStateBody {
  [conversationID: string]: PeopleMessagesResponseBody;
}
