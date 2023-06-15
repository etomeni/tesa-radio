import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { toastState } from 'src/modelInterface';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

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


  onSubmit(formData: any): void { 
    this.submitted = true;

    this.firebaseService.sendPasswordResetEmailFireAuth(formData.email).then(
      (authRes: any) =>  {
        console.log(authRes);
        
        this.response.display = true;
        this.response.status = true;
        this.response.message = "A password reset link was sent to your email address";
        this.resourcesService.presentToast("A reset link was sent to your email address", toastState.Success);

        this.router.navigateByUrl('/auth/login');
      }
    ).catch ((error: any)=> {
      this.response.display = true;
      this.response.status = false;
      this.response.message = "An error ocurred while resetting your password or email address not registered";
      this.resourcesService.presentToast("An error ocurred while resetting your password or email address not registered", toastState.Error);
      
      console.log(error);
    }).finally(() => {
      // this.response.display = true;
      this.submitted = false;
    });
    
  }

}
