import { createReducer, on } from '@ngrx/store';
import {
  deleteLogin,
  setEmailError,
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
  }))
);
