import { Injectable } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { audiosInterface, audioType, lastPlayedz_ } from 'src/modelInterface';
import { FirebaseService } from './firebase.service';
import { ResourcesService } from './resources.service';


@Injectable({
  providedIn: 'root'
})
export class AudioService {
  currentlyPlayingAudio = {
    type: <audioType> '', // radio || podcast || shows
    playingAudio: <any> null,
    id: <any> null,

    _id: <string> '',
    ref_id: <string> '',
    // audio: <any> null,
    currentTime: <any> null,
    duration: <any> null,
    timingInterval: <any> null,
    seekAudioRangeValue: <any> null,
    title: <string> '',
    description: <string> '',
    image: <string> '',
    src: <string> '',
    isPlaying: <boolean> false,
    loadingState: <boolean> false,
    index: <number> 0.1,
  }

  radio = {
    src: <string> '',
    audio: new Audio("https://stream.zeno.fm/1z937nxzhchvv"),

    timingInterval: <any> '',
    currentTime: <any> '',
    duration: <any> '',
    playbackRate: null,
    loadingState: <boolean> true, 
    isPlaying: <boolean> false,
  };
  podcasts: audiosInterface[] = [];
  shows: audiosInterface[] = [];
  lastPlayed: lastPlayedz_[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private resourcesService: ResourcesService
  ) { }


  getRadio() {
    const playRadio = () => {
      this.radio.audio.load();

      const setRadioPlayInterval = setInterval(() => {
        if (this.radio.loadingState) {
          if (this.radio.audio.readyState) {
            this.radio.loadingState = false;
          }
    
          if (this.radio.audio.readyState > 1) {
            this.radio.loadingState = false;
            this.play(audioType.radio, '');
          }
        }
      }, 500);

      this.radio.audio.addEventListener("playing", () => {
        this.radio.loadingState = this.currentlyPlayingAudio.loadingState = false;
        this.radio.isPlaying = this.currentlyPlayingAudio.isPlaying = true;

        clearInterval(setRadioPlayInterval);

        this.currentlyPlayingAudio.playingAudio = this.radio.audio;
        this.currentlyPlayingAudio.type = audioType.radio;
      });
    };

    this.firebaseService.getFirestoreDocumentData("appData", "radio").then(
      (res: any) => {
        // console.log(res);
        this.radio.src = res.streamUrl;
        this.radio.audio = new Audio(res.streamUrl);
        
        this.resourcesService.setLocalStorage("radioStreamUrl", { ...this.radio, ...res} );
        playRadio();
      },
      (err: any) => {
        console.log(err);

        this.resourcesService.getLocalStorage("radioStreamUrl").then(
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
    ).finally(() => {

    });
  }

  play(audio_Type: audioType, audio_array_id: any) {
    if (this.currentlyPlayingAudio.playingAudio) {
      if (this.currentlyPlayingAudio.type == audioType.radio) {
        this.radio.audio.pause();
        this.currentlyPlayingAudio.playingAudio.pause();

        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.radio.audio.currentTime = 0;
          this.currentlyPlayingAudio.playingAudio.currentTime = 0;
          this.radio.audio.removeAllListeners;
        }
      } 

      if (this.currentlyPlayingAudio.type == audioType.podcast) {
        this.podcasts[this.currentlyPlayingAudio.id].audio.pause();
        this.currentlyPlayingAudio.playingAudio.pause();

        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.podcasts[this.currentlyPlayingAudio.id].audio.currentTime = 0;
          this.currentlyPlayingAudio.playingAudio.currentTime = 0;
          this.podcasts[this.currentlyPlayingAudio.id].audio.removeAllListeners();
        }
      } 

      if (this.currentlyPlayingAudio.type == audioType.shows) {
        this.shows[this.currentlyPlayingAudio.id].audio.pause();
        this.currentlyPlayingAudio.playingAudio.pause();
        
        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.shows[this.currentlyPlayingAudio.id].audio.currentTime = 0;
          this.currentlyPlayingAudio.playingAudio.currentTime = 0;
          this.shows[this.currentlyPlayingAudio.id].audio.removeAllListeners();
        }
      } 

      if (this.currentlyPlayingAudio.type == audioType.lastPlayed) {
        this.lastPlayed[this.currentlyPlayingAudio.id].audio.pause();
        this.currentlyPlayingAudio.playingAudio.pause();
        
        if (this.currentlyPlayingAudio.type != audio_Type) {
          this.lastPlayed[this.currentlyPlayingAudio.id].audio.currentTime = 0;
          this.currentlyPlayingAudio.playingAudio.currentTime = 0;
          this.lastPlayed[this.currentlyPlayingAudio.id].audio.removeAllListeners();
        }
      } 
    }
    this.mediaSessionFunc(audio_Type, audio_array_id);

