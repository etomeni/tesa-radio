import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent  implements OnInit {
  message: string = "";

  isEditProfilModalOpen: boolean = false;
  modalFormSubmitted: boolean = false;
  modalResponse = {
    display: false,
    status: false,
    message: ''
  };

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.message, 'confirm');
  }
  
  onSubmitEditProfile(formDataValue: any) {
    this.modalFormSubmitted = true;
    console.log(formDataValue);


    // if successful dismiss the modal with optional message
    if (!this.modalFormSubmitted) {
      // this.modal.dismiss(this.message, 'confirm');
      this.modalCtrl.dismiss(this.message, 'confirm');
      
    }

  }





}
