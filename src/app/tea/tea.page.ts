import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Tea } from '@app/models';
import { State } from '@app/store';
import { selectTeas } from '@app/store/selectors';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
})
export class TeaPage implements OnInit {
  teas$: Observable<Array<Array<Tea>>>;

  constructor(private auth: AuthenticationService, private navController: NavController, private store: Store<State>) {}

  ngOnInit() {
    this.teas$ = this.store.select(selectTeas).pipe(map((teas) => this.teaMatrix(teas)));
  }

  showDetailsPage(id: number) {
    this.navController.navigateForward(['tabs', 'tea', 'tea-details', id]);
  }

  async refresh(): Promise<void> {
    await this.auth.refreshSession();
  }

  private teaMatrix(teas: Array<Tea>): Array<Array<Tea>> {
    const matrix: Array<Array<Tea>> = [];
    let row = [];
    teas.forEach((t) => {
      row.push(t);
      if (row.length === 4) {
        matrix.push(row);
        row = [];
      }
    });

    if (row.length) {
      matrix.push(row);
    }

    return matrix;
  }
}
