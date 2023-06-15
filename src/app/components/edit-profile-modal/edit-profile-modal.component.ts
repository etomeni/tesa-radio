import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { toastState, userInterface } from 'src/modelInterface';


@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent  implements OnInit {

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
  
  onSubmitEditProfile(formDataValue: any) {
    this.modalFormSubmitted = true;

    const data2db = {
      name: formDataValue.name,
      phoneNumber: formDataValue.phoneNumber,
    }

    try {
      this.firebaseService.updateFirestoreData('users', this.currentUser.userID, data2db).then(
        (res: any) => {

          this.firebaseService.updateUserProfileFireAuth(`${formDataValue.name}`);
        
          this.modalResponse.display = true;
          this.modalResponse.status = true;
          this.modalResponse.message = "Profile details updated successfully!!!";
          this.resourcesService.presentToast("Profile details updated successfully!!!", toastState.Success);
          this.modalFormSubmitted = false;

          this.modalCtrl.dismiss(data2db, 'confirm');
        },
        (err: any) => {
          console.log(err);
          this.modalResponse.display = true;
          this.modalResponse.status = false;
          this.modalResponse.message = "an error ocurred while updating profile details";
          this.resourcesService.presentToast("an error ocurred while updating profile details", toastState.Error);
          this.modalFormSubmitted = false;
        }
      );
      
    } catch (error) {
      console.log(error);
      this.modalResponse.display = true;
      this.modalResponse.status = false;
      this.modalResponse.message = "an error ocurred while updating profile details";
      this.resourcesService.presentToast("an error ocurred while updating profile details", toastState.Error);
      this.modalFormSubmitted = false;
    }

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
