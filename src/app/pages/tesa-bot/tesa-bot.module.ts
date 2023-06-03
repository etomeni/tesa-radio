import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TesaBotPageRoutingModule } from './tesa-bot-routing.module';

import { TesaBotPage } from './tesa-bot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TesaBotPageRoutingModule
  ],
  declarations: [TesaBotPage]
})
export class TesaBotPageModule {}
