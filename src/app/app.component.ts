import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { register } from 'swiper/element/bundle';
import { FirebaseService } from './services/firebase.service';
import { ResourcesService } from './services/resources.service';
import { BrowserView } from 'src/modelInterface';

register();

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

  marketPlace: BrowserView = {
    display: false,
    url: '',
    pageTitle: 'Market Place'
  };
  tesaChat: BrowserView = {
    display: false,
    url: '',
    pageTitle: 'Chat'
  };
  tesaTV: BrowserView = {
    display: false,
    url: '',
    pageTitle: 'Tesa TV'
  };
  secretCommunity: BrowserView = {
    display: false,
    url: '',
    pageTitle: 'Secret Community'
  };
  
  constructor(
    private router: Router,
    private location: Location,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    public firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    // take the user to the path requested.
    const route = location.path();
    if(route != ''){
      this.router.navigateByUrl(route);
    }
    this.initializeApp();
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
    
    this.getSettingsInfo();
    this.firebaseService.IsLoggedIn();
    this.resourcesService.updateApp();
  }

  initializeApp() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        // console.log('Navigate to back page');
        this.location.back();
      } else {
        this.exitAppConfirmation();
        // if (this.location.isCurrentPathEqualTo('/home')) {
        //   this.exitAppConfirmation();
        // } else {
        //   this.router.navigateByUrl('/home');
        // }
      }
    });
  }

  logout() {
    this.firebaseService.logoutFirebaseUser();
    this.resourcesService.presentToast("user logged out", 'Info');
  }

  
  async exitAppConfirmation () {
    const loading = await this.alertController.create({
      // header: headerTitle,
      message: "Are you sure you want to close this App?",
      cssClass: 'alert-class',
      buttons: [{
        text: "Cancel",
        role: 'cancel',
        handler: ()=> {
          this.alertController.dismiss();
        }
      },
      {
        text: "Close App",
        handler: ()=> {
          App.exitApp();
        }
      }]
    });
    loading.present();
  }

  async presentToast(header: string, message: string) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 10000, // 10 seconds
      position: 'top', // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }


  getSettingsInfo() {
    this.resourcesService.getLocalStorage("appSettings").then(
      (res: any) => {
        if (res) {
          this.marketPlace = res.marketPlace;
          this.tesaChat = res.tesaChat;
        }
      }
    );

    this.firebaseService.getFirestoreDocumentData("appData", "settings").then(
      (res: any) => {
        // console.log(res);
        this.resourcesService.setLocalStorage("appSettings", res);
        this.marketPlace = res.marketPlace;
        this.tesaChat = res.tesaChat;
        this.tesaTV = res.tesaTV;
        this.secretCommunity = res.secretCommunity;
      }
    );
  }


  async openWebView(url: string) {
    await Browser.open({ 
      url: url,
      toolbarColor: '#de2341',
      presentationStyle: 'fullscreen',
    });
  }
  
}
