import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { FirebaseService } from './services/firebase.service';
import { ResourcesService } from './services/resources.service';

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
  ) { }

  ngOnInit(): void {
    const getUserInterval = setInterval(
      () => {
        if (this.currentUser.currentUser) {
          this.currentUser = this.firebaseService.currentUser;
          // console.log(this.firebaseService.currentUser);

          clearInterval(getUserInterval);
        }
      },
      500
    );
    
    this.resourcesService.updateApp();
    this.resourcesService.registerPushNotifications();

    this.firebaseService.IsLoggedIn();
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
