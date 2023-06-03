import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PodcastsPageRoutingModule } from './podcasts-routing.module';

import { PodcastsPage } from './podcasts.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [PodcastsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PodcastsPageRoutingModule,
        ComponentsModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PodcastsPageModule {}
