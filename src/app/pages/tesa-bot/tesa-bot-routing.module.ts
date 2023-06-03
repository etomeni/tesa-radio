import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TesaBotPage } from './tesa-bot.page';

const routes: Routes = [
  {
    path: '',
    component: TesaBotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TesaBotPageRoutingModule {}
