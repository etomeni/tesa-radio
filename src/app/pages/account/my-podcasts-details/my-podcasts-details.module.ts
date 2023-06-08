import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPodcastsDetailsPageRoutingModule } from './my-podcasts-details-routing.module';

import { MyPodcastsDetailsPage } from './my-podcasts-details.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
    declarations: [MyPodcastsDetailsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyPodcastsDetailsPageRoutingModule,
        ComponentsModule
    ]
})
export class MyPodcastsDetailsPageModule {}
