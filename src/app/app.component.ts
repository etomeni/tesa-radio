import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { FirebaseService } from './services/firebase.service';
import { ResourcesService } from './services/resources.service';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';


register();

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

interface userInterface {
  updatedAt: number,
  createdAt: number,
  email: string,
  name: string,
  phoneNumber: string,
  profilePhotoURL: string,
  id: string,
  userID: string,
  lastInteraction: number
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: any = {
    name: '',
    profilePhotoURL: ''
  };
  
  constructor(
    private resourcesService: ResourcesService,
    public firebaseService: FirebaseService,
    private location: Location,
    private platform: Platform,
    private router: Router
  ) {
    // take the user to the path requested.
    const route = location.path();
    if(route != ''){
      this.router.navigateByUrl(route);
    }

  }

  ngOnInit(): void {
    this.platform.ready().then(async () => {
      setTimeout(()=>{
        SplashScreen.hide();
      }, 3000);
    });

    const getUserInterval = setInterval(
      () => {
        if (this.currentUser.name) {
          this.currentUser = this.firebaseService.currentUser;
          // console.log(this.firebaseService.currentUser);
          clearInterval(getUserInterval);
        }
      },
      500
    );
    
    this.firebaseService.IsLoggedIn();
    this.resourcesService.updateApp();
  }

  searchInput() {
    // console.log("ionInput");
    this.resourcesService.openTesaBotModal();
  }

  logout() {
    this.firebaseService.logoutFirebaseUser();
    this.resourcesService.presentToast("user logged out", 'Info');

    // this.firebaseService.isCurrentUserLoggedIn = false;
  }
  
}



// user: userInterface | any = {
//   email: '',
//   name: '',
//   phoneNumber: '',
//   profilePhotoURL: '',
//   id: '',
//   userID: ''
// };
// isCurrentUserLoggedIn: boolean = this.firebaseService.isCurrentUserLoggedIn;

// checkUserLoggedin() {
//   this.resourcesService.getLocalStorage("isCurrentUserLoggedIn").then(
//     (res: any) => {
//       if (res) {
//         this.isCurrentUserLoggedIn = true;
//       }
//     }
//   )

//   this.firebaseService.IsLoggedIn().then(
//     (res: any) => {
//       if(res.state) {
//         this.isCurrentUserLoggedIn = true;

//         this.getUserData(res.user)
//       } else {
//         this.isCurrentUserLoggedIn = false;
//       }
//     }
//   );
// }

// getUserData(authUserData: any) {
//   this.firebaseService.getAllFirestoreDocumentData("users", authUserData.uid).then(
//     (res: any) => {
//       console.log(res);
//       if(res) {
//         this.user = res;

//         let userData = {
//           userAuthInfo: authUserData,
//           userDBinfo: res,
//           loginStatus: true
//         }
//         this.resourcesService.setLocalStorage("user", userData);
//       }
//     },
//     (err: any) => {
//       console.log(err);
//       this.resourcesService.getLocalStorage("user").then(
//         (res: any) => {
//           if(res) {
//             this.user = res.userDBinfo;
//             // this.authUser = res.userAuthInfo
//           }
//         }
//       )
//     }
//   )
// }
