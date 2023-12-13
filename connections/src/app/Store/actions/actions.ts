import { createAction, props } from '@ngrx/store';
import {
  PeopleConversationRequestBody,
  PeopleConversationResonseBody,
  PeopleMessagesResponseBody,
} from 'src/app/shared/models/people-messages-model';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages-model';
import {
  GroupListResponseBody,
  ResponseGroupID,
} from 'src/app/shared/models/groups-model';
import {
  PeopleConversationsListResponseBody,
  PeopleListResponseBody,
} from 'src/app/shared/models/people-model';
import { ProfileResponseBody } from 'src/app/shared/models/profile-model';

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
  props<{ groupID: string; name: string }>()
);
export const deleteGroupSuccess = createAction(
  '[Group] Delete Group Success',
  props<{ groupID: string }>()
);

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
export const setPeopleMessagesData = createAction(
  '[People Conversation] Set People Conversation Data',
  props<{ conversationID: string; since?: number }>()
);
export const setPeopleMessagesDataSuccess = createAction(
  '[People Conversation] Set People Conversation Data Success',
  props<{ data: PeopleMessagesResponseBody }>()
);

export const sendPeopleMessagesData = createAction(
  '[People Messages] Send People Messages Data',
  props<{ conversationID: string; authorID: string; message: string }>()
);
export const sendPeopleMessagesDataSuccess = createAction(
  '[People Messages] Send People Messages Data  Success',
  props<{ conversationID: string; authorID: string; message: string }>()
);

export const setPeopleConversationsListData = createAction(
  '[People List] Set People Conversations List Data',
  props<{ data: PeopleConversationsListResponseBody }>()
);

export const setPeopleConversationID = createAction(
  '[People List] Set People Conversations ID',
  props<{ companion: PeopleConversationRequestBody }>()
);

export const setPeopleConversationIDSuccess = createAction(
  '[People List] Set People Conversations ID Success',
  props<{
    conversationID: PeopleConversationResonseBody;
    companion: PeopleConversationRequestBody;
  }>()
);

export const deletePeopleConversation = createAction(
  '[People Conversation] Delete People Conversation',
  props<{ conversationID: string }>()
);
export const deletePeopleConversationSuccess = createAction(
  '[People Conversation] Delete People Conversation Success',
  props<{ conversationID: string }>()
);
