import { Component, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { AudioService } from '../services/audio.service';
import { FirebaseService } from '../services/firebase.service';
import { ResourcesService } from '../services/resources.service';


enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
};

enum audioType {
  radio = "radio",
  podcast = "podcast",
  shows = "shows",
};

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
  ) {}


  ngOnInit() {
    this.audioService.getRadio();

    this.getSuggestedPodcats();
    this.getSuggestedShows();

    this.firebaseService.updateFirestoreData("podcasts", "Ud1cud9E8ZZUEBY102Za", {
      lastInteraction: Date.now(),
      episodes: 0
    })
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
        this.resourcesService.store("suggestedShows", res);
      },
      (err: any) => {
        console.log(err);

        this.resourcesService.get("suggestedShows").then(
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
        this.resourcesService.store("suggestedPodcasts", res);
      },
      (err: any) => {
        console.log(err);

        this.resourcesService.get("suggestedPodcasts").then(
          (res: any) => {
            if(res) {
              this.suggestedShows = res;
            }
          }
        );
      }
    );
  }


  // createShows() {
  //   let today = Date.now();

  //   this.topShows.forEach((element) => {
  //     let show = {
  //       creator_id: "",
  //       creator_name: "Tesa Radio",
  //       // description: "",
  //       image: element.image,
  //       title: element.title,
  //       lastInteraction: today,
  //       episodes: 0,
  //       createdAt: today,
  //       updatedAt: today,
  //     }
      
  //     this.firebaseService.save2FirestoreDB("shows", show).then(
  //       (res: any) => {
  //         // console.log(res);
  //         this.firebaseService.updateFirestoreData("shows", res.id, { id: res.id }).then(
  //           (res: any) => {
  //             console.log(res);
  //           },
  //           (err: any) => {
  //             console.log(err);
  //           }
  //         );
  //       }
  //     );

  //   });
  // }


  searchInput() {
    console.log("ionInput");
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