    return new Promise<any> ((resolve, reject) => {
      switch (audio_Type) {
        case audioType.radio:
          this.radio.loadingState = this.currentlyPlayingAudio.loadingState = true;
          this.radio.isPlaying = this.currentlyPlayingAudio.isPlaying = false;
          this.currentlyPlayingAudio.src = this.radio.src;
          this.currentlyPlayingAudio._id = 'Tesa Radio';

          // this.radio.timingInterval = setInterval(()=> {
          //   this.radio.currentTime = this.audioTiming(this.radio.audio.currentTime);
          //   this.radio.duration = this.audioTiming(this.radio.audio.duration);
          // }, 500);

          this.currentlyPlayingAudio.playingAudio = this.radio.audio;
          this.currentlyPlayingAudio.type = audio_Type;
        
          this.radio.audio.play().then(
            (res: any) => {
              this.radio.loadingState = this.currentlyPlayingAudio.loadingState = false;
              this.radio.isPlaying = this.currentlyPlayingAudio.isPlaying = true;
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
                this.radio.loadingState = this.currentlyPlayingAudio.loadingState = false;
                this.radio.isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.radio.audio.currentTime = 0;
                this.radio.audio.removeAllListeners;
                clearInterval(this.radio.timingInterval);
              });

              this.radio.audio.addEventListener("pause", () => {
                this.radio.loadingState = this.currentlyPlayingAudio.loadingState = false;
                this.radio.isPlaying = this.currentlyPlayingAudio.isPlaying = false;
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
          this.podcasts[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
          this.podcasts[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = true;
          this.setLastPlayed(this.podcasts[audio_array_id]);

          this.podcasts[audio_array_id].timingInterval = this.currentlyPlayingAudio.timingInterval = setInterval(()=> {
            this.podcasts[audio_array_id].currentTime = this.currentlyPlayingAudio.currentTime = this.audioTiming(this.podcasts[audio_array_id].audio.currentTime);
            this.podcasts[audio_array_id].duration = this.currentlyPlayingAudio.duration = this.audioTiming(this.podcasts[audio_array_id].audio.duration);

            this.podcasts[audio_array_id].seekAudioRangeValue = this.currentlyPlayingAudio.seekAudioRangeValue = this.podcasts[audio_array_id].audio.currentTime * (100 / this.podcasts[audio_array_id].audio.duration);
          }, 500);

          this.currentlyPlayingAudio.type = audio_Type;
          this.currentlyPlayingAudio.playingAudio = this.podcasts[audio_array_id].audio;
          this.currentlyPlayingAudio.id = audio_array_id;
          this.currentlyPlayingAudio._id = this.podcasts[audio_array_id].id;
          this.currentlyPlayingAudio.ref_id = this.podcasts[audio_array_id].ref_id;
          this.currentlyPlayingAudio.image = this.podcasts[audio_array_id].image;
          this.currentlyPlayingAudio.src = this.podcasts[audio_array_id].src;
          this.currentlyPlayingAudio.title = this.podcasts[audio_array_id].title;
          this.currentlyPlayingAudio.description = this.podcasts[audio_array_id].description;

          this.podcasts[audio_array_id].audio.play().then(
            (res: any) => {
              this.podcasts[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = true;
              this.podcasts[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;

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
                this.podcasts[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.podcasts[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;
                this.podcasts[audio_array_id].audio.currentTime = this.currentlyPlayingAudio.currentTime = 0;
                clearInterval(this.podcasts[audio_array_id].timingInterval);
                clearInterval(this.currentlyPlayingAudio.timingInterval);
              });

              this.podcasts[audio_array_id].audio.addEventListener("pause", () => {
                this.podcasts[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.podcasts[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;
                clearInterval(this.podcasts[audio_array_id].timingInterval);
                clearInterval(this.currentlyPlayingAudio.timingInterval);
              });

              // update the play stats
              this.updateAudioPlayStat_n_interations(this.podcasts[audio_array_id].id);
              
              resolve(this.podcasts[audio_array_id]);
            },
            (err: any) => {
              this.podcasts[audio_array_id].audio.load();
              reject(err);
            }
          );
      
          break;
        case audioType.shows:
          this.shows[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
          this.shows[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = true;
          this.setLastPlayed(this.shows[audio_array_id]);

          this.shows[audio_array_id].timingInterval = this.currentlyPlayingAudio.timingInterval = setInterval(()=> {
            this.shows[audio_array_id].currentTime = this.currentlyPlayingAudio.currentTime = this.audioTiming(this.shows[audio_array_id].audio.currentTime);
            this.shows[audio_array_id].duration = this.currentlyPlayingAudio.duration = this.audioTiming(this.shows[audio_array_id].audio.duration);

            this.shows[audio_array_id].seekAudioRangeValue = this.currentlyPlayingAudio.seekAudioRangeValue = this.shows[audio_array_id].audio.currentTime * (100 / this.shows[audio_array_id].audio.duration);
          }, 500);

          this.currentlyPlayingAudio.type = audio_Type;
          this.currentlyPlayingAudio.playingAudio = this.shows[audio_array_id].audio;
          this.currentlyPlayingAudio.id = audio_array_id;
          this.currentlyPlayingAudio._id = this.shows[audio_array_id].id;
          this.currentlyPlayingAudio.ref_id = this.shows[audio_array_id].ref_id;
          this.currentlyPlayingAudio.image = this.shows[audio_array_id].image;
          this.currentlyPlayingAudio.src = this.shows[audio_array_id].src;
          this.currentlyPlayingAudio.title = this.shows[audio_array_id].title;
          this.currentlyPlayingAudio.description = this.shows[audio_array_id].description;

          this.shows[audio_array_id].audio.play().then(
            (res: any) => {
              this.shows[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = true;
              this.shows[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;

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
                this.podcasts[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.podcasts[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;
                this.podcasts[audio_array_id].audio.currentTime = this.currentlyPlayingAudio.currentTime = 0;
                clearInterval(this.podcasts[audio_array_id].timingInterval);
                clearInterval(this.currentlyPlayingAudio.timingInterval);
              });

              this.shows[audio_array_id].audio.addEventListener("pause", () => {
                this.shows[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.shows[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;
                clearInterval(this.shows[audio_array_id].timingInterval);
                clearInterval(this.currentlyPlayingAudio.timingInterval);
              });
              
              // update the play stats
              this.updateAudioPlayStat_n_interations(this.shows[audio_array_id].id);

              resolve(this.shows[audio_array_id]);
            },
            (err: any) => {
              this.shows[audio_array_id].audio.load();
              reject(err);
            }
          );

          break;
        case audioType.lastPlayed:
          this.lastPlayed[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
          this.lastPlayed[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = true;
          this.setLastPlayed(this.lastPlayed[audio_array_id]);

          this.lastPlayed[audio_array_id].timingInterval = this.currentlyPlayingAudio.timingInterval = setInterval(()=> {
            this.lastPlayed[audio_array_id].currentTime = this.currentlyPlayingAudio.currentTime = this.audioTiming(this.lastPlayed[audio_array_id].audio.currentTime);
            this.lastPlayed[audio_array_id].duration = this.currentlyPlayingAudio.duration = this.audioTiming(this.lastPlayed[audio_array_id].audio.duration);

            this.lastPlayed[audio_array_id].seekAudioRangeValue = this.currentlyPlayingAudio.seekAudioRangeValue = this.lastPlayed[audio_array_id].audio.currentTime * (100 / this.lastPlayed[audio_array_id].audio.duration);
          }, 500);

          this.currentlyPlayingAudio.type = audio_Type;
          this.currentlyPlayingAudio.playingAudio = this.lastPlayed[audio_array_id].audio;
          this.currentlyPlayingAudio.id = audio_array_id;
          this.currentlyPlayingAudio._id = this.lastPlayed[audio_array_id].id;
          // this.currentlyPlayingAudio.ref_id = this.lastPlayed[audio_array_id].ref_id;
          // this.currentlyPlayingAudio.image = this.lastPlayed[audio_array_id].image;
          this.currentlyPlayingAudio.src = this.lastPlayed[audio_array_id].src;
          this.currentlyPlayingAudio.title = this.lastPlayed[audio_array_id].title;
          this.currentlyPlayingAudio.description = this.lastPlayed[audio_array_id].description;

          this.lastPlayed[audio_array_id].audio.play().then(
            (res: any) => {
              this.lastPlayed[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = true;
              this.lastPlayed[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;

              if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: this.lastPlayed[audio_array_id].title || "Tesa Radio",
                  artist: 'Tesa Radio',
                  album: this.lastPlayed[audio_array_id].type,
                  artwork: [
                    { src: this.lastPlayed[audio_array_id].image || '/assets/images/shows.jpg', sizes: '512x512', type: 'image/png' },
                  ]
                });
              
                navigator.mediaSession.playbackState = 'playing';
              };
              
              this.lastPlayed[audio_array_id].audio.addEventListener("ended", () => {
                this.podcasts[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.podcasts[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;
                this.podcasts[audio_array_id].audio.currentTime = this.currentlyPlayingAudio.currentTime = 0;
                clearInterval(this.podcasts[audio_array_id].timingInterval);
                clearInterval(this.currentlyPlayingAudio.timingInterval);
              });

              this.lastPlayed[audio_array_id].audio.addEventListener("pause", () => {
                this.lastPlayed[audio_array_id].isPlaying = this.currentlyPlayingAudio.isPlaying = false;
                this.lastPlayed[audio_array_id].loadingState = this.currentlyPlayingAudio.loadingState = false;
                clearInterval(this.lastPlayed[audio_array_id].timingInterval);
                clearInterval(this.currentlyPlayingAudio.timingInterval);
              });
              
              // update the play stats
              this.updateAudioPlayStat_n_interations(this.lastPlayed[audio_array_id].id);

              resolve(this.lastPlayed[audio_array_id]);
            },
            (err: any) => {
              this.lastPlayed[audio_array_id].audio.load();
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
        case audioType.lastPlayed:
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = 'playing';
          }

          clearInterval(this.lastPlayed[audio_array_id].timingInterval);
          this.lastPlayed[audio_array_id].audio.pause();
          if (this.lastPlayed[audio_array_id].audio.paused) {
            this.currentlyPlayingAudio.playingAudio = this.lastPlayed[audio_array_id].audio;
            this.lastPlayed[audio_array_id].isPlaying = false;

            resolve(this.lastPlayed[audio_array_id]);
          } else {
            reject(this.lastPlayed[audio_array_id]);
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

  async setLastPlayed(_lastPlayed: any) {
    // console.log(_lastPlayed);
    // THIS LINE OF CODE DELETES THE LIST properties OF THE OBJECT AND
    // CREATES A NEW OBJECT CALLED newLastPlayed;
    _lastPlayed.isPlaying = false;
    const { playStat, audio, loadingState, timingInterval, seekAudioRangeValue, lastVisible, ...newLastPlayed } = _lastPlayed;
    // console.log(newLastPlayed);

    let last_playedz: any[] = [];
    const localStoredLastPlayed: any = await this.resourcesService.getLocalStorage("lastPlayed");

    if (localStoredLastPlayed) {
      const isDuplicate = localStoredLastPlayed.some((item: any) => item.id === newLastPlayed.id && item.ref_id === newLastPlayed.ref_id);
      
      if (isDuplicate) {
        return;
      } else {
        last_playedz.unshift(newLastPlayed);
        last_playedz = [ ...last_playedz, ...localStoredLastPlayed ];
      }
    } else {
      last_playedz.unshift(newLastPlayed);
    }

    this.resourcesService.setLocalStorage("lastPlayed", last_playedz.slice(0, 9));
  }

  updateAudioPlayStat_n_interations(id: string) {
    this.firebaseService.getFirestoreDocumentData("audios", id).then(
      (res: any) => {
        // console.log(res);
        this.firebaseService.updateFirestoreData("audios", res.id, { lastInteraction: Date.now(), playStat: res.playStat + 1 });
      }
    )
  }

  updateShowPodcastPlayStat_n_interations(id: string, type: "podcast" | "shows") {
    let path = '';
    if (type == "podcast") {
      path = "podcasts";
    }
    if (type == "shows") {
      path = "shows";
    }

    if (path === '') return;

    this.firebaseService.getFirestoreDocumentData(path, id).then(
      (mainRes: any) => {
        // console.log(mainRes);

        this.firebaseService.countFirestoreDocs("audios", { property: "ref_id", condition: '==', value: mainRes.id}).then(
          (countRes: any) => {
            // console.log(countRes);
  
            let data2update = {
              episodes: countRes,
              lastInteraction: Date.now(),
              viewStat: Number(mainRes.viewStat) + 1
            }
            this.firebaseService.updateFirestoreData(path, mainRes.id, data2update);
          }
        );

      }
    );
  }

}
