import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { AudioService } from 'src/app/services/audio.service';
import { audioType } from 'src/modelInterface';

@Component({
  selector: 'app-shows-details',
  templateUrl: './shows-details.page.html',
  styleUrls: ['./shows-details.page.scss'],
})
export class ShowsDetailsPage implements OnInit {
  loadingStatus: boolean = true;
  viewType: boolean = false;

  show_id: string = '';
  show: any;

  lastShowDetail: any = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    public audioService: AudioService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
      // console.log("queryParams => ", params);
      if (params) {
        this.show = params;
      }
    });

    this.activatedRoute.params.subscribe((params)=>{
      // console.log("id param: ",params['id']);
      if (params['id']) {
        this.show_id = params['id'];
      }
    });

    if (this.audioService.shows.length && this.audioService.shows[1].ref_id == this.show_id) {
      this.resourcesService.getLocalStorage("showDetails").then(
        (res: any) => {
          if (res) {
            this.lastShowDetail = res.length ? res[0].lastVisible : undefined;
            this.loadingStatus = false;
          } else {
            this.getShowDetails();
          }
        },
        (err: any) => {
          this.getShowDetails();
        }
      );
    } else {
      this.getShowDetails();
    }
  }

  getShowDetails() {
    this.resourcesService.getLocalStorage("showDetails").then(
      (res: any) => {
        if (res.length) {
          if (res[1].ref_id == this.show_id) {
            this.audioService.shows = res;
            this.lastShowDetail = res.length ? res[0].lastVisible : undefined;
            this.loadingStatus = false;
          }
        }
      }
    );
    
    this.audioService.updateShowPodcastPlayStat_n_interations(this.show_id, "shows");

    this.firebaseService.getLimitedFirestoreDocumentData(
      "audios", 10, 
      {property: "type", condition: '==', value: audioType.shows}, 
      {property: "ref_id", condition: '==', value: this.show_id}
    ).then(
      (res: any[]) => {
        // console.log(res);

        for (let i = 0; i < res.length; i++) {
          res[i].audio = new Audio(res[i].src);

          // res[i].audio.load();
          res[i].currentTime = this.audioService.audioTiming(res[i].audio.currentTime);
          res[i].duration = this.audioService.audioTiming(res[i].audio.duration);
        }

        this.audioService.shows = res;
        // this.lastShowDetail = res[0].lastVisible;
        this.lastShowDetail = res.length ? res[0].lastVisible : undefined;
        this.resourcesService.setLocalStorage("showDetails", res);

        this.loadingStatus = false;

        setTimeout(() => {
          for (let i = 0; i < this.audioService.shows.length; i++) {
            const element = this.audioService.shows[i];
  
            // this.audioService.shows[i].audio.load();
            this.audioService.shows[i].currentTime = this.audioService.audioTiming(element.audio.currentTime);
            this.audioService.shows[i].duration = this.audioService.audioTiming(element.audio.duration);
          }
        }, 1000);
      },
      (err: any) => {
        console.log(err);
      }
    ).catch((err: any) => {
      console.log(err);
    });
  }

  getMoreShowDetails() {
    this.firebaseService.getNextLimitedFirestoreDocumentData(
      "audios", this.lastShowDetail, 7, 
      {property: "type", condition: '==', value: audioType.shows}, 
      {property: "ref_id", condition: '==', value: this.show_id}
    ).then(
      (res: any[]) => {
        // console.log(res);

        if (res.length) {
          this.lastShowDetail = res[0].lastVisible;
          // this.lastShowDetail = res[0].lastVisible;
  
          for (let i = 0; i < res.length; i++) {
            res[i].audio = new Audio(res[i].src);

            res[i].currentTime = this.audioService.audioTiming(res[i].audio.currentTime);
            res[i].duration = this.audioService.audioTiming(res[i].audio.duration);
          }

          this.audioService.shows = [...this.audioService.shows, ...res];
          this.resourcesService.setLocalStorage("showDetails", this.audioService.shows);
  
          // this.showDetails = [...this.showDetails, ...res];
          // this.resourcesService.setLocalStorage("showDetails", this.showDetails);
        } else {
          this.lastShowDetail = undefined;
        }

      }
    ).catch((err: any) => {
      console.log(err);
    });
  }


  loadMoreData(ev: any) {
    this.getMoreShowDetails();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lastShowDetail == undefined) {
        ev.target.disabled = true;
      }
    }, 500);
  }


  playPause(i: any, id: string, _playPauseValue: string) {
    // console.log("angular index: ", i);
    // const _index = this.audioService.shows.map((e) => {
    //   return e.id;
    // }).indexOf(id);
    // console.log("map index: ", _index);

    const index = this.audioService.shows.findIndex(e => e.id == id);
    // console.log("find index: ", index);

    if (_playPauseValue == 'play') {
      this.audioService.play(audioType.shows, index);
      // this.audioService.playWaveSurfer(audioType.shows, index);
    }

    if (_playPauseValue == 'pause') {
      this.audioService.pause(audioType.shows, index);
      // this.audioService.pauseWaveSurfer(audioType.shows, index);
    }



    // the logic used for the suggested podcast and shows
    // 1. each time a person plays an audio, update the 'audios' STAT and updatedAt 
    // 2. also update the "lastInteraction" on the 'podcast/show' collection
    // 3. when a podcast is added/deleted use the firebase count() method to update the 'episodes' on the 'podcast/show' collection
    // 4. use the 'lastInteraction' and 'episodes' on the 'podcast/show' collection to get the suggested podcast/show
    this.firebaseService.updateFirestoreData('shows', this.audioService.shows[index].ref_id, { lastInteraction: Date.now() });
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
