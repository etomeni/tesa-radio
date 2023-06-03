import { Injectable } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { FirebaseService } from './firebase.service';
import { ResourcesService } from './resources.service';



enum toastState {
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
  Info = "Info"
};

enum audioType {
  radio = "radio",
  podcast = "podcast",
  shows = "shows",
};

interface audiosInterface {
  id: string,
  arrayID: number,
  type: string,
  src: string,
  wave_surfer: any,
  audio: any,
  title: string,
  description: string,
  image: string,
  category: string,
  ref_id: string,
  playStat: string,
  comments: any,
  createdAt: string,
  updatedAt: string,

  // playing controls
  durationSummary: string,
  timingInterval: any, 
  seekAudioRangeValue: number,
  currentTime: any,
  duration: any,
  playbackRate: any,
  loadingState: boolean // true, 
  isPlaying: boolean // false,
}



@Injectable({
  providedIn: 'root'
})
export class AudioService {
  // wave_surfer: any;

  currentlyPlayingAudio = {
    type: <audioType> '', // radio || podcast || shows
    playingAudio: <any> null,
    id: <any> null,

    // currentTime: null,
    // duration: null,
    // playbackRate: null,
    // loadingState: <boolean> true, 
    // isPlaying: <boolean> false,
  }

  radio = {
    src: <string> '',
    audio: new Audio("https://stream.zeno.fm/1z937nxzhchvv"),
    wave_surfer: <any> '',

    timingInterval: <any> '',
    currentTime: <any> '',
    duration: <any> '',
    playbackRate: null,
    loadingState: <boolean> true, 
    isPlaying: <boolean> false,
  };
  podcasts: audiosInterface[] = [];
  shows: audiosInterface[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService
  ) { }


  getRadio() {
    const playRadio = () => {
      this.radio.audio.load();

      if (this.radio.audio.readyState) {
        this.radio.loadingState = false;
      }

      if (this.radio.audio.readyState > 1) {
        this.radio.loadingState = false;
        this.radio.audio.play();
      }

      this.radio.audio.addEventListener("playing", () => {
        this.radio.isPlaying = true;
        this.radio.loadingState = false;

        this.currentlyPlayingAudio.playingAudio = this.radio.audio;
        this.currentlyPlayingAudio.type = audioType.radio;
      });

      // this.radio.currentTime = this.audioTiming(this.radio.audio.currentTime);
      // this.radio.duration = this.audioTiming(this.radio.audio.duration);
    };

    this.firebaseService.getFirestoreDocumentData("appData", "radio").then(
      (res: any) => {
        // console.log(res);
        this.radio.src = res.streamUrl;
        this.radio.audio = new Audio(res.streamUrl);
        
        this.radio.wave_surfer.load(res.streamUrl);

        this.resourcesService.store("radioStreamUrl", { ...this.radio, ...res} );
        playRadio();
      },
      (err: any) => {
        console.log(err);

        this.resourcesService.get("radioStreamUrl").then(
          (res: any) => {
            if (res) {
              // console.log(res);
              // this.radio.audio = new Audio(res.streamUrl);
              this.radio = res;
              playRadio();
            }
          },
          (err: any) => {
            // console.log(err);
            playRadio();
          }
        )
      }
    );
  }

  play(audio_Type: audioType, audio_array_id: any) {
    if (this.currentlyPlayingAudio.playingAudio) {
      if (this.currentlyPlayingAudio.type == audioType.radio) {
        this.radio.audio.pause();

        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.radio.audio.currentTime = 0;
          this.radio.audio.removeAllListeners;
        }
      } 

      if (this.currentlyPlayingAudio.type == audioType.podcast) {
        this.podcasts[this.currentlyPlayingAudio.id].audio.pause();

        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.podcasts[this.currentlyPlayingAudio.id].audio.currentTime = 0;
          this.podcasts[this.currentlyPlayingAudio.id].audio.removeAllListeners();
        }
      } 

