import { Component, OnInit } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { audioType, toastState } from 'src/modelInterface';


@Component({
  selector: 'app-new-podcast-content',
  templateUrl: './new-podcast-content.component.html',
  styleUrls: ['./new-podcast-content.component.scss'],
})
export class NewPodcastContentComponent  implements OnInit {
  response = {
    display: false,
    status: false,
    message: ''
  };
  submitted = false;
  currentUser: any = this.firebaseService.currentUser;
  
  uploadedFiles = {
    image: {
      file: <any> '',
      filePath: <string> '',
      previewSrc: <any> '',
      fileSrc: <string> ''
    },
    audio: {
      file: <any> '',
      filePath: <string> '',
      previewSrc: <any> '',
      fileSrc: <string> ''
    }
  }

  ref_id: any;
  podcastInfo: any;

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    let user: any = await this.resourcesService.getLocalStorage("user");
    if (user.userDBinfo) {
      this.currentUser = user.userDBinfo;
    }
  }

  handleAudioFileChange(event: any, ref_id: string = this.ref_id) {
    const reader = new FileReader();
    const file = event.target.files[0];
    this.uploadedFiles.audio.file = file;
    if(file) {
      const filePath = `audios/${ ref_id }/${file.name}`;
      this.uploadedFiles.audio.filePath = filePath;

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadedFiles.audio.previewSrc = reader.result as string;
      };
    }
  }

  handleImageFileChange(event: any, ref_id: string = this.ref_id) {
    const reader = new FileReader();
    const file = event.target.files[0];
    this.uploadedFiles.image.file = file;
    if(file) {
      const filePath = `audios/${ ref_id }/${ file.name }`;
      this.uploadedFiles.image.filePath = filePath;

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadedFiles.image.previewSrc = reader.result as string;
      };
    }
  }

  async onSubmit(formDataValue: any) { 
    this.submitted = true;
    // upload the image first and get the src url before updating the DB
    // need await the response from the file upload before proceeding
    await this.uploadFile(this.uploadedFiles.audio.filePath, this.uploadedFiles.audio.file, "audio");
    if (this.uploadedFiles.image.file) {
      await this.uploadFile(this.uploadedFiles.image.filePath, this.uploadedFiles.image.file, "image");
    }

    const data2dB = {
      title: formDataValue.title,
      description: formDataValue.description,
      image: this.uploadedFiles.image.fileSrc,
      src: this.uploadedFiles.audio.fileSrc, // audio source
      imagePath: this.uploadedFiles.image.filePath,
      audioPath: this.uploadedFiles.audio.filePath,
      ref_id: this.ref_id,
      type: audioType.podcast,
      playStat: 0,
      // lastInteraction: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    if(this.uploadedFiles.audio.fileSrc) {
      this.firebaseService.save2FirestoreDB('audios', data2dB).then(
        (response: any) =>  {
          // console.log(response);
          this.submitted = false;
          this.response.display = true;
          this.response.status = true;
          this.response.message = "A new podcast audio as been added successfully";
          this.resourcesService.presentToast("A new podcast audio as been added successfully", toastState.Success);

          this.modalCtrl.dismiss({...data2dB, id: response.id, _id: response.id }, 'confirm');
        }
      ).catch ((error: any)=> {
        this.submitted = false;
  
        this.response.display = true;
        this.response.status = false;
        this.response.message = "An error ocurred while adding a new podcast audio";
        this.resourcesService.presentToast("An error ocurred while adding a new podcast audio", toastState.Error);
        
        console.log(error);
      });
      
    } else {
      this.submitted = false;
  
      this.response.display = true;
      this.response.status = false;
      this.response.message = "Unable to upload podcast audio.";
      this.resourcesService.presentToast("Unable to upload podcast audio.", toastState.Error);
    }
  }

  async uploadFile(path: any, file: any, type: 'audio' | 'image') {
    const storage = getStorage();
    // Create a child reference
    const storageRef = ref(storage, path);
    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file).then(async (snapshot) => {
      // console.log(snapshot);
      await getDownloadURL(ref(storage, snapshot.ref.fullPath)).then((url) => {
        // console.log(url);
        if (type == "audio") {
          this.uploadedFiles.audio.fileSrc = url;
          this.uploadedFiles.audio.filePath = snapshot.ref.fullPath;
        }
        if (type == "image") {
          this.uploadedFiles.image.fileSrc = url;
          this.uploadedFiles.image.filePath = snapshot.ref.fullPath;
        }
      });
    });
  }

  closeModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
