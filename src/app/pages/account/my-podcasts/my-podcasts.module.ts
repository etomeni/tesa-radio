import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPodcastsPageRoutingModule } from './my-podcasts-routing.module';

import { MyPodcastsPage } from './my-podcasts.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
    declarations: [MyPodcastsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyPodcastsPageRoutingModule,
        ComponentsModule
    ]
})
export class MyPodcastsPageModule {}