      if (this.currentlyPlayingAudio.type == audioType.shows) {
        this.shows[this.currentlyPlayingAudio.id].audio.pause();
        
        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.shows[this.currentlyPlayingAudio.id].audio.currentTime = 0;
          this.shows[this.currentlyPlayingAudio.id].audio.removeAllListeners();
        }
      } 
    }
    this.mediaSessionFunc(audio_Type, audio_array_id);

    return new Promise<any> ((resolve, reject) => {
      switch (audio_Type) {
        case audioType.radio:
          this.radio.loadingState = true;
          this.radio.isPlaying = false;

          this.radio.timingInterval = setInterval(()=> {
            this.radio.currentTime = this.audioTiming(this.radio.audio.currentTime);
            this.radio.duration = this.audioTiming(this.radio.audio.duration);
          }, 500);
        
          this.radio.audio.play().then(
            (res: any) => {
              this.currentlyPlayingAudio.playingAudio = this.radio.audio;
              this.currentlyPlayingAudio.type = audio_Type;

              this.radio.isPlaying = true;
              this.radio.loadingState = false;
              if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: "Tesa Radio",
                  artist: 'Team Tesa',
                  album: "Team Tesa Radio",
                  artwork: [
                    { src: '/assets/images/radiomic.png', sizes: '512x512', type: 'image/png' },
                  ]
                });
              
                // TODO: Update playback state.
                navigator.mediaSession.playbackState = 'playing';
              };

              // this.radio.audio.addEventListener("play", () => {
              //   navigator.mediaSession.playbackState = 'playing';
              // });
              
              this.radio.audio.addEventListener("ended", () => {
                // navigator.mediaSession.playbackState = 'paused';
                this.radio.isPlaying = false;
                this.radio.loadingState = false;
                this.radio.audio.currentTime = 0;
                this.radio.audio.removeAllListeners;
                clearInterval(this.radio.timingInterval);
              });

              this.radio.audio.addEventListener("pause", () => {
                this.radio.isPlaying = false;
                this.radio.loadingState = false;
                clearInterval(this.radio.timingInterval);
                // navigator.mediaSession.playbackState = 'paused';
              });
              
              resolve(this.radio);
            },
            (err: any) => {
              this.radio.audio.load();
              reject(err);
            }
          );

          break;
        case audioType.podcast:
          this.podcasts[audio_array_id].isPlaying = false;
          this.podcasts[audio_array_id].loadingState = true;

          this.podcasts[audio_array_id].timingInterval = setInterval(()=> {
            this.podcasts[audio_array_id].currentTime = this.audioTiming(this.podcasts[audio_array_id].audio.currentTime);
            this.podcasts[audio_array_id].duration = this.audioTiming(this.podcasts[audio_array_id].audio.duration);

            this.podcasts[audio_array_id].seekAudioRangeValue = this.podcasts[audio_array_id].audio.currentTime * (100 / this.podcasts[audio_array_id].audio.duration);
          }, 500);

          this.podcasts[audio_array_id].audio.play().then(
            (res: any) => {
              this.currentlyPlayingAudio.type = audio_Type;
              this.currentlyPlayingAudio.playingAudio = this.podcasts[audio_array_id].audio;
              this.currentlyPlayingAudio.id = audio_array_id;

              this.podcasts[audio_array_id].isPlaying = true;
              this.podcasts[audio_array_id].loadingState = false;
              if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: this.podcasts[audio_array_id].title || "Tesa Radio",
                  artist: 'Tesa Radio',
                  album: this.podcasts[audio_array_id].category,
                  artwork: [
                    { src: this.podcasts[audio_array_id].image || '/assets/images/radiomic.png', sizes: '512x512', type: 'image/png' },
                  ]
                });
              
                // TODO: Update playback state.
                navigator.mediaSession.playbackState = 'playing';
              };

              this.podcasts[audio_array_id].audio.addEventListener("ended", () => {
                this.podcasts[audio_array_id].isPlaying = false;
                this.podcasts[audio_array_id].loadingState = false;
                this.podcasts[audio_array_id].audio.currentTime = 0;
                clearInterval(this.podcasts[audio_array_id].timingInterval);
              });

              this.podcasts[audio_array_id].audio.addEventListener("pause", () => {
                this.podcasts[audio_array_id].isPlaying = false;
                this.podcasts[audio_array_id].loadingState = false;
                clearInterval(this.podcasts[audio_array_id].timingInterval);
              });
              
              resolve(this.podcasts[audio_array_id]);
            },
            (err: any) => {
              this.podcasts[audio_array_id].audio.load();
              reject(err);
            }
          );
      
          break;
        case audioType.shows:
          this.shows[audio_array_id].isPlaying = false;
          this.shows[audio_array_id].loadingState = true;

          this.shows[audio_array_id].timingInterval = setInterval(()=> {
            this.shows[audio_array_id].currentTime = this.audioTiming(this.shows[audio_array_id].audio.currentTime);
            this.shows[audio_array_id].duration = this.audioTiming(this.shows[audio_array_id].audio.duration);

            this.shows[audio_array_id].seekAudioRangeValue = this.shows[audio_array_id].audio.currentTime * (100 / this.shows[audio_array_id].audio.duration);
          }, 500);

          this.shows[audio_array_id].audio.play().then(
            (res: any) => {
              this.currentlyPlayingAudio.type = audio_Type;
              this.currentlyPlayingAudio.playingAudio = this.shows[audio_array_id].audio;
              this.currentlyPlayingAudio.id = audio_array_id;

              this.shows[audio_array_id].isPlaying = true;
              this.shows[audio_array_id].loadingState = false;
              if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: this.shows[audio_array_id].title || "Tesa Radio",
                  artist: 'Tesa Radio',
                  album: this.shows[audio_array_id].category,
                  artwork: [
                    { src: this.shows[audio_array_id].image || '/assets/images/shows.jpg', sizes: '512x512', type: 'image/png' },
                  ]
                });
              
                navigator.mediaSession.playbackState = 'playing';
              };
              
              this.shows[audio_array_id].audio.addEventListener("ended", () => {
                this.shows[audio_array_id].isPlaying = false;
                this.shows[audio_array_id].loadingState = false;
                this.shows[audio_array_id].audio.currentTime = 0;
                clearInterval(this.shows[audio_array_id].timingInterval);
              });

              this.shows[audio_array_id].audio.addEventListener("pause", () => {
                this.shows[audio_array_id].isPlaying = false;
                this.shows[audio_array_id].loadingState = false;
                clearInterval(this.shows[audio_array_id].timingInterval);
              });
              
              resolve(this.shows[audio_array_id]);
            },
            (err: any) => {
              this.shows[audio_array_id].audio.load();
              reject(err);
            }
          );

          break;
        default:
          this.currentlyPlayingAudio.playingAudio.play().then(
            (res: any) => {
              this.currentlyPlayingAudio.id = audio_array_id;

              // this.radio.audio.addEventListener("playing", () => {
              //   this.currentlyPlayingAudio.isPlaying = true;
              //   this.currentlyPlayingAudio.loadingState = false;
              // });

              // this.radio.audio.addEventListener("ended", () => {
              //   this.currentlyPlayingAudio.isPlaying = false;
              //   this.currentlyPlayingAudio.loadingState = false;
              //   this.currentlyPlayingAudio.playingAudio.currentTime = 0;
              // });

              // this.radio.audio.addEventListener("pause", () => {
              //   this.currentlyPlayingAudio.isPlaying = false;
              //   this.currentlyPlayingAudio.loadingState = false;
              // });
              
              resolve(this.currentlyPlayingAudio);
            },
            (err: any) => {
              this.currentlyPlayingAudio.playingAudio.load();
              reject(this.currentlyPlayingAudio);
            }
          );

          break;
      };
    });
  }

  pause(audio_Type: audioType, audio_array_id: any) {
    this.currentlyPlayingAudio.type = audio_Type;
    this.currentlyPlayingAudio.id = audio_array_id;
    // this.currentlyPlayingAudio.isPlaying = false;

    return new Promise<any> ((resolve, reject) => {
      switch (audio_Type) {
        case audioType.radio:
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = 'paused';
          }

          this.radio.audio.pause();
          clearInterval(this.radio.timingInterval);
          if (this.radio.audio.paused) {
            // this.currentlyPlayingAudio.playingAudio = this.radio.audio;
            this.radio.isPlaying = false;

            resolve(this.radio);
          } else {
            reject(this.radio);
          }

          break;
      
        case audioType.podcast:
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = 'playing';
          }

          clearInterval(this.podcasts[audio_array_id].timingInterval);
          this.podcasts[audio_array_id].audio.pause();
          if (this.podcasts[audio_array_id].audio.paused) {
            this.currentlyPlayingAudio.playingAudio = this.podcasts[audio_array_id].audio;
            this.podcasts[audio_array_id].isPlaying = false;

            resolve(this.podcasts[audio_array_id]);
          } else {
            reject(this.podcasts[audio_array_id]);
          };

          break;
      
        case audioType.shows:
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = 'playing';
          }

          clearInterval(this.shows[audio_array_id].timingInterval);
          this.shows[audio_array_id].audio.pause();
          if (this.shows[audio_array_id].audio.paused) {
            this.currentlyPlayingAudio.playingAudio = this.shows[audio_array_id].audio;
            this.shows[audio_array_id].isPlaying = false;

            resolve(this.shows[audio_array_id]);
          } else {
            reject(this.shows[audio_array_id]);
          };

          break;
      
        default:
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = 'paused';
          }

          if (this.currentlyPlayingAudio.playingAudio) {
            this.currentlyPlayingAudio.playingAudio.pause();
            if (this.currentlyPlayingAudio.playingAudio.paused) {
              resolve(this.currentlyPlayingAudio);
            } else {
              reject(this.currentlyPlayingAudio);
            }
          }

          break;
      }
    });
  }

  mediaSessionFunc(audio_Type: audioType, audio_array_id: any) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler('play', async () => {
        // Resume playback
        // navigator.mediaSession.playbackState = 'playing';
        this.play(audio_Type, audio_array_id);
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        // Pause active playback
        // navigator.mediaSession.playbackState = 'paused';
        this.pause(audio_Type, audio_array_id);
      });
    }
   
  }

  seekAudioRangeChange(ev: Event, id: string, audio_type: "shows" | "podcast") {
    // console.log(ev);
    // let lastEmittedValue: RangeValue = (ev as RangeCustomEvent).detail.value;
    let lastEmittedValue: any = (ev as RangeCustomEvent).detail.value;

    if (audio_type == audioType.podcast) {
      const i = this.podcasts.findIndex(e => e.id == id);
      const current_time = this.podcasts[i].audio.duration * (lastEmittedValue / 100);

      // // this is for seek
      this.podcasts[i].audio.currentTime = current_time;
    }
    
    if (audio_type == audioType.shows) {
      const i = this.shows.findIndex(e => e.id == id);
      const current_time = this.shows[i].audio.duration * (lastEmittedValue / 100);

      // // this is for seek
      this.shows[i].audio.currentTime = current_time;
    }

  }

  audioTiming(timing: any) {
    var seconds: any = Math.floor(timing % 60);
    var foo = timing - seconds;
    var min: any = foo / 60;
    var minutes: any = Math.floor(min % 60);
    var hours: any = Math.floor(min / 60);

    if(seconds < 10){
      seconds = "0" + seconds.toString();
    }

    if(minutes < 10){
      minutes = "0" + minutes.toString();
    }

    if(hours < 10){
      hours = "0" + hours.toString();
    }

    if(hours > 0){
      return hours + ":" + minutes + ":" + seconds;
    } else {
      return minutes + ":" + seconds;
    }
  }
  
}






