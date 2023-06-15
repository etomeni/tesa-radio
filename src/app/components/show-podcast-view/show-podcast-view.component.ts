import { Component, Input, OnInit } from '@angular/core';
import { podcastInterface } from 'src/modelInterface';


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
