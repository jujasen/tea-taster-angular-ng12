import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';

import { TastingNoteEditorComponent } from './tasting-note-editor/tasting-note-editor.component';
import { TastingNote } from '@app/models';
import { selectNotes, selectPhoto, State } from '@app/store';
import { noteDeleted, notesPageLoaded, photoSessionStart, photoSessionSuccess } from '@app/store/actions';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasting-notes',
  templateUrl: './tasting-notes.page.html',
  styleUrls: ['./tasting-notes.page.scss'],
})
export class TastingNotesPage implements OnInit {
  notes$: Observable<Array<TastingNote>>;
  pickedPhoto$: Observable<Photo>;
  imageUrl: string;

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.store.dispatch(notesPageLoaded());
    this.notes$ = this.store.select(selectNotes);
    this.pickedPhoto$ = this.store.select(selectPhoto);
  }

  async takePicture() {
    this.store.dispatch(photoSessionStart());
    // let message = 'Photo capture error';
    // try {
    //   this.pickedPhoto = await Camera.getPhoto({
    //     quality: 90,
    //     allowEditing: true,
    //     resultType: CameraResultType.Uri
    //   });
    //   this.imageUrl = this.pickedPhoto.webPath;
    //   message = 'Photo OK';
    // } catch(e) {
    //   console.log('Error', e);
    //   this.pickedPhoto = undefined;
    // }
    // const toast = await this.toastController.create({
    //   message,
    //   duration: 2000
    // });
    // toast.present();
  }

  deleteNote(note: TastingNote): void {
    this.store.dispatch(noteDeleted({ note }));
  }

  async newNote(): Promise<void> {
    this.displayEditor();
  }

  async updateNote(note: TastingNote) {
    return this.displayEditor(note);
  }

  private async displayEditor(note?: TastingNote) {
    const opt = {
      component: TastingNoteEditorComponent,
      backdropDismiss: false,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    };

    const modal = await (note
      ? this.modalController.create({ ...opt, componentProps: { note } })
      : this.modalController.create(opt));
    modal.present();
  }
}
