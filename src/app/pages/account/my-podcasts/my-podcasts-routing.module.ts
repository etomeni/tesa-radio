import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPodcastsPage } from './my-podcasts.page';

const routes: Routes = [
  {
    path: '',
    component: MyPodcastsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPodcastsPageRoutingModule {}
