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
exports.__esModule = true;
exports.NewShoutOutComponent = void 0;
var core_1 = require("@angular/core");
var toastState;
(function (toastState) {
    toastState["Success"] = "Success";
    toastState["Error"] = "Error";
    toastState["Warning"] = "Warning";
    toastState["Info"] = "Info";
})(toastState || (toastState = {}));
;
var NewShoutOutComponent = /** @class */ (function () {
    function NewShoutOutComponent(modalCtrl, firebaseService, resourcesService) {
        this.modalCtrl = modalCtrl;
        this.firebaseService = firebaseService;
        this.resourcesService = resourcesService;
        this.submitted = false;
        this.response = {
            display: false,
            status: false,
            message: ''
        };
    }
    NewShoutOutComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.resourcesService.getLocalStorage("user").then(function (res) {
            if (res) {
                _this.currentUser = res;
            }
        });
    };
    NewShoutOutComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.submitted = true;
        var data2db = {
            sender_name: formData.senderName,
            sender_email: formData.senderEmail,
            sender_image: "assets/images/avatar.svg",
            sender_id: '',
            recipient_name: formData.recipientName,
            recipient_email: formData.recipientEmail,
            message: formData.shoutOutMessage,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        if (this.currentUser) {
            if (this.currentUser.userDBinfo.profilePhotoURL) {
                data2db.sender_image = this.currentUser.userDBinfo.profilePhotoURL;
            }
            if (this.currentUser.userDBinfo.userID) {
                data2db.sender_id = this.currentUser.userDBinfo.userID;
            }
        }
        // save in firebase real time database realtimeDB
        this.firebaseService.save2FirestoreDB("shoutOuts", data2db).then(function (res) {
            // console.log(res);
            _this.response.display = true;
            _this.response.status = true;
            _this.response.message = "shout-out message sent to " + formData.recipientName + ", successfully!";
            _this.resourcesService.presentToast("shout-out sent successfully!!!", toastState.Success);
            _this.submitted = false;
            // close modal and send the new data to the parent page.
            _this.closeModal(__assign(__assign({}, data2db), { id: res.id }));
        })["catch"](function (err) {
            console.log(err);
            _this.response.display = true;
            _this.response.status = false;
            _this.response.message = "an error ocurred while sending your shout-out";
            _this.resourcesService.presentToast("an error ocurred while sending your shout-out", toastState.Error);
            _this.submitted = false;
        });
    };
    NewShoutOutComponent.prototype.closeModal = function (data2sendOnDismia) {
        if (data2sendOnDismia === void 0) { data2sendOnDismia = ''; }
        this.modalCtrl.dismiss(data2sendOnDismia, 'confirm', 'newShoutOutModall');
        return true;
    };
    NewShoutOutComponent = __decorate([
        core_1.Component({
            selector: 'app-new-shout-out',
            templateUrl: './new-shout-out.component.html',
            styleUrls: ['./new-shout-out.component.scss']
        })
    ], NewShoutOutComponent);
    return NewShoutOutComponent;
}());
exports.NewShoutOutComponent = NewShoutOutComponent;
