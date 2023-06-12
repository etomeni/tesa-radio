import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';

import { AppUpdate } from '@capawesome/capacitor-app-update';

import { EditProfileModalComponent } from 'src/app/components/edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { Capacitor } from '@capacitor/core';


enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
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
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  currentUser: userInterface | any = {
    name: '',
    phoneNumber: '',
  };

  currentAppVersion: any = '';
  availableAppVersion: any = '';

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    public resourcesService: ResourcesService
  ) {}

  async ngOnInit() {
    const getUserInterval = setInterval(
      () => {
        if (this.firebaseService.currentUser) {
          this.currentUser = this.firebaseService.currentUser;
          clearInterval(getUserInterval);
        }
      },
      500
    );

    if(Capacitor.isNativePlatform()) {
      this.currentAppVersion = await (await AppUpdate.getAppUpdateInfo()).currentVersion;
      this.availableAppVersion = await (await AppUpdate.getAppUpdateInfo()).availableVersion;
    }
    
  }

  async openEditProfileModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfileModalComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.9],
      canDismiss: this.canDismiss,
      
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // console.log(data);
      this.currentUser.name = data.name;
      this.currentUser.phoneNumber = data.phoneNumber;
    }
  }

  async openChangePasswordModal() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordModalComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.9],
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



  async deleteAccount() {
    const alertInputs = [
      {
        name: 'reauthPassword',
        placeholder: 'Enter your password to confirm',
        attributes: {
          minlength: 8,
        },
      },
    ];

    const alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log("Alert canceled");
        },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: (alertData: any) => {
          console.log("Alert confirmed");

          this.firebaseService.deleteFireAuthAcct(this.currentUser.email, alertData.reauthPassword).then(
            (res: any) => {
              this.resourcesService.presentToast("Account deleted!", toastState.Info);
              this.firebaseService.logoutFirebaseUser();
            },
            (err: any) => {
              console.log(err);
              this.resourcesService.presentToast("Wrong password!", toastState.Error);
            }
          )
        },
      },
    ];

    const alert = await this.alertController.create({
      header: 'Are you sure, you want to delete your account?',
      inputs: alertInputs,
      buttons: alertButtons,
      mode: 'ios',
      translucent: true,
    });
    await alert.present();

    // const actionSheet = await this.actionSheetCtrl.create({
    //   header: 'Are you sure, you want to delete your account?',
    //   buttons: [
    //     {
    //       text: 'Delete',
    //       role: 'destructive',
    //       data: {
    //         action: 'delete',
    //       },
    //       handler() {
              
    //       },
    //     },
    //     {
    //       text: 'No',
    //       role: 'cancel',
    //       data: {
    //         action: 'cancel',
    //       },
    //     },
    //   ],
    // });
    // actionSheet.present();
    // const { role } = await actionSheet.onWillDismiss();
    // return role === 'confirm';
  };


  logOut() {
    this.firebaseService.logoutFirebaseUser();
    this.resourcesService.presentToast("user logged out", 'Info');
  }

}
