import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { audioType } from 'src/modelInterface';
import { AudioService } from '../services/audio.service';
import { FirebaseService } from '../services/firebase.service';
import { ResourcesService } from '../services/resources.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
// export class HomePage {
export class HomePage implements OnInit {
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

  suggestedPodcasts: any[] = [];
  suggestedShows: any[] = [];
  
  showPodcastViews = {
    settings: {
      pageLink: "/podcast-details",
      viewType: true
    },
    
    data: [
      {
        image: "assets/images/imgPlaceholder.png",
        title: "The Tespreneur Podcast"
      },
      {
        image: "assets/images/shows.jpg",
        title: "Tesa Moments"
      },
      {
        image: "assets/images/tesaHealthTalk.jpg",
        title: "Health Talk with Eva"
      },
      {
        image: "assets/images/tuesdayVibes.jpg",
        title: "Tuesday Vibes"
      },
      {
        image: "assets/images/sportShow.jpg",
        title: "Sport Show"
      },
      {
        image: "assets/images/askMuiliSeun.jpg",
        title: "The Ask Muili Seun Show"
      }
    ] 
  }

  constructor(
    private resourcesService: ResourcesService,
    private firebaseService: FirebaseService,
    public audioService: AudioService,
    private http: HttpClient
  ) {}


  ngOnInit() {
    this.audioService.getRadio();

    this.getSuggestedPodcats();
    this.getSuggestedShows();
    this.firebaseService.registerPushNotifications();
  }

  playPauseRadio(playPauseValue: string) {
    if (playPauseValue == 'play') {
      this.audioService.play(audioType.radio, '')
    }

    if (playPauseValue == 'pause') {
      this.audioService.pause(audioType.radio, '')
    }
  }

  // the logic used for the suggested podcast and shows
  // 1. each time a person plays an audio, update the 'audios' STAT and updatedAt 
  // 2. also update the "lastInteraction" on the 'podcast/show' collection
  // 3. when a podcast is added/deleted use the firebase count() method to update the 'episodes' on the 'podcast/show' collection
  // 4. use the 'lastInteraction' and 'episodes' on the 'podcast/show' collection to get the suggested podcast/show

  getSuggestedShows() {
    this.firebaseService.getOrderedLimitedFirestorDocs("shows", "lastInteraction", 10,"episodes").then(
      (res: any) => {
        // console.log(res);
        this.suggestedShows = res;
        this.resourcesService.setLocalStorage("suggestedShows", res);
      },
      (err: any) => {
        console.log(err);

        this.resourcesService.getLocalStorage("suggestedShows").then(
          (res: any) => {
            if(res) {
              this.suggestedShows = res;
            }
          }
        );
      }
    );
  }

  getSuggestedPodcats() {
    this.firebaseService.getOrderedLimitedFirestorDocs("podcasts", "lastInteraction", 10, "episodes").then(
      (res: any) => {
        // console.log(res);
        this.suggestedPodcasts = res;
        this.resourcesService.setLocalStorage("suggestedPodcasts", res);
      },
      (err: any) => {
        console.log(err);

        this.resourcesService.getLocalStorage("suggestedPodcasts").then(
          (res: any) => {
            if(res) {
              this.suggestedShows = res;
            }
          }
        );
      }
    );
  }

  searchInput() {
    // console.log("ionInput");
    this.resourcesService.openTesaBotModal();
  }

  doRefresh(event: any) {
    window.location.reload();
    // this.router.navigate(['radio']);
    // this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

}
