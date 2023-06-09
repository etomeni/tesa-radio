import { Component, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import { ModalController, ToastController } from '@ionic/angular';
// import { Network } from '@capacitor/network';


@Component({
  selector: 'app-browser-view',
  templateUrl: './browser-view.page.html',
  styleUrls: ['./browser-view.page.scss'],
})
export class BrowserViewPage implements OnInit {

  loadingState: boolean = true;
  initIframe: boolean = false;

  pageUrl: any;
  modal: any;

  constructor(
    public sanitizer: DomSanitizer,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    // this.getPageData();
    this.networkStatusUpdate();
    // this.updateService.checkForUpdate();
  }

  // getPageData() {
  //   this.databaseService.getRealtimeDBdata("iframe").then(
  //     (res: any) => {
  //       this.readyPageFunction(res.url);
  //       this.storageService.store("iframeUrl", res);    
  //     },
  //     (err: any) => {
  //       console.log(err);
        
  //       this.storageService.get("iframeUrl").then(
  //         (res: any) => {
  //           if (res.url) {
  //             this.readyPageFunction(res.url);
  //           }
  //         }
  //       )
  //     }
  //   )
  // }

  readyPageFunction(url: any): void {
    this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.initIframe = true;

    setTimeout(
      () => { 
        this.checkIframeLoaded();
        // this.pushNotificationService.initPush();
      },
      1000
    );
  }

  checkIframeLoaded() {
    // Get a handle to the iframe element
    // const iframe: HTMLIFrameElement = document.getElementById('iframeWebView') as HTMLIFrameElement;
    // var iframeDoc = iframe.contentWindow.document || iframe.contentDocument;

    // Check if loading is complete
    // if ( iframeDoc.readyState  == 'complete' ) {
    //   // The loading is complete, call the function we want executed once the iframe is loaded
    //   this.loadingState = false;
    //   return;
    // }

    this.loadingState = false;

    // If we are here, it is not loaded. Set things up so we check the status again in 100 milliseconds
    window.setTimeout(() => {
      this.checkIframeLoaded();
    }, 100);
  }

  iframeErr() {
    this.initIframe = false;
    this.loadingState = true;
  }

  doRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  // =========================================================== //

  async networkStatusUpdate() {
    // const startNetStatus = await Network.getStatus();
    let disconnected = false;

    // if (!startNetStatus.connected || disconnected) {
    //   this.presentToast("Internet Connection is disconnected :-(", "You're offline, please check your internet connection!!!");
    //   this.openModal();
    // }

    // Network.addListener('networkStatusChange', (status: any) => {
    //   // console.log('Network status changed', status);
    //   if (status.connected) {
    //     if (!startNetStatus.connected || disconnected) {
    //       disconnected = false;

    //       this.presentToast("Internet Connection Restored." ,"Relaoding..., please wait...");

    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 700);
    //     }
    //   }
                 
    //   if (!status.connected) {
    //     disconnected = true;
    //     this.presentToast("Internet Connection is disconnected :-(", "You're offline, please check your internet connection!!!");
    //     this.openModal();
    //     // console.log(iframe.contentWindow.location.href);
    //   }
    // });
    
  }

  async presentToast(header: string, message: string) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 10000, // 10 seconds
      position: "bottom", // position: 'top' | 'bottom' | 'middle',
    });
    toast.present();
  }

  async openModal() {
    this.modal = await this.modalController.create({
      component: "NoInternetComponent",
      componentProps: {
        userId: "this is my ID"
      },
      showBackdrop: true,
      backdropDismiss: false,
      keyboardClose: false,
      animated: true,
      // canDismiss: false,
    });

    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }

}
