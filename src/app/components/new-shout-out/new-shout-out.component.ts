import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';


enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
};

interface shoutOutInterface {
  sender_name: string,
  sender_image: string,
  sender_email: string,
  sender_id: string,

  recipient_name: string,
  recipient_email: string,
  message: string,

  createdAt:  any,
  updatedAt: any,
}

@Component({
  selector: 'app-new-shout-out',
  templateUrl: './new-shout-out.component.html',
  styleUrls: ['./new-shout-out.component.scss'],
})
export class NewShoutOutComponent  implements OnInit {
  submitted = false;
  response = {
    display: false,
    status: false,
    message: ''
  };

  currentUser: any;

  constructor(
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService
  ) { }

  ngOnInit() {
    this.resourcesService.getLocalStorage("user").then(
      (res: any) => {
        if (res) {
          this.currentUser = res;
        }
      }
    );
  }


  onSubmit(formData: any) {
    this.submitted = true;
    
    let data2db: shoutOutInterface = {
      sender_name: formData.senderName,
      sender_email: formData.senderEmail,
      sender_image: "assets/images/avatar.svg",
      sender_id: '',

      recipient_name: formData.recipientName,
      recipient_email: formData.recipientEmail,
      message: formData.shoutOutMessage,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    if (this.currentUser) {
      if (this.currentUser.userDBinfo.profilePhotoURL) {
        data2db.sender_image = this.currentUser.userDBinfo.profilePhotoURL;
      }

      if (this.currentUser.userDBinfo.userID) {
        data2db.sender_id = this.currentUser.userDBinfo.userID;
      }
    }

    // save in firebase real time database realtimeDB
    this.firebaseService.save2FirestoreDB("shoutOuts", data2db).then((res: any) => {
      // console.log(res);
      
      this.response.display = true;
      this.response.status = true;
      this.response.message = `shout-out message sent to ${formData.recipientName}, successfully!`;
      this.resourcesService.presentToast("shout-out sent successfully!!!", toastState.Success);
      this.submitted = false;

      // close modal and send the new data to the parent page.
      this.closeModal({ ...data2db, id: res.id });
    }).catch( err => {
      console.log(err);
      this.response.display = true;
      this.response.status = false;
      this.response.message = "an error ocurred while sending your shout-out";
      this.resourcesService.presentToast("an error ocurred while sending your shout-out", toastState.Error);
      this.submitted = false;
    });
  }

  closeModal(data2sendOnDismia: any = '') {
    this.modalCtrl.dismiss(data2sendOnDismia, 'confirm', 'newShoutOutModall');
    return true;
  }

}
