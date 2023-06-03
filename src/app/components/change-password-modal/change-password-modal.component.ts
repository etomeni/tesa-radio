import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent  implements OnInit {

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
  
  onSubmitChangePassword(formDataValue: any) {
    this.modalFormSubmitted = true;
    console.log(formDataValue);


    // if successful dismiss the modal with optional message
    if (!this.modalFormSubmitted) {
      // this.modal.dismiss(this.message, 'confirm');
      this.modalCtrl.dismiss(this.message, 'confirm');
      
    }

  }


}
