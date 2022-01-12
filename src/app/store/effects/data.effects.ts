import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, finalize, map, mergeMap, switchMap } from 'rxjs/operators';

import {
  loginSuccess,
  initialLoadSuccess,
  initialLoadFailure,
  notesPageLoaded,
  notesPageLoadedFailure,
  notesPageLoadedSuccess,
  noteDeleted,
  noteDeletedFailure,
  noteDeletedSuccess,
  noteSaved,
  noteSavedFailure,
  noteSavedSuccess,
  startup,
  teaDetailsChangeRating,
  teaDetailsChangeRatingFailure,
  teaDetailsChangeRatingSuccess,
  unlockSessionSuccess,
  photoSessionCancelled,
  photoSessionFailure,
  photoSessionStart,
  photoSessionSuccess,
} from '@app/store/actions';
import { AuthenticationService, SessionVaultService, TastingNotesService, TeaService } from '@app/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';

@Injectable()
export class DataEffects {
  sessionLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess, startup, unlockSessionSuccess),
      mergeMap(() =>
        from(this.auth.isAuthenticated()).pipe(
          mergeMap((isAuth) => (isAuth ? this.teaService.getAll() : of([]))),
          map((teas) => initialLoadSuccess({ teas })),
          catchError(() =>
            of(
              initialLoadFailure({
                errorMessage: 'Error in data load, check server logs',
              })
            )
          )
        )
      )
    )
  );

  teaRatingChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(teaDetailsChangeRating),
      mergeMap((action) =>
        from(this.teaService.save({ ...action.tea, rating: action.rating })).pipe(
          map(() =>
            teaDetailsChangeRatingSuccess({
              tea: { ...action.tea, rating: action.rating },
            })
          ),
          catchError((err) =>
            of(
              teaDetailsChangeRatingFailure({
                errorMessage: err.message || 'Unknown error in rating save',
              })
            )
          )
        )
      )
    )
  );

  notesPageLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notesPageLoaded),
      mergeMap(() =>
        this.tastingNotesService.getAll().pipe(
          map((notes) => notesPageLoadedSuccess({ notes })),
          catchError(() =>
            of(
              notesPageLoadedFailure({
                errorMessage: 'Error in data load, check server logs',
              })
            )
          )
        )
      )
    )
  );

  noteSaved$ = createEffect(() =>
    this.actions$.pipe(
      ofType(noteSaved),
      mergeMap((action) =>
        this.tastingNotesService.save(action.note).pipe(
          map((note) => noteSavedSuccess({ note })),
          catchError(() =>
            of(
              noteSavedFailure({
                errorMessage: 'Error in data load, check server logs',
              })
            )
          )
        )
      )
    )
  );

  noteDeleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(noteDeleted),
      mergeMap((action) =>
        this.tastingNotesService.delete(action.note.id).pipe(
          map(() => noteDeletedSuccess({ note: action.note })),
          catchError(() =>
            of(
              noteDeletedFailure({
                errorMessage: 'Error in data load, check server logs',
              })
            )
          )
        )
      )
    )
  );

  photoSessionStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(photoSessionStart),
      mergeMap((action) =>
        from(this.sessionVault.updateTimeout(null)).pipe(
          switchMap(() =>
            from(Camera.getPhoto(action.imageOptions)).pipe(
              map((photo) => {
                console.log('photoSessionSuccess', photo);
                return photoSessionSuccess({ photo });
              }),
              catchError((e) => {
                console.log('photoSessionError', e);
                if (e) {
                  return of(photoSessionCancelled());
                } else {
                  return of(photoSessionFailure({ errorMessage: 'Photo capture error' }));
                }
              })
            )
          )
        )
      ),
      finalize(() => this.sessionVault.updateTimeout())
    )
  );

  constructor(
    private actions$: Actions,
    private auth: AuthenticationService,
    private tastingNotesService: TastingNotesService,
    private sessionVault: SessionVaultService,
    private teaService: TeaService
  ) {}
}
