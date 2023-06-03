import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoutOutPage } from './shout-out.page';

const routes: Routes = [
  {
    path: '',
    component: ShoutOutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoutOutPageRoutingModule {}
