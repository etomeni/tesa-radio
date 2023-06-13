"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomePage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var toastState;
(function (toastState) {
    toastState["Success"] = "Success";
    toastState["Error"] = "Error";
    toastState["Warning"] = "Warning";
    toastState["Info"] = "Info";
})(toastState || (toastState = {}));
;
var audioType;
(function (audioType) {
    audioType["radio"] = "radio";
    audioType["podcast"] = "podcast";
    audioType["shows"] = "shows";
})(audioType || (audioType = {}));
;
var HomePage = /** @class */ (function () {
    function HomePage(resourcesService, firebaseService, audioService) {
        this.resourcesService = resourcesService;
        this.firebaseService = firebaseService;
        this.audioService = audioService;
        this.swiperModules = [angular_1.IonicSlides];
        this.swiperBreakPoints = {
            50: {
                slidesPerView: 1.2
            },
            168: {
                slidesPerView: 1.8
            },
            300: {
                slidesPerView: 2.4
            },
            540: {
                slidesPerView: 3.3
            },
            720: {
                slidesPerView: 4.3
            },
            960: {
                slidesPerView: 5.3
            },
            1140: {
                slidesPerView: 6.3
            }
        };
        this.suggestedPodcasts = [];
        this.suggestedShows = [];
        this.showPodcastViews = {
            settings: {
                pageLink: "/podcast-details",
                viewType: true
            },
            data: [
                {
                    image: "assets/images/imgPlaceholder.png",
                    title: "The Tespreneur Podcast"
                },
                {
                    image: "assets/images/shows.jpg",
                    title: "Tesa Moments"
                },
                {
                    image: "assets/images/tesaHealthTalk.jpg",
                    title: "Health Talk with Eva"
                },
                {
                    image: "assets/images/tuesdayVibes.jpg",
                    title: "Tuesday Vibes"
                },
                {
                    image: "assets/images/sportShow.jpg",
                    title: "Sport Show"
                },
                {
                    image: "assets/images/askMuiliSeun.jpg",
                    title: "The Ask Muili Seun Show"
                }
            ]
        };
    }
    HomePage.prototype.ngOnInit = function () {
        this.audioService.getRadio();
        this.getSuggestedPodcats();
        this.getSuggestedShows();
        this.firebaseService.registerPushNotifications();
    };
    HomePage.prototype.playPauseRadio = function (playPauseValue) {
        if (playPauseValue == 'play') {
            this.audioService.play(audioType.radio, '');
        }
        if (playPauseValue == 'pause') {
            this.audioService.pause(audioType.radio, '');
        }
    };
    // the logic used for the suggested podcast and shows
    // 1. each time a person plays an audio, update the 'audios' STAT and updatedAt 
    // 2. also update the "lastInteraction" on the 'podcast/show' collection
    // 3. when a podcast is added/deleted use the firebase count() method to update the 'episodes' on the 'podcast/show' collection
    // 4. use the 'lastInteraction' and 'episodes' on the 'podcast/show' collection to get the suggested podcast/show
    HomePage.prototype.getSuggestedShows = function () {
        var _this = this;
        this.firebaseService.getOrderedLimitedFirestorDocs("shows", "lastInteraction", 10, "episodes").then(function (res) {
            // console.log(res);
            _this.suggestedShows = res;
            _this.resourcesService.setLocalStorage("suggestedShows", res);
        }, function (err) {
            console.log(err);
            _this.resourcesService.getLocalStorage("suggestedShows").then(function (res) {
                if (res) {
                    _this.suggestedShows = res;
                }
            });
        });
    };
    HomePage.prototype.getSuggestedPodcats = function () {
        var _this = this;
        this.firebaseService.getOrderedLimitedFirestorDocs("podcasts", "lastInteraction", 10, "episodes").then(function (res) {
            // console.log(res);
            _this.suggestedPodcasts = res;
            _this.resourcesService.setLocalStorage("suggestedPodcasts", res);
        }, function (err) {
            console.log(err);
            _this.resourcesService.getLocalStorage("suggestedPodcasts").then(function (res) {
                if (res) {
                    _this.suggestedShows = res;
                }
            });
        });
    };
    HomePage.prototype.searchInput = function () {
        // console.log("ionInput");
        this.resourcesService.openTesaBotModal();
    };
    HomePage.prototype.doRefresh = function (event) {
        window.location.reload();
        // this.router.navigate(['radio']);
        // this.ngOnInit();
        setTimeout(function () {
            event.target.complete();
        }, 500);
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss']
        })
        // export class HomePage {
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
