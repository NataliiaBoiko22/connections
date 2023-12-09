import { createReducer, on } from '@ngrx/store';
import { CreatedGroupItem } from 'src/app/shared/models/groups-model';
import {
  createGroupSuccess,
  deleteGroup,
  deleteGroupSuccess,
  deleteLogin,
  deleteLoginSuccess,
  sendGroupMessagesData,
  sendGroupMessagesDataSuccess,
  setConversationDataSuccess,
  setEmailError,
  setGroupListData,
  setGroupMessagesData,
  setGroupMessagesDataSuccess,
  setPeopleListData,
  setProfileData,
  updateName,
} from '../actions/actions';
import { transformUnixTimestampToReadableDate } from '../effects/date-utils';
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
  // on(deleteLoginSuccess, (state) => {
  //   return {
  //     ...state,
  //     profile: {
  //       ...initialState.profile,
  //     },
  //   };
  // }),
  on(deleteLoginSuccess, () => initialState),

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
  on(deleteGroupSuccess, (state, { groupID }) => {
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
  on(sendGroupMessagesDataSuccess, (state, { groupID, authorID, message }) => {
    return {
      ...state,
      groupMessages: {
        Count: state.groupMessages.Count + 1,
        Items: [
          ...state.groupMessages.Items,
          {
            authorID: { S: authorID },
            message: { S: message },
            createdAt: {
              S: new Date().getTime().toString(),
            },
            authorName: 'Me',
          },
        ],
      },
    };
  }),
  on(setConversationDataSuccess, (state, { conversationID }) => {
    return {
      ...state,
      coversation: conversationID,
    };
  })
);
