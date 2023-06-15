import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { toastState, userInterface } from 'src/modelInterface';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent  implements OnInit {
  isEditProfilModalOpen: boolean = false;
  modalFormSubmitted: boolean = false;
  modalResponse = {
    display: false,
    status: false,
    message: ''
  };
  currentUser: userInterface | any;

  constructor(
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
  ) {}

  ngOnInit() {
    const getUserInterval = setInterval(
      () => {
        if (this.firebaseService.currentUser) {
          this.currentUser = this.firebaseService.currentUser;
          clearInterval(getUserInterval);
        }
      },
      500
    );

  }

  onSubmitChangePassword(formDataValue: any) {
    this.modalFormSubmitted = true;

    if (formDataValue.newPassword == formDataValue.confirmNewPassword) {
      try {
        this.firebaseService.updatePasswordFireAuth(formDataValue.newPassword, this.currentUser.email, formDataValue.currentPassword).then(
          (res: any) => {
          
            this.modalResponse.display = true;
            this.modalResponse.status = true;
            this.modalResponse.message = "Password successfully updated!";
            this.resourcesService.presentToast("Password successfully updated!", toastState.Success);
            this.modalFormSubmitted = false;
  
            this.modalCtrl.dismiss("Password successfully updated!", 'confirm');
          },
          (err: any) => {
            console.log(err);
            this.modalResponse.display = true;
            this.modalResponse.status = false;
            this.modalResponse.message = "Wrong password or an error ocurred while updating profile details";
            this.resourcesService.presentToast("Wrong password or an error ocurred while updating profile details", toastState.Error);
            this.modalFormSubmitted = false;
          }
        );
        
      } catch (error) {
        console.log(error);
        this.modalResponse.display = true;
        this.modalResponse.status = false;
        this.modalResponse.message = "Wrong password or an error ocurred while updating profile details";
        this.resourcesService.presentToast("Wrong password or an error ocurred while updating profile details", toastState.Error);
        this.modalFormSubmitted = false;
      }
    } else {
      this.modalResponse.display = true;
      this.modalResponse.status = false;
      this.modalResponse.message = "passwords do not match";
      this.resourcesService.presentToast("passwords do not match", toastState.Error);
      this.modalFormSubmitted = false;
    }

  }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
