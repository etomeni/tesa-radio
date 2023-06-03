import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { PodcastListComponent } from './podcast-list/podcast-list.component';
import { ShowPodcastViewComponent } from './show-podcast-view/show-podcast-view.component';
import { NewShoutOutComponent } from './new-shout-out/new-shout-out.component';

@NgModule({
  declarations: [
    EditProfileModalComponent,
    ChangePasswordModalComponent,
    PodcastListComponent,
    ShowPodcastViewComponent,
    NewShoutOutComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],

  exports: [
    EditProfileModalComponent,
    ChangePasswordModalComponent,
    PodcastListComponent,
    ShowPodcastViewComponent,
    NewShoutOutComponent
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]


})
export class ComponentsModule { }
