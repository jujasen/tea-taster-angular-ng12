import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TeaDetailsPageRoutingModule } from './tea-details-routing.module';
import { SharedModule } from '@app/shared';
import { TeaDetailsPage } from './tea-details.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, TeaDetailsPageRoutingModule],
  declarations: [TeaDetailsPage],
})
export class TeaDetailsPageModule {}
