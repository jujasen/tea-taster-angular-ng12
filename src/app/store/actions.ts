import { UnlockMode } from '@app/core';
import { TastingNote, Tea, User } from '@app/models';
import { CameraResultType, ImageOptions, Photo } from '@capacitor/camera';
import { createAction, props } from '@ngrx/store';

export const startup = createAction('[Application] startup');
export const initialLoadSuccess = createAction('[Data API] initial data load success', props<{ teas: Array<Tea> }>());
export const initialLoadFailure = createAction(
  '[Data API] initial data load failure',
  props<{ errorMessage: string }>()
);

export const login = createAction('[LoginPage] login', props<{ mode?: UnlockMode }>());
export const loginSuccess = createAction('[Auth API] login success', props<{ user: User }>());
export const loginFailure = createAction('[Auth API] login failure', props<{ errorMessage: string }>());

export const logout = createAction('[Tea Page] logout');
export const logoutSuccess = createAction('[Auth API] logout success');
export const logoutFailure = createAction('[Auth API] logout failure', props<{ errorMessage: string }>());

export const unlockSession = createAction('[Login Page] unlock session');
export const unlockSessionSuccess = createAction('[Vault API] unlock session success', props<{ user: User }>());
export const unlockSessionFailure = createAction('[Vault API] unlock session failure');

export const unauthError = createAction('[Auth API] unauthenticated error');

export const sessionLocked = createAction('[Vault API] session locked');
export const sessionUnlocked = createAction('[Vault API] session unlocked');

export const teaDetailsChangeRating = createAction(
  '[Tea Details Page] change rating',
  props<{ tea: Tea; rating: number }>()
);
export const teaDetailsChangeRatingSuccess = createAction('[Data API] change rating success', props<{ tea: Tea }>());
export const teaDetailsChangeRatingFailure = createAction(
  '[Data API] change rating failure',
  props<{ errorMessage: string }>()
);

export const notesPageLoaded = createAction('[Notes Page] loaded');
export const notesPageLoadedSuccess = createAction(
  '[Data API] notes page loaded success',
  props<{ notes: Array<TastingNote> }>()
);
export const notesPageLoadedFailure = createAction(
  '[Data API] notes page loaded failure',
  props<{ errorMessage: string }>()
);

export const noteSaved = createAction('[Note Editor] note saved', props<{ note: TastingNote }>());
export const noteSavedSuccess = createAction('[Data API] note saved success', props<{ note: TastingNote }>());
export const noteSavedFailure = createAction('[Data API] note saved failure', props<{ errorMessage: string }>());

export const noteDeleted = createAction('[Notes Page] note deleted', props<{ note: TastingNote }>());
export const noteDeletedSuccess = createAction('[Data API] note deleted success', props<{ note: TastingNote }>());
export const noteDeletedFailure = createAction('[Data API] note deleted failure', props<{ errorMessage: string }>());

const defautImageOptions: ImageOptions = {
  quality: 90,
  allowEditing: true,
  resultType: CameraResultType.Uri,
};

// eslint-disable-next-line max-len
export const photoSessionStart = createAction(
  '[Photo Sesssion] session started',
  (imageOptions = defautImageOptions) => ({ imageOptions })
);
export const photoSessionCancelled = createAction('[Photo Sesssion] session cancelled');
export const photoSessionSuccess = createAction('[Photo Sesssion] session success', props<{ photo: Photo }>());
export const photoSessionFailure = createAction('[Photo Sesssion] session failure', props<{ errorMessage: string }>());
