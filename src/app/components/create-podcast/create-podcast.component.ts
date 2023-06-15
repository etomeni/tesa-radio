import { Component, OnInit } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { toastState } from 'src/modelInterface';

@Component({
  selector: 'app-create-podcast',
  templateUrl: './create-podcast.component.html',
  styleUrls: ['./create-podcast.component.scss'],
})
export class CreatePodcastComponent  implements OnInit {
  response = {
    display: false,
    status: false,
    message: ''
  };
  submitted = false;
  currentUser: any = this.firebaseService.currentUser;
  
  categories = [
    'Arts',
    'Books',
    'Fashion & Beauty',
    'Food',
    'Business',
    'Careers',
    'Entrepreneurship',
    'Comedy',
    'Education',
    'Fiction',
    'Drama',
    'Government',
    'History',
    'Health & Fitness',
    'Kids & Family',
    'Leisure',
    'Music',
    'News',
    'Religion & Spirituality',
    'Science',
    'Society & Culture',
    'Sports',
    'Technology',
    'TV & Film',
  ]
  
  uploadedFiles = {
    file: <any> '',
    filePath: <string> '',
    previewImageSrc: <any> '',
    fileSrc: <string> ''
  }

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

  handleFileInputChange(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    this.uploadedFiles.file = file;
    if(file) {
      const filePath = `podcasts/${ this.currentUser.userID || this.currentUser._id }/${file.name}`;
      this.uploadedFiles.filePath = filePath;

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadedFiles.previewImageSrc = reader.result as string;
      };
    }
  }

  async onSubmit(formDataValue: any) { 
    this.submitted = true;
    // upload the image first and get the src url before updating the DB
    // need await the response from the file upload before proceeding
    await this.uploadFile(this.uploadedFiles.filePath, this.uploadedFiles.file);

    const data2dB = {
      title: formDataValue.title,
      category: formDataValue.category,
      description: formDataValue.description,
      image: this.uploadedFiles.fileSrc,
      imagePath: this.uploadedFiles.filePath,
      creator_id: this.currentUser.userID || this.currentUser._id,
      creator_name: this.currentUser.name,
      episodes: 0,
      viewStat: 0,

      lastInteraction: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    if(this.uploadedFiles.fileSrc) {
      this.firebaseService.save2FirestoreDB('podcasts', data2dB).then(
        (response: any) =>  {
          // console.log(response);
  
          this.submitted = false;
          this.response.display = true;
          this.response.status = true;
          this.response.message = "A new podcast podcast as been created successfully";
          this.resourcesService.presentToast("A new podcast podcast as been created successfully", toastState.Success);

          this.modalCtrl.dismiss({...data2dB, id: response.id, _id: response.id }, 'confirm');
        }
      ).catch ((error: any)=> {
        this.submitted = false;
  
        this.response.display = true;
        this.response.status = false;
        this.response.message = "An error ocurred while creating a new podcast";
        this.resourcesService.presentToast("An error ocurred while creating a new podcast", toastState.Error);
        
        console.log(error);
      });
      
    } else {
      this.submitted = false;
  
      this.response.display = true;
      this.response.status = false;
      this.response.message = "Unable to upload podcast image.";
      this.resourcesService.presentToast("Unable to upload podcast image.", toastState.Error);
    }
  }

  async uploadFile(path: any, file: any) {
    const storage = getStorage();
    // Create a child reference
    const storageRef = ref(storage, path);
    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file).then(async (snapshot) => {
      // console.log(snapshot);
      this.uploadedFiles.filePath = snapshot.ref.fullPath;
      await getDownloadURL(ref(storage, snapshot.ref.fullPath)).then((url) => {
        // console.log(url);
        this.uploadedFiles.fileSrc = url;
      });
    });
  }

  closeModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
