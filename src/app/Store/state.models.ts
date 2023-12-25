import {
  PeopleConversationResonseBody,
  PeopleMessagesResponseBody,
  PeopleMessagesStateBody,
} from '../shared/models/people-messages-model';
import {
  GroupMessagesResponseBody,
  GroupMessagesStateBody,
} from '../shared/models/group-messages-model';
import {
  CreatedGroupItem,
  GroupListResponseBody,
} from '../shared/models/groups-model';
import {
  PeopleConversationsListResponseBody,
  PeopleListResponseBody,
} from '../shared/models/people-model';
import { ProfileResponseBody } from '../shared/models/profile-model';

export interface ConnectionsState {
  profile: ProfileResponseBody;
  emailError: boolean;
  groupList: GroupListResponseBody;
  peopleList: PeopleListResponseBody;
  createdGroupList: CreatedGroupItem[];
  groupMessages: GroupMessagesStateBody;
  peopleMessages: PeopleMessagesStateBody;
  peopleConversationsList: PeopleConversationsListResponseBody;
  peopleConversationID: PeopleConversationResonseBody;
  // coversation: PeopleMessagesResponseBody;
}

export const initialState: ConnectionsState = {
  profile: {
    email: {
      S: '',
    },
    name: {
      S: '',
    },
    uid: {
      S: '',
    },
    createdAt: {
      S: '',
    },
  },
  emailError: false,
  groupList: {
    Count: 0,
    Items: [],
  },
  peopleList: {
    Count: 0,
    Items: [],
  },
  createdGroupList: [],
  groupMessages: {},
  // groupMessages: {
  //   groupID: '',
  //   Count: 0,
  //   Items: [],
  // },
  peopleMessages: {},
  peopleConversationID: { conversationID: '' },
  peopleConversationsList: {
    Count: 0,
    Items: [],
  },
  // coversation: { conversationID: '' },
};
