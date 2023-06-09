"use strict";
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
exports.ShowsDetailsPage = void 0;
var core_1 = require("@angular/core");
var audioType;
(function (audioType) {
    audioType["radio"] = "radio";
    audioType["podcast"] = "podcast";
    audioType["shows"] = "shows";
})(audioType || (audioType = {}));
;
var ShowsDetailsPage = /** @class */ (function () {
    function ShowsDetailsPage(activatedRoute, firebaseService, resourcesService, audioService) {
        this.activatedRoute = activatedRoute;
        this.firebaseService = firebaseService;
        this.resourcesService = resourcesService;
        this.audioService = audioService;
        this.loadingStatus = true;
        this.viewType = false;
        this.show_id = '';
        this.lastShowDetail = undefined;
    }
    ShowsDetailsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            // console.log("queryParams => ", params);
            if (params) {
                _this.show = params;
            }
        });
        this.activatedRoute.params.subscribe(function (params) {
            // console.log("id param: ",params['id']);
            if (params['id']) {
                _this.show_id = params['id'];
            }
        });
        this.getShowDetails();
    };
    ShowsDetailsPage.prototype.getShowDetails = function () {
        var _this = this;
        var getStoredShows = function () {
            _this.resourcesService.getLocalStorage("showDetails").then(function (res) {
                if (res) {
                    // this.showDetails = res;
                    _this.audioService.shows = res;
                    // this.lastShowDetail = res[0].lastVisible;
                    _this.lastShowDetail = res.length ? res[0].lastVisible : undefined;
                    _this.loadingStatus = false;
                }
                else {
                    _this.loadingStatus = true;
                }
            }, function (err) {
                _this.loadingStatus = true;
            });
        };
        this.firebaseService.getLimitedFirestoreDocumentData("audios", 15, { property: "type", condition: '==', value: audioType.shows }, { property: "ref_id", condition: '==', value: this.show_id }).then(function (res) {
            // console.log(res);
            for (var i = 0; i < res.length; i++) {
                res[i].audio = new Audio(res[i].src);
                res[i].currentTime = _this.audioService.audioTiming(res[i].audio.currentTime);
                res[i].duration = _this.audioService.audioTiming(res[i].audio.duration);
            }
            _this.audioService.shows = res;
            // this.lastShowDetail = res[0].lastVisible;
            _this.lastShowDetail = res.length ? res[0].lastVisible : undefined;
            _this.resourcesService.setLocalStorage("showDetails", res);
            _this.loadingStatus = false;
            setTimeout(function () {
                for (var i = 0; i < _this.audioService.shows.length; i++) {
                    var element = _this.audioService.shows[i];
                    _this.audioService.shows[i].currentTime = _this.audioService.audioTiming(element.audio.currentTime);
                    _this.audioService.shows[i].duration = _this.audioService.audioTiming(element.audio.duration);
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
    ShowsDetailsPage.prototype.getMoreShowDetails = function () {
        var _this = this;
        this.firebaseService.getNextLimitedFirestoreDocumentData("audios", this.lastShowDetail, 10, { property: "type", condition: '==', value: audioType.shows }, { property: "ref_id", condition: '==', value: this.show_id }).then(function (res) {
            // console.log(res);
            if (res.length) {
                _this.lastShowDetail = res[0].lastVisible;
                // this.lastShowDetail = res[0].lastVisible;
                for (var i = 0; i < res.length; i++) {
                    res[i].audio = new Audio(res[i].src);
                    res[i].currentTime = _this.audioService.audioTiming(res[i].audio.currentTime);
                    res[i].duration = _this.audioService.audioTiming(res[i].audio.duration);
                }
                _this.audioService.shows = __spreadArrays(_this.audioService.shows, res);
                _this.resourcesService.setLocalStorage("showDetails", _this.audioService.shows);
                // this.showDetails = [...this.showDetails, ...res];
                // this.resourcesService.setLocalStorage("showDetails", this.showDetails);
            }
            else {
                _this.lastShowDetail = undefined;
            }
        })["catch"](function (err) {
            console.log(err);
        });
    };
    ShowsDetailsPage.prototype.loadMoreData = function (ev) {
        var _this = this;
        this.getMoreShowDetails();
        setTimeout(function () {
            ev.target.complete();
            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            if (_this.lastShowDetail == undefined) {
                ev.target.disabled = true;
            }
        }, 500);
    };
    ShowsDetailsPage.prototype.playPause = function (i, id, _playPauseValue) {
        // console.log("angular index: ", i);
        // const _index = this.audioService.shows.map((e) => {
        //   return e.id;
        // }).indexOf(id);
        // console.log("map index: ", _index);
        var index = this.audioService.shows.findIndex(function (e) { return e.id == id; });
        // console.log("find index: ", index);
        if (_playPauseValue == 'play') {
            this.audioService.play(audioType.shows, index);
            // this.audioService.playWaveSurfer(audioType.shows, index);
        }
        if (_playPauseValue == 'pause') {
            this.audioService.pause(audioType.shows, index);
            // this.audioService.pauseWaveSurfer(audioType.shows, index);
        }
        // the logic used for the suggested podcast and shows
        // 1. each time a person plays an audio, update the 'audios' STAT and updatedAt 
        // 2. also update the "lastInteraction" on the 'podcast/show' collection
        // 3. when a podcast is added/deleted use the firebase count() method to update the 'episodes' on the 'podcast/show' collection
        // 4. use the 'lastInteraction' and 'episodes' on the 'podcast/show' collection to get the suggested podcast/show
        this.firebaseService.updateFirestoreData('shows', this.audioService.shows[index].ref_id, { lastInteraction: Date.now() });
    };
    ShowsDetailsPage.prototype.doRefresh = function (event) {
        window.location.reload();
        setTimeout(function () {
            // console.log('Async operation has ended');
            // this.loadingService.alertMessage("Please check Your internet connection", "no internet connection")
            event.target.complete();
        }, 500);
    };
    ShowsDetailsPage = __decorate([
        core_1.Component({
            selector: 'app-shows-details',
            templateUrl: './shows-details.page.html',
            styleUrls: ['./shows-details.page.scss']
        })
    ], ShowsDetailsPage);
    return ShowsDetailsPage;
}());
exports.ShowsDetailsPage = ShowsDetailsPage;
