import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-tesa-bot',
  templateUrl: './tesa-bot.page.html',
  styleUrls: ['./tesa-bot.page.scss'],
})
export class TesaBotPage implements OnInit {
  modalOpened: boolean = false;
  submitted: boolean = false;
  tesaBotTextareaRows: number = 1;

  constructor(
    private modalCtrl: ModalController,
    private resourcesService: ResourcesService
  ) { }

  ngOnInit() {
  }

  closeTesaBotModal() {
    let data2sendOnDismiaa: any;
    this.modalCtrl.dismiss(data2sendOnDismiaa, 'confirm', 'tesaBotModall');


    return true;
  }

  tesaBotInputFocus(focusType: 'focusIn' | 'focusOut') {
    if(focusType == 'focusIn') {
      this.tesaBotTextareaRows = 5;
    }
    if(focusType == 'focusOut') {
      this.tesaBotTextareaRows = 1;
    }
  }

  onSubmitTesaBot(formData: any) {
    this.submitted = true;

    console.log(formData);
    this.resourcesService.chatGPTopenAIgenerateText(formData.tesaBot).then(
      (res: any) => {
        console.log(res);
        
      }
    )


  }

}
