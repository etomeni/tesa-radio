"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var routes = [
    {
        path: 'home',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./home/home.module'); }).then(function (m) { return m.HomePageModule; }); }
    },
    {
        path: '',
        redirectTo: 'home',
        // redirectTo: 'intro',
        pathMatch: 'full'
    },
    {
        path: 'intro',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/intro/intro.module'); }).then(function (m) { return m.IntroPageModule; }); }
    },
    {
        path: 'auth',
        // canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/auth/login/login.module'); }).then(function (m) { return m.LoginPageModule; }); }
            },
            {
                path: 'login',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/auth/login/login.module'); }).then(function (m) { return m.LoginPageModule; }); }
            },
            {
                path: 'signup',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/auth/signup/signup.module'); }).then(function (m) { return m.SignupPageModule; }); }
            },
            {
                path: 'forgot-password',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/auth/forgot-password/forgot-password.module'); }).then(function (m) { return m.ForgotPasswordPageModule; }); }
            },
            {
                path: 'verify-code',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/auth/verify-code/verify-code.module'); }).then(function (m) { return m.VerifyCodePageModule; }); }
            },
            {
                path: 'new-password',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/auth/new-password/new-password.module'); }).then(function (m) { return m.NewPasswordPageModule; }); }
            },
        ]
    },
    {
        path: 'account',
        // canActivate: [AccountGuard],
        children: [
            {
                path: '',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/profile/profile.module'); }).then(function (m) { return m.ProfilePageModule; }); }
            },
            {
                path: 'profile',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/profile/profile.module'); }).then(function (m) { return m.ProfilePageModule; }); }
            },
            {
                path: 'edit-profile',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/edit-profile/edit-profile.module'); }).then(function (m) { return m.EditProfilePageModule; }); }
            },
            {
                path: 'settings',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/settings/settings.module'); }).then(function (m) { return m.SettingsPageModule; }); }
            },
            {
                path: 'my-podcasts',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/my-podcasts/my-podcasts.module'); }).then(function (m) { return m.MyPodcastsPageModule; }); }
            },
            {
                path: 'my-podcasts/:id',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/my-podcasts-details/my-podcasts-details.module'); }).then(function (m) { return m.MyPodcastsDetailsPageModule; }); }
            },
            {
                path: 'feedbacks',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/account/feedbacks/feedbacks.module'); }).then(function (m) { return m.FeedbacksPageModule; }); }
            },
        ]
    },
    {
        path: 'shows',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/shows/shows.module'); }).then(function (m) { return m.ShowsPageModule; }); }
    },
    {
        path: 'shows/:id',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/shows-details/shows-details.module'); }).then(function (m) { return m.ShowsDetailsPageModule; }); }
    },
    {
        path: 'podcasts',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/podcasts/podcasts.module'); }).then(function (m) { return m.PodcastsPageModule; }); }
    },
    {
        path: 'podcasts/:id',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/podcast-details/podcast-details.module'); }).then(function (m) { return m.PodcastDetailsPageModule; }); }
    },
    {
        path: 'contact',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/contact-us/contact-us.module'); }).then(function (m) { return m.ContactUsPageModule; }); }
    },
    {
        path: 'about',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/about-us/about-us.module'); }).then(function (m) { return m.AboutUsPageModule; }); }
    },
    {
        path: 'tesa-bot',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/tesa-bot/tesa-bot.module'); }).then(function (m) { return m.TesaBotPageModule; }); }
    },
    {
        path: 'shout-out',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/shout-out/shout-out.module'); }).then(function (m) { return m.ShoutOutPageModule; }); }
    },
    {
        path: 'browser-view',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/browser-view/browser-view.module'); }).then(function (m) { return m.BrowserViewPageModule; }); }
    },
    {
        path: '**',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/page-not-found/page-not-found.module'); }).then(function (m) { return m.PageNotFoundPageModule; }); }
    },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(routes, { preloadingStrategy: router_1.PreloadAllModules })
            ],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
