import { ResponseCoversationBody } from '../shared/models/conversation-model';
import { GroupMessagesResponseBody } from '../shared/models/group-messages';
import {
  CreatedGroupItem,
  GroupListResponseBody,
} from '../shared/models/groups-model';
import { PeopleListResponseBody } from '../shared/models/people-models';
import { ProfileResponseBody } from '../shared/models/profile-models';

export interface ConnectionsState {
  profile: ProfileResponseBody;
  emailError: boolean;
  groupList: GroupListResponseBody;
  peopleList: PeopleListResponseBody;
  createdGroupList: CreatedGroupItem[];
  groupMessages: GroupMessagesResponseBody;
  coversation: ResponseCoversationBody;
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
  groupMessages: {
    Count: 0,
    Items: [],
  },
  coversation: { conversationID: ""},
};
