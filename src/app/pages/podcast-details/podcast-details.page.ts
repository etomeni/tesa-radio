import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { audioType, podcastInterface } from 'src/modelInterface';


@Component({
  selector: 'app-podcast-details',
  templateUrl: './podcast-details.page.html',
  styleUrls: ['./podcast-details.page.scss'],
})
export class PodcastDetailsPage implements OnInit {
  loadingStatus: boolean = true;
  podcast_id: string = '';
  podcastInfo: podcastInterface | any;

  lastPodcastDetail: any = undefined;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    public audioService: AudioService
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

    this.getPodcastDetails();
  }





  getPodcastDetails() {
    const getStoredShows = () => {
      this.resourcesService.getLocalStorage("podcastDetails").then(
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

    this.audioService.updateShowPodcastPlayStat_n_interations(this.podcast_id, "podcast");

    this.firebaseService.countFirestoreDocs("audios", { property: "ref_id", condition: '==', value: this.podcast_id }).then((res: any) => {
      // console.log(res);

      this.podcastInfo = { ...this.podcastInfo, episodes: res };
  
      this.firebaseService.updateFirestoreData('podcasts', this.podcastInfo.id, { episodes: res, updatedAt: Date.now() });
    }).catch((err: any) => {
      console.log(err);
    })

    this.firebaseService.getLimitedFirestoreDocumentData("audios", 10, {property: "type", condition: '==', value: audioType.podcast}, {property: "ref_id", condition: '==', value: this.podcast_id}).then(
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
        this.resourcesService.setLocalStorage("podcastDetails", res);

        this.loadingStatus = false;

        setTimeout(() => {
          for (let i = 0; i < this.audioService.podcasts.length; i++) {
            const element = this.audioService.podcasts[i];
  
            this.audioService.podcasts[i].audio.load();
            this.audioService.podcasts[i].currentTime = this.audioService.audioTiming(element.audio.currentTime);
            this.audioService.podcasts[i].duration = this.audioService.audioTiming(element.audio.duration);
          }
        }, 1000);
      },
      (err: any) => {
        console.log(err);

        getStoredShows();
      }
    ).catch((err: any) => {
      console.log(err);

      getStoredShows();
    });
  }

  getMorePodcastDetails() {
    this.firebaseService.getNextLimitedFirestoreDocumentData("audios", this.lastPodcastDetail, 10, {property: "type", condition: '==', value: audioType.podcast}, {property: "ref_id", condition: '==', value: this.podcast_id}).then(
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
          this.resourcesService.setLocalStorage("podcastDetails", this.audioService.podcasts);
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

}
