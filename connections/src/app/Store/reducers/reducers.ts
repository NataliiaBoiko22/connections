import { createReducer, on } from '@ngrx/store';
import { CreatedGroupItem } from 'src/app/shared/models/groups-model';
import {
  createGroupSuccess,
  deleteGroup,
  deleteLogin,
  sendGroupMessagesData,
  setEmailError,
  setGroupListData,
  setGroupMessagesData,
  setGroupMessagesDataSuccess,
  setPeopleListData,
  setProfileData,
  updateName,
} from '../actions/actions';
import { initialState } from '../state.models';

export const connectionsReducer = createReducer(
  initialState,
  on(setProfileData, (connectionsState, { data }) => ({
    ...connectionsState,
    profile: data,
  })),
  on(updateName, (state, { name }) => {
    return {
      ...state,
      profile: {
        ...state.profile,
        name: { S: name },
      },
    };
  }),
  on(deleteLogin, (state) => {
    return {
      ...state,
      profile: {
        ...initialState.profile,
      },
    };
  }),

  on(setEmailError, (state, { emailError }) => ({
    ...state,
    emailError: emailError,
  })),
  on(setGroupListData, (state, { data }) => ({
    ...state,
    groupList: data,
  })),
  on(setPeopleListData, (state, { data }) => ({
    ...state,
    peopleList: data,
  })),
  on(createGroupSuccess, (state, { groupID, name }) => {
    const newGroupItem: CreatedGroupItem = { groupID: groupID.groupID, name };
    const updatedGroupList = [...state.createdGroupList, newGroupItem];

    return {
      ...state,
      createdGroupList: updatedGroupList,
    };
  }),
  on(deleteGroup, (state, { groupID }) => {
    const updatedGroups = state.groupList.Items.filter(
      (group) => group.id.S !== groupID
    );
    const updatedOwnGroups = state.createdGroupList.filter(
      (group) => group.groupID !== groupID
    );
    return {
      ...state,
      groupList: {
        Count: updatedGroups.length,
        Items: updatedGroups,
      },
      createdGroupList: updatedOwnGroups,
    };
  }),
  on(setGroupMessagesDataSuccess, (state, { data }) => {
    return {
      ...state,
      groupMessages: data,
    };
  }),
  on(sendGroupMessagesData, (state, { groupID, message }) => {
    return {
      ...state,
      groupMessages: {
        Count: state.groupMessages.Count + 1,
        Items: [
          ...state.groupMessages.Items,
          {
            authorID: { S: new Date().toISOString() },
            message: { S: message },
            createdAt: { S: new Date().toLocaleString() },
          },
        ],
      },
    };
  })
);
