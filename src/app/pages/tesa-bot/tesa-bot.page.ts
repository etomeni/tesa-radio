import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { ResourcesService } from 'src/app/services/resources.service';

interface chatList {
  // s_no: number,
  question: string,
  response: any,
}
@Component({
  selector: 'app-tesa-bot',
  templateUrl: './tesa-bot.page.html',
  styleUrls: ['./tesa-bot.page.scss'],
})
export class TesaBotPage implements OnInit {
  @ViewChild(IonContent)
  content!: IonContent;
  
  modalOpened: boolean = false;
  submitted: boolean = false;
  tesaBotQuestion: string = '';
  responseLoadingState: boolean = false;

  chatListArray: chatList[] = [
    {
      // s_no: 0,
      question: '',
      response: '',
    }
  ];

  constructor(
    private modalCtrl: ModalController,
    private resourcesService: ResourcesService
  ) { }

  ngOnInit() {
  }

  closeTesaBotModal() {
    this.modalCtrl.dismiss(null, 'confirm', 'tesaBotModall');
    return true;
  }

  onSubmitTesaBot(formData: any) {
    this.submitted = true;
    // console.log(formData);

    const scrollToBottom = () => {
      // Passing a duration to the method makes it so the scroll slowly
      // goes to the bottom instead of instantly
      this.content.scrollToBottom(500);
    }

    const chat: chatList = {
      question: formData.tesaBot.trim(),
      response: '',
      // s_no: this.chatListArray[this.chatListArray.length - 1].s_no + 1,
    }
    this.chatListArray.push(chat);
    this.tesaBotQuestion = '';
    scrollToBottom();

    this.resourcesService.chatGPTopenAIgenerateText(formData.tesaBot).then(
      (res: any) => {
        // console.log(res);
        const response: chatList = {
          question: '',
          response: res,
          // s_no: this.chatListArray[this.chatListArray.length - 1].s_no + 1
        }
        this.chatListArray.push(response);
        this.submitted = false;
        scrollToBottom();
      }
    ).catch(() => {
      const response: chatList = {
        question: '',
        response: "Oooops, sorry an error occoured while trying to fetch you your reply.",
        // s_no: this.chatListArray[this.chatListArray.length - 1].s_no + 1
      }

      this.chatListArray.push(response);
      this.submitted = false;
      scrollToBottom();
    });

  }

}
