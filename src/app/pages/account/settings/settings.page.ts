import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';

import { EditProfileModalComponent } from 'src/app/components/edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  modalResponse: any;


  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
  }

  async openEditProfileModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfileModalComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5],
      canDismiss: this.canDismiss,
      
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.modalResponse = data;
      console.log(`Hello, ${data}!`);
    }
  }

  async openChangePasswordModal() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordModalComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5],
      canDismiss: this.canDismiss,
      
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.modalResponse = `Hello, ${data}!`;
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }



  async deleteAccount() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure, you want to delete your account?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
          handler() {
              
          },
        },
        {
          text: 'No',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };


  logOut() {

  }

}
