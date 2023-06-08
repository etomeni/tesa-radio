import { Component, Input, OnInit } from '@angular/core';


interface podcastInterface {
  id: string,
  _id: string,
  title: string,
  description: string,
  image: string,
  category: string,
  creator_id: string,
  creator_name: string,
  episodes: number,
  viewStat: number,

  lastInteraction: any,
  createdAt: any,
  updatedAt: any,
  lastVisible: any
}

@Component({
  selector: 'app-show-podcast-view',
  templateUrl: './show-podcast-view.component.html',
  styleUrls: ['./show-podcast-view.component.scss'],
})
export class ShowPodcastViewComponent  implements OnInit {
  @Input() childPodcastViews!: podcastInterface[];
  @Input() viewType!: boolean;
  @Input() accountPage: boolean = false;

  
  constructor() { }

  ngOnInit() {}

}
