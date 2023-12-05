import { createAction, props } from '@ngrx/store';
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
