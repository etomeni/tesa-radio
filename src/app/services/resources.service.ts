import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage-angular';
import { ModalController, ToastController } from '@ionic/angular';

import { NativeMarket } from '@capacitor-community/native-market';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { Capacitor } from '@capacitor/core';

import { Configuration, OpenAIApi } from 'openai';

import { TesaBotPage } from '../pages/tesa-bot/tesa-bot.page';
import { toastState } from 'src/modelInterface';


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
    apiKey: "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",
  });


  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private modalCtrl: ModalController,
  ) {
    this.initStorage();
    this.openai = new OpenAIApi(this.configuration);
  }


  chatGPTopenAIgenerateText(prompt: string):Promise<string | undefined>{
    return this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt, // "Tesa Bot " + prompt
      max_tokens: 256,
      temperature: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0.6
    }).then((response: any) => {
      // console.log(response);
      return response.data.choices[0].text;
    }).catch((error: any) =>{
      console.log(error);
      return '';
    });
  }
  

  // TODO:::::
  // read the documentation here on setup of app updates
  // https://github.com/capawesome-team/capacitor-plugins/tree/main/packages/app-update#openappstoreoptions

  async openAppOnStore() {
    if(Capacitor.isNativePlatform()) {
      NativeMarket.openStoreListing({
        appId: "com.tesamedia.app",
      }).catch(async () => {
        await AppUpdate.openAppStore();
      });
    }
  }

  async updateApp() {
    if(Capacitor.isNativePlatform()) {
      const getUpdateAvailability = await (await AppUpdate.getAppUpdateInfo()).updateAvailability;
  
      if (getUpdateAvailability == AppUpdateAvailability.UPDATE_AVAILABLE) {
        // const getCurrentAppVersion = await (await AppUpdate.getAppUpdateInfo()).currentVersion;
        // const getAvailableAppVersion = await (await AppUpdate.getAppUpdateInfo()).availableVersion;
        
        if(Capacitor.getPlatform() == 'ios') {
          await AppUpdate.openAppStore();
        }
  
        if(Capacitor.getPlatform() == 'android') {
          await AppUpdate.performImmediateUpdate();
        }
      }
    }
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

  formatLikesCount(count: number) {
    if (count >= 1000000000) {
      // Format for billion
      return (count / 1000000000).toFixed(1) + 'B';
    } else if (count >= 1000000) {
      // Format for millions
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      // Format for thousands
      return (count / 1000).toFixed(1) + 'K';
    } else {
      // No formatting needed
      return count.toString();
    }
    

    // Example usage
    // const likeCount = 13456;
    // const formattedLikes = formatLikesCount(likeCount);
    // console.log(formattedLikes); // Output: "13.5K"
  }





  async openTesaBotModal() {
    const modal = await this.modalCtrl.create({
      component: TesaBotPage,
      componentProps: { modalOpened: true },
      mode: 'ios', 
      id: "tesaBotModall",
      canDismiss: this.canDismiss,
      animated: true,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // console.log(`Hello, ${data}!`);
      console.log(data);
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

  async setLocalStorage(storageKey: string, value: any) {
    const encryptedvalue = btoa(escape(JSON.stringify(value)))
    return await this._storage?.set(storageKey, encryptedvalue);
  }

  // getLocalStorage
  async getLocalStorage(storageKey:string) {
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

  // removeLocalStorageItem
  async removeLocalStorageItem(storageKey:string) {
    await this._storage?.remove(storageKey);
  }
  
  // clearLocalStorage
  async clearLocalStorage() {
    await this._storage?.clear();
  }
}