// playWaveSurfer(audio_Type: audioType, audio_array_id: any) {
//   if (this.currentlyPlayingAudio.playingAudio) {
//     if (this.currentlyPlayingAudio.type == audioType.radio) {
//       this.radio.wave_surfer.pause();

//       if (this.currentlyPlayingAudio.type != audio_Type) {
//         this.radio.wave_surfer.stop();
//         // this.radio.wave_surfer.setCurrentTime(0);
//         // this.radio.wave_surfer. .removeAllListeners;
//       }
//     } 

//     if (this.currentlyPlayingAudio.type == audioType.podcast) {
//       this.podcasts[this.currentlyPlayingAudio.id].wave_surfer.pause();

//       if (this.currentlyPlayingAudio.type != audio_Type) {
//         this.podcasts[this.currentlyPlayingAudio.id].wave_surfer.stop();
//         // this.podcasts[this.currentlyPlayingAudio.id].wave_surfer.setCurrentTime(0);
//         // this.podcasts[this.currentlyPlayingAudio.id].wave_surfer. .removeAllListeners();
//       }
//     } 

//     if (this.currentlyPlayingAudio.type == audioType.shows) {
//       this.shows[this.currentlyPlayingAudio.id].wave_surfer.pause();
      
//       if (this.currentlyPlayingAudio.type != audio_Type) {
//         this.shows[this.currentlyPlayingAudio.id].wave_surfer.stop();
//         // this.shows[this.currentlyPlayingAudio.id].wave_surfer.setCurrentTime(0);
//         // this.shows[this.currentlyPlayingAudio.id].wave_surfer. .removeAllListeners();
//       }
//     } 
//   }
//   this.mediaSessionFunc(audio_Type, audio_array_id);

