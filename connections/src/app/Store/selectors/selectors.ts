import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConnectionsState } from '../state.models';

export const selectConnectionsState =
  createFeatureSelector<ConnectionsState>('connectionsState');

export const selectProfileData = createSelector(
  selectConnectionsState,
  (state) => state.profile
);

export const selectEmailError = createSelector(
  selectConnectionsState,
  (state) => state.emailError
);
export const selectGroupList = createSelector(
  selectConnectionsState,
  (state) => state.groupList
);
export const selectPeopleList = createSelector(
  selectConnectionsState,
  (state) => state.peopleList
);
export const selectPeopleConversationsList = createSelector(
  selectConnectionsState,
  (state) => state.peopleConversationsList
);
export const selectPeopleConversationID = createSelector(
  selectConnectionsState,
  (state) => state.peopleConversationID
);
export const selectCreatedGroupList = createSelector(
  selectConnectionsState,
  (state) => state.createdGroupList
);
// export const selectGroupMessages = createSelector(
//   selectConnectionsState,
//   (state) => state.groupMessages
// );
export const selectGroupMessagesById = (groupID: string) =>
  createSelector(
    selectConnectionsState,
    (state) => state.groupMessages[groupID]
  );
// export const selectGroupMessagesById = (groupID: string) =>
//   createSelector(selectConnectionsState, (state) => {
//     const groupMessages = state.groupMessages;
//     const groupMessage = Object.values(groupMessages).find(
//       (message) => message === groupID
//     );
//     return groupMessage || { groupID: '', Count: 0, Items: [] };
//   });
// export const selectGroupMessagesById = (groupID: string) =>
//   createSelector(selectConnectionsState, (state) => {
//     return state.groupMessages.groupID === groupID;
//   });

export const selectPeopleMessages = createSelector(
  selectConnectionsState,
  (state) => state.peopleMessages
);
