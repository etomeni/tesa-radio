import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoutOutPageRoutingModule } from './shout-out-routing.module';

import { ShoutOutPage } from './shout-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoutOutPageRoutingModule
  ],
  declarations: [ShoutOutPage]
})
export class ShoutOutPageModule {}
