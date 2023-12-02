import { createAction, props } from '@ngrx/store';
import { ProfileResponseBody } from 'src/app/shared/models/profile-models';

// export const setProfileData = createAction(
//   '[Profile] Set Profile Data',
//   (data: ProfileResponseBody) => ({ data })
// );
export const setProfileData = createAction(
  '[Profile] Set Profile Data',
  props<{ data: ProfileResponseBody }>()
);

export const updateName = createAction(
  '[Profile] Update Name',
  props<{ name: string }>()
);
