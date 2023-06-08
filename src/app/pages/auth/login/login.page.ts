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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  submitted = false;
  response = {
    display: false,
    status: false,
    message: ''
  };

  constructor(
    private router: Router,
    // services here
    public resourcesService: ResourcesService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    
  }

  onSubmitLogin(formDataValue: any): void { 
    this.submitted = true;
    // console.log(formDataValue);
    
    this.firebaseService.loginFireAuth(formDataValue).then(
      (authRes: any) => {
        console.log(authRes);
        
        this.resourcesService.setLocalStorage('isCurrentUserLoggedIn', true).then(() => {
          this.firebaseService.isCurrentUserLoggedIn = true;
        });

        this.firebaseService.updateFirestoreData('users', authRes.user.uid, { lastInteraction: Date.now() });
        this.firebaseService.getFirestoreDocumentData("users", authRes.user.uid).then(
          (fireStoreRes: any)=>{
            let userData = {
              userAuthInfo: authRes.user,
              userDBinfo: fireStoreRes,
              loginStatus: true
            }
            this.resourcesService.setLocalStorage("user", userData);

            this.response.display = true;
            this.response.status = false;
            this.response.message = "successfull!!!";
            this.resourcesService.presentToast("successfull!!!", toastState.Success);

            this.router.navigateByUrl('/account', {replaceUrl: true});
          }).catch((error: any) => {
            console.log(error);
            this.resourcesService.setLocalStorage('isCurrentUserLoggedIn', false).then(() => {
              this.firebaseService.isCurrentUserLoggedIn = false;
            });

            this.response.display = true;
            this.response.status = false;
            this.response.message = "unable to get user's data";
            this.resourcesService.presentToast("unable to get user's data", toastState.Error);
        });

      }
    ).catch( err => {
      console.log(err);
      this.resourcesService.setLocalStorage('isCurrentUserLoggedIn', false).then(() => {
        this.firebaseService.isCurrentUserLoggedIn = false;
      });


      this.response.display = true;
      this.response.status = false;
      this.response.message = "Incorrect email address or password.";
      this.resourcesService.presentToast("Incorrect email address or password.", toastState.Error);
    }).finally(() => {
      this.submitted = false;
    });
    
  }

}