//   return new Promise<any> ((resolve, reject) => {
//     switch (audio_Type) {
//       case audioType.radio:
//         this.radio.loadingState = true;
//         this.radio.isPlaying = false;
      
//         this.radio.wave_surfer.play().then(
//           (res: any) => {
//             this.currentlyPlayingAudio.playingAudio = this.radio.wave_surfer;
//             this.currentlyPlayingAudio.type = audio_Type;

//             this.radio.isPlaying = true;
//             this.radio.loadingState = false;
//             if ("mediaSession" in navigator) {
//               navigator.mediaSession.metadata = new MediaMetadata({
//                 title: "Tesa Radio",
//                 artist: 'Team Tesa',
//                 album: "Team Tesa Radio",
//                 artwork: [
//                   { src: '/assets/images/radiomic.png', sizes: '512x512', type: 'image/png' },
//                 ]
//               });
            
//               // TODO: Update playback state.
//               navigator.mediaSession.playbackState = 'playing';
//             };

//             this.radio.wave_surfer.on('finish', ()=> {
//               this.radio.wave_surfer.setCurrentTime(0);
//               this.radio.wave_surfer.stop();
//               this.radio.isPlaying = this.radio.wave_surfer.isPlaying() || false;
//               this.radio.loadingState = false;
//             });

