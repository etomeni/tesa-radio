import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';

import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';

import { NewShoutOutComponent } from 'src/app/components/new-shout-out/new-shout-out.component';


interface shoutOutInterface {
  sender_name: string,
  sender_image: string,
  sender_email: string,
  sender_id: string,

  recipient_name: string,
  recipient_email: string,
  message: string,

  createdAt: string,
  updatedAt: string,
}

@Component({
  selector: 'app-shout-out',
  templateUrl: './shout-out.page.html',
  styleUrls: ['./shout-out.page.scss'],
})
export class ShoutOutPage implements OnInit {
  loadingStatus: boolean = true;

  shoutOuts: shoutOutInterface[] = [];
  lastShoutOut: any = undefined;

  constructor(
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
  ) { }

  ngOnInit() {
    this.getShoutOuts();
  }

  getShoutOuts() {
    this.firebaseService.getLimitedFirestoreDocumentData("shoutOuts", 15).then(
      (res: any) => {
        // console.log(res);

        if(res.length) {
          this.shoutOuts = res;
          this.lastShoutOut = res[0].lastVisible;
          this.resourcesService.setLocalStorage("shoutOuts", res);
        }

        this.loadingStatus = false;
      },
      (err: any) => {
        console.log(err);
        
        this.resourcesService.getLocalStorage("shoutOuts").then((res: any) => {
          if (res) {
            this.shoutOuts = res;
            this.lastShoutOut = res[0].lastVisible;
          }
        }).finally(() => {
          this.loadingStatus = false;
        });
      }
    );
  }

  getMoreShoutOuts() {
    this.firebaseService.getNextLimitedFirestoreDocumentData("shoutOuts", this.lastShoutOut, 10).then(
      (res: any) => {
        // console.log(res);

        this.lastShoutOut = res.length ? res[0].lastVisible : undefined;
        this.shoutOuts = [...this.shoutOuts, ...res];
        
        this.resourcesService.setLocalStorage("shoutOuts", this.shoutOuts);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  loadMoreData(ev: any) {
    this.getMoreShoutOuts();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lastShoutOut == undefined) {
        ev.target.disabled = true;
      }
    }, 500);
  }


  doRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async openNewShoutOutModal() {
    const modal = await this.modalCtrl.create({
      component: NewShoutOutComponent,
      mode: 'ios', 
      id: "newShoutOutModall",
      cssClass: "newShoutOutModall",
      canDismiss: this.canDismiss,
      animated: true,
      initialBreakpoint: 0.8
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // console.log(`Hello, `, data);
      // this.shoutOuts.push(data);
      this.shoutOuts.unshift(data);
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

}
