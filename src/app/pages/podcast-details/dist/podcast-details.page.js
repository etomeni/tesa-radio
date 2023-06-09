"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.PodcastDetailsPage = void 0;
var core_1 = require("@angular/core");
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
var PodcastDetailsPage = /** @class */ (function () {
    function PodcastDetailsPage(activatedRoute, firebaseService, resourcesService, audioService) {
        this.activatedRoute = activatedRoute;
        this.firebaseService = firebaseService;
        this.resourcesService = resourcesService;
        this.audioService = audioService;
        this.loadingStatus = true;
        this.podcast_id = '';
        this.lastPodcastDetail = undefined;
    }
    PodcastDetailsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            // console.log("queryParams => ", params);
            if (params) {
                _this.podcastInfo = params;
            }
        });
        this.activatedRoute.params.subscribe(function (params) {
            // console.log("id param: ",params['id']);
            if (params['id']) {
                _this.podcast_id = params['id'];
            }
        });
        this.getPodcastDetails();
    };
    PodcastDetailsPage.prototype.getPodcastDetails = function () {
        var _this = this;
        var getStoredShows = function () {
            _this.resourcesService.getLocalStorage("podcastDetails").then(function (res) {
                if (res) {
                    _this.audioService.podcasts = res;
                    // this.lastPodcastDetail = res[0].lastVisible;
                    _this.lastPodcastDetail = res.length ? res[0].lastVisible : undefined;
                    _this.loadingStatus = false;
                }
                else {
                    _this.loadingStatus = true;
                }
            }, function (err) {
                _this.loadingStatus = true;
            });
        };
        this.firebaseService.countFirestoreDocs("audios", { property: "ref_id", condition: '==', value: this.podcast_id }).then(function (res) {
            // console.log(res);
            _this.podcastInfo = __assign(__assign({}, _this.podcastInfo), { episodes: res });
            _this.firebaseService.updateFirestoreData('podcasts', _this.podcastInfo.id, { episodes: res, updatedAt: Date.now() });
        })["catch"](function (err) {
            console.log(err);
        });
        this.firebaseService.getLimitedFirestoreDocumentData("audios", 10, { property: "type", condition: '==', value: audioType.podcast }, { property: "ref_id", condition: '==', value: this.podcast_id }).then(function (res) {
            // console.log(res);
            for (var i = 0; i < res.length; i++) {
                res[i].audio = new Audio(res[i].src);
                res[i].audio.load();
                res[i].currentTime = _this.audioService.audioTiming(res[i].audio.currentTime);
                res[i].duration = _this.audioService.audioTiming(res[i].audio.duration);
            }
            _this.audioService.podcasts = res;
            // this.lastPodcastDetail = res[0].lastVisible;
            _this.lastPodcastDetail = res.length ? res[0].lastVisible : undefined;
            _this.resourcesService.setLocalStorage("podcastDetails", res);
            _this.loadingStatus = false;
            setTimeout(function () {
                for (var i = 0; i < _this.audioService.podcasts.length; i++) {
                    var element = _this.audioService.podcasts[i];
                    _this.audioService.podcasts[i].audio.load();
                    _this.audioService.podcasts[i].currentTime = _this.audioService.audioTiming(element.audio.currentTime);
                    _this.audioService.podcasts[i].duration = _this.audioService.audioTiming(element.audio.duration);
                }
            }, 5000);
        }, function (err) {
            console.log(err);
            getStoredShows();
        })["catch"](function (err) {
            console.log(err);
            getStoredShows();
        });
    };
    PodcastDetailsPage.prototype.getMorePodcastDetails = function () {
        var _this = this;
        this.firebaseService.getNextLimitedFirestoreDocumentData("audios", this.lastPodcastDetail, 10, { property: "type", condition: '==', value: audioType.podcast }, { property: "ref_id", condition: '==', value: this.podcast_id }).then(function (res) {
            // console.log(res);
            if (res.length) {
                _this.lastPodcastDetail = res[0].lastVisible;
                for (var i = 0; i < res.length; i++) {
                    res[i].audio = new Audio(res[i].src);
                    res[i].currentTime = _this.audioService.audioTiming(res[i].audio.currentTime);
                    res[i].duration = _this.audioService.audioTiming(res[i].audio.duration);
                }
                _this.audioService.podcasts = __spreadArrays(_this.audioService.podcasts, res);
                _this.resourcesService.setLocalStorage("podcastDetails", _this.audioService.podcasts);
            }
            else {
                _this.lastPodcastDetail = undefined;
            }
        })["catch"](function (err) {
            console.log(err);
        });
    };
    PodcastDetailsPage.prototype.loadMoreData = function (ev) {
        var _this = this;
        this.getMorePodcastDetails();
        setTimeout(function () {
            ev.target.complete();
            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            if (_this.lastPodcastDetail == undefined) {
                ev.target.disabled = true;
            }
        }, 500);
    };
    PodcastDetailsPage.prototype.playPause = function (i, id, _playPauseValue) {
        // console.log("angular index: ", i);
        // const _index = this.audioService.podcasts.map((e) => {
        //   return e.id;
        // }).indexOf(id);
        // console.log("map index: ", _index);
        var index = this.audioService.podcasts.findIndex(function (e) { return e.id == id; });
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
    };
    PodcastDetailsPage.prototype.doRefresh = function (event) {
        window.location.reload();
        setTimeout(function () {
            // console.log('Async operation has ended');
            // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
            event.target.complete();
        }, 500);
    };
    PodcastDetailsPage = __decorate([
        core_1.Component({
            selector: 'app-podcast-details',
            templateUrl: './podcast-details.page.html',
            styleUrls: ['./podcast-details.page.scss']
        })
    ], PodcastDetailsPage);
    return PodcastDetailsPage;
}());
exports.PodcastDetailsPage = PodcastDetailsPage;
