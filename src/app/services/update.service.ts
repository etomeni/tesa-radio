import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
// import { Browser } from '@capacitor/browser';

import { AlertController } from '@ionic/angular';
import { ResourcesService } from './resources.service';
import { FirebaseService } from './firebase.service';


interface appUpdate {
  currentAppVersion: {
    iOS: string,
    android: string
  },
  status: boolean;
  forceful: boolean;
  displayText: {
    title: string;
    message: string;
    btn: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  appUpdateDetails = {
    currentAppVersion: {
      iOS: '',
      android: ''
    },
    status: false,
    forceful: false,
    displayText: {
      title: "New Update",
      message: "Good news there is a new version",
      btn: "Update"
    }
  }

  constructor(

    // private platform: Platform,
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
  ) { }


  async checkForUpdate() {
    this.firebaseService.getFirestoreDocumentData("settings", "update").then(
      async (res: appUpdate) => {
        this.updateFunction(res);
        
        this.resourcesService.setLocalStorage("update", res);
      },
      (err: any) => {
        this.resourcesService.getLocalStorage("update").then(
          (res: any) => {
            if (res) {
              this.updateFunction(res);
            }
          }
        );
      }
    );
  }

  // async openAppStoreEntry() {
  //   const packageId = (await App.getInfo()).id;
  //   const packageName = (await App.getInfo()).name;

  //   if (Capacitor.getPlatform() == "android") {
  //     await Browser.open({ url: `https://play.google.com/store/apps/details?id=${ packageId }` });
  //   }
    
  //   if (Capacitor.getPlatform() == "ios") {
  //     await Browser.open({ url: `itms-apps://itunes.apple.com/app/${ packageId }` });
  //   }
  // }

  async presentUpdateAlert(
    title = this.appUpdateDetails.displayText.title, 
    message = this.appUpdateDetails.displayText.message,
    btn = this.appUpdateDetails.displayText.btn,
    forceful = this.appUpdateDetails.forceful
  ) {

    const buttons: any = [];

    if (btn != '' || this.appUpdateDetails.status) {
      buttons.push({
        text: btn || 'Update',
        handler: () => {
          this.openAppStoreEntry();
        },
      })
    }

    if (!forceful) {
      buttons.push({
        text: 'Close',
        role: 'cancel'
      })
    }

    const alert = await this.alertController.create({
      header: title,
      // subHeader: 'New update avaliable',
      message,

      backdropDismiss: forceful ? true : false,
      keyboardClose: forceful ? true : false,
      mode: 'ios',
      animated: true,
      translucent: true,
      buttons: buttons ,
    });

    await alert.present();
  }

  async updateFunction(res: appUpdate) {
    this.appUpdateDetails.status = res.status;
    this.appUpdateDetails.currentAppVersion.iOS = res.currentAppVersion.iOS;
    this.appUpdateDetails.currentAppVersion.android = res.currentAppVersion.android;
    this.appUpdateDetails.forceful = res.forceful;
    // this.appUpdateDetails.displayText = res.displayText;
    this.appUpdateDetails.displayText.btn = res.displayText.btn;
    this.appUpdateDetails.displayText.message = res.displayText.message;
    this.appUpdateDetails.displayText.title = res.displayText.title;

    if (res.status) {
      const versionNumber = (await App.getInfo()).version;
      const userVersionNumber = Number(versionNumber.split(".").join(""));

      const iOSCurrentVersion = Number(res.currentAppVersion.iOS.split(".").join(""));
      const androidCurrentVersion = Number(res.currentAppVersion.android.split(".").join(""));
      // const devicePlatform = Capacitor.getPlatform();

      if (Capacitor.getPlatform() == "android") {
        if (iOSCurrentVersion > androidCurrentVersion) {
          this.presentUpdateAlert(
            res.displayText.title,
            res.displayText.message,
            res.displayText.btn,
            res.forceful
          );
        }
      }

      if (Capacitor.getPlatform() == "ios") {
        if (iOSCurrentVersion > userVersionNumber) {
          this.presentUpdateAlert(
            res.displayText.title,
            res.displayText.message,
            res.displayText.btn,
            res.forceful
          );
        }
      }
      
    }

  }


  async testAlert(message: string) {
    const loading = await this.alertController.create({
      // header: headerTitle,
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          handler: ()=> {
            this.alertController.dismiss();
          }
        },
      ]
    });

    loading.present();
  }

}
