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
  Count: number;
  Items: PeopleMessage[];
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
  lastTimestamp?: number;
}
