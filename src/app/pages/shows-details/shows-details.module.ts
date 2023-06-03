import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowsDetailsPageRoutingModule } from './shows-details-routing.module';

import { ShowsDetailsPage } from './shows-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowsDetailsPageRoutingModule
  ],
  declarations: [ShowsDetailsPage]
})
export class ShowsDetailsPageModule {}
