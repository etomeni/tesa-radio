import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PodcastDetailsPageRoutingModule } from './podcast-details-routing.module';

import { PodcastDetailsPage } from './podcast-details.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [PodcastDetailsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PodcastDetailsPageRoutingModule,
        ComponentsModule
    ]
})
export class PodcastDetailsPageModule {}
