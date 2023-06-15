import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { toastState } from 'src/modelInterface';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  submitted = false;
  response = {
    display: false,
    status: false,
    message: ''
  };

  contactDetails = {
    address: "154 New Lagos Road by Medical Store Junction, Benin City, Edo State, Nigeria.",
    phoneNumber: "+234-706-171-1112",
    emailAddress: "support@tesamedia.com",
    socail: "@tesaradio"
  }

  constructor(
    public alertController: AlertController,
    private http: HttpClient,
    // services here
    private resourcesService: ResourcesService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {  }

  onSubmit(formData: any) {
    this.submitted = true;

    // save in firebase real time database
    let form2submit = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      Message: formData.message,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    // save in firebase real time database realtimeDB
    this.firebaseService.save2FirestoreDB("contactUs", form2submit).then((res: any) => {
      // console.log(res);
      
      this.sendMail(formData);

      this.response.display = true;
      this.response.status = true;
      this.response.message = "";

      this.response.message = "Contact Message sent successfully!!!";
      this.resourcesService.presentToast("Contact Message sent successfully!!!", toastState.Success);
      this.submitted = false;
    }).catch( err => {
      console.log(err);
      this.response.display = true;
      this.response.status = false;
      this.response.message = "An error ocurred while sending the message";
      this.resourcesService.presentToast("An error ocurred while sending the message", toastState.Error);
      this.submitted = false;
    });
    
  }

  async sendMail(form2submit: any) {

    let message = "Hello Team TESA, <br><b>" + form2submit.name + "</b> just contacted us with this message below <br><br>" + 
                  form2submit.message + "<br><br> Please do well to attend to it on time. <br><br> Thanks. <br> Team TESA";

    let postParam = JSON.stringify({
      receiverEmail: "Sundaywht@gmail.com",
      appName: "Tesa Radio App",
      subject: "Clients's Feedback From " + form2submit.name,
      userName: form2submit.name,
      userEmail: form2submit.email,
      message: form2submit.message
    });
    
    const link = 'https://audiomackstream.com/sendMailwithIonic/sendMail.php';

    let response: any = this.http.post(link, postParam).subscribe( res => {
      console.log(res);
    });

  }

  async presentAlert(message: any) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      // subHeader: message,
      // header: message,
      message: message,
      // buttons: ['OK']
    });
    await alert.present();
  }

}
