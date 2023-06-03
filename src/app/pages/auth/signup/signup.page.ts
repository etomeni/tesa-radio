import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';


enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  response = {
    display: false,
    status: false,
    message: ''
  };
  submitted = false;

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  onSubmitSignup(formDataValue: any): void { 
    this.submitted = true;

    // let today = new Date();
    // let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    this.firebaseService.signupFireAuth(formDataValue).then(
      (authRes: any) =>  {
        // console.log(response);
        if (authRes.user) {
          this.firebaseService.updateUserProfileFireAuth(formDataValue.name, '');

          // save in firebase real time database
          const data2dB = {
            name: formDataValue.name,
            email: formDataValue.email,
            phoneNumber: formDataValue.phoneNumber,
            profilePhotoURL: '',
            userID: authRes.user.uid,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }

          // save in firebase real time database realtimeDB
          this.firebaseService.save2FirestoreDB("users", data2dB, authRes.user.uid).then((fireStoreRes: any) => {
            // console.log(res);

            this.resourcesService.store('isCurrentUserLoggedIn', true).then(() => {
              this.firebaseService.isCurrentUserLoggedIn = true;
            });

            let userData = {
              userLoginInfo: authRes.user,
              userDBinfo: data2dB,
              loginStatus: true
            }
            this.resourcesService.store("user", userData);

            
            this.response.display = true;
            this.response.status = true;
            this.response.message = "account created successfully!!!";
            this.resourcesService.presentToast("account created successfully!!!", toastState.Success);

            this.router.navigateByUrl('/account', {replaceUrl: true});
          }).catch( err => {
            this.response.display = true;
            this.response.status = false;
            this.response.message = "an error ocurred while saving user's data";
            this.resourcesService.presentToast("an error ocurred while saving user's data", toastState.Error);
            
            console.log(err);
          })
        } else {
          console.log(authRes);
        }

      }
    ).catch ((error: any)=> {
      this.response.display = true;
      this.response.status = false;
      this.response.message = "An error ocurred while adding new user or email already in use";
      this.resourcesService.presentToast("An error ocurred while adding new user or email already in use", toastState.Error);
      
      console.log(error);
    }).finally(() => {
      // this.response.display = true;
      this.submitted = false;
    });

  }

}
