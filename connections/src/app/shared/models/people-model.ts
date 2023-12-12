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
  hasConversation: boolean;
}

export interface PeopleConversationsListResponseBody {
  Count: number;
  Items: PeopleConversationItem[];
}

export interface PeopleConversationItem {
  id: {
    S: string;
  };
  companionID: {
    S: string;
  };
}

export interface MergedData {
  peopleList: PeopleItem[];
  conversationsList: PeopleConversationItem[];
}
