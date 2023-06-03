import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tesa-bot',
  templateUrl: './tesa-bot.page.html',
  styleUrls: ['./tesa-bot.page.scss'],
})
export class TesaBotPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  closeTesaBotModal() {
    let data2sendOnDismiaa: any;
    this.modalCtrl.dismiss(data2sendOnDismiaa, 'confirm', 'tesaBotModall');


    return true;
  }

  searchInput() {

  }

}
