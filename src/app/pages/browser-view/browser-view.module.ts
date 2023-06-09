import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowserViewPageRoutingModule } from './browser-view-routing.module';

import { BrowserViewPage } from './browser-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserViewPageRoutingModule
  ],
  declarations: [BrowserViewPage]
})
export class BrowserViewPageModule {}
