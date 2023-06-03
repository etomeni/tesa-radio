import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicSlides } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';


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

  lastInteraction: any,
  createdAt: any,
  updatedAt: any,
  lastVisible: any
}

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.page.html',
  styleUrls: ['./podcasts.page.scss'],
})
export class PodcastsPage implements OnInit {
  swiperModules = [IonicSlides];
  swiperBreakPoints = {
    50: {
      slidesPerView: 1.2,
    },
    168: {
      slidesPerView: 1.8,
    },
    300: {
      slidesPerView: 2.4,
    },
    540: {
      slidesPerView: 3.3,
    },
    720: {
      slidesPerView: 4.3
    },
    960: {
      slidesPerView: 5.3
    },
    1140: {
      slidesPerView: 6.3
    }
  }
  loadingStatus: boolean = true;
  viewType: boolean = true;

  _podcasts: podcastInterface[] = [];
  suggestedPodcastViews: podcastInterface[] = [];

  lastPodcast: any = undefined;

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
  ) { }

  ngOnInit() {
    this.getPodcasts();
    this.getTop9Podcats();
  }


  getPodcasts() {
    const getLocalStorage = () => {
      this.resourcesService.get("podcasts").then((res: any) => {
        if (res) {
          // this.podcasts = res;
          this._podcasts = res;
          this.lastPodcast = res[0].lastVisible;
        }
      }).finally(() => {
        this.loadingStatus = false;
      });
    }

    this.firebaseService.getLimitedFirestoreDocumentData("podcasts", 20).then(
      (res: any) => {
        // console.log(res);
        
        this._podcasts = res;
        this.lastPodcast = res[0].lastVisible;
        this.resourcesService.store("podcasts", res);

        this.loadingStatus = false;
      },
      (err: any) => {
        console.log(err);
        getLocalStorage();
      }
    ).catch((err: any) => {
      console.log(err);
      getLocalStorage();
    });
  }

  getMorePodcasts() {
    this.firebaseService.getNextLimitedFirestoreDocumentData("podcasts", this.lastPodcast, 10).then(
      (res: any[]) => {
        // console.log(res);

        this.lastPodcast = res.length ? res[0].lastVisible : undefined;
        this._podcasts = [...this._podcasts, ...res];

        this.resourcesService.store("podcasts", this._podcasts);
      }
    ).catch((err: any) => {
      console.log(err);
    });
  }

  loadMoreData(ev: any) {
    this.getMorePodcasts();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lastPodcast == undefined) {
        ev.target.disabled = true;
      }
    }, 500);
  }

  getTop9Podcats() {
    this.firebaseService.getOrderedLimitedFirestorDocs("podcasts", "lastInteraction", 10, "episodes").then(
      (res: any) => {
        this.suggestedPodcastViews = res;
        this.resourcesService.store("suggestedPodcasts", res);

      },
      (err: any) => {
        console.log(err);
        
        this.resourcesService.get("suggestedPodcasts").then((res: any) => {
          if (res) {
            // this.podcasts = res;
            this.suggestedPodcastViews = res;
          }
        });
      }
    )

  }

  handleRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

}
