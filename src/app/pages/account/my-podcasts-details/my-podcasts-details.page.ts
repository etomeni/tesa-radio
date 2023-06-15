import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { NewPodcastContentComponent } from 'src/app/components/new-podcast-content/new-podcast-content.component';
import { AudioService } from 'src/app/services/audio.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { audioType, podcastInterface } from 'src/modelInterface';

@Component({
  selector: 'app-my-podcasts-details',
  templateUrl: './my-podcasts-details.page.html',
  styleUrls: ['./my-podcasts-details.page.scss'],
})
export class MyPodcastsDetailsPage implements OnInit {
  loadingStatus: boolean = true;
  podcast_id: string = '';
  podcastInfo: podcastInterface | any;
  
  myPodcasts: podcastInterface[] = [];
  lastPodcastDetail: any = undefined;

  currentUser: any = this.firebaseService.currentUser;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    public audioService: AudioService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any)=>{
      // console.log("queryParams => ", params);
      if (params) {
        this.podcastInfo = params;
      }
    });

    this.activatedRoute.params.subscribe((params)=>{
      // console.log("id param: ",params['id']);
      if (params['id']) {
        this.podcast_id = params['id'];
      }
    });

    this.getMyPodcastDetails();
  }




  getMyPodcastDetails() {
    const getStoredMyPodcasts = () => {
      this.resourcesService.getLocalStorage("myPodcastDetails").then(
        (res: any) => {
          if (res) {
            this.audioService.podcasts = res;
            // this.lastPodcastDetail = res[0].lastVisible;
            this.lastPodcastDetail = res.length ? res[0].lastVisible : undefined;
            this.loadingStatus = false;
          } else {
            this.loadingStatus = true;
          }
        },
        (err: any) => {
          this.loadingStatus = true;
        }
      )
    }

    this.firebaseService.countFirestoreDocs("audios", { property: "ref_id", condition: '==', value: this.podcast_id }).then((res: any) => {
      // console.log(res);
      this.podcastInfo = { ...this.podcastInfo, episodes: res };
  
      this.firebaseService.updateFirestoreData('podcasts', this.podcastInfo.id, { episodes: res, updatedAt: Date.now() });
    }).catch((err: any) => {
      console.log(err);
    })

    this.firebaseService.getLimitedFirestoreDocumentData(
      "audios", 10, 
      {property: "type", condition: '==', value: audioType.podcast}, 
      {property: "ref_id", condition: '==', value: this.podcastInfo.id}
    ).then(
      (res: any[]) => {
        // console.log(res);

        for (let i = 0; i < res.length; i++) {
          res[i].audio = new Audio(res[i].src);

          res[i].audio.load();
          res[i].currentTime = this.audioService.audioTiming(res[i].audio.currentTime);
          res[i].duration = this.audioService.audioTiming(res[i].audio.duration);
        }

        this.audioService.podcasts = res;
        // this.lastPodcastDetail = res[0].lastVisible;
        this.lastPodcastDetail = res.length ? res[0].lastVisible : undefined;
        this.resourcesService.setLocalStorage("myPodcastDetails", res);

        this.loadingStatus = false;

        setTimeout(() => {
          for (let i = 0; i < this.audioService.podcasts.length; i++) {
            const element = this.audioService.podcasts[i];
  
            this.audioService.podcasts[i].audio.load();
            this.audioService.podcasts[i].currentTime = this.audioService.audioTiming(element.audio.currentTime);
            this.audioService.podcasts[i].duration = this.audioService.audioTiming(element.audio.duration);
          }
        }, 5000);
      },
      (err: any) => {
        console.log(err);

        getStoredMyPodcasts();
      }
    ).catch((err: any) => {
      console.log(err);

      getStoredMyPodcasts();
    });
  }

  getMorePodcastDetails() {
    this.firebaseService.getNextLimitedFirestoreDocumentData(
      "audios", this.lastPodcastDetail, 10, 
      {property: "type", condition: '==', value: audioType.podcast},
      {property: "ref_id", condition: '==', value: this.podcastInfo.id}
    ).then(
      (res: any[]) => {
        // console.log(res);

        if (res.length) {
          this.lastPodcastDetail = res[0].lastVisible;
  
          for (let i = 0; i < res.length; i++) {
            res[i].audio = new Audio(res[i].src);

            res[i].currentTime = this.audioService.audioTiming(res[i].audio.currentTime);
            res[i].duration = this.audioService.audioTiming(res[i].audio.duration);
          }
  
          this.audioService.podcasts = [...this.audioService.podcasts, ...res];
          this.resourcesService.setLocalStorage("myPodcastDetails", this.audioService.podcasts);
        } else {
          this.lastPodcastDetail = undefined;
        }

      }
    ).catch((err: any) => {
      console.log(err);
    });
  }


  loadMoreData(ev: any) {
    this.getMorePodcastDetails();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lastPodcastDetail == undefined) {
        ev.target.disabled = true;
      }
    }, 500);
  }


  playPause(i: any, id: string, _playPauseValue: string) {
    // console.log("angular index: ", i);
    // const _index = this.audioService.podcasts.map((e) => {
    //   return e.id;
    // }).indexOf(id);
    // console.log("map index: ", _index);

    const index = this.audioService.podcasts.findIndex(e => e.id == id);
    // console.log("find index: ", index);

    if (_playPauseValue == 'play') {
      this.audioService.play(audioType.podcast, index);
      // this.audioService.playWaveSurfer(audioType.podcasts, index);
    }

    if (_playPauseValue == 'pause') {
      this.audioService.pause(audioType.podcast, index);
      // this.audioService.pauseWaveSurfer(audioType.podcasts, index);
    }

    // the logic used for the suggested podcast and shows
    // 1. each time a person plays an audio, update the 'audios' STAT and updatedAt 
    // 2. also update the "lastInteraction" on the 'podcast/show' collection
    // 3. when a podcast is added/deleted use the firebase count() method to update the 'episodes' on the 'podcast/show' collection
    // 4. use the 'lastInteraction' and 'episodes' on the 'podcast/show' collection to get the suggested podcast/show
    this.firebaseService.updateFirestoreData('podcasts', this.audioService.podcasts[index].ref_id, { lastInteraction: Date.now() });
  }

  doRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      // console.log('Async operation has ended');
      // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
      event.target.complete();
    }, 500);
  }




  async handleRefresh(event: any) {
    window.location.reload();

    // let user: any = await this.resourcesService.getLocalStorage("user");
    // if (user.userDBinfo) {
    //   this.currentUser = user.userDBinfo;
    // }
    // this.getPodcasts();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async openCreatePodcastModal() {
    const modal = await this.modalCtrl.create({
      component: NewPodcastContentComponent,
      componentProps: {
        ref_id: this.podcast_id,
        podcastInfo: this.podcastInfo,
      },
      // initialBreakpoint: 0.5,
      // breakpoints: [0, 0.25, 0.5],
      canDismiss: this.canDismiss,
      
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.createPodcastModalResponse = data;
      // console.log(`Hello, ${data}!`);
      this.myPodcasts.unshift(data);
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

}
