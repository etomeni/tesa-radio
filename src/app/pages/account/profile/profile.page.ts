import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { CreatePodcastComponent } from 'src/app/components/create-podcast/create-podcast.component';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { audioType, lastPlayedz_ } from 'src/modelInterface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  loadingStatus: boolean = true;
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

  user: any;
  authUser: any;
  // lastPlayed: lastPlayedz_[] = [];
  // currentlyLastPlayed: lastPlayedz_ | undefined;
  // private routerSubscription!: Subscription;

  constructor(
    private resourcesService: ResourcesService,
    public firebaseService: FirebaseService,
    public audioService: AudioService,
    // private router: Router,

    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    this.checkUserLoggedin();

    if (!this.audioService.lastPlayed.length) {
      this.getPreviousListenAudio();
    }

    // this.routerSubscription = this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd)
    // ).subscribe(
    //   () => {
    //     this.stopCurrentlyPlayingAudio();
    //   }
    // );
  }

  ngOnDestroy() {
    // this.stopCurrentlyPlayingAudio();
    // this.routerSubscription.unsubscribe();
  }

  async checkUserLoggedin() {
    let localStoredUser: any = await this.resourcesService.getLocalStorage("user");
    if (localStoredUser) {
      if (localStoredUser.userDBinfo) {
        this.user = localStoredUser.userDBinfo;
        // console.log(this.user);
        this.loadingStatus = false;
      }
      if (localStoredUser.userAuthInfo) {
        this.authUser = localStoredUser.userAuthInfo;
        this.loadingStatus = false;
      }
    } else {
      this.user = this.firebaseService.currentUser;
      this.loadingStatus = false;
    }

    this.firebaseService.IsLoggedIn().then(
      (res: any) => {
        if(res.state) {
          // console.log(res);
          this.authUser = res.user;

          this.getUserData(res.user.uid)
        } else {
          // console.log("please login");
          this.firebaseService.logoutFirebaseUser();
        }
      },
      (err: any) => {
        console.log(err);
        this.firebaseService.logoutFirebaseUser();
      }
    )
    ;
  }

  getUserData(userId: string) {
    this.firebaseService.getFirestoreDocumentData("users", userId).then(
      (res: any) => {
        // console.log(res);
        if(res) {
          this.user = res;

          let userData = {
            userAuthInfo: this.authUser,
            userDBinfo: res,
            loginStatus: true
          }
          this.resourcesService.setLocalStorage("user", userData);
        }
      },
      (err: any) => {
        // console.log(err);
        this.resourcesService.getLocalStorage("user").then(
          (res: any) => {
            if(res) {
              this.user = res.userDBinfo;
              this.authUser = res.userAuthInfo
            }
          }
        )
      }
    )
  }

  getPreviousListenAudio() {
    this.resourcesService.getLocalStorage("lastPlayed").then(
      (res: any) => {
        if (res) {
          this.audioService.lastPlayed = res;

          for (let i = 0; i < this.audioService.lastPlayed.length; i++) {
            this.audioService.lastPlayed[i].audio = new Audio(this.audioService.lastPlayed[i].src);
            this.audioService.lastPlayed[i].index = i;
            this.audioService.lastPlayed[i].isPlaying = false;
            this.audioService.lastPlayed[i].loadingState = false;
          }
        }
      }
    );
  }


  playPause(playingState: "play" | "pause", preAudio: lastPlayedz_, i: number) {
    const index = this.audioService.lastPlayed.findIndex(e => e.id == preAudio.id);

    if (playingState == 'play') {
      this.audioService.play(audioType.lastPlayed, index);
    }

    if (playingState == 'pause') {
      this.audioService.pause(audioType.lastPlayed, index);
    }

    
    // this.lastPlayed[i].timingInterval = setInterval(()=> {
    //   this.lastPlayed[i].currentTime = this.audioService.audioTiming(this.lastPlayed[i].audio.currentTime);
    //   this.lastPlayed[i].duration = this.audioService.audioTiming(this.lastPlayed[i].audio.duration);

    //   this.lastPlayed[i].seekAudioRangeValue = this.lastPlayed[i].audio.currentTime * (100 / this.lastPlayed[i].audio.duration);
    // }, 500);

    // if(playingState == "play") {
    //   this.stopCurrentlyPlayingAudio();

    //   this.lastPlayed[i].audio.play();
    //   this.lastPlayed[i].isPlaying = true;
    //   this.lastPlayed[i].loadingState = false;

    //   if ("mediaSession" in navigator) {
    //     navigator.mediaSession.metadata = new MediaMetadata({
    //       title: this.lastPlayed[i].title || "Tesa Radio",
    //       artist: 'Tesa Radio',
    //       album: this.lastPlayed[i].type,
    //       artwork: [
    //         { src: this.lastPlayed[i].image || '/assets/images/radiomic.png', sizes: '512x512', type: 'image/png' },
    //       ]
    //     });
      
    //     // TODO: Update playback state.
    //     navigator.mediaSession.playbackState = 'playing';
    //   };

    //   this.currentlyLastPlayed = this.lastPlayed[i];
    // }

    // if(playingState == "pause") {
    //   this.lastPlayed[i].audio.pause();
    //   this.lastPlayed[i].isPlaying = false;

    //   if ("mediaSession" in navigator) {
    //     navigator.mediaSession.playbackState = 'playing';
    //   }

    //   clearInterval(this.lastPlayed[i].timingInterval);
    //   this.currentlyLastPlayed = undefined;
    // }

    // this.lastPlayed[i].audio.addEventListener("ended", () => {
    //   this.lastPlayed[i].isPlaying = false;
    //   this.lastPlayed[i].loadingState = false;
    //   this.lastPlayed[i].audio.currentTime = 0;
    //   clearInterval(this.lastPlayed[i].timingInterval);
    // });

    // this.lastPlayed[i].audio.addEventListener("pause", () => {
    //   this.lastPlayed[i].isPlaying = false;
    //   this.lastPlayed[i].loadingState = false;
    //   clearInterval(this.lastPlayed[i].timingInterval);
    // });

  }


  // stopCurrentlyPlayingAudio() {
  //   if (this.currentlyLastPlayed) {
  //     if (this.currentlyLastPlayed.isPlaying) {
  //       this.lastPlayed[this.currentlyLastPlayed.index].audio.pause();
  //       this.lastPlayed[this.currentlyLastPlayed.index].audio.currentTime = 0;
  //     }
  //   }
  // }

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
      console.log(data);
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

}
