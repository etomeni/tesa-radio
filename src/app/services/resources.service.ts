import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage-angular';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Configuration, OpenAIApi } from 'openai';

import { TesaBotPage } from '../pages/tesa-bot/tesa-bot.page';

enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
};

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Accept': '*/*'
    }),
  };
  private _storage: Storage | null = null;

  private openai: OpenAIApi;
  configuration = new Configuration({
    apiKey: "Your-Key-Here",
  });


  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {
    this.initStorage();
    this.openai = new OpenAIApi(this.configuration);
  }


  chatGPTopenAIgenerateText(prompt: string):Promise<string | undefined>{
    return this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 256
    }).then((response: any) => {
      return response.data.choices[0].text;
    }).catch((error: any) =>{
      return '';
    });
  }
  


  async presentToast(message: any, header: string) {
    let ionToastCssClassName: string = '';
    let iconName: string = '';

    switch (header) {
      case toastState.Error:
        ionToastCssClassName = "errorToast";
        iconName = "close";
        break;
      case toastState.Info:
        ionToastCssClassName = "infoToast";
        iconName = "information";
        break;
      case toastState.Success:
        ionToastCssClassName = "sucessToast";
        iconName = "checkmark";
        break;
      case toastState.Warning:
        ionToastCssClassName = "warningToast";
        iconName = "alert";
        break;
      default:
        ionToastCssClassName = "";
        iconName = "";
        break;
    }

    const toast = await this.toastController.create({
      header: header,
      message: message,
      mode: 'md',
      cssClass: ionToastCssClassName,
      icon: iconName,
      duration: 5000
    });
    toast.present();
  }





  async openTesaBotModal() {
    const modal = await this.modalCtrl.create({
      component: TesaBotPage,
      mode: 'ios', 
      id: "tesaBotModall",
      canDismiss: this.canDismiss,
      animated: true,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }


  async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  // public set(key: string, value: any) {
  //   this._storage?.set(key, value);
  // }

  async store (storageKey: string, value: any) {
    const encryptedvalue = btoa(escape(JSON.stringify(value)))
    return await this._storage?.set(storageKey, encryptedvalue);
  }

  async get(storageKey:string) {
    return new Promise(resolve=>{
      this._storage?.get(storageKey).then((value)=>{
        if (value == null) {
          resolve(false);
        } else {
          resolve(JSON.parse(unescape(atob(value))));
        }
      })
    })
  }

  async removeItem(storageKey:string) {
    await this._storage?.remove(storageKey);
  }
  
  async clear () {
    await this._storage?.clear();
  }
  

}