//             this.radio.wave_surfer.on('pause', ()=> {
//               this.radio.isPlaying = this.radio.wave_surfer.isPlaying() || false;
//               this.radio.loadingState = false;
//             });

//             // this.radio.wave_surfer.on('play', ()=> {
//             //   audioObj.isPlaying = this.radio.wave_surfer.isPlaying();
//             // });
            
//             resolve(this.radio);
//           },
//           (err: any) => {
//             this.radio.wave_surfer.load(this.radio.src);
//             reject(err);
//           }
//         );

//         break;
//       case audioType.podcast:
//         this.podcasts[audio_array_id].isPlaying = false;
//         this.podcasts[audio_array_id].loadingState = true;

//         this.podcasts[audio_array_id].wave_surfer.play().then(
//           (res: any) => {
//             this.currentlyPlayingAudio.type = audio_Type;
//             this.currentlyPlayingAudio.playingAudio = this.podcasts[audio_array_id].wave_surfer;
//             this.currentlyPlayingAudio.id = audio_array_id;

//             this.podcasts[audio_array_id].isPlaying = true;
//             this.podcasts[audio_array_id].loadingState = false;
//             if ("mediaSession" in navigator) {
//               navigator.mediaSession.metadata = new MediaMetadata({
//                 title: this.podcasts[audio_array_id].title || "Tesa Radio",
//                 artist: 'Tesa Radio',
//                 album: this.podcasts[audio_array_id].category,
//                 artwork: [
//                   { src: this.podcasts[audio_array_id].image || '/assets/images/radiomic.png', sizes: '512x512', type: 'image/png' },
//                 ]
//               });
            
//               // TODO: Update playback state.
//               navigator.mediaSession.playbackState = 'playing';
//             };

//             this.podcasts[audio_array_id].wave_surfer.on('finish', ()=> {
//               this.podcasts[audio_array_id].wave_surfer.setCurrentTime(0);
//               this.podcasts[audio_array_id].wave_surfer.stop();
//               this.podcasts[audio_array_id].isPlaying = this.podcasts[audio_array_id].wave_surfer.isPlaying() || false;
//               this.podcasts[audio_array_id].loadingState = false;
//             });

//             this.podcasts[audio_array_id].wave_surfer.on('pause', ()=> {
//               this.podcasts[audio_array_id].isPlaying = this.podcasts[audio_array_id].wave_surfer.isPlaying() || false;
//               this.podcasts[audio_array_id].loadingState = false;
//             });
            
//             resolve(this.podcasts[audio_array_id]);
//           },
//           (err: any) => {
//             this.podcasts[audio_array_id].wave_surfer.load(this.podcasts[audio_array_id].src);
//             reject(err);
//           }
//         );
    
//         break;
//       case audioType.shows:
//         this.shows[audio_array_id].isPlaying = false;
//         this.shows[audio_array_id].loadingState = true;

//         this.shows[audio_array_id].wave_surfer.play();

//         resolve(this.shows[audio_array_id]);

