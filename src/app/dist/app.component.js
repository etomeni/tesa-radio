"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var bundle_1 = require("swiper/element/bundle");
bundle_1.register();
var toastState;
(function (toastState) {
    toastState["Success"] = "Success";
    toastState["Error"] = "Error";
    toastState["Warning"] = "Warning";
    toastState["Info"] = "Info";
})(toastState || (toastState = {}));
;
var audioType;
(function (audioType) {
    audioType["radio"] = "radio";
    audioType["podcast"] = "podcast";
    audioType["shows"] = "shows";
})(audioType || (audioType = {}));
;
var AppComponent = /** @class */ (function () {
    function AppComponent(resourcesService, firebaseService) {
        this.resourcesService = resourcesService;
        this.firebaseService = firebaseService;
        this.currentUser = {
            name: '',
            profilePhotoURL: ''
        };
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var getUserInterval = setInterval(function () {
            if (_this.currentUser.currentUser) {
                _this.currentUser = _this.firebaseService.currentUser;
                // console.log(this.firebaseService.currentUser);
                clearInterval(getUserInterval);
            }
        }, 500);
        this.resourcesService.updateApp();
        this.resourcesService.registerPushNotifications();
        this.firebaseService.IsLoggedIn();
    };
    AppComponent.prototype.searchInput = function () {
        // console.log("ionInput");
        this.resourcesService.openTesaBotModal();
    };
    AppComponent.prototype.logout = function () {
        this.firebaseService.logoutFirebaseUser();
        this.resourcesService.presentToast("user logged out", 'Info');
        // this.firebaseService.isCurrentUserLoggedIn = false;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
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
