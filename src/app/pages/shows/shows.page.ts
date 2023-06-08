import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.page.html',
  styleUrls: ['./shows.page.scss'],
})
export class ShowsPage implements OnInit {
  loadingStatus: boolean = false;
  shows: any = [];
  lastShow: any = undefined;

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
  ) { }

  ngOnInit() {
    this.getShowws();
  }

  getShowws() {
    this.firebaseService.getLimitedFirestoreDocumentData("shows", 20).then(
      (res: any) => {
        // console.log(res);
        
        if(res.length) {
          this.shows = res;
          this.lastShow = res[0].lastVisible;
          this.resourcesService.setLocalStorage("shows", res);
        }

        this.loadingStatus = true;
      }
    ).catch((err: any) => {
      console.log(err);

      this.resourcesService.getLocalStorage("shows").then((res: any) => {
        if (res) {
          this.shows = res;
          this.lastShow = res[0].lastVisible;
        }
      }).finally(() => {
        this.loadingStatus = true;
      });
    });
  }

  getMoreShows() {
    this.firebaseService.getNextLimitedFirestoreDocumentData("shows", this.lastShow, 10).then(
      (res: any[]) => {
        // console.log(res);

        this.lastShow = res.length ? res[0].lastVisible : undefined;
        this.shows = [...this.shows, ...res];
        
        this.resourcesService.setLocalStorage("shows", this.shows);
      }
    ).catch((err: any) => {
      console.log(err);
    });
  }

  loadMoreData(ev: any) {
    this.getMoreShows();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lastShow == undefined) {
        ev.target.disabled = true;
      }
    }, 500);
  }



  doRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

}