//         break;
//       default:
//         this.currentlyPlayingAudio.playingAudio.play().then(
//           (res: any) => {
//             this.currentlyPlayingAudio.id = audio_array_id;

//             resolve(this.currentlyPlayingAudio);
//           },
//           (err: any) => {
//             // this.currentlyPlayingAudio.playingAudio.load();
//             reject(this.currentlyPlayingAudio);
//           }
//         );

//         break;
//     };
//   });
// }

// pauseWaveSurfer(audio_Type: audioType, audio_array_id: any) {
//   this.currentlyPlayingAudio.type = audio_Type;
//   this.currentlyPlayingAudio.id = audio_array_id;
//   // this.currentlyPlayingAudio.isPlaying = false;

//   return new Promise<any> ((resolve, reject) => {
//     switch (audio_Type) {
//       case audioType.radio:
//         if ("mediaSession" in navigator) {
//           navigator.mediaSession.playbackState = 'paused';
//         }

//         this.radio.wave_surfer.pause();
//         this.radio.isPlaying = false;
//         resolve(this.radio);

//         // if (this.radio.wave_surfer.paused) {
//         //   // this.currentlyPlayingAudio.playingAudio = this.radio.audio;
//         // } else {
//         //   reject(this.radio);
//         // }

//         break;
    
//       case audioType.podcast:
//         if ("mediaSession" in navigator) {
//           navigator.mediaSession.playbackState = 'playing';
//         }

//         this.podcasts[audio_array_id].wave_surfer.pause();
//         this.currentlyPlayingAudio.playingAudio = this.podcasts[audio_array_id].wave_surfer;
//         this.podcasts[audio_array_id].isPlaying = false;
//         resolve(this.podcasts[audio_array_id]);

//         // if (this.podcasts[audio_array_id].wave_surfer.paused) {
//         // } else {
//         //   reject(this.podcasts[audio_array_id]);
//         // };

//         break;
    
//       case audioType.shows:
//         if ("mediaSession" in navigator) {
//           navigator.mediaSession.playbackState = 'playing';
//         }

//         this.shows[audio_array_id].wave_surfer.pause();
//         this.currentlyPlayingAudio.playingAudio = this.shows[audio_array_id].wave_surfer;
//         this.shows[audio_array_id].isPlaying = false;
//         resolve(this.shows[audio_array_id]);

//         // if (this.shows[audio_array_id].wave_surfer.paused) {
//         // } else {
//         //   reject(this.shows[audio_array_id]);
//         // };

//         break;
    
//       default:
//         if ("mediaSession" in navigator) {
//           navigator.mediaSession.playbackState = 'paused';
//         }

//         if (this.currentlyPlayingAudio.playingAudio) {
//           this.currentlyPlayingAudio.playingAudio.pause();
//           if (this.currentlyPlayingAudio.playingAudio.paused) {
//             resolve(this.currentlyPlayingAudio);
//           } else {
//             reject(this.currentlyPlayingAudio);
//           }
//         }

//         break;
//     }
//   });
// }


  // waveSurferFunc(wave_surferObj: any, audioObj: any) {
  //   // this.wave_surfer.load("assets/audio.mp3");

  //   wave_surferObj.on('ready', ()=> {
  //     audioObj.loadingState = false;
  //     // wave_surferObj.play();
  //     audioObj.playbackRate = wave_surferObj.getPlaybackRate();
  //   });

  //   // console.log(wave_surferObj);
    

  //   wave_surferObj.on('audioprocess', ()=> {
  //     audioObj.playbackRate = wave_surferObj.getPlaybackRate();
  //     audioObj.isPlaying = wave_surferObj.isPlaying();
  //   });

  //   wave_surferObj.on('error', ()=> {
  //     wave_surferObj.stop();
  //     audioObj.isPlaying = wave_surferObj.isPlaying();
  //   });

  //   wave_surferObj.on('finish', ()=> {
  //     wave_surferObj.stop();
  //     audioObj.isPlaying = wave_surferObj.isPlaying();
  //   });

  //   wave_surferObj.on('pause', ()=> {
  //     audioObj.isPlaying = wave_surferObj.isPlaying();
  //   });

  //   wave_surferObj.on('play', ()=> {
  //     audioObj.isPlaying = wave_surferObj.isPlaying();
  //   });

  //   // wave_surferObj.on('seek', ()=> {
  //   //   wave_surferObj.play();
  //   // });

  // }
