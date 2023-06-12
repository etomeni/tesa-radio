import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccountGuard } from './guards/account.guard';
import { AuthGuard } from './guards/auth.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    // canActivate: [IntroGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    // redirectTo: 'intro',
    pathMatch: 'full'
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule),
    // canActivate: [IntroGuard]
  },

  {
    path: 'auth',
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
      },

      {
        path: 'login',
        loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./pages/auth/signup/signup.module').then( m => m.SignupPageModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
      },
      {
        path: 'verify-code',
        loadChildren: () => import('./pages/auth/verify-code/verify-code.module').then( m => m.VerifyCodePageModule)
      },
      {
        path: 'new-password',
        loadChildren: () => import('./pages/auth/new-password/new-password.module').then( m => m.NewPasswordPageModule)
      },


    ]
  },

  {
    path: 'account',
    // canActivate: [AccountGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/account/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/account/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('./pages/account/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/account/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'my-podcasts',
        loadChildren: () => import('./pages/account/my-podcasts/my-podcasts.module').then( m => m.MyPodcastsPageModule)
      },
      {
        path: 'my-podcasts/:id',
        loadChildren: () => import('./pages/account/my-podcasts-details/my-podcasts-details.module').then( m => m.MyPodcastsDetailsPageModule)
      },
      {
        path: 'feedbacks',
        loadChildren: () => import('./pages/account/feedbacks/feedbacks.module').then( m => m.FeedbacksPageModule)
      },

    ]
  },
  
  {
    path: 'shows',
    loadChildren: () => import('./pages/shows/shows.module').then( m => m.ShowsPageModule)
  },
  {
    path: 'shows/:id',
    loadChildren: () => import('./pages/shows-details/shows-details.module').then( m => m.ShowsDetailsPageModule)
  },
  {
    path: 'podcasts',
    loadChildren: () => import('./pages/podcasts/podcasts.module').then( m => m.PodcastsPageModule)
  },
  {
    path: 'podcasts/:id',
    loadChildren: () => import('./pages/podcast-details/podcast-details.module').then( m => m.PodcastDetailsPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'tesa-bot',
    loadChildren: () => import('./pages/tesa-bot/tesa-bot.module').then( m => m.TesaBotPageModule)
  },
  {
    path: 'shout-out',
    loadChildren: () => import('./pages/shout-out/shout-out.module').then( m => m.ShoutOutPageModule)
  },
  {
    path: 'browser-view',
    loadChildren: () => import('./pages/browser-view/browser-view.module').then( m => m.BrowserViewPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
