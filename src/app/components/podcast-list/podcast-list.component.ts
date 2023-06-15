import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { audioType } from 'src/modelInterface';
// import { ResourcesService } from 'src/app/services/resources.service';


@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss'],
})
export class PodcastListComponent  implements OnInit {
  podcasts: any[] = [];
  audioTimingInterval: any;

  constructor(
    private firebaseService: FirebaseService,
    // private resourcesService: ResourcesService,
    public audioService: AudioService
  ) { }

  ngOnInit() {
  }

  playPause(i: any, id: string, _playPauseValue: string) {
    // console.log("angular index: ", i);
    // const _index = this.audioService.podcasts.map((e) => {
    //   return e.id;
    // }).indexOf(id);
    // console.log("map index: ", _index);

    const index = this.audioService.podcasts.findIndex(e => e.id == id);
    // console.log("find index: ", index);

    if (_playPauseValue == 'play') {
      this.audioService.play(audioType.podcast, index);
      // this.audioService.playWaveSurfer(audioType.podcasts, index);
    }

    if (_playPauseValue == 'pause') {
      this.audioService.pause(audioType.podcast, index);
      // this.audioService.pauseWaveSurfer(audioType.podcasts, index);
    }


    // the logic used for the suggested podcast and shows
    // 1. each time a person plays an audio, update the 'audios' STAT and updatedAt 
    // 2. also update the "lastInteraction" on the 'podcast/show' collection
    // 3. when a podcast is added/deleted use the firebase count() method to update the 'episodes' on the 'podcast/show' collection
    // 4. use the 'lastInteraction' and 'episodes' on the 'podcast/show' collection to get the suggested podcast/show
    this.firebaseService.updateFirestoreData('podcasts', this.audioService.podcasts[index].ref_id, { lastInteraction: Date.now() });
  }


  displayAudioTime(time: number) {
    let seconds: any = Math.floor(time % 60);
    let foo = time - seconds;
    let min = foo / 60;
    let minutes: any = Math.floor(min % 60);
    let hours = Math.floor(min / 60);

    if(hours > 0){
      return hours + " hrs";
    } 

    if(minutes > 0){
      minutes = minutes.toString() + " min";
      return minutes;
    }

    if(seconds < 60){
      seconds = seconds.toString() + " sec";
      return seconds;
    }

  }

  displayTime(time: number) {
    let seconds: any = Math.floor(time % 60);
    let foo = time - seconds;
    let min = foo / 60;
    let minutes: any = Math.floor(min % 60);
    let hours = Math.floor(min / 60);

    if(seconds < 10){
      seconds = "0" + seconds.toString();
    }

    if(minutes < 10){
      minutes = "0" + minutes.toString();
    }

    if(hours > 0){
      return hours + ":" + minutes + ":" + seconds;
    } else {
      return minutes + ":" + seconds;
    }
  }

}
