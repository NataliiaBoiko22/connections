import { createReducer, on } from '@ngrx/store';
import { CreatedGroupItem } from 'src/app/shared/models/groups-model';
import {
  createGroupSuccess,
  deleteGroupSuccess,
  deleteLoginSuccess,
  deletePeopleConversationSuccess,
  sendGroupMessagesDataSuccess,
  sendPeopleMessagesDataSuccess,
  setEmailError,
  setGroupListData,
  setGroupMessagesDataSuccess,
  setPeopleConversationIDSuccess,
  setPeopleConversationsListData,
  setPeopleListData,
  setPeopleMessagesDataSuccess,
  setProfileData,
  updateName,
} from '../actions/actions';
import { initialState } from '../state.models';

export const connectionsReducer = createReducer(
  initialState,
  on(setProfileData, (state, { data }) => ({
    ...state,
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
    const updatedGroupMessages = {
      ...state.groupMessages,
      [data.groupID]: data,
    };

    return {
      ...state,
      groupMessages: updatedGroupMessages,
    };
  }),

  on(sendGroupMessagesDataSuccess, (state, { groupID, authorID, message }) => {
    const group = state.groupMessages[groupID];
    const newMessage = {
      authorID: { S: authorID },
      message: { S: message },
      createdAt: { S: new Date().getTime().toString() },
      authorName: 'Me',
    };

    const updatedGroup = {
      ...group,
      Count: (group?.Count || 0) + 1,
      Items: [...(group?.Items || []), newMessage],
    };

    return {
      ...state,
      groupMessages: {
        ...state.groupMessages,
        [groupID]: updatedGroup,
      },
    };
  }),

  on(setPeopleMessagesDataSuccess, (state, { data }) => {
    const updatedPeopleMessages = {
      ...state.peopleMessages,
      [data.conversationID]: data,
    };

    return {
      ...state,
      peopleMessages: updatedPeopleMessages,
    };
  }),

  on(setPeopleConversationIDSuccess, (state, { conversationID, companion }) => {
    const updatedPeopleList = state.peopleList.Items.map((person) => {
      if (person.uid.S === companion.companion) {
        return {
          ...person,
          hasConversation: true,
          conversationId: conversationID.conversationID,
        };
      }
      return person;
    });

    return {
      ...state,
      peopleList: {
        Count: updatedPeopleList.length,
        Items: updatedPeopleList,
      },
      peopleConversationID: conversationID,
    };
  }),
  on(setPeopleConversationsListData, (state, { data }) => {
    return {
      ...state,
      peopleConversationsList: data,
    };
  }),
  on(
    sendPeopleMessagesDataSuccess,
    (state, { conversationID, authorID, message }) => {
      const peopleMessages = state.peopleMessages[conversationID];

      const newMessage = {
        authorID: { S: authorID },
        message: { S: message },
        createdAt: {
          S: new Date().getTime().toString(),
        },
        authorName: 'Me',
      };
      const updatedPeopleMessages = {
        ...peopleMessages,
        Count: (peopleMessages?.Count || 0) + 1,
        Items: [...(peopleMessages?.Items || []), newMessage],
      };
      return {
        ...state,
        peopleMessages: {
          ...state.peopleMessages,
          [conversationID]: updatedPeopleMessages,
        },
      };
    }
  ),

  on(deletePeopleConversationSuccess, (state, { conversationID }) => {
    const updatedConversationsList = state.peopleConversationsList.Items.filter(
      (conversation) => conversation.id.S !== conversationID
    );

    const updatedPeopleList = state.peopleList.Items.map((person) => {
      const isMatchedConversation = updatedConversationsList.some(
        (conversation) => conversation.companionID.S === person.uid.S
      );

      return {
        ...person,
        hasConversation: isMatchedConversation,
        conversationID: isMatchedConversation ? conversationID : '',
      };
    });

    return {
      ...state,
      peopleConversationsList: {
        Count: updatedConversationsList.length,
        Items: updatedConversationsList,
      },
      peopleList: {
        Count: updatedPeopleList.length,
        Items: updatedPeopleList,
      },
    };
  })
);
