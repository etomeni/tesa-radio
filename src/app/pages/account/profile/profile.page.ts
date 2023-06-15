import { Component, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { CreatePodcastComponent } from 'src/app/components/create-podcast/create-podcast.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
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
  lastPlayed: any[] = [];

  constructor(
    private resourcesService: ResourcesService,
    public firebaseService: FirebaseService,
    public audioService: AudioService,

    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    this.checkUserLoggedin();
    this.getPreviousListenAudio();
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

  async getPreviousListenAudio() {
    let localStoredLastPlayed: any = await this.resourcesService.getLocalStorage("lastPlayed");
    if (localStoredLastPlayed) {
      this.lastPlayed = localStoredLastPlayed;
    }
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
      console.log(data);
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

}
