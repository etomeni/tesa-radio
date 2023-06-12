"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SettingsPage = void 0;
var core_1 = require("@angular/core");
var capacitor_app_update_1 = require("@capawesome/capacitor-app-update");
var edit_profile_modal_component_1 = require("src/app/components/edit-profile-modal/edit-profile-modal.component");
var change_password_modal_component_1 = require("src/app/components/change-password-modal/change-password-modal.component");
var core_2 = require("@capacitor/core");
var toastState;
(function (toastState) {
    toastState["Success"] = "Success";
    toastState["Error"] = "Error";
    toastState["Warning"] = "Warning";
    toastState["Info"] = "Info";
})(toastState || (toastState = {}));
;
var SettingsPage = /** @class */ (function () {
    function SettingsPage(modalCtrl, actionSheetCtrl, alertController, firebaseService, resourcesService) {
        this.modalCtrl = modalCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertController = alertController;
        this.firebaseService = firebaseService;
        this.resourcesService = resourcesService;
        this.currentUser = {
            name: '',
            phoneNumber: ''
        };
        this.currentAppVersion = '';
        this.availableAppVersion = '';
    }
    SettingsPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var getUserInterval, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        getUserInterval = setInterval(function () {
                            if (_this.firebaseService.currentUser) {
                                _this.currentUser = _this.firebaseService.currentUser;
                                clearInterval(getUserInterval);
                            }
                        }, 500);
                        if (!core_2.Capacitor.isNativePlatform()) return [3 /*break*/, 5];
                        _a = this;
                        return [4 /*yield*/, capacitor_app_update_1.AppUpdate.getAppUpdateInfo()];
                    case 1: return [4 /*yield*/, (_c.sent()).currentVersion];
                    case 2:
                        _a.currentAppVersion = _c.sent();
                        _b = this;
                        return [4 /*yield*/, capacitor_app_update_1.AppUpdate.getAppUpdateInfo()];
                    case 3: return [4 /*yield*/, (_c.sent()).availableVersion];
                    case 4:
                        _b.availableAppVersion = _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.openEditProfileModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal, _a, data, role;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: edit_profile_modal_component_1.EditProfileModalComponent,
                            initialBreakpoint: 0.5,
                            breakpoints: [0, 0.25, 0.5, 0.75, 0.9],
                            canDismiss: this.canDismiss
                        })];
                    case 1:
                        modal = _b.sent();
                        modal.present();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 2:
                        _a = _b.sent(), data = _a.data, role = _a.role;
                        if (role === 'confirm') {
                            // console.log(data);
                            this.currentUser.name = data.name;
                            this.currentUser.phoneNumber = data.phoneNumber;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.openChangePasswordModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal, _a, data, role;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: change_password_modal_component_1.ChangePasswordModalComponent,
                            initialBreakpoint: 0.5,
                            breakpoints: [0, 0.25, 0.5, 0.75, 0.9],
                            canDismiss: this.canDismiss
                        })];
                    case 1:
                        modal = _b.sent();
                        modal.present();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 2:
                        _a = _b.sent(), data = _a.data, role = _a.role;
                        if (role === 'confirm') {
                            console.log(data);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.canDismiss = function (data, role) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, role !== 'gesture'];
            });
        });
    };
    SettingsPage.prototype.deleteAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alertInputs, alertButtons, alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alertInputs = [
                            {
                                name: 'reauthPassword',
                                placeholder: 'Enter your password to confirm',
                                attributes: {
                                    minlength: 8
                                }
                            },
                        ];
                        alertButtons = [
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: function () {
                                    console.log("Alert canceled");
                                }
                            },
                            {
                                text: 'OK',
                                role: 'confirm',
                                handler: function (alertData) {
                                    console.log("Alert confirmed");
                                    _this.firebaseService.deleteFireAuthAcct(_this.currentUser.email, alertData.reauthPassword).then(function (res) {
                                        _this.resourcesService.presentToast("Account deleted!", toastState.Info);
                                        _this.firebaseService.logoutFirebaseUser();
                                    }, function (err) {
                                        console.log(err);
                                        _this.resourcesService.presentToast("Wrong password!", toastState.Error);
                                    });
                                }
                            },
                        ];
                        return [4 /*yield*/, this.alertController.create({
                                header: 'Are you sure, you want to delete your account?',
                                inputs: alertInputs,
                                buttons: alertButtons,
                                mode: 'ios',
                                translucent: true
                            })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SettingsPage.prototype.logOut = function () {
        this.firebaseService.logoutFirebaseUser();
        this.resourcesService.presentToast("user logged out", 'Info');
    };
    SettingsPage = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.page.html',
            styleUrls: ['./settings.page.scss']
        })
    ], SettingsPage);
    return SettingsPage;
}());
exports.SettingsPage = SettingsPage;
