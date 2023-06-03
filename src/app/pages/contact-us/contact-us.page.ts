import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';

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
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;


    // save in firebase real time database
    let contactFormPath = "contactUs/" + dateTime;
    let form2submit = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      Message: formData.message,
      date: date,
      time: time,
    }
    let mailJSparam = {
      subject: "New Contact Message From " + formData.name,
      from_name: formData.name,
      reply_to: formData.email,
      from_phone_number: formData.phoneNumber,
      before_msg: "",
      message: formData.message,
      after_msg: "",
      to_name: "Team Tesa",  
    }
    this.firebaseService.save2FirestoreDB(contactFormPath, form2submit).then( () => {
      this.response.status = true;

      // send mail after succedd
      // this.sendmailService.contactUs(mailJSparam).then(
      //   res => {
      //     this.presentAlert("Contact Message sent successfully!!!");
      //   },
      //   rejects => {
      //     this.presentAlert("Ooops, unable to deliver Contact Message");
      //   }
      // ).catch(()=> {
      //   this.presentAlert("Ooops, unable to deliver Contact Message");
      // });

      // this.sendMail(formData);
      // console.log("contact form sent");

      this.response.message = "Contact Message sent successfully!!!";
    }).catch( err => {
      this.presentAlert("An error ocurred while sending the message");
      this.response.message = "An error ocurred while sending the message";
      console.log(err);
    }).finally(() => {
      this.response.display = true;
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
    
    // const link = 'http://127.0.0.1/sendMailwithIonic/sendMail.php';
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
