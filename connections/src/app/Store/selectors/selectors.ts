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
export const selectCreatedGroupList = createSelector(
  selectConnectionsState,
  (state) => state.createdGroupList
);
export const selectGroupMessages = createSelector(
  selectConnectionsState,
  (state) => state.groupMessages
);
