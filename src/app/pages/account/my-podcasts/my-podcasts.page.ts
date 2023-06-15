import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { CreatePodcastComponent } from 'src/app/components/create-podcast/create-podcast.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { audioType, podcastInterface } from 'src/modelInterface';

@Component({
  selector: 'app-my-podcasts',
  templateUrl: './my-podcasts.page.html',
  styleUrls: ['./my-podcasts.page.scss'],
})
export class MyPodcastsPage implements OnInit {
  loadingStatus: boolean = true;
  viewType: boolean = true;
  _accountPage: boolean = true;

  myPodcasts: podcastInterface[] = [];
  lastPodcast: any = undefined;

  currentUser: any = this.firebaseService.currentUser;
  createPodcastModalResponse: any;

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getPodcasts();
  }

  async getPodcasts() {
    let user: any = await this.resourcesService.getLocalStorage("user");
    if (user.userDBinfo) {
      this.currentUser = user.userDBinfo;
    }

    const getLocalStorage = () => {
      this.resourcesService.getLocalStorage("myPodcasts").then((res: any) => {
        if (res) {
          this.myPodcasts = res;
          this.lastPodcast = res[0].lastVisible;
        }
      }).finally(() => {
        this.loadingStatus = false;
      });
    }

    this.firebaseService.getLimitedFirestoreDocumentData(
      "podcasts", 15, 
      {property: "type", condition: '==', value: audioType.podcast}, 
      { property: 'creator_id', condition: '==', value: this.currentUser.userID || this.currentUser._id }
    ).then(
      (res: any[]) => {
        // console.log(res);
        this.myPodcasts = res;
        this.lastPodcast = res.length ? res[0].lastVisible : undefined;
        this.resourcesService.setLocalStorage("myPodcasts", res);

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
    this.firebaseService.getNextLimitedFirestoreDocumentData(
      "podcasts", this.lastPodcast, 10, 
      {property: "type", condition: '==', value: audioType.podcast}, 
      { property: 'creator_id', condition: '==', value: this.currentUser.userID || this.currentUser._id }
    ).then(
      (res: any[]) => {
        // console.log(res);
        this.lastPodcast = res.length ? res[0].lastVisible : undefined;
        this.myPodcasts = [...this.myPodcasts, ...res];

        this.resourcesService.setLocalStorage("myPodcasts", this.myPodcasts);
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

  async handleRefresh(event: any) {
    // window.location.reload();

    let user: any = await this.resourcesService.getLocalStorage("user");
    if (user.userDBinfo) {
      this.currentUser = user.userDBinfo;
    }
    this.getPodcasts();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }



  async openCreatePodcastModal() {
    const modal = await this.modalCtrl.create({
      component: CreatePodcastComponent,
      // initialBreakpoint: 0.5,
      // breakpoints: [0, 0.25, 0.5],
      canDismiss: this.canDismiss,
      
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.createPodcastModalResponse = data;
      // console.log(`Hello, ${data}!`);
      this.myPodcasts.unshift(data);
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }




}
