import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConnectionsState } from '../state.models';

export const selectConnectionsState =
  createFeatureSelector<ConnectionsState>('connectionsState');

export const selectProfileData = createSelector(
  selectConnectionsState,
  (state) => state.profile
);
