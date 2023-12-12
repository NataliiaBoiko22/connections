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
  // on(setGroupMessagesDataSuccess, (state, { data }) => {
  //   return {
  //     ...state,
  //     groupMessages: data,
  //   };
  // }),
  // on(setGroupMessagesDataSuccess, (state, { data }) => {
  //   const existingGroupIndex = state.groupMessages.groupID === data.groupID;

  //   if (existingGroupIndex !== -1) {
  //     // Если группа уже существует в стейте, заменяем сообщения
  //     const updatedGroupMessages = { ...state.groupMessages };
  //     updatedGroupMessages.Items[existingGroupIndex] = data;

  //     return {
  //       ...state,
  //       groupMessages: updatedGroupMessages,
  //     };
  //   } else {
  //     // Если группы еще нет в стейте, добавляем новую группу
  //     const updatedGroupMessages = { ...state.groupMessages };
  //     updatedGroupMessages.Items = [...updatedGroupMessages.Items, data];

  //     return {
  //       ...state,
  //       groupMessages: updatedGroupMessages,
  //     };
  //   }
  // }),
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

  // on(sendGroupMessagesDataSuccess, (state, { groupID, authorID, message }) => {
  //   return {
  //     ...state,
  //     groupMessages: {
  //       groupID: groupID,
  //       Count: state.groupMessages.Count + 1,
  //       Items: [
  //         ...state.groupMessages.Items,
  //         {
  //           authorID: { S: authorID },
  //           message: { S: message },
  //           createdAt: {
  //             S: new Date().getTime().toString(),
  //           },
  //           authorName: 'Me',
  //         },
  //       ],
  //     },
  //   };
  // }),
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
    return {
      ...state,
      peopleMessages: data,
    };
  }),
  on(setPeopleConversationIDSuccess, (state, { conversationID }) => {
    return {
      ...state,
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
      return {
        ...state,
        peopleMessages: {
          Count: state.peopleMessages.Count + 1,
          Items: [
            ...state.peopleMessages.Items,
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
    }
  ),
  // on(deletePeopleConversationSuccess, (state, { conversationID }) => {
  //   const updatedConversationsList = state.peopleConversationsList.Items.filter(
  //     (coversation) => coversation.id.S !== conversationID
  //   );
  //   const updatedPeopleList = state.peopleList.Items.map((person) => {
  //     if (person.hasConversation && person.uid === coversation.companionID.S) {
  //       return {
  //         ...person,
  //         hasConversation: false,
  //         conversationID: '', // Опционально: обнулить идентификатор беседы
  //       };
  //     }
  //     return person;
  //   });

  //   return {
  //     ...state,
  //     peopleConversationsList: {
  //       Count: updatedConversationsList.length,
  //       Items: updatedConversationsList,
  //     },
  //     peopleList: {
  //       Count: updatedPeopleList.length,
  //       Items: updatedPeopleList,
  //     },
  //   };
  // })
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

  // on(deletePeopleConversationSuccess, (state, { conversationID }) => {
  //   const updatedPeopleList = state.peopleList.Items.map((person) => {
  //     if (person.hasConversation && person.conversationID === conversationID) {
  //       return {
  //         ...person,
  //         hasConversation: false,
  //         conversationID: '', // Опционально: обнулить идентификатор беседы
  //       };
  //     }
  //     return person;
  //   });

  //   return {
  //     ...state,
  //     peopleList: {
  //       Count: updatedPeopleList.length,
  //       Items: updatedPeopleList,
  //     },
  //   };
  // })
);
