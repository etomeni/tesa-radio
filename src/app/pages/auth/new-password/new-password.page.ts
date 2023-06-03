import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  submitted = false;
  response = {
    display: false,
    status: false,
    message: ''
  };

  constructor() { }

  ngOnInit() {
  }

  onSubmitNewPassword(formDataValue: any): void { 

  }

}
