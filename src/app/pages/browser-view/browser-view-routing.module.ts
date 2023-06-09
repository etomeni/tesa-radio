import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowserViewPage } from './browser-view.page';

const routes: Routes = [
  {
    path: '',
    component: BrowserViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowserViewPageRoutingModule {}
