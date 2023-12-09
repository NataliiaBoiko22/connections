import { createAction, props } from '@ngrx/store';
import {
  RequestConversationBody,
  ResponseCoversationBody,
} from 'src/app/shared/models/conversation-model';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages';
import {
  GroupListResponseBody,
  ResponseGroupID,
} from 'src/app/shared/models/groups-model';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
import { ProfileResponseBody } from 'src/app/shared/models/profile-models';

export const setProfileData = createAction(
  '[Profile] Set Profile Data',
  props<{ data: ProfileResponseBody }>()
);

export const updateName = createAction(
  '[Profile] Update Name',
  props<{ name: string }>()
);
export const deleteLogin = createAction('[Profile] Delete Login');
export const deleteLoginSuccess = createAction(
  '[Profile] Delete Login Success'
);

export const setEmailError = createAction(
  '[Email Error] Set Email Error',
  props<{ emailError: boolean }>()
);

export const setGroupListData = createAction(
  '[Group List] Set Group List Data',
  props<{ data: GroupListResponseBody }>()
);
export const setPeopleListData = createAction(
  '[People List] Set People List Data',
  props<{ data: PeopleListResponseBody }>()
);
export const createGroup = createAction(
  '[Group] Create Group',
  props<{ name: string }>()
);
export const createGroupSuccess = createAction(
  '[Group] Create Group Success',
  props<{ groupID: ResponseGroupID; name: string }>()
);
export const deleteGroup = createAction(
  '[Group] Delete Group',
  props<{ groupID: string }>()
);
export const deleteGroupSuccess = createAction(
  '[Group] Delete Group Success',
  props<{ groupID: string }>()
);

// export const setGroupMessagesData = createAction(
//   '[Group Messages] Set Group Messages Data',
//   props<{ groupID: string }>()
// );
export const setGroupMessagesData = createAction(
  '[Group Messages] Set Group Messages Data',
  props<{ groupID: string; since?: number }>()
);
export const setGroupMessagesDataSuccess = createAction(
  '[Group Messages] Set Group Messages Data Success',
  props<{ data: GroupMessagesResponseBody }>()
);

export const sendGroupMessagesData = createAction(
  '[Group Messages] Send Group Messages Data',
  props<{ groupID: string; authorID: string; message: string }>()
);
export const sendGroupMessagesDataSuccess = createAction(
  '[Group Messages] Send Group Messages Data  Success',
  props<{ groupID: string; authorID: string; message: string }>()
);
export const setConversationData = createAction(
  '[People Conversation] Set People Conversation Data',
  props<{ companion: RequestConversationBody }>()
);
export const setConversationDataSuccess = createAction(
  '[People Conversation] Set People Conversation Data Success',
  props<{ conversationID: ResponseCoversationBody }>()
);
