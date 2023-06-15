import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Browser } from '@capacitor/browser';
import { BrowserView } from 'src/modelInterface';


@Component({
  selector: 'app-browser-view',
  templateUrl: './browser-view.page.html',
  styleUrls: ['./browser-view.page.scss'],
})
export class BrowserViewPage implements OnInit {
  // loadingState: boolean = true;

  // chat || marketPlace
  pageDetails!: BrowserView;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any)=>{
      // console.log(params);
      if (params) {
        this.pageDetails = params;

        this.openWebView();
      }
    });
  }

  async openWebView() {
    await Browser.open({ 
      url: this.pageDetails.url,
      toolbarColor: '#de2341',
      presentationStyle: 'fullscreen',
    });
  }
  
}
