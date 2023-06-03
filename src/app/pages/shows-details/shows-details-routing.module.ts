import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowsDetailsPage } from './shows-details.page';

const routes: Routes = [
  {
    path: '',
    component: ShowsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowsDetailsPageRoutingModule {}
